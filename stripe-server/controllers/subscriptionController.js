const stripe = require("../config/stripe");

// Create Subscription
const createSubscription = async (req, res, next) => {
  try {
    const { customerId, priceId, paymentMethodId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ["latest_invoice.payment_intent"],
    });

    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

// Get Subscription
const getSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

// Update Subscription
const updateSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const updateData = req.body;

    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updateData
    );

    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

// Cancel Subscription
const cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

// List Subscriptions
const listSubscriptions = async (req, res, next) => {
  try {
    const { customerId, limit = 10 } = req.query;

    const params = { limit: parseInt(limit) };
    if (customerId) params.customer = customerId;

    const subscriptions = await stripe.subscriptions.list(params);

    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  listSubscriptions,
};
