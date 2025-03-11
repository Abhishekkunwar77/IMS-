import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CourseDetail = () => {
  const params = useParams();
  const [course, setCourse] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const navigate=useNavigate();

  useEffect(() => {
    getCourseDetail();
  }, []);
  const getCourseDetail = () => {
    axios
      .get("http://localhost:4200/course/course-detail/" + params.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCourse(res.data.course[0]);
        setStudentList(res.data.studentList);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong!");
      });
  };
  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
         axios
           .delete("http://localhost:4200/course/" + courseId, {
             headers: {
               Authorization: "Bearer " + localStorage.getItem("token"),
             },
           })
           .then((res) => {
            navigate("/dashboard/courses");
            toast.success("Course Deleted Successfully!");
           })
           .catch((err) => {
             console.log(err);
             toast.error("Something Went Wrong!");
           });
  }
}
  return (
    <div className="course-detail-main-wrapper">
      {course && (
        <div>
          <div className="course-detail-wrapper">
            {course && course.imageUrl ? (
              <img src={course.imageUrl} alt={course.courseName} />
            ) : (
              <p>Loading image...</p>
            )}

            <div className="course-detail-text">
              <h1>{course.courseName}</h1>
              <p>Price: {course.price}</p>
              <p>Starting Date: {course.startingDate}</p>
              <p>End Date: {course.endDate}</p>
            </div>
            <div className="course-description-box">
              <div className="btn-container">
                <button
                  onClick={() => {
                    navigate("/dashboard/update-course/" + course._id, {
                      state: { course },
                    });
                  }}
                  className="primary-btn"
                >
                  Edit
                </button>
                <button onClick={()=>{deleteCourse(course._id)}} className="secondary-btn">Delete</button>
              </div>
              <h3>Course Detail</h3>
              <div className="course-description-container">
                <p>{course.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <hr className="hrline" />
      {studentList && studentList.length > 0 && (
        <div className="studentList-container">
          <table>
            <thead>
              <tr>
                <th>Student's Pic</th>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => (
                <tr
                  onClick={() => {
                    navigate("/dashboard/student-detail/" + student._id);
                  }}
                  key={student._id}
                  className="student-row"
                >
                  <td>
                    <img
                      className="student-profile-pic"
                      src={student.imageUrl}
                      alt="students-image"
                    />
                  </td>
                  <td>
                    <p>{student.fullName}</p>
                  </td>
                  <td>
                    <p>{student.phone}</p>
                  </td>
                  <td>
                    <p>{student.email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
