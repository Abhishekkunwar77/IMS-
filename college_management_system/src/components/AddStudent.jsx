import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const AddStudent = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [courseId, setCourseId] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCourses();
    if (location.state) {
      setFullName(location.state.student.fullName);
      setPhone(location.state.student.phone);
      setEmail(location.state.student.email);
      setAddress(location.state.student.address);
      setCourseId(location.state.student.courseId);
      setImageUrl(location.state.student.imageUrl);
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setCourseId("");
      setImageUrl("");
    }
  }, [location]);

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
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("courseId", courseId);
    if (image) formData.append("image", image);

    if (location.state) {
      axios
        .put(
          "http://localhost:4200/student/" + location.state.student._id,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setLoading(false);
          toast.success("Student Detail Updated!");
          navigate("/dashboard/student-detail/" + location.state.student._id);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Something went wrong!");
        });
    } else {
      axios
        .post("http://localhost:4200/student/add-student", formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setLoading(false);
          toast.success("Added New Student!");
          navigate("/dashboard/course-detail/" + courseId);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Something went wrong!");
        });
    }
  };

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="form">
        <h1>{location.state ? "Edit Student Detail" : "Add New Student"}</h1>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Student Name"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full Address"
          required
        />

        <select
          value={courseId}
          disabled={location.state}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select Course</option>
          {courseList.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>

        <input required={!location.state} onChange={fileHandler} type="file" />

        {imageUrl && (
          <img className="your-logo" alt="student-image" src={imageUrl} />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Submit "}
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
