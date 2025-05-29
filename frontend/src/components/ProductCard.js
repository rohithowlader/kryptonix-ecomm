import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token"); // You can replace this with your auth logic

  const handleAddToCart = async () => {
    try {
      const { data } = await API.post("/cart", {
        productId: product._id,
        quantity,
      });

      if (data.message === "Already in cart") {
        alert("Product is already in your cart. Delete from cart to add it.");
      } else if (data.message === "Added to cart") {
        alert("Added to cart!");
      } else {
        alert("Action completed.");
      }
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Card className="mb-4 shadow-sm" style={{ height: "700px" }}>
      <Card.Img
        variant="top"
        src={product.image}
        height="400"
        style={{ objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${Number(product.price).toFixed(2)}</Card.Text>

        {isLoggedIn ? (
          <>
            <Form.Group controlId={`quantity-${product._id}`} className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </Form.Group>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </>
        ) : (
          <Button variant="primary" onClick={handleLoginRedirect}>
            Login to Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
