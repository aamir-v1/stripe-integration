const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomer,
  updateCustomer,
  listCustomers,
  deleteCustomer,
} = require("../controllers/customerController");

router.post("/", createCustomer);
router.get("/:customerId", getCustomer);
router.put("/:customerId", updateCustomer);
router.delete("/:customerId", deleteCustomer);
router.get("/", listCustomers);

module.exports = router;
