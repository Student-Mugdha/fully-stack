import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./invoice.css";
import axios from "axios";

function ViewSubscriptionOrder() {
  const location = useLocation();
  const state = location.state || {};

  const [endDate, setEndDate] = useState(
    localStorage.getItem("subscriptionEndDate") || "N/A"
  );
  const [subsId, setSubsId] = useState(
    localStorage.getItem("subscriptionID") || "N/A"
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    localStorage.getItem("subscriptionStatus") || "N/A"
  );

  // Use cartItems from the passed state or localStorage
  const [cartItems, setCartItems] = useState(state.cartItems || []);
  const [totalPrice, setTotalPrice] = useState(state.totalPrice || 0);
  const [platformFee, setPlatformFee] = useState(state.platformFee || 0);
  const [finalTotal, setFinalTotal] = useState(state.finalTotal || 0);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      try {
        const parsedCartItems = JSON.parse(storedCartItems);

        // Avoid double-counting by mapping the items properly
        const uniqueItems = parsedCartItems.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.name === item.name);
          if (existingItem) {
            existingItem.quantity = item.quantity; // Replace the quantity instead of adding
          } else {
            acc.push(item);
          }
          return acc;
        }, []);

        setCartItems(uniqueItems);

        // Calculate total price and final total
        const total = uniqueItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
        setFinalTotal(total + platformFee);
      } catch (error) {
        console.error("Error parsing cartItems from localStorage", error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [platformFee]);

  useEffect(() => {
    // Store the cart items in local storage whenever they change
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]); // Add cartItems to the dependency array

  let selectedPlan = localStorage.getItem("selectedPlan") || "{}";
  try {
    selectedPlan = JSON.parse(selectedPlan);
  } catch (error) {
    console.error("Error parsing selectedPlan from local storage", error);
    selectedPlan = {};
  }

  const planName = selectedPlan.name || "N/A";
  const startDate = new Date();

  const plans = [
    {
      name: "Weekly Plan",
      price: "300/Week",
      duration: 7,
      features: ["2 Fruits", "2 Veggies", "Quantity: 2/head"],
    },
    {
      name: "Monthly Plan",
      price: "500/Month",
      duration: 30,
      features: ["4 Fruits", "4 Veggies", "Quantity: 4/head"],
    },
  ];

  const selectedPlanDetails = plans.find((plan) => plan.name === planName);

  const handleCancelToday = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/subscription/cancelToday",
        { subs_ID: subsId }
      );

      if (response.data && response.data.newEndDate) {
        const newEndDate = new Date(response.data.newEndDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        const formattedNewEndDate = newEndDate.toLocaleDateString();
        setEndDate(formattedNewEndDate);
        localStorage.setItem("subscriptionEndDate", formattedNewEndDate);

        alert("Subscription day canceled, end date extended");
      } else {
        alert("Error: Could not update the subscription end date");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Error canceling subscription");
    }
  };

  return (
    <div className="invoice-container">
      <h1 style={{ fontSize: "2em" }}>Subscription Plans</h1>
      <div className="invoice-details">
        <p>
          <strong>Subscription ID:</strong> {subsId}
        </p>
        <p>
          <strong>Plan Name:</strong> {planName}
        </p>
        {selectedPlanDetails && (
          <p>
            <strong>Plan Price:</strong> Rs. {selectedPlanDetails.price}
          </p>
        )}
        <p>
          <strong>Start Date:</strong> {startDate.toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong> {endDate}
        </p>
        <p>
          <strong>Status:</strong> {subscriptionStatus}
        </p>

        {/* Display cart items */}
        <div className="invoice-items">
          <h3>Products in your subscription:</h3>
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
            <p>No products in the cart.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewSubscriptionOrder;
