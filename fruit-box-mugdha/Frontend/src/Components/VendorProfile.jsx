import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled Components
const ProfilePageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #2c3e50; /* Dark blue background */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Soft shadow */
  color: #ecf0f1; /* Light text color */
  position: relative;
  overflow: hidden; /* Ensures child elements don’t overflow */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the items horizontally */

  @media (max-width: 600px) {
    padding: 15px; /* Adjust padding for smaller screens */
    margin: 20px; /* Reduce margin for smaller screens */
  }
`;

const ProfilePicture = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
  border: 4px solid #f39c12; /* Bright border for profile picture */
  transition: transform 0.3s ease; /* Smooth transition for scaling */

  &:hover {
    transform: scale(1.1); /* Scale up on hover */
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures image covers the container */
  }
`;

const UserInfoBox = styled.div`
  background: rgba(44, 62, 80, 0.9); /* Semi-transparent background */
  border-radius: 10px; /* Rounded corners */
  padding: 20px;
  margin: 20px 0; /* Space around the box */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Shadow for depth */
  transition: transform 0.3s ease, opacity 0.3s ease; /* Animation for box */

  &:hover {
    transform: translateY(-5px); /* Lift effect on hover */
    opacity: 0.9; /* Slightly change opacity on hover */
  }

  h2 {
    font-size: 1.8rem; /* Adjust font size for name */
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem; /* Consistent font size for details */
    margin: 5px 0;
  }

  @media (max-width: 600px) {
    h2 {
      font-size: 1.5rem; /* Smaller heading on mobile */
    }

    p {
      font-size: 0.9rem; /* Smaller text on mobile */
    }
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-top: 20px;
  text-align: center;
  color: #f39c12; /* Bright orange for heading */
`;

const EditProfileButton = styled.button`
  background-color: #3498db; /* Bright blue */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transition */

  &:hover {
    background-color: #2980b9; /* Darker blue on hover */
    transform: scale(1.05); /* Slightly enlarge on hover */
  }

  @media (max-width: 600px) {
    width: 100%; /* Full-width button on mobile */
    font-size: 0.9rem; /* Smaller text on mobile */
    padding: 10px; /* Adjust padding for mobile */
  }
`;

// VendorProfile Component
function VendorProfile() {
  const [vendorData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    axios
      .get("http://localhost:3000/vendor/profile", { withCredentials: true })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!vendorData) {
    return <p>No vendor data found</p>;
  }

  // Handle edit button click to navigate to edit profile page
  const handleEditProfile = () => {
    navigate("/vendor/edit");
  };

  return (
    <>
      <Heading>Profile Information</Heading>
      <ProfilePageContainer>
        <ProfilePicture>
          <img
            src={vendorData.profilePicture || "/profile.jpeg"}
            alt="Profile"
          />
        </ProfilePicture>
        <UserInfoBox>
          <h2>{vendorData.vendorName}</h2>
          <p>Email: {vendorData.vendorEmail}</p>
          <p>Phone: {vendorData.vendorPhoneNumber}</p>
          <p>Address: {vendorData.vendorAddress}</p>
        </UserInfoBox>
        <EditProfileButton onClick={handleEditProfile}>
          Edit Profile
        </EditProfileButton>
      </ProfilePageContainer>
    </>
  );
}

export default VendorProfile;
