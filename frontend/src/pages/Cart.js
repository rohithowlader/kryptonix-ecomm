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

  const removeFromCart = async (cartProductId) => {
    try {
      await API.delete(`/cart/${cartProductId}`);
      setCartItems(cartItems.filter((item) => item._id !== cartProductId));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  // Calculate total price considering quantity
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * (item.quantity || 1),
    0
  );

  // Calculate total items (sum of quantities)
  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
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
          <Col md={8}>
            {cartItems.map((item) => (
              <Card key={item._id} className="mb-3">
                <Row className="g-0 align-items-center">
                  <Col md={4}>
                    <Card.Img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{item.product.name}</Card.Title>
                      <Card.Text>
                        Price: ${Number(item.product.price).toFixed(2)}
                        <br />
                        Quantity: {item.quantity || 1}
                        <br />
                        Total: $
                        {(
                          Number(item.product.price) * (item.quantity || 1)
                        ).toFixed(2)}
                      </Card.Text>

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

          <Col md={4}>
            <Card>
              <Card.Header>Order Summary</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Total Items:</strong> {totalItems}
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
