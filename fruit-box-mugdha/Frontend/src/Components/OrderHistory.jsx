import React, { useState, useEffect } from "react";
import api from "../api/config";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = localStorage.getItem("Users");
        if (!userData) {
          navigate("/login");
          toast.error("Please login to view your order history");
          return;
        }

        // Get user data from the session
        const userResponse = await api.get("/user/profile");
        const userID = userResponse.data.userID;

        if (!userID) {
          toast.error("User ID not found. Please login again.");
          navigate("/login");
          return;
        }

        // Fetch completed orders for the user
        const ordersResponse = await api.get(
          `/completed-orders?user=${userID}`
        );

        if (!ordersResponse.data || !Array.isArray(ordersResponse.data)) {
          setOrders([]);
          toast.error("No order history found or invalid data format");
          return;
        }

        // Sort orders by date (most recent first)
        const sortedOrders = ordersResponse.data.sort(
          (a, b) => new Date(b.OrderDate) - new Date(a.OrderDate)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          setError("Failed to fetch orders. Please try again later.");
          toast.error("Failed to fetch orders. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      <div className="orders-section">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.orderID} className="order-card">
              <div className="order-details">
                <h3>Order #{order.orderID}</h3>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.OrderDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Delivery Date:</strong>{" "}
                  {new Date(order.DeliveryDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{order.TotalAmount}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${order.Status.toLowerCase()}`}>
                    {order.Status}
                  </span>
                </p>
              </div>
              <div className="order-actions">
                <button
                  onClick={() => navigate(`/view-order/${order.orderID}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-orders">No order history available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
