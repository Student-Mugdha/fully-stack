// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// const VendorReview = ({ vendorID }) => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/reviews/vendor`);
//         setReviews(response.data);
//       } catch (error) {
//         console.error("Error fetching reviews: ", error);
//         toast.error("Error fetching reviews. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   if (loading) {
//     return <p>Loading reviews...</p>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-10 p-8 rounded-lg shadow-xl bg-gray-800">
//       <h2 className="text-2xl font-semibold mb-6 text-center text-white">Reviews</h2>
//       {reviews.length === 0 ? (
//         <p className="text-white">No reviews available for this vendor.</p>
//       ) : (
//         reviews.map((review) => (
//           <div key={review.ReviewID} className="mb-4 p-4 border border-gray-700 rounded-md">
//             <h3 className="font-bold text-white">{review.userName}</h3>
//             <p className="text-yellow-400">Rating: {review.rating} ⭐</p>
//             <p className="text-gray-300">{review.review}</p>
//             <p className="text-gray-500 text-sm">Reviewed on: {new Date(review.created_at).toLocaleString()}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default VendorReview;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaStar, FaFilter, FaSpinner } from "react-icons/fa";

const VendorReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, positive, negative
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, rating
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

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
        const reviewData = response.data;
        setReviews(reviewData);

        // Calculate statistics
        const total = reviewData.length;
        const avg =
          total > 0
            ? reviewData.reduce((sum, review) => sum + review.rating, 0) / total
            : 0;

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewData.forEach((review) => {
          distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        });

        setStats({
          averageRating: avg.toFixed(1),
          totalReviews: total,
          ratingDistribution: distribution,
        });
      } catch (error) {
        console.error("Error fetching reviews: ", error);
        toast.error("Error fetching reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorID]);

  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];

    // Apply rating filter
    if (filter === "positive") {
      filtered = filtered.filter((review) => review.rating >= 4);
    } else if (filter === "negative") {
      filtered = filtered.filter((review) => review.rating <= 2);
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    }

    return filtered;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`inline ${
          index < rating ? "text-yellow-400" : "text-gray-400"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 rounded-lg shadow-xl bg-white">
      {/* Statistics Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-4 text-center">Review Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/10 rounded-lg">
            <p className="text-4xl font-bold">{stats.averageRating}</p>
            <div className="my-2">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <p className="text-sm">Average Rating</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <p className="text-4xl font-bold">{stats.totalReviews}</p>
            <p className="text-sm">Total Reviews</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            {Object.entries(stats.ratingDistribution)
              .reverse()
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-12">{rating} stars</span>
                  <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${(count / stats.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4">
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Reviews</option>
            <option value="positive">Positive Reviews (4-5 ★)</option>
            <option value="negative">Critical Reviews (1-2 ★)</option>
          </select>
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
        <div className="text-gray-600">
          <FaFilter className="inline mr-2" />
          {getFilteredAndSortedReviews().length} reviews
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {getFilteredAndSortedReviews().length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              No reviews match your filters.
            </p>
          </div>
        ) : (
          getFilteredAndSortedReviews().map((review) => (
            <div
              key={review.ReviewID}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {review.userName}
                  </h3>
                  <div className="text-yellow-400 my-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorReview;
