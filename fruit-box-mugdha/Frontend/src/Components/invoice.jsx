import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./invoice.css"; // Import CSS for styling

function Invoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {}; // Default to an empty object if state is null

  const {
    cartItems = [],
    totalPrice = 0,
    platformFee = 0,
    finalTotal = 0,
    orderId = "N/A",
  } = state;

  // State to store vendor list and selected vendor
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch vendors from API using axios
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/vendors/details"
        );
        console.log("API Response:", response.data);
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // Handle vendor selection
  const handleVendorChange = (event) => {
    setSelectedVendor(event.target.value);
  };

  // Simulate placing the order
  const handlePlaceOrder = () => {
    setIsOrderPlaced(true); // Show the vendor selection dropdown
  };

  // Initialize Razorpay payment
  const initializePayment = async () => {
    try {
      setIsPaymentProcessing(true);

      // Create order on your backend
      const response = await axios.post("http://localhost:3000/create-order", {
        amount: finalTotal * 100, // Convert to paise
        currency: "INR",
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Using environment variable
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Fruit Box",
        description: "Order Payment",
        order_id: response.data.id,
        handler: async (response) => {
          try {
            const user = JSON.parse(localStorage.getItem("users"));
            const userID = user ? user.userID : null;

            if (!userID) {
              throw new Error("User not logged in");
            }

            try {
              // Verify payment on backend with order details
              const verificationResponse = await axios.post(
                "http://localhost:3000/verify-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderDetails: {
                    userID: userID,
                    vendorID: selectedVendor,
                    OrderDate: new Date().toISOString().split("T")[0],
                    DeliveryDate: new Date().toISOString().split("T")[0],
                    Status: "Pending",
                    TotalAmount: finalTotal,
                    PaymentStatus: "Completed",
                    PaymentID: response.razorpay_payment_id,
                    OrderID: response.razorpay_order_id,
                  },
                }
              );

              if (verificationResponse.data.status === "success") {
                alert("Payment successful!");
                navigate("/userdashboard");
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              alert(
                error.response?.data?.error ||
                  "Payment verification failed. Please try again."
              );
              throw error;
            }

            // If payment is successful, submit the order
            await handleSubmitOrder();
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3498db",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  // Handle final order submission
  const handleSubmitOrder = async () => {
    const user = JSON.parse(localStorage.getItem("users"));
    const userID = user ? user.userID : null;

    if (!userID) {
      console.error("No userID found in localStorage.");
      alert("User not logged in.");
      return;
    }

    const orderDetails = {
      userID: userID,
      vendorID: selectedVendor || null,
      OrderDate: new Date().toISOString().split("T")[0],
      DeliveryDate: new Date().toISOString().split("T")[0],
      Status: "Pending",
      TotalAmount: finalTotal || null,
      PaymentStatus: "Completed",
    };

    console.log("Submitting Order Details:", orderDetails);

    try {
      const response = await axios.post(
        "http://localhost:3000/orders",
        orderDetails
      );
      console.log("Order placed successfully:", response.data);
      alert("Order placed successfully!"); // Notify the user of success
      navigate("/userdashboard"); // Redirect to user dashboard
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="invoice-container">
      <h1 style={{ fontSize: "2em" }}>Invoice</h1>
      <div className="invoice-details">
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </p>
        <div className="invoice-items">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="invoice-item">
                <p>
                  {item.name} (x{item.quantity})
                </p>
                <p>Rs. {item.price * item.quantity}</p>
              </div>
            ))
          ) : (
            <p>No items in the cart.</p>
          )}
        </div>
        <div className="invoice-summary">
          <p>
            <strong>Total Price:</strong> Rs. {totalPrice}
          </p>
          <p>
            <strong>Platform Fee:</strong> Rs. {platformFee}
          </p>
          <p style={{ color: "green", fontSize: "1.5em" }}>
            <strong>Final Total:</strong> Rs. {finalTotal}
          </p>
        </div>
      </div>
      {!isOrderPlaced ? (
        <button className="back-button" onClick={handlePlaceOrder}>
          Place Order
        </button>
      ) : (
        <div className="vendor-selection">
          <label htmlFor="vendor">Select Vendor:</label>
          <div className="select-container">
            <select
              id="vendor"
              value={selectedVendor}
              onChange={handleVendorChange}
            >
              <option value="">-- Select Vendor --</option>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <option key={vendor.vendorID} value={vendor.vendorID}>
                    {vendor.vendorName} (ID: {vendor.vendorID}, Address:{" "}
                    {vendor.vendorAddress})
                  </option>
                ))
              ) : (
                <option value="">No vendors available</option>
              )}
            </select>
          </div>
          <button
            className="submit-button"
            onClick={initializePayment}
            disabled={isPaymentProcessing || !selectedVendor}
          >
            {isPaymentProcessing ? "Processing Payment..." : "Pay Now"}
          </button>
        </div>
      )}
      <Link to="/userdashboard">
        <button className="back-button">Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default Invoice;
