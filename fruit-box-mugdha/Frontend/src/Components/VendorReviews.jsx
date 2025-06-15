import React, { useState, useEffect } from "react";
import VendorNavbar from "./VendorNavbar";
import api from "../api/config";

const VendorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/vendor/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to fetch reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleRespondToReview = async (reviewId, response) => {
    try {
      await api.post(`/vendor/reviews/${reviewId}/respond`, { response });
      setReviews(
        reviews.map((review) =>
          review.reviewID === reviewId
            ? { ...review, vendorResponse: response }
            : review
        )
      );
    } catch (error) {
      console.error("Error responding to review:", error);
      setError("Failed to respond to review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
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
    <div className="reviews-container">
      <VendorNavbar />
      <div className="reviews-content">
        <h1>Customer Reviews</h1>

        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet.</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.reviewID} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <h3>{review.userName}</h3>
                    <div className="rating">
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
                  </div>
                  <span className="review-date">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </span>
                </div>

                <p className="review-text">{review.reviewText}</p>

                {review.vendorResponse ? (
                  <div className="vendor-response">
                    <h4>Your Response:</h4>
                    <p>{review.vendorResponse}</p>
                  </div>
                ) : (
                  <div className="response-form">
                    <textarea
                      placeholder="Write your response..."
                      className="response-input"
                    />
                    <button
                      className="submit-response"
                      onClick={() => {
                        const response = document.querySelector(
                          `.response-input[data-review-id="${review.reviewID}"]`
                        ).value;
                        if (response.trim()) {
                          handleRespondToReview(review.reviewID, response);
                        }
                      }}
                    >
                      Submit Response
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorReviews;
