const OEN_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://payment-api.oen.tw'
  : 'https://payment-api.testing.oen.tw';

const OEN_CHECKOUT_HOST = process.env.NODE_ENV === 'production'
  ? 'oen.tw'
  : 'testing.oen.tw';

const buildRedirectUrl = (merchantId, checkoutId) => `https://${merchantId}.${OEN_CHECKOUT_HOST}/checkout/${checkoutId}`;

export const createOenCheckout = async (req, res) => {
  const {
    amount,
    currency = 'TWD',
    orderId,
    successUrl,
    failureUrl,
    productDetail
  } = req.body || {};

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
    const redirectUrl = buildRedirectUrl(merchantId, checkoutId);

    return res.json({
      success: true,
      checkoutId,
      transactionHid: result.data.transactionHid,
      redirectUrl
    });
  } catch (error) {
    console.error('Failed to create OEN checkout:', error);
    return res.status(500).json({ success: false, message: 'failed to create checkout' });
  }
};
