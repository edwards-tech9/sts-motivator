// PayPal Payment Service - Coach billing integration
// Handles recurring subscription setup and payment requests

const STORAGE_KEYS = {
  PAYPAL_SETTINGS: 'sts_paypal_settings',
  PRICE_TIERS: 'sts_price_tiers',
  LAST_AMOUNT: 'sts_last_payment_amount',
  PAYMENT_REQUESTS: 'sts_payment_requests',
};

// Default price tiers
const DEFAULT_TIERS = [
  { id: 'tier1', name: 'Basic', amount: 99, description: 'Monthly coaching' },
  { id: 'tier2', name: 'Standard', amount: 149, description: 'Full program access' },
  { id: 'tier3', name: 'Premium', amount: 249, description: 'Priority support included' },
];

// Get coach's PayPal settings
export const getPayPalSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PAYPAL_SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading PayPal settings:', e);
  }
  return {
    email: '',
    businessName: '',
    currency: 'USD',
    isConfigured: false,
  };
};

// Save coach's PayPal settings
export const savePayPalSettings = (settings) => {
  try {
    const updated = {
      ...settings,
      isConfigured: !!(settings.email && settings.email.includes('@')),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PAYPAL_SETTINGS, JSON.stringify(updated));
    return { success: true, settings: updated };
  } catch (e) {
    console.error('Error saving PayPal settings:', e);
    return { success: false, error: e.message };
  }
};

// Get price tiers
export const getPriceTiers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRICE_TIERS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading price tiers:', e);
  }
  return DEFAULT_TIERS;
};

// Save price tiers
export const savePriceTiers = (tiers) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICE_TIERS, JSON.stringify(tiers));
    return { success: true };
  } catch (e) {
    console.error('Error saving price tiers:', e);
    return { success: false, error: e.message };
  }
};

// Add a new price tier
export const addPriceTier = (tier) => {
  const tiers = getPriceTiers();
  const newTier = {
    id: `tier_${Date.now()}`,
    ...tier,
  };
  tiers.push(newTier);
  savePriceTiers(tiers);
  return newTier;
};

// Update a price tier
export const updatePriceTier = (tierId, updates) => {
  const tiers = getPriceTiers();
  const index = tiers.findIndex(t => t.id === tierId);
  if (index !== -1) {
    tiers[index] = { ...tiers[index], ...updates };
    savePriceTiers(tiers);
    return tiers[index];
  }
  return null;
};

// Delete a price tier
export const deletePriceTier = (tierId) => {
  const tiers = getPriceTiers();
  const filtered = tiers.filter(t => t.id !== tierId);
  savePriceTiers(filtered);
  return filtered;
};

// Get last used amount
export const getLastPaymentAmount = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_AMOUNT);
    return stored ? parseFloat(stored) : null;
  } catch (e) {
    return null;
  }
};

// Save last used amount
export const saveLastPaymentAmount = (amount) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_AMOUNT, amount.toString());
  } catch (e) {
    console.error('Error saving last amount:', e);
  }
};

// Create a payment request for a client
export const createPaymentRequest = (clientId, clientEmail, amount, billingCycle = 'monthly') => {
  const settings = getPayPalSettings();

  if (!settings.isConfigured) {
    return {
      success: false,
      error: 'PayPal account not configured. Please set up your PayPal email in settings.'
    };
  }

  const request = {
    id: `pr_${Date.now()}`,
    clientId,
    clientEmail,
    amount,
    billingCycle,
    coachEmail: settings.email,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Save to pending requests
  try {
    const requests = getPaymentRequests();
    requests.push(request);
    localStorage.setItem(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(requests));

    // Update last used amount
    saveLastPaymentAmount(amount);

    return { success: true, request };
  } catch (e) {
    console.error('Error creating payment request:', e);
    return { success: false, error: e.message };
  }
};

// Get all payment requests
export const getPaymentRequests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PAYMENT_REQUESTS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// Update payment request status
export const updatePaymentRequestStatus = (requestId, status) => {
  const requests = getPaymentRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index].status = status;
    requests[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(requests));
    return requests[index];
  }
  return null;
};

// Generate PayPal subscription link
// In production, this would use PayPal's API to create actual subscription buttons
export const generatePayPalSubscriptionLink = (request) => {
  const settings = getPayPalSettings();

  if (!settings.isConfigured) {
    return null;
  }

  // PayPal subscription URL structure
  // In production, use PayPal's Subscriptions API to create proper plan
  const params = new URLSearchParams({
    cmd: '_xclick-subscriptions',
    business: settings.email,
    item_name: `${settings.businessName || 'Coaching'} - ${request.billingCycle} subscription`,
    a3: request.amount.toFixed(2),
    p3: 1,
    t3: request.billingCycle === 'monthly' ? 'M' : request.billingCycle === 'weekly' ? 'W' : 'Y',
    src: 1, // Recurring payment
    currency_code: settings.currency || 'USD',
    notify_url: '', // IPN URL for production
    return: window.location.origin + '/payment-success',
    cancel_return: window.location.origin + '/payment-cancelled',
  });

  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
};

// Send payment request to client (simulation - in production would send email)
export const sendPaymentRequestToClient = async (request) => {
  const link = generatePayPalSubscriptionLink(request);

  if (!link) {
    return { success: false, error: 'Could not generate payment link' };
  }

  // In production, this would:
  // 1. Send email to client with the payment link
  // 2. Use SendGrid, AWS SES, or similar service
  // 3. Track email delivery status

  // For now, we'll simulate success
  // In production, you would send an actual email here

  // Update request status
  updatePaymentRequestStatus(request.id, 'sent');

  return {
    success: true,
    message: 'Payment request sent to client',
    link
  };
};

// Get payment requests for a specific client
export const getClientPaymentRequests = (clientId) => {
  const requests = getPaymentRequests();
  return requests.filter(r => r.clientId === clientId);
};

// Check if client has active subscription
export const hasActiveSubscription = (clientId) => {
  const requests = getClientPaymentRequests(clientId);
  return requests.some(r => r.status === 'active');
};

// Format currency amount
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export default {
  getPayPalSettings,
  savePayPalSettings,
  getPriceTiers,
  savePriceTiers,
  addPriceTier,
  updatePriceTier,
  deletePriceTier,
  getLastPaymentAmount,
  saveLastPaymentAmount,
  createPaymentRequest,
  getPaymentRequests,
  updatePaymentRequestStatus,
  generatePayPalSubscriptionLink,
  sendPaymentRequestToClient,
  getClientPaymentRequests,
  hasActiveSubscription,
  formatCurrency,
};
