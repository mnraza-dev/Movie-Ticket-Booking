import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Body = () => {
  return (
    <main className="min-h-screen pt-32 bg-gray-[#f5f5f5]">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default Body;
