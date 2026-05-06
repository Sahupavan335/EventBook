import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null); // ✅ FIXED
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include"
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);

      } catch (error) {

        setUser(null);

      } finally {

        setLoading(false); // ✅ already correct

      }

    };

    fetchUser();

  }, []);


  const login = (userData) => {
    setUser(userData);
    setLoading(false); // 🔥 IMPORTANT FIX
  };


  const logout = async () => {

    try {

      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

    } catch (error) {}

    setUser(null);

  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);