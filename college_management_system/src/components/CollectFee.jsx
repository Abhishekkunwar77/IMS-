import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CollectFee = () => {

  const [fullName, setFullName] = useState("");
  const[phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseList , setCourseList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

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
  const submitHandler = (e) => {
    e.preventDefault();
     axios
       .post("http://localhost:4200/fee/add-fee",  {
          fullName: fullName,
          phone: phone,
          amount: amount,
          remark: remark,
          courseId: courseId,

          
         },{
         headers: {
           Authorization: "Bearer " + localStorage.getItem("token"),
         },
       })
       .then((res) => {
         setLoading(false);
         toast.success("Fee paid!");
         navigate("/dashboard/payment-history");
       })
       .catch((err) => {
         setLoading(false);
          console.log(err.response); 
         toast.error("Something went wrong!");
       });
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="form">
        <h1>Collect Fee</h1>

        <input
          onChange={(e) => {
            setFullName(e.target.value);
          }}
          type="text"
          placeholder="Full Name"
          required
        />
        <input
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          type="text"
          placeholder="Phone "
          required
        />
        <input
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          type="text"
          placeholder="Amount "
          required
        />
        <input
          onChange={(e) => {
            setRemark(e.target.value);
          }}
          type="text"
          placeholder="Remark "
          required
        />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select Course</option>
          {courseList.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <button type="submit">
          Submit
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        </button>
      </form>
    </div>
  );
}

export default CollectFee
