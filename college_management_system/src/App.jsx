import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddCourses from "./components/AddCourses";
import AddStudent from "./components/AddStudent";
import CollectFee from "./components/CollectFee";
import PaymentHistory from "./components/PaymentHistory";
import Home from "./components/Home";
import Courses from "./components/Courses";
import Students from "./components/Students";
import CourseDetail from "./components/CourseDetail";
import StudentDetail from "./components/StudentDetail";

const myRouter = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "courses", element: <Courses /> },
      { path: "add-course", element: <AddCourses /> },
      { path: "add-student", element: <AddStudent /> },
      { path: "students", element: <Students /> },
      { path: "collect-fee", element: <CollectFee /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "course-detail/:id", element: <CourseDetail /> },
      { path: "update-course/:id", element: <AddCourses /> },
      { path: "update-student/:id", element: <AddStudent /> },
      { path: "student-detail/:id", element: <StudentDetail /> },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={myRouter} />
      <ToastContainer />
    </>
  );
};

export default App;
