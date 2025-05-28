// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // You can auto-generate or insert manually
  name: { type: String, required: true },
  price: { type: String, required: true }, // String to match your original format
  image: { type: String, required: true }, // Image URL or path
});

module.exports = mongoose.model("Product", productSchema);
