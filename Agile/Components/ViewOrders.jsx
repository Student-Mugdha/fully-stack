import React, { useState, useEffect } from "react";
import "./ViewOrders.css";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get vendor data from the session
        const vendorResponse = await api.get("/vendor/profile");
        const vendorID = vendorResponse.data.vendorID;

        // Fetch orders for the vendor
        const ordersResponse = await api.get(`/orders?vendor=${vendorID}`);
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderID) => {
    try {
      await api.patch(`/orders/${orderID}`, { Status: "Done" });
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderID !== orderID)
      );
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Failed to accept order. Please try again.");
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <VendorNavbar />
      <div className="vendor-dashboard">
        <h1>Vendor Dashboard</h1>
        <div className="orders-section">
          <h2>User Orders</h2>
          <ul>
            {orders.length > 0 ? (
              orders.map((order) => (
                <li key={order.orderID} className="order-card">
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
                  <div className="order-actions">
                    <button
                      onClick={() => handleAcceptOrder(order.orderID)}
                      className="accept-btn"
                      disabled={order.Status === "Done"}
                    >
                      Accept Order
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-orders">No orders available.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ViewOrders;
