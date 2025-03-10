import React, { useState } from "react";
import "../components/style.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:4200/user/login", {
        email: email,
        password: password,
      })

      .then((res) => {
        setLoading(false);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("fullName", res.data.fullName);
        localStorage.setItem("imageUrl", res.data.imageUrl);
        localStorage.setItem("imageId", res.data.imageId);
        localStorage.setItem("email", res.data.email);
        toast.success("Login successful! 🎉");
        navigate("/dashboard");
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(" Oops! Invalid credentials.");
        console.log(err);
      });
  };
  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img src={require("../assets/books.png")} alt="" />
          <h1 className="signup-left-heading">College Management System</h1>
          <p className="signup-left-para">
            Your Journey to Excellence Starts Here!
          </p>
        </div>
        <div className="signup-right">
          <hr />
          <form onSubmit={submitHandler} className="form">
            <h1>Login With Your Account</h1>

            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="Email "
              required
            />

            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password "
              required
            />

            <button type="submit">
              Login{" "}
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}
            </button>
            <Link className="link" to="/signup">
              Create Your Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
