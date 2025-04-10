import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const getPasswordStrength = (password) => {
  if (!password) return "";
  const strength = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(
    password
  )
    ? "Strong"
    : password.length >= 6
    ? "Medium"
    : "Weak";
  return strength;
};

const EditProfile = ({ isOpen, onClose, user }) => {
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState("");
  const { setUser } = useAuth();

  useEffect(() => {
    if (user) setFullname(user.fullname);
  }, [user]);

  useEffect(() => {
    setStrength(getPasswordStrength(password));
  }, [password]);

  const handleUpdate = async () => {
    if (!fullname.trim()) return alert("Fullname is required!");
    if (password && password !== confirm)
      return alert("Passwords do not match!");

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/update`,
        { fullname, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      alert("✅ Profile updated successfully!");
      onClose();
    } catch (err) {
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-lg animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-700">Edit Profile</h2>

        <input
          type="text"
          placeholder="Fullname"
          className="w-full px-4 py-2 border rounded"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && (
          <p
            className={`text-sm ${
              strength === "Strong"
                ? "text-green-600"
                : strength === "Medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Password strength: {strength}
          </p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="flex justify-between space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
