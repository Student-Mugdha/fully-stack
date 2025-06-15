import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import DashboardNavbar from "./DashboardNavbar";

function ReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    review: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/reviews", formData);
      if (res.status === 200) {
        toast.success("Review submitted successfully!");
        setFormData({ name: "", email: "", rating: 0, review: "" }); // Reset form
      }
    } catch (err) {
      toast.error("Error submitting the review, please try again later.");
    }
  };

  return (
    <>
      <DashboardNavbar />

      <div
        className="max-w-md mx-auto my-10 p-8 rounded-lg shadow-xl border-4"
        style={{
          backgroundColor: "#1D232A",
          borderColor: "#28a745",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
        }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Leave a Review
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: "white",
                color: "black",
                borderColor: "#28a745",
              }}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: "white",
                color: "black",
                borderColor: "#28a745",
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Rating Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: "white",
                color: "black",
                borderColor: "#28a745",
              }}
              required
            >
              <option value={0} disabled>
                Select rating
              </option>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>

          {/* Review Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Review
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              style={{
                backgroundColor: "white",
                color: "black",
                borderColor: "#28a745",
              }}
              rows="5"
              placeholder="Write your review"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-md text-white hover:bg-green-600 focus:outline-none"
            style={{ backgroundColor: "#28a745" }}
          >
            Submit Review
          </button>
        </form>
      </div>
    </>
  );
}

export default ReviewForm;
