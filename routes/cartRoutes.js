const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.delete("/:productId", authMiddleware, removeFromCart);

module.exports = router;
