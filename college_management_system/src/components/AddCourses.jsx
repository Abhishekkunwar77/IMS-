import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
const AddCourses = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [startingDate, setStartingDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      setCourseName(location.state.course.courseName);
      setDescription(location.state.course.description);
      setPrice(location.state.course.price);
      setStartingDate(location.state.course.startingDate);
      setEndDate(location.state.course.endDate);
      setImageUrl(location.state.course.imageUrl);
    } else {
      setCourseName('');
      setDescription('');
      setPrice('');
      setStartingDate('');
      setEndDate('');
      setImageUrl('');
    }
  }, [location]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("startingDate", startingDate);
    formData.append("endDate", endDate);

    if (image) {
      formData.append("image", image);
    }

    if (location.state) {
      axios
        .put(
          "http://localhost:4200/course/" + location.state.course._id,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setLoading(false);
          toast.success("Course Updated!");
          navigate("/dashboard/course-detail/" + location.state.course._id);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Something went wrong!");
        });
    } else {
      axios
        .post("http://localhost:4200/course/add-course", formData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setLoading(false);
          toast.success("Added New Course!");
          navigate("/dashboard/courses");
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
        <h1>{location.state ? "Edit Course" : "Add New Course"}</h1>
        <input
          value={courseName}
          onChange={(e) => {
            setCourseName(e.target.value);
          }}
          type="text"
          placeholder="Course Name"
          required
        />
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          type="text"
          placeholder="Description"
          required
        />
        <input
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          type="number"
          placeholder="Price"
          required
        />
        <input
          value={startingDate}
          onChange={(e) => {
            setStartingDate(e.target.value);
          }}
          type="text"
          placeholder="Starting Date"
          required
        />
        <input
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
          type="text"
          placeholder="End Date"
          required
        />
        <input onChange={fileHandler} type="file" required={!location.state} />
        {imageUrl && (
          <img className="your-logo" alt={courseName} src={imageUrl} />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Add Course"}
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        </button>
      </form>
    </div>
  );
};

export default AddCourses;
