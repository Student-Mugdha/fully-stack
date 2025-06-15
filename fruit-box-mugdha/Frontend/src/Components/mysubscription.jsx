import React, { useEffect, useState } from "react";
import "./mysubscription.css";
import axios from "axios";

const MySubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionDates, setSubscriptionDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [subsID, setSubsID] = useState(null);

  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan");
    const savedSubsID = localStorage.getItem("subscriptionID");

    if (plan && savedSubsID) {
      const parsedPlan = JSON.parse(plan);
      setSelectedPlan(parsedPlan);
      setSubsID(savedSubsID);

      // Fetch subscription details from the backend
      const fetchSubscriptionDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/subscription/details`,
            {
              params: { subs_ID: savedSubsID },
            }
          );

          const { endDate, startDate } = response.data;
          const formattedStartDate = new Date(startDate)
            .toISOString()
            .split("T")[0];
          const formattedEndDate = new Date(endDate);
          const updatedEndDate = new Date(formattedEndDate);
          updatedEndDate.setDate(updatedEndDate.getDate() + 1);
          const formattedEndDatePlusOne = updatedEndDate
            .toISOString()
            .split("T")[0];

          setSubscriptionDates({
            startDate: formattedStartDate,
            endDate: formattedEndDatePlusOne,
          });
          localStorage.setItem("subscriptionEndDate", formattedEndDatePlusOne);

          const currentDate = new Date();
          const subscriptionEndDate = new Date(endDate);

          const status =
            currentDate.getTime() !== subscriptionEndDate.getTime()
              ? "Active"
              : "Expired";
          setSubscriptionStatus(status);
          localStorage.setItem("subscriptionStatus", status); // Save subscription status to localStorage
        } catch (error) {
          console.error("Error fetching subscription details:", error);
        }
      };

      fetchSubscriptionDetails();
    }
  }, []);

  const handleCancelToday = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/subscription/cancelToday",
        { subs_ID: subsID }
      );

      if (response.data && response.data.newEndDate) {
        const newEndDate = new Date(response.data.newEndDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        const formattedNewEndDate = newEndDate.toISOString().split("T")[0];

        setSubscriptionDates((prev) => ({
          ...prev,
          endDate: formattedNewEndDate,
        }));
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
    <div className="subscription-container">
      <h1>Your Subscription</h1>
      {selectedPlan ? (
        <div className="subscription-details">
          <h2>{selectedPlan.name}</h2>
          <p>Start Date: {subscriptionDates.startDate}</p>
          <br />
          <p>End Date: {subscriptionDates.endDate}</p>
          <br />

          <p>
            Status: <strong>{subscriptionStatus}</strong>
          </p>
          <br />
          <p>You can cancel today order . Your end date extends</p>
          <br />
          <button className="cancel-button" onClick={handleCancelToday}>
            Cancel Today
          </button>
          <br />
        </div>
      ) : (
        <p className="no-subscription">No subscription selected.</p>
      )}
    </div>
  );
};

export default MySubscription;
