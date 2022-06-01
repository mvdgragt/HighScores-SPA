import { Routes, Route, Navigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";

import { ToastContainer } from 'react-toastify';

import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";
import Register from "./Register/Register";

const Admin = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token : localStorage.token }
      })
      const parseRes = await response.json()
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false)
      console.log(parseRes)

    } catch (err) {
      console.error(err.message)      
    }
  }

  useEffect(() => {
    isAuth()
  },[])



  return (
    <Fragment>
    <div className="container">
    <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setAuth={setAuth} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register setAuth={setAuth} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Routes>
    </div>
  </Fragment>
);
}

export default Admin