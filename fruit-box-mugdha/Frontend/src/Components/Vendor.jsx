import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Review from "./Review";
import DashboardNavbar from "./DashboardNavbar";

const Vendor = () => {
  const { vendorID } = useParams(); // Get vendorId from the URL
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendor data based on dynamic vendorId
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/vendors/${vendorID}`
        );
        if (!response.ok) {
          throw new Error("Error fetching vendor data");
        }
        const data = await response.json();
        setVendor(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const addReview = (review) => {
    setReviews([...reviews, review]);
  };

  if (loading) {
    return <div>Loading vendor data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <DashboardNavbar />

      <div className="vendor">
        {vendor ? (
          <>
            <h2>{vendor.VendorName}</h2>
            <p>{vendor.VendorID}</p>
            <Review reviews={reviews} addReview={addReview} />
          </>
        ) : (
          <p>No vendor found</p>
        )}
      </div>
    </>
  );
};

export default Vendor;
