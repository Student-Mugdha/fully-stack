import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import { Link } from "react-router-dom";

function UserDashboard({ clearCart }) {
  const navigate = useNavigate();

  // Check if the user is logged in by verifying the token
  const token = localStorage.getItem("userToken");

  if (!token) {
    // Redirect to login if token is not found (user is not logged in)
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar clearCart={clearCart} />
      <div className="product-page">
        <div className="product-container">
          {/* Fruit Section */}
          <div className="section">
            <div className="product-card fruit-card">
              <h2 className="product-title">Fruits</h2>
              <Link to="/fruitsection" className="product-button">
                Browse Fruits
              </Link>
            </div>
          </div>

          {/* Vegetable Section */}
          <div className="section">
            <div className="product-card veggie-card">
              <h2 className="product-title">Vegetables</h2>
              <Link to="/veggiesection" className="product-button">
                Browse Vegetables
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
