import supabase from '../configs/supabase.js';

const getGarageId = (req) => req.headers['x-garage-id'] || req.headers['x-user-id'] || null;

const mapGarageToSubscription = (garage) => {
  if (!garage) return null;

  const planType = garage.subscription_status === 'none' ? null : garage.subscription_status;

  return {
    id: garage.id,
    planType,
    status: 'active',
    trialStartDate: garage.subscription_date,
    trialExpiryDate: garage.trial_expiry_date,
    purchaseDate: garage.subscription_date,
    transactionId: garage.last_transaction_id,
    features: {
      bookingManagement: planType === 'trial' || planType === 'lifetime',
      reviewSystem: planType === 'trial' || planType === 'lifetime',
      profileDisplay: true
    }
  };
};

export const getCurrentSubscription = async (req, res) => {
  const garageId = getGarageId(req);

  if (!garageId) {
    return res.status(400).json({
      success: false,
      message: 'garage ID required (x-garage-id or x-user-id header)'
    });
  }

  try {
    const { data: garage, error } = await supabase
      .from('garages')
      .select('id, subscription_status, trial_expiry_date, subscription_date, last_transaction_id')
      .eq('id', garageId)
      .single();

    if (error) {
      console.error('Failed to fetch garage subscription:', error);
      return res.status(500).json({ success: false, message: 'failed to fetch subscription' });
    }

    return res.json({
      success: true,
      subscription: mapGarageToSubscription(garage)
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ success: false, message: 'server error' });
  }
};

export const activateTrial = async (req, res) => {
  const garageId = getGarageId(req);

  if (!garageId) {
    return res.status(400).json({
      success: false,
      message: 'garage ID required'
    });
  }

  try {
    const { data: garage, error: fetchError } = await supabase
      .from('garages')
      .select('subscription_status')
      .eq('id', garageId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch garage:', fetchError);
      return res.status(500).json({ success: false, message: 'failed to check garage' });
    }

    if (garage.subscription_status !== 'none') {
      return res.status(400).json({
        success: false,
        message: '您已經有訂閱方案'
      });
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { data: updatedGarage, error: updateError } = await supabase
      .from('garages')
      .update({
        subscription_status: 'trial',
        trial_expiry_date: expiryDate.toISOString(),
        subscription_date: now.toISOString()
      })
      .eq('id', garageId)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to activate trial:', updateError);
      return res.status(500).json({ success: false, message: 'failed to activate trial' });
    }

    return res.json({
      success: true,
      subscription: mapGarageToSubscription(updatedGarage)
    });
  } catch (error) {
    console.error('Error activating trial:', error);
    return res.status(500).json({ success: false, message: 'server error' });
  }
};

export const activateLifetime = async (req, res) => {
  const garageId = getGarageId(req);
  const { orderId, transactionId } = req.body;

  if (!garageId) {
    return res.status(400).json({
      success: false,
      message: 'garage ID required'
    });
  }

  try {
    const { data: updatedGarage, error } = await supabase
      .from('garages')
      .update({
        subscription_status: 'lifetime',
        subscription_date: new Date().toISOString(),
        last_transaction_id: transactionId
      })
      .eq('id', garageId)
      .select()
      .single();

    if (error) {
      console.error('Failed to activate lifetime:', error);
      return res.status(500).json({ success: false, message: 'failed to activate lifetime' });
    }

    return res.json({
      success: true,
      subscription: mapGarageToSubscription(updatedGarage)
    });
  } catch (error) {
    console.error('Error activating lifetime:', error);
    return res.status(500).json({ success: false, message: 'server error' });
  }
};

export const setLifetimeFromPayment = async ({ garageId, orderId, transactionId }) => {
  try {
    const { data: updatedGarage, error } = await supabase
      .from('garages')
      .update({
        subscription_status: 'lifetime',
        subscription_date: new Date().toISOString(),
        last_transaction_id: transactionId
      })
      .eq('id', garageId)
      .select()
      .single();

    if (error) {
      console.error('Failed to set lifetime from payment:', error);
      return null;
    }

    return mapGarageToSubscription(updatedGarage);
  } catch (error) {
    console.error('Error setting lifetime:', error);
    return null;
  }
};
