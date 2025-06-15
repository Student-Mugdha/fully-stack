import { useEffect, useState } from "react";
import axios from "axios";

function ReviewDashboard() {
  const [reviews, setReviews] = useState([]);

  // Fetch reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3000/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">User Reviews</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-500"
            >
              <h3 className="text-xl font-bold mb-2 text-white">
                {review.userName}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Email: {review.userEmail}
              </p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 font-bold mr-2">Rating:</span>
                <span className="text-white">{review.rating}/5</span>
              </div>
              <p className="text-white">{review.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No reviews yet. Be the first to leave a review!
        </p>
      )}
    </div>
  );
}

export default ReviewDashboard;
