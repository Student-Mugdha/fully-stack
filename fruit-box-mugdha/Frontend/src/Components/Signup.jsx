import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/register/user",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/login/user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px]">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </Link>

            <h3 className="font-bold text-2xl text-center mb-6">User Signup</h3>

            {/* UserID */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">UserID</span>
              <input
                type="text"
                placeholder="Enter your unique ID"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.userID
                    ? "border-red-500"
                    : touchedFields.userID && !errors.userID
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("userID", {
                  required: {
                    value: true,
                    message: "UserID is required",
                  },
                  validate: async (value) => {
                    try {
                      const response = await axios.get(
                        `http://localhost:3000/check-userid/${value}`
                      );
                      return (
                        response.data.available || "UserID already exists!"
                      );
                    } catch (error) {
                      return "Error checking UserID availability";
                    }
                  },
                })}
              />
              {errors.userID && (
                <span className="text-sm text-red-500">
                  {errors.userID.message}
                </span>
              )}
            </div>

            {/* UserName */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">UserName</span>
              <input
                type="text"
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.userName
                    ? "border-red-500"
                    : touchedFields.userName && !errors.userName
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("userName", {
                  required: {
                    value: true,
                    message: "Full name is required",
                  },
                })}
              />
              {errors.userName && (
                <span className="text-sm text-red-500">
                  {errors.userName.message}
                </span>
              )}
            </div>

            {/* Phone No. */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Phone No.</span>
              <input
                type="text"
                placeholder="Enter your 10-digit phone number"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.userPhoneNumber
                    ? "border-red-500"
                    : touchedFields.userPhoneNumber && !errors.userPhoneNumber
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("userPhoneNumber", {
                  required: {
                    value: true,
                    message: "Phone number is required",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                })}
              />
              {errors.userPhoneNumber && (
                <span className="text-sm text-red-500">
                  {errors.userPhoneNumber.message}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Address</span>
              <input
                type="text"
                placeholder="Enter your full address"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.userAddress
                    ? "border-red-500"
                    : touchedFields.userAddress && !errors.userAddress
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("userAddress", {
                  required: {
                    value: true,
                    message: "Address is required",
                  },
                })}
              />
              {errors.userAddress && (
                <span className="text-sm text-red-500">
                  {errors.userAddress.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.userEmail
                    ? "border-red-500"
                    : touchedFields.userEmail && !errors.userEmail
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("userEmail", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.userEmail && (
                <span className="text-sm text-red-500">
                  {errors.userEmail.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.userPassword
                    ? "border-red-500"
                    : touchedFields.userPassword && !errors.userPassword
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("userPassword", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.userPassword && (
                <span className="text-sm text-red-500">
                  {errors.userPassword.message}
                </span>
              )}
            </div>

            {/* Button */}
            <div className="flex flex-col items-center mt-6 space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login/user"
                  className="text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
