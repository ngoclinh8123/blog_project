import { createContext, useState, useEffect } from "react";
import api, { setOnTokenRefreshed } from "/src/service/axios/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState({});

  const handleLogin = (user) => {
    setLoggedIn(true);
    setUser(user);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser({});
  };

  // Use an effect hook to fetch the user information from the API when the refresh flag changes
  useEffect(() => {
    api
      .get("/auth/user_info/")
      .then((response) => {
        if (response) {
          handleLogin(response.data.data);
        }
      })
      .catch((e) => {});
  }, [refresh]);

  // Use an effect hook to set the onTokenRefreshed callback to update the refresh flag
  useEffect(() => {
    setOnTokenRefreshed(() => {
      setRefresh(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
