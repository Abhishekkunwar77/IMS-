import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const StudentDetail = () => {
  const [student, setStudent] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [course, setCourse] = useState({});

  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getStudentDetail();
  }, []);

  const getStudentDetail = () => {
    axios
      .get("http://localhost:4200/student/student-detail/" + params.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setStudent(res.data.StudentDetail);
        setPaymentList(res.data.feeDetail);
        setCourse(res.data.courseDetail);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong!");
      });
  };
const deleteStudent = (studentId) => {
  if (window.confirm("Are you sure you want to delete this course?")) {
    axios
      .delete("http://localhost:4200/student/" + studentId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        navigate("/dashboard/course-detail/" + course._id);
        toast.success("Student Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong!");
      });
  }
};
  return (
    <div className="student-detail-main-wrapper">
      <div className="student-detail-wrapper">
        <div className="student-detail-header">
          <h2>Student Full Detail</h2>
          <div className="sd-btn-container">
            <button
              className="primary-btn"
              onClick={() => {
                navigate("/dashboard/update-student/" + student._id, {
                  state: { student },
                });
              }}
            >
              Edit
            </button>
            <button onClick={()=>{deleteStudent(student._id)}} className="secondary-btn">Delete</button>
          </div>
        </div>
        <div className="sd-detail">
          <img alt="studentpic" src={student.imageUrl} />
          <div>
            <h2>{student.fullName}</h2>
            <p>Phone: {student.phone}</p>
            <p>Email: {student.email}</p>
            <p>Address: {student.address}</p>
            <h4>Course: {course.courseName}</h4>
          </div>
        </div>
      </div>
      <br />
      <h2 className="payment-history-title">Payment History</h2>
      <div className="fee-detail-wrapper">
        <table>
          <thead>
            <th>Date and Time</th>
            <th>Amount</th>
            <th>Remark</th>
            </thead>
          <tbody>
            {paymentList.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.createdAt}</td>
                <td>{payment.amount}</td>
                <td>{payment.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDetail;
