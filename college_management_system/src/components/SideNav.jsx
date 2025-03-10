import React, { useState, useEffect } from "react";
import "../components/style.css";
import { Link, useLocation } from "react-router-dom";

const SideNav = () => {
  const location = useLocation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nav-container">
      <div className="brand-container">
        <img
          className="profile-logo"
          src={require("../assets/clg-logo.png")}
          alt="brand-container"
        />
        <div>
          <h2 className="brand-name">Campus360 </h2>
          <p className="brand-slogan">360° Smart Campus Solutions</p>
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
          title="Go to Dashboard Home"
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
          title="View all available courses"
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
          title="Add a new course"
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
          title="View all registered students"
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
          title="Register a new student"
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
          title="Record student payments"
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
          title="View payment transactions"
        >
          <i className="fa-solid fa-list"></i>Payment History
        </Link>
      </div>

      {/* Current Date and Time */}
      <p className="current-datetime">
        <strong>
          Current Date & Time <br />
        </strong>
        {currentDateTime.toLocaleString()}
      </p>

      <p className="stay-connected-message">Stay Connected, Stay Updated!</p>

      {/* Social Media Links */}
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/abhishek-kunwar55/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-linkedin"></i>
        </a>
        <a
          href="https://www.instagram.com/abhishek_kunwar23/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a
          href="https://github.com/Abhishekkunwar77"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-github"></i>
        </a>
        <a
          href="https://t.me/Abhishek_Kunwar_23"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-telegram"></i>
        </a>
        <a
          href="https://www.facebook.com/nishu.kunwar.31"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-facebook"></i>
        </a>
      </div>
    </div>
  );
};

export default SideNav;
