import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./subscription.css";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/subscription/plans"
      );
      setPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
      setLoading(false);
    }
  };

  const initializeRazorpay = async (plan) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    try {
      // Create subscription record
      const subscriptionResponse = await axios.post(
        "http://localhost:3000/subscription/subscribe",
        {
          userID,
          planId: plan.id,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "FruitBox Subscription",
        description: `${plan.name} - ${plan.duration} month`,
        order_id: subscriptionResponse.data.orderId,
        handler: async (response) => {
          try {
            await axios.post("http://localhost:3000/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: subscriptionResponse.data.subscriptionId,
            });

            toast.success("Subscription activated successfully!");
            navigate("/subscription/my-subscriptions");
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("userEmail"),
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
    }
  };

  if (loading) {
    return <div className="loading">Loading subscription plans...</div>;
  }

  return (
    <div className="subscription-container">
      <h1>Choose Your Subscription Plan</h1>
      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h2>{plan.name}</h2>
            <div className="price">₹{plan.price}</div>
            <div className="duration">{plan.duration} month</div>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              className="select-plan-btn"
              onClick={() => initializeRazorpay(plan)}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
