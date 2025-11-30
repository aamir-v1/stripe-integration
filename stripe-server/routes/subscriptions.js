const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  listSubscriptions,
} = require("../controllers/subscriptionController");

router.post("/", createSubscription);
router.get("/:subscriptionId", getSubscription);
router.put("/:subscriptionId", updateSubscription);
router.delete("/:subscriptionId", cancelSubscription);
router.get("/", listSubscriptions);

module.exports = router;
