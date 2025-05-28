// import React from "react";
// import { Card, Button } from "react-bootstrap";

// function ProductCard({ product }) {
//   return (
//     <Card>
//       <Card.Img
//         variant="top"
//         src={product.image}
//         style={{ height: "400px", objectFit: "cover" }}
//       />
//       <Card.Body>
//         <Card.Title>{product.name}</Card.Title>
//         <Card.Text>${product.price}</Card.Text>
//         <Button variant="primary">Add to Cart</Button>
//       </Card.Body>
//     </Card>
//   );
// }

// export default ProductCard;
import React from "react";
import { Card, Button } from "react-bootstrap";
import API from "../api";

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      await API.post("/cart", { productId: product._id });
      alert("Added to cart!");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Img
        variant="top"
        src={product.image}
        height="400"
        style={{ objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.price}</Card.Text>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
