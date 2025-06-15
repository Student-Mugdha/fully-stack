import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
    axios.get('http://localhost:3000/vendor/edit', { withCredentials: true })
      .then((response) => {
        const {VendorID ,  VendorName, VendorEmail, VendorAddress, VendorPhoneNumber } = response.data;
        
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
        const response = await axios.patch('http://localhost:3000/vendor/edit', data, {
            withCredentials: true,
        });
        console.log('Edit profile response:', response.data);
        toast.success("Profile updated successfully!");
        navigate('/vendorProfile'); // Redirect to profile page after successful update
    } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);

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
            {/* Vendor Id  */}
            <div className="mt-4 space-y-2">
              <span>New Vendor ID</span>
              <input
                type="number"
                placeholder="Enter new Vendor Id"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newVendorID", { required: true })}
              />
              {errors.newVendorID && (
                <span className="text-sm text-red-500">Vendor Id  is required.</span>
              )}
            </div>
            {/* Vendorname */}
            <div className="mt-4 space-y-2">
              <span>New Vendorname</span>
              <input
                type="text"
                placeholder="Enter new Vendorname"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newVendorName", { required: true })}
              />
              {errors.newVendorName && (
                <span className="text-sm text-red-500">Vendorname is required.</span>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span>New Email</span>
              <input
                type="email"
                placeholder="Enter new email"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("newVendorEmail", { required: true })}
              />
              {errors.newVendorEmail && (
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
                {...register("newVendorAddress", { required: true })}
              />
              {errors.newVendorAddress && (
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
                {...register("newVendorPhoneNumber", { required: true })}
              />
              {errors.newVendorPhoneNumber && (
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

export default EditProfileVendor;
