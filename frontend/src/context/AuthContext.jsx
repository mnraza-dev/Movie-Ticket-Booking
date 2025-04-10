import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (cookie) {
      const token = cookie.split("=")[1];
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded JWT:", decoded);
        setUser(decoded);
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
        setUser(null);
      }
    } else {
      console.warn("⚠️ Token cookie not found");
      setUser(null);
    }
  }, []);

  const logout = async () => {
    try {
      setUser(null);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true }
      );

      document.cookie =
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure";
      console.log("👋 Logged out successfully");
    } catch (err) {
      console.error("❌ Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
