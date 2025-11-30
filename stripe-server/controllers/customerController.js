const stripe = require('../config/stripe');

// Create Customer (or get existing)
const createCustomer = async (req, res, next) => {
  try {
    const { email, name, phone, metadata } = req.body;

    // First, check if customer with this email already exists
    if (email) {
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        // Customer exists, return existing customer
        return res.status(200).json(existingCustomers.data[0]);
      }
    }

    // Customer doesn't exist, create new one
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata,
    });

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

// Get Customer
const getCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await stripe.customers.retrieve(customerId);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

// Update Customer
const updateCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const updateData = req.body;

    const customer = await stripe.customers.update(customerId, updateData);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

// List Customers
const listCustomers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const customers = await stripe.customers.list({
      limit: parseInt(limit),
    });

    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

// Delete Customer
const deleteCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const deleted = await stripe.customers.del(customerId);

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  listCustomers,
  deleteCustomer,
};
