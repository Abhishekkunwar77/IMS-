import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Home.css";
const Home = () => {
  const [totalCourse, setTotalCourse] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  useEffect(() => {
    getHomeDetails();
  }, []);
  const getHomeDetails = () => {
    axios
      .get("http://localhost:4200/course/home", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setTotalCourse(res.data.totalCourse);
        setTotalStudents(res.data.totalStudent);
        setStudents(res.data.students);
        setFees(res.data.fees);
        setTotalAmount(res.data.totalAmount);
      })
      .catch((err) => {
        console.log("Error Response:", err.response);
        console.log(err);
        toast.error("Something Went Wrong!");
      });
  };
  return (
    <div className="home-wrapper">
      <div className="count-box-wrapper">
        <div className=" box box1">
          <h2>{totalCourse}</h2>
          <p>Total Course</p>
        </div>
        <div className="box box2">
          <h2>{totalStudents}</h2>
          <p>Total Student</p>
        </div>
        <div className=" box box3">
          <h2>{totalAmount}</h2>
          <p>Total Amount</p>
        </div>
      </div>
      <div className="home-list-container">
        <div className="home-table-container">
          {students.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Date and Time</th>
                  <th>Amount</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.fullName}</td>
                    <td>{payment.createdAt}</td>
                    <td>{payment.amount}</td>
                    <td className="remark">{payment.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Students Available</p>
          )}
        </div>
        <div className="table-container-home">
          {fees.length > 0 ? (
            <table className="home-student-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="student-row">
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
          ) : (
            <p>No Fees Data Available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
