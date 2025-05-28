import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Cart from "./pages/Cart";
// import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
