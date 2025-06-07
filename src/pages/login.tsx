import { useEffect, useState } from "react";
import initializeAOS from "../utils/aos-init";
import { logo, working } from "../constants/assets";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type LoginData = {
  username: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );

  const { login, getUsername } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>();

  const navigate = useNavigate();

  useEffect(() => {
    initializeAOS();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setFormMessage(null);

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "https://oxfords-waec-cbt-backend.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.message.toLowerCase().includes("invalid")) {
        setFormMessage(result.message);
        setMessageType("error");
        return;
      }

      if (result.message.toLowerCase().includes("successful")) {
        setFormMessage(result.message);
        getUsername(result.username);
        login(result.token);
        setMessageType("success");
        reset();

        setTimeout(() => {
          if (result.username === "waeccbtcandidate1") {
            navigate("/take-test");
          } else {
            navigate("/dashboard");
          }
        }, 2000);

        return;
      }

      // fallback for unexpected
      setFormMessage(result.message);
      setMessageType(response.ok ? "success" : "error");
    } catch (err) {
      console.error("Login Error:", err);
      setFormMessage("Login failed. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col justify-center items-center w-full h-[100vh] backdrop relative">
      <img
        src={logo}
        alt="logo"
        className="sm:absolute top-2 left-2 w-20 h-20"
      />
      <div className="py-12 sm:px-6 sm:w-3/5 mx-auto font-Montserrat">
        <div className="bg-white p-6 w-full shadow rounded-xl flex justify-between sm:gap-6 animate-fadeDownFast">
          {/* Illustration */}
          <img
            src={working}
            alt="undraw-illustration"
            className="w-1/2 object-contain sm:block hidden sm:mr-10"
          />

          <div className="sm:w-1/2 flex flex-col justify-center">
            <h1 className="sm:text-3xl text-xl font-bold text-[#123982]">
              Login
            </h1>
            <p className="text-gray-400 mb-6 mt-2 sm:text-[1rem] text-sm">
              Welcome! Please enter your login details!!
            </p>
            {formMessage && (
              <div
                className={`p-3 mb-4 rounded text-center ${
                  messageType === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {formMessage}
              </div>
            )}
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Username Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#123982]">
                  Username
                </label>
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[#dc117b] placeholder:text-sm"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#123982]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring focus:ring-[#dc117b] placeholder:text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#dc117b] text-white px-6 py-2 rounded hover:bg-[#ab0c5e] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed w-full"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
