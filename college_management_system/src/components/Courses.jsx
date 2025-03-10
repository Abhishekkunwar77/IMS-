import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../components/style.css'
import { useNavigate } from "react-router-dom";
const Courses = () => {
  const navigate= useNavigate();
  const [courseList, setCourseList] = useState([]);
  useEffect(() => {
    getCourses();
  }, []);
  const getCourses = () => {
    axios
      .get("http://localhost:4200/course/all-courses", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data.courses);
        setCourseList(res.data.courses);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong!");
      });
  };
  return (
    <div className="course-wrapper">
      {courseList.map((course) => (
        <div onClick={()=>{navigate('/dashboard/course-detail/'+course._id)}} className='course-box' key={course._id}>
          <img className='course-thumbnail' src={course.imageUrl} alt='courseImage'/>
          <h2 className='course-title'>{course.courseName}</h2>
          <p className='course-price'> Rs. {course.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Courses;
