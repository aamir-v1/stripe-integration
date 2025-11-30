const express = require("express");
const router = express.Router();

const {
  createPaymentIntent,
  confirmPaymentIntent,
  getPaymentIntent,
  listPaymentIntents,
} = require("../controllers/paymentController");

router.post("/create", createPaymentIntent);
router.post("/confirm/:paymentIntentId", confirmPaymentIntent);
router.get("/:paymentIntentId", getPaymentIntent);
router.get("/", listPaymentIntents);

module.exports = router;
