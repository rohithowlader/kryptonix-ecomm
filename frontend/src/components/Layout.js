import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";
import "../styles/layout.css";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <TopNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
