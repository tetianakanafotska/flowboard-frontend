import React, { useState, useEffect } from "react";
import authService from "@services/auth.service";
//import usersService from "@services/user.service.js";
import taskService from "@services/task.service.js";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      authService
        .verify()
        .then((res) => {
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(res.data);
        })
        .catch((error) => {
          if (error) {
            setAuthError(error.response.data.message);
            removeToken();
            return;
          }
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  // const handleDeleteAccount = async () => {
  //   try {
  //     const userResponse = await usersService.get(user._id);
  //     const tasks = userResponse.data.tasks;

  //     for (const taskId of tasks) {
  //       const taskResponse = await taskService.get(taskId);
  //       await taskService.delete(taskId);
  //     }
  //     const deleteResponse = await usersService.delete(user._id);

  //     if (deleteResponse.status === 200) {
  //       removeToken();
  //       setIsLoggedIn(false);
  //       setIsLoading(false);
  //       setUser(null);
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting account:", error);
  //   }
  // };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        authError,
        //handleDeleteAccount,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
