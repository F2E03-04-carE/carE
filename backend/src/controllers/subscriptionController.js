// 暫時用記憶體存儲訂閱資訊（開發階段）
// TODO: 之後整合 Supabase 資料庫
const subscriptions = new Map();

const getUserId = (req) => req.headers['x-user-id'] || 'demo-user';

export const getCurrentSubscription = async (req, res) => {
  const userId = getUserId(req);

  const subscription = subscriptions.get(userId);

  if (!subscription) {
    return res.json({
      success: true,
      subscription: null
    });
  }

  return res.json({
    success: true,
    subscription
  });
};

export const activateTrial = async (req, res) => {
  const userId = getUserId(req);

  // 檢查是否已有訂閱
  if (subscriptions.has(userId)) {
    return res.status(400).json({
      success: false,
      message: '您已經有訂閱方案'
    });
  }

  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + 30);

  const subscription = {
    id: `trial_${Date.now()}`,
    planType: 'trial',
    status: 'active',
    trialStartDate: now.toISOString(),
    trialExpiryDate: expiryDate.toISOString(),
    features: {
      bookingManagement: true,
      reviewSystem: true,
      profileDisplay: true
    }
  };

  subscriptions.set(userId, subscription);

  return res.json({
    success: true,
    subscription
  });
};

export const activateLifetime = async (req, res) => {
  const userId = getUserId(req);
  const { orderId, transactionId } = req.body;

  // TODO: 驗證交易是否成功（從資料庫查詢 webhook 記錄）

  const subscription = {
    id: `lifetime_${Date.now()}`,
    planType: 'lifetime',
    status: 'active',
    purchaseDate: new Date().toISOString(),
    orderId,
    transactionId,
    features: {
      bookingManagement: true,
      reviewSystem: true,
      profileDisplay: true
    }
  };

  subscriptions.set(userId, subscription);

  return res.json({
    success: true,
    subscription
  });
};

export const setLifetimeFromPayment = ({ userId, orderId, transactionId }) => {
  const subscription = {
    id: `lifetime_${Date.now()}`,
    planType: 'lifetime',
    status: 'active',
    purchaseDate: new Date().toISOString(),
    orderId,
    transactionId,
    features: {
      bookingManagement: true,
      reviewSystem: true,
      profileDisplay: true
    }
  };

  subscriptions.set(userId, subscription);
  return subscription;
};
