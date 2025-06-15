import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./VendorNavbar.css";

const VendorNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear any local storage items
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("vendorData");

      // Show success message
      toast.success("Logged out successfully");

      // Navigate to login page
      navigate("/login/vendor");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="vendor-navbar">
      <div className="navbar-container">
        <Link to="/vendordashboard" className="navbar-brand">
          Vendor Dashboard
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          <Link to="/vendordashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/addproduct" className="nav-link">
            Add Product
          </Link>
          <Link to="/vieworders" className="nav-link">
            View Orders
          </Link>
          <Link to="/vendor/reviews" className="nav-link">
            Reviews
          </Link>
          <Link to="/vendor/edit" className="nav-link">
            Edit Profile
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default VendorNavbar;
