import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("jay@gmail.com");
  const [password, setPassword] = useState("jay@123");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      navigate("/movies");
      console.log("Login successful", res.data);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert(
        "Login failed: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="flex pt-16 justify-center items-center ">
      <div className=" bg-black bg-opacity-75  sm:px-6 sm:py-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-3xl mb-8 font-bold">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-red-600 focus:ring-red-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-red-600 focus:ring-red-600"
            />
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-gray-400 text-sm">
          <p>
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="text-white hover:underline cursor-pointer"
            >
              Sign up now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
