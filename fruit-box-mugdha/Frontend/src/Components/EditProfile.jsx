import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch existing user data on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/user/edit", { withCredentials: true })
      .then((response) => {
        const { userID, userName, userEmail, userAddress, userPhoneNumber } =
          response.data;

        // Set default form values using fetched data
        setValue("newUserID", userID);
        setValue("newUserName", userName);
        setValue("newUserEmail", userEmail);
        setValue("newUserAddress", userAddress);
        setValue("newUserPhoneNumber", userPhoneNumber);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      });
  }, [setValue]);

  // Handle form submission for updating user data
  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/user/edit",
        data,
        {
          withCredentials: true,
        }
      );
      console.log("Edit profile response:", response.data);
      toast.success("Profile updated successfully!");
      navigate("/profile"); // Redirect to profile page after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please check your password.");
    }
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to bottom right, #f9f9f9, #e0e0e0)",
    animation: "fadeIn 0.5s ease-in-out",
  };

  const modalBoxStyle = {
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    animation: "slideIn 0.5s ease-in-out",
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  };

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    transition: "border 0.3s, box-shadow 0.3s",
  };

  const inputFocusStyle = {
    borderColor: "#007bff",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
  };

  const errorStyle = {
    borderColor: "red",
  };

  const errorMessageStyle = {
    color: "red",
    fontSize: "0.875rem",
  };

  const submitContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const submitButtonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
    width: "100%",
  };

  const submitButtonHoverStyle = {
    backgroundColor: "#0056b3",
    transform: "scale(1.05)",
  };

  return (
    <div style={containerStyle}>
      <div style={modalBoxStyle}>
        <h3 style={headerStyle}>Edit Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              placeholder="Enter your current password"
              style={{
                ...inputStyle,
                ...(errors.formPassword ? errorStyle : {}),
              }}
              {...register("formPassword", { required: true })}
            />
            {errors.formPassword && (
              <span style={errorMessageStyle}>Password is required.</span>
            )}
          </div>

          {/* UserID */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>New UserID</label>
            <input
              type="text"
              placeholder="Enter new UserID"
              style={{
                ...inputStyle,
                ...(errors.newUserID ? errorStyle : {}),
              }}
              {...register("newUserID", { required: true })}
            />
            {errors.newUserID && (
              <span style={errorMessageStyle}>UserID is required.</span>
            )}
          </div>

          {/* Username */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>New Username</label>
            <input
              type="text"
              placeholder="Enter new username"
              style={{
                ...inputStyle,
                ...(errors.newUserName ? errorStyle : {}),
              }}
              {...register("newUserName", { required: true })}
            />
            {errors.newUserName && (
              <span style={errorMessageStyle}>Username is required.</span>
            )}
          </div>

          {/* Email */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>New Email</label>
            <input
              type="email"
              placeholder="Enter new email"
              style={{
                ...inputStyle,
                ...(errors.newUserEmail ? errorStyle : {}),
              }}
              {...register("newUserEmail", { required: true })}
            />
            {errors.newUserEmail && (
              <span style={errorMessageStyle}>Email is required.</span>
            )}
          </div>

          {/* Address */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>New Address</label>
            <input
              type="text"
              placeholder="Enter new address"
              style={{
                ...inputStyle,
                ...(errors.newUserAddress ? errorStyle : {}),
              }}
              {...register("newUserAddress", { required: true })}
            />
            {errors.newUserAddress && (
              <span style={errorMessageStyle}>Address is required.</span>
            )}
          </div>

          {/* Phone Number */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>New Phone Number</label>
            <input
              type="text"
              placeholder="Enter new phone number"
              style={{
                ...inputStyle,
                ...(errors.newUserPhoneNumber ? errorStyle : {}),
              }}
              {...register("newUserPhoneNumber", { required: true })}
            />
            {errors.newUserPhoneNumber && (
              <span style={errorMessageStyle}>Phone number is required.</span>
            )}
          </div>

          {/* Update Button */}
          <div style={submitContainerStyle}>
            <button
              type="submit"
              style={submitButtonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  submitButtonHoverStyle.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
