import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VendorDashboard.css";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";
import { toast } from "react-hot-toast";

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVendorAuth = async () => {
      try {
        const response = await api.get("/vendor/profile");
        setVendorData(response.data);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        setError("Failed to fetch vendor data. Please try again.");
        toast.error("Authentication failed. Please login again.");
        navigate("/login/vendor");
      } finally {
        setLoading(false);
      }
    };

    checkVendorAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard-container">
      <VendorNavbar />
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {vendorData.vendorName}!</h1>
          <p>Manage your products, orders, and reviews from your dashboard.</p>
        </div>

        <div className="dashboard-grid">
          {/* Products Management Card */}
          <div className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Products Management</h3>
            <p>Add, edit, or remove products from your inventory</p>
            <div className="card-actions">
              <Link to="/addproduct" className="card-button primary">
                Add New Product
              </Link>
              <Link to="/products" className="card-button secondary">
                View Products
              </Link>
            </div>
          </div>

          {/* Orders Management Card */}
          <div className="dashboard-card">
            <div className="card-icon">🛍️</div>
            <h3>Orders Management</h3>
            <p>View and manage customer orders</p>
            <div className="card-actions">
              <Link to="/vieworders" className="card-button primary">
                View Orders
              </Link>
              <Link to="/orders/history" className="card-button secondary">
                Order History
              </Link>
            </div>
          </div>

          {/* Reviews Management Card */}
          <div className="dashboard-card">
            <div className="card-icon">⭐</div>
            <h3>Reviews Management</h3>
            <p>View and respond to customer reviews</p>
            <div className="card-actions">
              <Link to="/vendor/reviews" className="card-button primary">
                View Reviews
              </Link>
              <Link
                to="/vendor/reviews/analytics"
                className="card-button secondary"
              >
                Review Analytics
              </Link>
            </div>
          </div>

          {/* Profile Management Card */}
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Profile Management</h3>
            <p>Update your vendor profile information</p>
            <div className="card-actions">
              <Link to="/vendor/edit" className="card-button primary">
                Edit Profile
              </Link>
              <Link to="/vendor/settings" className="card-button secondary">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
