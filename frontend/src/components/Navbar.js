import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

function TopNavbar({ toggleSidebar }) {
  return (
    <Navbar bg="primary" variant="dark" className="top-navbar">
      <Container fluid>
        <button className="btn btn-link text-white" onClick={toggleSidebar}>
          <FaBars size={20} />
        </button>
        <Navbar.Brand>MyShop</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
