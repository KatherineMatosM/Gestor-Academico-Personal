import { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);

  const login = (userData) => {
    console.log('Login llamado con:', userData);
    
    if (userData.token) {
      setToken(userData.token);
      setUser(userData.user || userData);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user || userData));
    } else {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}