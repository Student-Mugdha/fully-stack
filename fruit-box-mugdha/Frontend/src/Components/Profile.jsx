import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Keyframe animations for fading in
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Container for the profile page with a transparent background
const ProfilePageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: rgba(
    255,
    255,
    255,
    0.9
  ); /* More opaque white background for better readability */
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.5); /* Slightly more transparent border */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.8s ease-in-out;
  backdrop-filter: blur(10px); /* Moderate blur for a glass-like effect */
`;

// Styled component for the profile picture
const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Styled component for user info
const UserInfo = styled.div`
  margin-bottom: 20px;
  text-align: center;

  h2 {
    font-size: 2rem;
    color: #333; /* Darker color for better contrast */
    margin: 10px 0;
  }

  p {
    font-size: 1.2rem;
    color: #555; /* Softer color for readability */
    margin: 5px 0;
    transition: color 0.3s;

    &:hover {
      color: #ffcc00; // Change color on hover
    }
  }
`;

// Styled component for the heading
const Heading = styled.h1`
  font-size: 3rem;
  margin-top: 20px;
  text-align: center;
  color: white; /* Set heading color to white */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4); /* Softer shadow for depth */
`;

// Styled button with hover effects
const EditButton = styled.button`
  background-color: #ff4081;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 1.2rem;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #e91e63;
    transform: translateY(-3px) scale(1.05);
  }

  &:active {
    transform: translateY(1px);
  }
`;

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/profile", { withCredentials: true })
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
    return <p style={{ textAlign: "center", color: "#333" }}>Loading...</p>; // Changed text color for visibility
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!userData) {
    return (
      <p style={{ textAlign: "center", color: "#333" }}>No user data found</p>
    );
  }

  // Handle edit button click to navigate to edit profile page
  const handleEditProfile = () => {
    navigate("/user/edit");
  };

  return (
    <>
      <Heading>Profile Information</Heading>
      <ProfilePageContainer>
        <ProfilePicture>
          <img
            src={userData.profilePicture || "/profile.jpeg"}
            alt="Profile Picture"
          />
        </ProfilePicture>
        <UserInfo>
          <h2>UserName: {userData.userName}</h2>
          <p>Email: {userData.userEmail}</p>
          <p>Phone: {userData.userPhoneNumber}</p>
          <p>Address: {userData.userAddress}</p>
        </UserInfo>
        <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
      </ProfilePageContainer>
    </>
  );
}

export default Profile;
