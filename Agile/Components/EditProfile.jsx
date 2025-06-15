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
    axios.get('http://localhost:3000/user/edit', { withCredentials: true })
      .then((response) => {
        const { userID ,  userName, userEmail, userAddress, userPhoneNumber } = response.data;
        
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
      const response = await axios.patch('http://localhost:3000/user/edit', data, {
        withCredentials: true,
      });
      console.log('Edit profile response:', response.data);
      toast.success("Profile updated successfully!");
      navigate('/profile'); // Redirect to profile page after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile. Please check your password.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[600px]">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Current Password */}
            <div className="mt-4 space-y-2">
              <span>Current Password</span>
              <input
                type="password"
                placeholder="Enter your current password"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("formPassword", { required: true })}
              />
              {errors.formPassword && (
                <span className="text-sm text-red-500">
                  Password is required.
                </span>
              )}
            </div>

               {/* UserID */}
            <div className="mt-4 space-y-2">
              <span>New UserID</span>
              <input
                type="text"
                placeholder="Enter new username"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newUserID", { required: true })}
              />
              {errors.newUserID && (
                <span className="text-sm text-red-500">UserID is required.</span>
              )}
            </div>

            {/* Username */}
            <div className="mt-4 space-y-2">
              <span>New Username</span>
              <input
                type="text"
                placeholder="Enter new username"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newUserName", { required: true })}
              />
              {errors.newUserName && (
                <span className="text-sm text-red-500">Username is required.</span>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span>New Email</span>
              <input
                type="email"
                placeholder="Enter new email"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newUserEmail", { required: true })}
              />
              {errors.newUserEmail && (
                <span className="text-sm text-red-500">Email is required.</span>
              )}
            </div>

            {/* Address */}
            <div className="mt-4 space-y-2">
              <span>New Address</span>
              <input
                type="text"
                placeholder="Enter new address"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newUserAddress", { required: true })}
              />
              {errors.newUserAddress && (
                <span className="text-sm text-red-500">Address is required.</span>
              )}
            </div>

            {/* Phone Number */}
            <div className="mt-4 space-y-2">
              <span>New Phone Number</span>
              <input
                type="text"
                placeholder="Enter new phone number"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newUserPhoneNumber", { required: true })}
              />
              {errors.newUserPhoneNumber && (
                <span className="text-sm text-red-500">Phone number is required.</span>
              )}
            </div>

            {/* Update Button */}
            <div className="mt-6 flex justify-center">
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 duration-200">
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
