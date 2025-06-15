import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const Login = () => {
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
        `${import.meta.env.VITE_API_URL}/login/user`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.user) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userID", response.data.user.userID);
        toast.success("Login successful!");
        navigate("/userdashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
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

            <h3 className="font-bold text-2xl text-center mb-6">User Login</h3>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-md outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : touchedFields.email && !errors.email
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("email", {
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
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
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
                  errors.password
                    ? "border-red-500"
                    : touchedFields.password && !errors.password
                    ? "border-green-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
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
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline">
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

export default Login;
