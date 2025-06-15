import React, { useState } from "react";
import axios from "axios";
import Payment from "./Payment";
import "./subscription.css";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const plans = [
    {
      id: 1,
      name: "Basic Plan",
      price: 999,
      duration: "1 month",
      features: [
        "Weekly delivery",
        "5 items per delivery",
        "Basic fruits and vegetables",
      ],
    },
    {
      id: 2,
      name: "Premium Plan",
      price: 1899,
      duration: "1 month",
      features: [
        "Bi-weekly delivery",
        "10 items per delivery",
        "Premium fruits and vegetables",
        "Priority delivery",
      ],
    },
    {
      id: 3,
      name: "Family Plan",
      price: 2999,
      duration: "1 month",
      features: [
        "Daily delivery",
        "15 items per delivery",
        "Premium fruits and vegetables",
        "Priority delivery",
        "Custom selection",
      ],
    },
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
    setError(null);
    setSuccess(false);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Get user ID from session/localStorage
      const userID = localStorage.getItem("userID");

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      // Create subscription
      const subscriptionResponse = await axios.post(
        "http://localhost:3000/subscription",
        {
          userID,
          subs_Type: selectedPlan.name,
          StartDate: startDate.toISOString().split("T")[0],
          EndDate: endDate.toISOString().split("T")[0],
        }
      );

      // Update payment status
      await axios.post("http://localhost:3000/payment-success", {
        paymentIntentId: paymentIntent.id,
        subscriptionId: subscriptionResponse.data.subsID,
      });

      setSuccess(true);
      setShowPayment(false);
      setSelectedPlan(null);
    } catch (err) {
      setError("Failed to process subscription. Please try again.");
      console.error("Subscription error:", err);
    }
  };

  const handlePaymentError = async (error) => {
    setError(error);
    if (selectedPlan) {
      try {
        await axios.post("http://localhost:3000/payment-failure", {
          subscriptionId: selectedPlan.id,
        });
      } catch (err) {
        console.error("Error recording payment failure:", err);
      }
    }
  };

  return (
    <div className="subscription-container">
      <h1>Choose Your Subscription Plan</h1>

      {!showPayment ? (
        <div className="plans-container">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h2>{plan.name}</h2>
              <div className="price">₹{plan.price}</div>
              <div className="duration">{plan.duration}</div>
              <ul className="features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button
                className="select-plan-btn"
                onClick={() => handlePlanSelect(plan)}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="payment-section">
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Subscription activated successfully!
            </div>
          )}
          <Payment
            amount={selectedPlan.price}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          <button
            className="back-button"
            onClick={() => {
              setShowPayment(false);
              setSelectedPlan(null);
              setError(null);
              setSuccess(false);
            }}
          >
            Back to Plans
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscription;
