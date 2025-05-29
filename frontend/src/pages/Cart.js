import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Card,
  ListGroup,
  Form,
} from "react-bootstrap";
import API from "../api";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QHjAHRwFKrcZYFWWbNjoWah2HlW0yIghlzDiel5qtmn2Eudof0fzMGtOwSP1QpxDz1C2SYixo52vD6FKEBfRCAl00VHc3BUfw"
);

function CheckoutForm({ cartItems, onOrderSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch client secret from backend when component mounts or cart changes
    const fetchPaymentIntent = async () => {
      try {
        const { data } = await API.post("/order/create-payment-intent");
        setClientSecret(data.clientSecret);
        setTotalPrice(data.totalPrice);
      } catch (err) {
        setError("Failed to initiate payment");
      }
    };
    fetchPaymentIntent();
  }, [cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card Element not found");
      setProcessing(false);
      return;
    }

    // Confirm card payment
    const { paymentIntent, error: stripeError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        // Call backend to place order after successful payment
        const res = await API.post("/order/place", {
          paymentIntentId: paymentIntent.id,
        });
        onOrderSuccess(res.data.order);
      } catch (placeOrderError) {
        setError(
          placeOrderError.response?.data?.message || "Failed to place order"
        );
      }
    } else {
      setError("Payment not successful");
    }
    setProcessing(false);
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#495057" },
              invalid: { color: "#fa755a" },
            },
          }}
        />
        <Button
          variant="success"
          type="submit"
          disabled={!stripe || processing || cartItems.length === 0}
          className="mt-3 w-100"
        >
          {processing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </Button>
      </Form>
    </>
  );
}

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(null);
  const navigate = useNavigate();
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

  const handleOrderSuccess = (order) => {
    setOrderPlaced(order);
    setCartItems([]);
  };

  if (orderPlaced) {
    setTimeout(() => {
      navigate("/"); // Redirect to home page after 5 seconds
    }, 5000);
    return (
      <Container className="mt-5">
        <Alert variant="success">
          <h4>Order placed successfully!</h4>
          <p>Order ID: {orderPlaced._id}</p>
          <p>Total Paid: ${orderPlaced.totalPrice.toFixed(2)}</p>
        </Alert>
      </Container>
    );
  }

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
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    cartItems={cartItems}
                    onOrderSuccess={handleOrderSuccess}
                  />
                </Elements>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CartPage;
