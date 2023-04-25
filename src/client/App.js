import React, { useState, useEffect } from "react";
import "./app.css";
import ReactImage from "./react.png";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    fetch("/api/getUsername")
      .then((res) => res.json())
      .then((user) => setUsername(user.username));
  }, []);

  const checkAuthStatus = async () => {
    try {
      const auth = await axios.get("/api/checkAuth");
      setAuthStatus(true);
    } catch (error) {
      setAuthStatus(false)
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, [loginStatus]);

  const login = async () => {
    const loginData = await axios.post("/api/login", {
      username,
    });
    console.log(loginData.data.success)
    setLoginStatus(loginData.data.success);
  };

  const logout = async () => {
    const logoutData = await axios.post("/api/logout", {
      username,
    });
    setLoginStatus(!logoutData.data.success);
  };

  return (
    <div>
      {authStatus ? (
        <h1>{`Hello ${username}`}</h1>
      ) : (
        <h1>Hi guest</h1>
      )}
      <button onClick={login}> Login </button>
      <button onClick={logout}> Logout </button>
      <p> Backend Auth status {authStatus ? 'Logged In' : 'Logged Out'}</p>
    </div>
  );
};

export default App;
