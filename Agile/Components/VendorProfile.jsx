
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ProfilePageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #1D232A;
  border: 1px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

const Bio = styled.p`
  font-size: 18px;
  color: #666;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-top: 20px;
  text-align: center;
`;

function VendorProfile() {
  const [vendorData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    axios.get('http://localhost:3000/vendor/profile', { withCredentials: true })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
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
    navigate('/vendor/edit');
  };

  return (
    <>
      <Heading>Profile Information</Heading>
      <ProfilePageContainer>
        <ProfilePicture>
          <img src={vendorData.profilePicture || '/profile.jpeg'} alt="Profile Picture" />
        </ProfilePicture>
        <UserInfo>
          <h2>vendorName : {vendorData.vendorName}</h2>
          <p>Email: {vendorData.vendorEmail}</p>
          <p>Phone: {vendorData.vendorPhoneNumber}</p>
          <p>Address: {vendorData.vendorAddress}</p>
        </UserInfo>
        <button 
          className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200"
          onClick={handleEditProfile} // Call function to navigate to /vendor/edit
        >
          Edit Profile
        </button>
      </ProfilePageContainer>
    </>
  );
}

export default VendorProfile;
