import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import ReviewDashboard from './ReviewDashboard.jsx';
import DashboardNavbar from './DashboardNavbar'; // This component seems to be used for displaying the vendor details

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const navigate = useNavigate(); // Create navigate function

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:3000/vendors/details');
        const data = await response.json();
        console.log("Fetched vendors:", data);
        setVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  // Fetch vendor details by ID when a vendor is clicked
  const handleVendorClick = async (VendorID) => {
    try {
      const response = await fetch(`http://localhost:3000/vendors/${VendorID}`);
      const data = await response.json();
      setSelectedVendor(data);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  };

  const handleAddReview = () => {
    if (selectedVendor) {
      // Navigate to the review page with vendor ID as a query parameter
      navigate(`/review`);
    } else {
      console.log('No vendor selected');
    }
  };

  return (
    <>
        <DashboardNavbar/>
   
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Vendor List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map(vendor => (
          <div 
            key={vendor.VendorID} 
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200" 
            onClick={() => handleVendorClick(vendor.VendorID)}
          >
            <h2 className="text-xl font-semibold">{vendor.VendorName}</h2>
            <p className="text-gray-600">Vendor ID: {vendor.VendorID}</p>
            <button 
              onClick={() => {
                if (selectedVendor) {
                  console.log('Full description for:', selectedVendor.vendorName);
                } else {
                  console.log('No vendor selected');
                }
              }} 
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              View Full Description
            </button>
          </div>
        ))}
      </div>

      {/* Show vendor details if a vendor is selected */}
      {selectedVendor && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">{selectedVendor.vendorName}</h2>
          <p className="text-gray-700">Email: {selectedVendor.vendorEmail}</p>
          <p className="text-gray-700">Address: {selectedVendor.vendorAddress}</p>
          <p className="text-gray-700">Phone Number: {selectedVendor.vendorPhoneNumber}</p>
          <button 
            onClick={handleAddReview} // Call handleAddReview on button click
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Add Review
          </button>
          <ReviewDashboard/>
        </div>
        
      )}
    </div>
    </>
  );
};

export default VendorList;
