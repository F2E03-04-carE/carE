import { setLifetimeFromPayment } from './subscriptionController.js';

const OEN_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://payment-api.oen.tw'
  : 'https://payment-api.testing.oen.tw';

const OEN_CHECKOUT_HOST = process.env.NODE_ENV === 'production'
  ? 'oen.tw'
  : 'testing.oen.tw';

const buildRedirectUrl = (merchantId, checkoutId) => `https://${merchantId}.${OEN_CHECKOUT_HOST}/checkout/${checkoutId}`;

// 簡易記憶體紀錄：將 orderId / checkoutId / transactionHid 對應到 user 與方案
const paymentSessions = {
  byOrderId: new Map(),
  byCheckoutId: new Map(),
  byTransactionHid: new Map()
};

const rememberPaymentSession = ({ orderId, checkoutId, transactionHid, userId, planType, amount }) => {
  const session = {
    orderId,
    checkoutId,
    transactionHid,
    userId,
    planType,
    amount,
    createdAt: new Date().toISOString()
  };

  if (orderId) paymentSessions.byOrderId.set(orderId, session);
  if (checkoutId) paymentSessions.byCheckoutId.set(checkoutId, session);
  if (transactionHid) paymentSessions.byTransactionHid.set(transactionHid, session);
};

export const createOenCheckout = async (req, res) => {
  const {
    amount,
    currency = 'TWD',
    orderId,
    successUrl,
    failureUrl,
    productDetail,
    planType
  } = req.body || {};

  const userId = req.headers['x-user-id'] || 'demo-user';

  const merchantId = process.env.OEN_MERCHANT_ID;
  const token = process.env.OEN_TOKEN;

  if (!merchantId || !token) {
    return res.status(500).json({
      success: false,
      message: 'payment config missing: OEN_MERCHANT_ID or OEN_TOKEN'
    });
  }

  if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'amount is required and must be > 0' });
  }

  if (!orderId || !successUrl || !failureUrl) {
    return res.status(400).json({
      success: false,
      message: 'orderId, successUrl, failureUrl are required'
    });
  }

  if (!planType) {
    return res.status(400).json({ success: false, message: 'planType is required' });
  }

  const payload = {
    merchantId,
    amount: Number(amount),
    currency,
    orderId,
    successUrl,
    failureUrl,
    productDetail
  };

  try {
    const response = await fetch(`${OEN_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        success: false,
        message: 'checkout request failed',
        detail: errorBody
      });
    }

    const result = await response.json();

    if (!result || result.code !== 'S0000' || !result.data?.id) {
      return res.status(502).json({
        success: false,
        message: 'unexpected response from OEN',
        detail: result
      });
    }

    const checkoutId = result.data.id;
    const transactionHid = result.data.transactionHid;

    rememberPaymentSession({
      orderId,
      checkoutId,
      transactionHid,
      userId,
      planType,
      amount: Number(amount)
    });
    const redirectUrl = buildRedirectUrl(merchantId, checkoutId);

    return res.json({
      success: true,
      checkoutId,
      transactionHid,
      redirectUrl
    });
  } catch (error) {
    console.error('Failed to create OEN checkout:', error);
    return res.status(500).json({ success: false, message: 'failed to create checkout' });
  }
};

export const getOEN_BASE_URL = () => (
  process.env.NODE_ENV === 'production' ? 'https://payment-api.oen.tw' : 'https://payment-api.testing.oen.tw'
);

export const getOenTransaction = async (req, res) => {
  const { id } = req.params || {};

  const token = process.env.OEN_TOKEN;
  if (!token) {
    return res.status(500).json({ success: false, message: 'payment config missing: OEN_TOKEN' });
  }
  if (!id) {
    return res.status(400).json({ success: false, message: 'id (transactionId or transactionHid) is required' });
  }

  try {
    const response = await fetch(`${getOEN_BASE_URL()}/transactions/${encodeURIComponent(id)}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'failed to fetch transaction', detail: result });
    }

    return res.json({ success: result.code === 'S0000', data: result.data, raw: result });
  } catch (error) {
    console.error('Failed to get OEN transaction:', error);
    return res.status(500).json({ success: false, message: 'failed to get transaction' });
  }
};

export const handleOenWebhook = async (req, res) => {
  // Webhook 會重試 3 次 第一次 2 秒 第二次 4 秒 第三次 6 秒
  const payload = req.body || {};
  const merchantId = process.env.OEN_MERCHANT_ID;

  if (!merchantId) {
    return res.status(500).json({ success: false, message: 'payment config missing: OEN_MERCHANT_ID' });
  }

  if (!payload.id || !payload.merchantId) {
    return res.status(400).json({ success: false, message: 'invalid webhook payload' });
  }

  if (payload.merchantId !== merchantId) {
    return res.status(403).json({ success: false, message: 'merchant mismatch' });
  }

  try {
    const transactionId = payload.id;
    const status = payload.status;
    const success = payload.success === true;

    // 盡量定位到原始 session（orderId -> user）
    let session = paymentSessions.byTransactionHid.get(transactionId);

    // 若未找到，透過交易查詢取回 orderId，再映射 session
    if (!session) {
      const tx = await fetchTransactionById(transactionId);
      if (tx?.orderId) {
        session = paymentSessions.byOrderId.get(tx.orderId);
      }
    }

    // 判斷成功條件：success=true 或 status=charged
    const isSuccess = success || status === 'charged';

    if (session && isSuccess && session.planType === 'lifetime') {
      setLifetimeFromPayment({
        userId: session.userId,
        orderId: session.orderId,
        transactionId
      });
    }

    // 總是回 200 讓 OEN 不要重試
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to process webhook:', error);
    // 依據金流文件，失敗會重試；仍回 500 讓金流重試
    return res.status(500).json({ success: false });
  }
};

async function fetchTransactionById(id) {
  const token = process.env.OEN_TOKEN;
  if (!token || !id) return null;

  try {
    const response = await fetch(`${getOEN_BASE_URL()}/transactions/${encodeURIComponent(id)}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.code !== 'S0000') {
      return null;
    }
    return result.data;
  } catch (error) {
    console.error('Failed to fetch transaction detail:', error);
    return null;
  }
}
