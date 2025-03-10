const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Student = require("../model/Student");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Fee = require("../model/Fee");
const Course = require("../model/Course");

//add new students
router.post("/add-student", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Image upload failed" });
    }

    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      courseId: req.body.courseId,
      address: req.body.address,
      imageUrl: result.secure_url,
      imageId: result.public_id,
    });

    newStudent
      .save()
      .then((result) => {
        res.status(200).json({ newStudent: result });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

//get all own students

router.get("/all-students", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Student.find({ uId: verify.uId })
    .select("_id uId fullName address email courseId phone imageUrl imageId")
    .then((result) => {
      res.status(200).json({ students: result });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//get own all students for a courses
router.get("/all-students/:courseId", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Student.find({ uId: verify.uId, courseId: req.params.courseId })
    .select("_id uId fullName address email courseId phone imageUrl imageId")
    .then((result) => {
      res.status(200).json({ students: result });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//delete students
router.delete("/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Student.findById(req.params.id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      if (student.uId == verify.uId) {
        Student.findByIdAndDelete(req.params.id)
          .then(() => {
            cloudinary.uploader.destroy(student.imageId, () => {
              res.status(200).json({ msg: "Student deleted successfully" });
            });
          })
          .catch((err) => {
            res.status(500).json({ msg: err.message });
          });
      } else {
        res.status(403).json({ msg: "Unauthorized request" });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: err.message });
    });
});

//update student

router.put("/:id", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Student.findById(req.params.id)
    .then((student) => {
      if (verify.uId != student.uId) {
        return res
          .status(500)
          .json({ error: "You are not allowed to update this data!" });
      }

      if (req.files) {
        cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
          cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: "Image upload failed" });
              }

              const newUpdatedStudent = {
                fullName: req.body.fullName,
                phone: req.body.phone,
                email: req.body.email,
                courseId: req.body.courseId,
                address: req.body.address,
                uId: verify.uId,
                imageUrl: result.secure_url,
                imageId: result.public_id,
              };
              Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, {
                new: true,
              })
                .then((data) => {
                  res.status(200).json({
                    UpdatedStudent: data,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          );
        });
      } else {
        const updatedData = {
          fullName: req.body.fullName,
          phone: req.body.phone,
          email: req.body.email,
          courseId: req.body.courseId,
          address: req.body.address,
          uId: verify.uId,
          imageUrl: student.imageUrl,
          imageId: student.imageId,
        };

        Student.findByIdAndUpdate(req.params.id, updatedData, { new: true })
          .then((data) => {
            res.status(200).json({ updatedData: data });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//get latest 5 students data
router.get("/latest-students", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  Student.find({ uId: verify.uId })
    .sort({ createdAt: -1 })
    .limit(5)

    .then((result) => {
      res.status(500).json({
        students: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// get student detail by id (new added)
router.get("/student-detail/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  Student.findById(req.params.id)
    .select("_id uId fullName address email courseId phone imageUrl imageId")
    .then((result) => {
      Fee.find({
        uId: verify.uId,
        courseId: result.courseId,
        phone: result.phone,
      }).then((feeData) => {
        Course.findById(result.courseId)
          .then((courseDetail) => {
            res.status(200).json({
              StudentDetail: result,
              feeDetail: feeData,
              courseDetail: courseDetail,
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
