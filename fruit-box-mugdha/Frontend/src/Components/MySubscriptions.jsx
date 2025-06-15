import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./mysubscription.css";

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      toast.error("Please login to view subscriptions");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/subscription/user/${userID}`
      );
      setSubscriptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await axios.post(
        `http://localhost:3000/subscription/cancel/${subscriptionId}`
      );
      toast.success("Subscription cancelled successfully");
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const handleRenewSubscription = async (subscriptionId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/subscription/renew/${subscriptionId}`
      );

      // Initialize Razorpay payment for renewal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: subscription.price * 100,
        currency: "INR",
        name: "FruitBox Subscription Renewal",
        description: `Renewal of ${subscription.subs_Type}`,
        handler: async (response) => {
          try {
            await axios.post("http://localhost:3000/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: subscriptionId,
            });

            toast.success("Subscription renewed successfully");
            fetchSubscriptions();
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
      console.error("Error renewing subscription:", error);
      toast.error("Failed to renew subscription");
    }
  };

  if (loading) {
    return <div className="loading">Loading subscriptions...</div>;
  }

  return (
    <div className="subscriptions-container">
      <h1>My Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <div className="no-subscriptions">
          <p>You don't have any active subscriptions.</p>
          <button
            className="browse-plans-btn"
            onClick={() => navigate("/subscription/plans")}
          >
            Browse Subscription Plans
          </button>
        </div>
      ) : (
        <div className="subscriptions-list">
          {subscriptions.map((subscription) => (
            <div key={subscription.subs_ID} className="subscription-card">
              <div className="subscription-header">
                <h2>{subscription.subs_Type}</h2>
                <span className={`status ${subscription.status.toLowerCase()}`}>
                  {subscription.status}
                </span>
              </div>

              <div className="subscription-details">
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(subscription.StartDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(subscription.EndDate).toLocaleDateString()}
                </p>
              </div>

              <div className="subscription-actions">
                {subscription.status === "ACTIVE" && (
                  <button
                    className="cancel-btn"
                    onClick={() =>
                      handleCancelSubscription(subscription.subs_ID)
                    }
                  >
                    Cancel Subscription
                  </button>
                )}
                {subscription.status === "EXPIRED" && (
                  <button
                    className="renew-btn"
                    onClick={() =>
                      handleRenewSubscription(subscription.subs_ID)
                    }
                  >
                    Renew Subscription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
