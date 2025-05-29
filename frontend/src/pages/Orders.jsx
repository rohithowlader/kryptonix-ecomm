import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Button,
  Modal,
  ListGroup,
  Pagination,
  Alert,
} from "react-bootstrap";
import API from "../api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");

  const fetchOrders = async (pageNumber = 1) => {
    try {
      const { data } = await API.get(`/orders?page=${pageNumber}`);
      setOrders(data.orders);
      setPage(data.page);
      setPages(data.totalPages);
    } catch (err) {
      setError("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleCloseModal = () => setModalOrder(null);

  return (
    <Container className="mt-4">
      <h2>Your Orders</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>${(order.totalPrice || 0).toFixed(2)}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setModalOrder(order)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.Prev
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            />
            {[...Array(pages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === page}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            />
          </Pagination>
        </>
      )}

      <Modal show={!!modalOrder} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalOrder && (
            <>
              <p>
                <strong>Order ID:</strong> {modalOrder._id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(modalOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> $
                {(modalOrder.totalPrice || 0).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {modalOrder.paymentStatus}
              </p>
              <ListGroup>
                {" "}
                {modalOrder.products.map((item, idx) => (
                  <ListGroup.Item key={idx}>
                    {" "}
                    Product: {item.product?.name || "N/A"} <br />
                    Quantity: {item.quantity || 1} <br />
                    Price per unit: ${" "}
                    {(Number(item.product?.price) || 0).toFixed(2)} <br />{" "}
                    Subtotal: ${" "}
                    {(
                      (Number(item.product?.price) || 0) * (item.quantity || 1)
                    ).toFixed(2)}{" "}
                  </ListGroup.Item>
                ))}{" "}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersPage;
