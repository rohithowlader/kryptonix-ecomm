const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware"); // your auth middleware

// Create Stripe Payment Intent
router.post(
  "/order/create-payment-intent",
  authMiddleware,
  orderController.createPaymentIntent
);

// Place order after payment success
router.post("/order/place", authMiddleware, orderController.placeOrder);
router.get("/orders", authMiddleware, orderController.getUserOrders);
module.exports = router;
