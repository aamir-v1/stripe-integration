require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./utils/errorHandler");

// Import routes
const paymentRoutes = require("./routes/payments");
const customerRoutes = require("./routes/customers");
const subscriptionRoutes = require("./routes/subscriptions");
const webhookRoutes = require("./routes/webhooks");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook route needs raw body
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// API Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Stripe Server API",
    version: "1.0.0",
    endpoints: {
      payments: "/api/payments",
      customers: "/api/customers",
      subscriptions: "/api/subscriptions",
      webhooks: "/api/webhooks",
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
});
