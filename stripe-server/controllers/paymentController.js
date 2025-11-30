const stripe = require('../config/stripe');

// Create Payment Intent
const createPaymentIntent = async (req, res, next) => {
  try {
    const {
      amount,
      currency = 'usd',
      payment_method_types = ['card'],
      customerId,
    } = req.body;

    const paymentIntentData = {
      amount: amount * 100,
      currency,
      payment_method_types,
    };

    // Add customer if provided
    if (customerId) {
      paymentIntentData.customer = customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm Payment Intent
const confirmPaymentIntent = async (req, res, next) => {
  try {
    const {paymentIntentId} = req.params;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    res.status(200).json({
      status: paymentIntent.status,
      paymentIntent,
    });
  } catch (error) {
    next(error);
  }
};

// Get Payment Intent
const getPaymentIntent = async (req, res, next) => {
  try {
    const {paymentIntentId} = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json(paymentIntent);
  } catch (error) {
    next(error);
  }
};

// List Payment Intents
const listPaymentIntents = async (req, res, next) => {
  try {
    const {limit = 10} = req.query;

    const paymentIntents = await stripe.paymentIntents.list({
      limit: parseInt(limit),
    });

    res.status(200).json(paymentIntents);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  getPaymentIntent,
  listPaymentIntents,
};
