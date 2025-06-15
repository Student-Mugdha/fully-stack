import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { toast } from "react-hot-toast";
import DashboardNavbar from "./DashboardNavbar";

const UserSubscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserSubscriptions();
  }, []);

  const fetchUserSubscriptions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("Users"));
      if (!user) {
        toast.error("Please login to view subscriptions");
        navigate("/login");
        return;
      }

      const response = await api.get(`/subscription/user/${user.userID}`);
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await api.post(`/subscription/cancel/${subscriptionId}`);
      toast.success("Subscription cancelled successfully");
      fetchUserSubscriptions(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const handleRenewSubscription = async (subscriptionId) => {
    try {
      await api.post(`/subscription/renew/${subscriptionId}`);
      toast.success("Subscription renewed successfully");
      fetchUserSubscriptions(); // Refresh the list
    } catch (error) {
      console.error("Error renewing subscription:", error);
      toast.error("Failed to renew subscription");
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="loading-container">
          <p>Loading subscriptions...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
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
              <div
                key={subscription.subscriptionID}
                className="subscription-card"
              >
                <div className="subscription-header">
                  <h2>{subscription.planName}</h2>
                  <span
                    className={`status ${subscription.status.toLowerCase()}`}
                  >
                    {subscription.status}
                  </span>
                </div>
                <div className="subscription-details">
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{subscription.price}
                  </p>
                  <p>
                    <strong>Duration:</strong> {subscription.duration}
                  </p>
                </div>
                <div className="subscription-actions">
                  {subscription.status === "ACTIVE" && (
                    <button
                      className="cancel-btn"
                      onClick={() =>
                        handleCancelSubscription(subscription.subscriptionID)
                      }
                    >
                      Cancel Subscription
                    </button>
                  )}
                  {subscription.status === "EXPIRED" && (
                    <button
                      className="renew-btn"
                      onClick={() =>
                        handleRenewSubscription(subscription.subscriptionID)
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
    </>
  );
};

export default UserSubscriptions;
