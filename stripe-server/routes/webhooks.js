const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controllers/webhookController");

// Stripe webhooks require raw body, so we need to handle it differently
// This route should be registered with express.raw({ type: 'application/json' })
router.post("/", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
