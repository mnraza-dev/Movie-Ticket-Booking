import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
            className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors"
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
