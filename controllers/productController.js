const Product = require("../models/Product");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllProducts,
};
