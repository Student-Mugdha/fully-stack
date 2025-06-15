import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VendorReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch vendorID from local storage
  const vendorID = localStorage.getItem("vendorID");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!vendorID) {
        toast.error("Vendor ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/reviews/vendor?vendorID=${vendorID}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
        toast.error("Error fetching reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorID]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 rounded-lg shadow-xl bg-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">
        Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="text-white">No reviews available for this vendor.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.ReviewID}
            className="mb-4 p-4 border border-gray-700 rounded-md"
          >
            <h3 className="font-bold text-white">{review.userName}</h3>
            <p className="text-yellow-400">Rating: {review.rating} ⭐</p>
            <p className="text-gray-300">{review.review}</p>
            <p className="text-gray-500 text-sm">
              Reviewed on: {new Date(review.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorReview;
