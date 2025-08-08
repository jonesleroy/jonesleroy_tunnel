import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [users, setUser] = useState([]);

  const newUser = async (url, body) => {
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const authenticate = await result.json();
      setToken(authenticate.token);
      setLocation("TABLET");
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async (url) => {
    try {
      const result = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  const value = { location, token, users, getUser, newUser, setLocation };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
