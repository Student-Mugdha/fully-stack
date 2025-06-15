import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { toast } from "react-hot-toast";
import DashboardNavbar from "./DashboardNavbar";

const SubscriptionProducts = () => {
  const navigate = useNavigate();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await api.get("/subscription/plans");
      setSubscriptionPlans(response.data);
      if (response.data.length > 0) {
        setSelectedPlan(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const user = JSON.parse(localStorage.getItem("Users"));
      if (!user) {
        toast.error("Please login to subscribe");
        navigate("/login");
        return;
      }

      const response = await api.post("/subscription/subscribe", {
        userId: user.userID,
        planId: plan.planID,
        duration: plan.duration,
      });

      toast.success("Successfully subscribed!");
      navigate("/subscription/confirmation");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error(error.response?.data?.message || "Failed to subscribe");
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="loading-container">
          <p>Loading subscription plans...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <div className="subscription-container">
        <h1>Subscription Plans</h1>
        <div className="subscription-plans">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.planID}
              className={`subscription-plan ${
                selectedPlan?.planID === plan.planID ? "selected" : ""
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h2>{plan.name}</h2>
              <div className="price">
                <span className="amount">₹{plan.price}</span>
                <span className="duration">/{plan.duration}</span>
              </div>
              <ul className="features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button
                className="subscribe-btn"
                onClick={() => handleSubscribe(plan)}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SubscriptionProducts;
