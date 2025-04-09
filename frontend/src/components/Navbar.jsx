import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 bg-black bg-opacity-50 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
      <div className="flex flex-col">
        <a
          href="/"
          className="text-xl md:text-3xl font-bold text-gray-100 hover:text-red-600 transition duration-300"
        >
          Movie Booking App
        </a>
        <p className="text-gray-500">Bringing Cinema Closer to You</p>
      </div>
    </nav>
  );
};

export default Navbar;
