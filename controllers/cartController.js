const Cart = require("../models/cartModel");
const mongoose = require("mongoose");
// const mongoose = require("mongoose");
// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "products.product"
    );
    res.json(cart || { products: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      // No cart exists, create new
      cart = new Cart({
        user: req.user.userId,
        products: [{ product: productId, quantity }],
      });
      await cart.save();
      return res.json({ message: "Added to cart", cart });
    }

    // Filter out invalid product entries (optional but good)
    cart.products = cart.products.filter(
      (item) => item.product && mongoose.Types.ObjectId.isValid(item.product)
    );

    // Check if product already in cart
    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingProduct) {
      // Product is already in cart
      return res.status(200).json({ message: "Already in cart", cart });
    }

    // If not in cart, add new product with quantity
    cart.products.push({ product: productId, quantity });
    await cart.save();

    return res.json({ message: "Added to cart", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.productId; // this is actually the cart product _id

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the cart item by its _id
    cart.products = cart.products.filter(
      (p) => p._id.toString() !== cartItemId
    );

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart" });
  }
};
