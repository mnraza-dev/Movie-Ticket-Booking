import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    console.log("Register", { name, email, password });
  };

  return (
    <div className="flex justify-center ">
      <div className=" bg-black bg-opacity-75  sm:px-6 sm:py-8 rounded-xl w-full max-w-md">
        <h1 className="text-white text-3xl mb-8 font-bold">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-red-600 focus:ring-red-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email or Phone Number
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone number"
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
              placeholder="Password"
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-red-600 focus:ring-red-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-red-600 focus:ring-red-600"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-4 text-gray-400 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline cursor-pointer">
              Sign in now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
