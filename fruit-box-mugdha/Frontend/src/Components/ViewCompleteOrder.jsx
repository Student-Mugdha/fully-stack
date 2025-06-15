import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./ViewOrders.css";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";

const ViewCompleteOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      try {
        // First check if vendor is logged in and has valid token
        const vendorData = localStorage.getItem("Vendors");
        const token = localStorage.getItem("token");
        if (!vendorData || !token) {
          toast.error("Please login to access the vendor dashboard");
          navigate("/login/vendor");
          return;
        }

        // Get vendor data from the session
        const vendorResponse = await api.get("/vendor/profile");
        const vendorID = vendorResponse.data.vendorID;

        if (!vendorID) {
          toast.error("Vendor ID not found. Please login again.");
          navigate("/login/vendor");
          return;
        }

        // Fetch completed orders for the vendor
        const ordersResponse = await api.get(
          `/vendor/${vendorID}/orders/completed`
        );
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error:", error);
        if (error.isAuthError || error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login/vendor", { replace: true });
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to view orders.");
          navigate("/vendor/dashboard");
        } else {
          toast.error("Failed to fetch orders. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <VendorNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <VendorNavbar />
      <div className="vendor-dashboard">
        <h1>Completed Orders</h1>
        <div className="orders-section">
          <div className="orders-list">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.orderID} className="order-card">
                  <div className="order-details">
                    <p>
                      <strong>Order ID:</strong> {order.orderID}
                    </p>
                    <p>
                      <strong>User ID:</strong> {order.userID}
                    </p>
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
                </div>
              ))
            ) : (
              <p className="no-orders">No completed orders available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCompleteOrder;
