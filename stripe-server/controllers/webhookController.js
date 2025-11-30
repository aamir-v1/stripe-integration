const stripe = require("../config/stripe");

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent succeeded:", paymentIntent.id);
      // Handle successful payment
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("PaymentIntent failed:", failedPayment.id);
      // Handle failed payment
      break;

    case "customer.subscription.created":
      const subscription = event.data.object;
      console.log("Subscription created:", subscription.id);
      // Handle subscription creation
      break;

    case "customer.subscription.updated":
      const updatedSubscription = event.data.object;
      console.log("Subscription updated:", updatedSubscription.id);
      // Handle subscription update
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object;
      console.log("Subscription deleted:", deletedSubscription.id);
      // Handle subscription deletion
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  handleWebhook,
};
