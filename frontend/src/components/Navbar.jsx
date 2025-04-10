import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <>
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

        {user && (
          <div className="relative flex items-center space-x-3">
            <span className="text-gray-100 text-sm sm:text-base">
              👋 Welcome,{" "}
              <span className="font-semibold text-red-400">
                {user.fullname}
              </span>
            </span>
            <button onClick={() => setShowDropdown(!showDropdown)}>
              <img
                src={`https://ui-avatars.com/api/?name=${user.fullname}&background=random`}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
              />
            </button>

            {showDropdown && (
              <div className="absolute top-14 right-0 bg-white shadow-md rounded-lg py-2 w-48 animate-fadeIn">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      <EditProfile
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />
    </>
  );
};

export default Navbar;
