import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange", // This shows validation errors as the user types
  });

  const onSubmit = async (data) => {
    const userInfo = {
      userEmail: data.userEmail,
      userPassword: data.userPassword,
    };

    try {
      const res = await axios.post("http://localhost:3000/login/user", userInfo, {
        withCredentials: true,
      });

      if (res.data) {
        toast.success("Logged in Successfully");
        localStorage.setItem("users", JSON.stringify(res.data.user));
        setTimeout(() => {
          navigate("/UserDashboard");
        }, 1000);
      }
    } catch (err) {
      console.error(err); // Log the entire error object for debugging
      if (err.response) {
        switch (err.response.status) {
          case 400:
            toast.error("Invalid input. Please check the fields and try again.");
            break;
          case 401:
            toast.error("Unauthorized: Incorrect email or password.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("No response from the server. Please check your connection.");
      }
   }
   
  };

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* Close modal button */}
            <Link
              to="/UserDashboard"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg">Login</h3>

            {/* Email Input */}
            <div className="mt-4 space-y-2">
              <span>Email</span>
              <br />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("userEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.userEmail && (
                <span className="text-sm text-red-500">
                  {errors.userEmail.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="mt-4 space-y-2">
              <span>Password</span>
              <br />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("userPassword", {
                  required: "Password is required",
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

            {/* Login Button */}
            <div className="flex justify-content mt-6">
              <button className="bg-pink-500 text-white rounded-md ml-[10px] px-3 py-1 hover:bg-pink-700 duration-200">
                Login
              </button>

              <div className="ml-[150px]">
                <p>
                  Not registered?{" "}
                  <Link
                    to="/signup"
                    className="underline text-blue-500 cursor-pointer"
                  >
                    Signup
                  </Link>{" "}
                </p>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
