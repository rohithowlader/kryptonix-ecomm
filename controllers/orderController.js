const Stripe = require("stripe");
const dotenv = require("dotenv");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Cart = require("../models/cartModel");
const Product = require("../models/Product");

// Create Stripe Payment Intent for full cart
exports.createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cart.products.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.product.price || 0;
      return sum + price * quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe requires cents
      currency: "usd",
      metadata: {
        userId,
        cartId: cart._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalPrice,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
};

// Confirm order and place after Stripe payment
exports.placeOrder = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.userId;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cart.products.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.product.price || 0;
      return sum + price * quantity;
    }, 0);

    const order = new Order({
      user: userId,
      products: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity || 1,
        price: item.product.price,
      })),
      totalPrice,
      paymentIntentId: paymentIntent.id,
      paymentStatus: "paid",
      paymentMethod: "stripe",
    });

    await order.save();

    // Clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};
