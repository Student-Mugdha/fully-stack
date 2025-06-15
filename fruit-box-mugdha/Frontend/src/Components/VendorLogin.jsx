import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import api from "../api/config";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm();

  const onSubmit = async (data) => {
    const vendorInfo = {
      vendorEmail: data.vendorEmail,
      vendorPassword: data.vendorPassword,
    };
    try {
      setIsLoading(true);
      const response = await api.post("/login/vendor", vendorInfo);

      if (response.status === 200) {
        const { vendor, token } = response.data;
        // Store vendor info and token in localStorage
        localStorage.setItem("Vendors", JSON.stringify(vendor));
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        navigate("/vendordashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      if (error.response?.status === 404) {
        toast.error("Vendor account not found. Please check your email.");
      } else if (error.response?.status === 401) {
        toast.error("Invalid password. Please try again.");
      }
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

            <h3 className="font-bold text-2xl text-center mb-6">
              Vendor Login
            </h3>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.vendorEmail
                    ? "border-red-500"
                    : touchedFields.vendorEmail && !errors.vendorEmail
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("vendorEmail", {
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
              {errors.vendorEmail && (
                <span className="text-sm text-red-500">
                  {errors.vendorEmail.message}
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
                  errors.vendorPassword
                    ? "border-red-500"
                    : touchedFields.vendorPassword && !errors.vendorPassword
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("vendorPassword", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
              />
              {errors.vendorPassword && (
                <span className="text-sm text-red-500">
                  {errors.vendorPassword.message}
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
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register/vendor"
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
