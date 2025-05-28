import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
  ListGroup,
} from "react-bootstrap";
import API from "../api";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart");
      setCartItems(data.products || []);
    } catch (err) {
      setError("Failed to load cart items");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      setCartItems(cartItems.filter((item) => item._id !== productId));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price),
    0
  );

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Container className="mt-5">
      <h2>Your Cart</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <Row>
          {/* Left Panel: Cart Items */}
          <Col md={8}>
            {cartItems.map((item) => (
              <Card key={item._id} className="mb-3">
                <Row className="g-0 align-items-center">
                  <Col md={4}>
                    <Card.Img
                      src={item.image}
                      alt={item.name}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>${Number(item.price).toFixed(2)}</Card.Text>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          {/* Right Panel: Order Summary */}
          <Col md={4}>
            <Card>
              <Card.Header>Order Summary</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Total Items:</strong> {cartItems.length}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Button
                  variant="success"
                  className="w-100"
                  disabled={cartItems.length === 0}
                >
                  Place Order
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CartPage;
