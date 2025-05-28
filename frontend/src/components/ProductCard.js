import React from "react";
import { Card, Button } from "react-bootstrap";

function ProductCard({ product }) {
  return (
    <Card>
      <Card.Img
        variant="top"
        src={product.image}
        style={{ height: "400px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.price}</Card.Text>
        <Button variant="primary">Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
