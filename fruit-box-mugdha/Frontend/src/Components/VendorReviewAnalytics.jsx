import React, { useState, useEffect } from "react";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";

const VendorReviewAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/vendor/reviews/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to fetch analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <VendorNavbar />
      <div className="analytics-content">
        <h1>Review Analytics</h1>

        <div className="analytics-grid">
          {/* Overall Rating Card */}
          <div className="analytics-card">
            <h3>Overall Rating</h3>
            <div className="rating-display">
              <span className="rating-number">
                {analytics.averageRating.toFixed(1)}
              </span>
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${
                      index < Math.round(analytics.averageRating)
                        ? "filled"
                        : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="rating-count">
              Based on {analytics.totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution Card */}
          <div className="analytics-card">
            <h3>Rating Distribution</h3>
            <div className="rating-distribution">
              {analytics.ratingDistribution.map((count, index) => (
                <div key={index} className="rating-bar">
                  <span className="rating-label">{5 - index} stars</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(count / analytics.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews Card */}
          <div className="analytics-card">
            <h3>Recent Reviews</h3>
            <div className="recent-reviews">
              {analytics.recentReviews.map((review) => (
                <div key={review.reviewID} className="recent-review">
                  <div className="review-rating">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`star ${
                          index < review.rating ? "filled" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="review-text">{review.reviewText}</p>
                  <span className="review-date">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Response Rate Card */}
          <div className="analytics-card">
            <h3>Response Rate</h3>
            <div className="response-rate">
              <div className="response-circle">
                <span className="response-percentage">
                  {analytics.responseRate}%
                </span>
                <span className="response-label">Response Rate</span>
              </div>
              <div className="response-stats">
                <p>Total Reviews: {analytics.totalReviews}</p>
                <p>Responded: {analytics.respondedReviews}</p>
                <p>
                  Pending: {analytics.totalReviews - analytics.respondedReviews}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorReviewAnalytics;
