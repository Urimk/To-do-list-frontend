import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const [details, setDetails] = useState({ username: "", password: "" });
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [btnMessage, setBtnMessage] = useState("Sign Up");

  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_RENDER_API_URL || "http://localhost:5000";

  const CHAR_REGEX = /(\w|'|-|\.)*/;
  const LETTER_REGEX = /[a-zA-z]+/;
  const SPECIAL_REGEX = /[-_\.][-_\.]/;
  const PASS_REGEX = /(?=.*[a-z]+)(?=.*[A-Z]+).*/;

  const MIN_USERNAME_LEN = 3;
  const MAX_USERNAME_LEN = 25;
  const MIN_PASS_LEN = 3;
  const MAX_PASS_LEN = 20;

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const validateUsername = (username) => {
    if (username.length < MIN_USERNAME_LEN)
      return `Username should be at least ${MIN_USERNAME_LEN} characters.`;
    if (username.length > MAX_USERNAME_LEN)
      return `Username should be at most ${MAX_USERNAME_LEN} characters.`;
    if (!CHAR_REGEX.test(username))
      return "Username contains illegal characters.";
    if (!LETTER_REGEX.test(username))
      return "Username must contain at least 1 letter.";
    if (SPECIAL_REGEX.test(username))
      return "Username must not contain two subsequent special letters.";

    return "";
  };

  const validatePassword = (password) => {
    if (password.length < MIN_PASS_LEN)
      return `Password should be at least ${MIN_PASS_LEN} characters.`;
    if (password.length > MAX_PASS_LEN)
      return `Password should be at least ${MAX_PASS_LEN} characters.`;
    if (!PASS_REGEX.test(password))
      return "Password should contain at least 1 lowercase and 1 uppercase letters.";
    return "";
  };

  const handleLeaveFocus = (e) => {
    if (e.target.name === "username") {
      setNameError(validateUsername(e.target.value));
      return;
    }
    if (e.target.name === "password") {
      setPasswordError(validatePassword(e.target.value));
      return;
    }
  };

  const validateDetails = (details) => {
    const nameError = validateUsername(details.username);
    const passError = validatePassword(details.password);
    if (nameError) setNameError(nameError);
    if (passError) setPasswordError(passError);
    if (nameError || passError) return false;
    return true;
  };

  const fetchData = async (details) => {
    const res = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: details.username,
        password: details.password,
      }),
    });
    if (!res.ok) {
      const badRes = await res.json();
      throw new Error(`${badRes.message}`);
    }
    const response = await res.json();
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDetails(details)) return;
    setBtnMessage("Signing Up...");

    try {
      await fetchData(details);
      toast.success("Register Successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message, { id: "unique-toast" });
    } finally {
      setBtnMessage("Sign Up");
    }
  };

  const isBtnDisabled = btnMessage !== "Sign Up";

  return (
    <div className="bg-blue-50 flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
          <p className="text-gray-500 mt-2">Please register to continue</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              placeholder="Enter your username"
              onChange={handleChange}
              onBlur={handleLeaveFocus}
            />
            {nameError ? (
              <p className="text-xs mt-2 ml-1 text-red-500">{nameError}</p>
            ) : (
              ""
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              placeholder="Enter your password"
              onChange={handleChange}
              onBlur={handleLeaveFocus}
            />
            {passwordError ? (
              <p className="text-xs mt-2 ml-1 text-red-500">{passwordError}</p>
            ) : (
              ""
            )}
          </div>

          {/* Submit button */}
          <button
            disabled={isBtnDisabled}
            type="submit"
            className={`w-full ${
              isBtnDisabled
                ? "bg-blue-300"
                : "bg-blue-600  hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            } text-white font-semibold py-3 rounded-lg shadow-md active:scale-[0.98]`}
          >
            {btnMessage}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline hover:cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
