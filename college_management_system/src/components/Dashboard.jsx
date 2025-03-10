import React from "react";
import "../components/style.css";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./SideNav";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Dashboard = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
        navigate("/login");
        toast.success("Logged out successfully!")
  };
  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <SideNav />
        <div className="main-container">
          <div className="top-bar">
            <div className="logo-container">
              <img
                alt="profile-logo"
                className="profile-logo"
                src={localStorage.getItem("imageUrl")}
              />
            </div>
            <div className="profile-container">
              <h2 className="profile-name">
                {localStorage.getItem("fullName")}
              </h2>
              <button onClick={logoutHandler} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
          <div className="outlet-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
