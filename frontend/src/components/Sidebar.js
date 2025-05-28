import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaHome,
  FaShoppingCart,
  //   FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBox,
} from "react-icons/fa";
import "../styles/layout.css";

function Sidebar({ isOpen, closeSidebar }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h4>Welcome{user ? "!" : ""}</h4>
        <button className="close-btn" onClick={closeSidebar}>
          ×
        </button>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/" onClick={closeSidebar}>
            <FaHome /> Home
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/cart" onClick={closeSidebar}>
                <FaShoppingCart /> Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" onClick={closeSidebar}>
                <FaBox /> Orders
              </Link>
            </li>
            <li>
              <button className="logout-btn" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={closeSidebar}>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={closeSidebar}>
                <FaUserPlus /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
