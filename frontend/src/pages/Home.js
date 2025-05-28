import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import API from "../api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Products</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col md={4} key={product._id} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Home;
