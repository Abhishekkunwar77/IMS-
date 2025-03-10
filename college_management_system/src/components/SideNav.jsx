import React from "react";
import "../components/style.css";
import { Link, useLocation } from "react-router-dom";
const SideNav = () => {
  const location = useLocation();

  return (
    <div className="nav-container">
      <div className="brand-container">
        <img
          className="profile-logo"
          src={require("../assets/clg-logo.png")}
          alt="brand-container"
        />

        <div>
          <h2 className="brand-name">Sri Eshwar </h2>
          <p className="brand-slogan">manage your app</p>
        </div>
      </div>
      <div className="menu-container">
        <Link
          to="/dashboard/home"
          className={
            location.pathname === "/dashboard/home"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-house"></i>Home
        </Link>

        <Link
          to="/dashboard/courses"
          className={
            location.pathname === "/dashboard/courses"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-book"></i>All Courses
        </Link>
        <Link
          to="/dashboard/add-course"
          className={
            location.pathname === "/dashboard/add-course"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-plus"></i>Add Courses
        </Link>

        <Link
          to="/dashboard/students"
          className={
            location.pathname === "/dashboard/students"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-user-group"></i>All Students
        </Link>

        <Link
          to="/dashboard/add-student"
          className={
            location.pathname === "/dashboard/add-student"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-user-plus"></i>Add Students
        </Link>

        <Link
          to="/dashboard/collect-fee"
          className={
            location.pathname === "/dashboard/collect-fee"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-indian-rupee-sign"></i>Collect Fee
        </Link>

        <Link
          to="/dashboard/payment-history"
          className={
            location.pathname === "/dashboard/payment-history"
              ? "menu-active-link"
              : "menu-link"
          }
        >
          <i className="fa-solid fa-list"></i>Payment History
        </Link>
      </div>
      <div className="contact-us">
        <p>
          <i className="fa-solid fa-id-badge"></i>Contact Developer
        </p>
        <p>
          <i className="fa-brands fa-whatsapp"></i> 7708520329
        </p>
      </div>
    </div>
  );
};

export default SideNav;
