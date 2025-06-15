import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import toast from "react-hot-toast";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height */
  background: linear-gradient(135deg, #f2f2f2 50%, #e0e0e0 100%);
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 600px; /* Set max width for larger screens */
  background: #ffffff; /* White background for the box */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Soft shadow */
  padding: 30px; /* Padding around the content */
  transition: transform 0.3s ease; /* Smooth scale effect */

  &:hover {
    transform: scale(1.02); /* Scale up on hover */
  }

  @media (max-width: 600px) {
    padding: 20px; /* Adjust padding for smaller screens */
  }
`;

const Title = styled.h3`
  font-size: 2rem; /* Large title */
  text-align: center;
  color: #3498db; /* Bright blue color */
  margin-bottom: 20px; /* Space below title */
`;

const InputGroup = styled.div`
  margin-bottom: 20px; /* Space between input groups */

  span {
    display: block; /* Make label a block */
    margin-bottom: 5px; /* Space between label and input */
    color: #34495e; /* Darker text for labels */
  }

  input {
    width: 100%; /* Full width */
    padding: 10px; /* Padding inside the input */
    border: 2px solid #3498db; /* Border color */
    border-radius: 5px; /* Rounded corners */
    outline: none; /* Remove outline */
    transition: border-color 0.3s ease; /* Smooth border color transition */

    &:focus {
      border-color: #2980b9; /* Darker blue on focus */
    }
  }

  .error-message {
    color: #e74c3c; /* Red color for error messages */
    font-size: 0.875rem; /* Slightly smaller text for errors */
  }
`;

const UpdateButton = styled.button`
  background-color: #3498db; /* Bright blue */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px; /* Padding for the button */
  cursor: pointer;
  font-size: 1.2rem; /* Larger font size */
  width: 100%; /* Full width */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */

  &:hover {
    background-color: #2980b9; /* Darker blue on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }
`;

const EditProfileVendor = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch existing Vendor data on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/vendor/edit", { withCredentials: true })
      .then((response) => {
        const {
          VendorID,
          VendorName,
          VendorEmail,
          VendorAddress,
          VendorPhoneNumber,
        } = response.data;

        // Set default form values using fetched data
        setValue("newVendorID", VendorID);
        setValue("newVendorName", VendorName);
        setValue("newVendorEmail", VendorEmail);
        setValue("newVendorAddress", VendorAddress);
        setValue("newVendorPhoneNumber", VendorPhoneNumber);
      })
      .catch((error) => {
        console.error("Error fetching Vendor data:", error);
        toast.error("Failed to load Vendor data.");
      });
  }, [setValue]);

  // Handle form submission for updating Vendor data
  const onSubmit = async (data) => {
    console.log("Submitting data:", data); // Log data to check its structure
    try {
      const response = await api.patch("/vendor/edit", data);
      console.log("Edit profile response:", response.data);
      toast.success("Profile updated successfully!");
      navigate("/vendorProfile"); // Redirect to profile page after successful update
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response ? error.response.data : error.message
      );

      toast.error("Failed to update profile. Please check your password.");
    }
  };

  return (
    <Container>
      <ProfileBox>
        <Title>Edit Profile</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password */}
          <InputGroup>
            <span>Current Password</span>
            <input
              type="password"
              placeholder="Enter your current password"
              {...register("formPassword", { required: true })}
            />
            {errors.formPassword && (
              <span className="error-message">Password is required.</span>
            )}
          </InputGroup>
          {/* Vendor Id */}
          <InputGroup>
            <span>New Vendor ID</span>
            <input
              type="number"
              placeholder="Enter new Vendor Id"
              {...register("newVendorID", { required: true })}
            />
            {errors.newVendorID && (
              <span className="error-message">Vendor Id is required.</span>
            )}
          </InputGroup>
          {/* Vendor Name */}
          <InputGroup>
            <span>New Vendor Name</span>
            <input
              type="text"
              placeholder="Enter new Vendor Name"
              {...register("newVendorName", { required: true })}
            />
            {errors.newVendorName && (
              <span className="error-message">Vendor Name is required.</span>
            )}
          </InputGroup>

          {/* Email */}
          <InputGroup>
            <span>New Email</span>
            <input
              type="email"
              placeholder="Enter new email"
              {...register("newVendorEmail", { required: true })}
            />
            {errors.newVendorEmail && (
              <span className="error-message">Email is required.</span>
            )}
          </InputGroup>

          {/* Address */}
          <InputGroup>
            <span>New Address</span>
            <input
              type="text"
              placeholder="Enter new address"
              {...register("newVendorAddress", { required: true })}
            />
            {errors.newVendorAddress && (
              <span className="error-message">Address is required.</span>
            )}
          </InputGroup>

          {/* Phone Number */}
          <InputGroup>
            <span>New Phone Number</span>
            <input
              type="text"
              placeholder="Enter new phone number"
              {...register("newVendorPhoneNumber", { required: true })}
            />
            {errors.newVendorPhoneNumber && (
              <span className="error-message">Phone number is required.</span>
            )}
          </InputGroup>

          {/* Update Button */}
          <div>
            <UpdateButton type="submit">Update Profile</UpdateButton>
          </div>
        </form>
      </ProfileBox>
    </Container>
  );
};

export default EditProfileVendor;
