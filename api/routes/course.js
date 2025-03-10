const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Course = require("../model/Course");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Student = require("../model/Student");
const fee= require("../model/Fee");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Add new course
router.post("/add-course", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
    const newCourse = new Course({
      _id: new mongoose.Types.ObjectId(),
      courseName: req.body.courseName,
      price: req.body.price,
      description: req.body.description,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,

      imageUrl: result.secure_url,
      imageId: result.public_id,
    });

    newCourse
      .save()
      .then((result) => {
        res.status(200).json({ newCourse: result });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

//get all courses
router.get("/all-courses", checkAuth, (req, res) => {
  Course.find(req.params.id)
    .select(
      "_id uId courseName description price startingDate endDate imageUrl imageId"
    )
    .then((courses) => {
      res.status(200).json({ courses });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Get one course for any user
router.get("/course-detail/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Course.find({ _id: req.params.id, uId: verify.uId })
    .select(
      "_id uId courseName description price startingDate endDate imageUrl imageId"
    )
    .then((result) => {
      Student.find({ courseId: req.params.id }).then((students) => {
        res.status(200).json({
          course: result,
          studentList: students,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
//deleting the course
router.delete("/:id", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Course.findById(req.params.id)
    .then((course) => {
      if (!course) {
        return res.status(404).json({ msg: "Course not found" });
      }

      if (course.uId != verify.uId) {
        return res.status(403).json({ msg: "Unauthorized" });
      }

      // Delete the course
      Course.findByIdAndDelete(req.params.id)
        .then((result) => {
          // Delete all students associated with the course
          Student.deleteMany({ courseId: req.params.id })
            .then(() => {
              // Delete the course image from Cloudinary
              cloudinary.uploader.destroy(course.imageId, (err) => {
                if (err) {
                  return res.status(500).json({
                    msg: "Failed to delete image from Cloudinary",
                    error: err,
                  });
                }
                res.status(200).json({ result: result });
              });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ msg: "Failed to delete students", error: err });
            });
        })
        .catch((err) => {
          res.status(500).json({ msg: "Failed to delete course", error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ msg: "Failed to find course", error: err });
    });
});

// Updating the course
router.put("/:id", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Course.findById(req.params.id)
    .then((course) => {
      if (verify.uId != course.uId) {
        return res
          .status(500)
          .json({ error: "You are not allowed to update this data!" });
      }

      if (req.files) {
        cloudinary.uploader.destroy(course.imageId, (deletedImage) => {
          cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            (err, result) => {
              if (err) {
                return res.status(500).json({ error: "Image upload failed" });
              }

              const newUpdatedCourse = {
                courseName: req.body.courseName,
                price: req.body.price,
                description: req.body.description,
                startingDate: req.body.startingDate,
                endDate: req.body.endDate,
                uId: verify.uId,
                imageUrl: result.secure_url,
                imageId: result.public_id,
              };
              Course.findByIdAndUpdate(req.params.id, newUpdatedCourse, {
                new: true,
              })
                .then((data) => {
                  res.status(200).json({
                    updatedCourse: data,
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
          courseName: req.body.courseName,
          price: req.body.price,
          description: req.body.description,
          startingDate: req.body.startingDate,
          endDate: req.body.endDate,
          uId: verify.uId,
          imageUrl: course.imageUrl,
          imageId: course.imageId,
        };

        Course.findByIdAndUpdate(req.params.id, updatedData, { new: true })
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
//get latest 5 course data
router.get("/latest-courses", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  Course.find({ uId: verify.uId })
    .sort({ createdAt: -1 })
    .limit(5)

    .then((result) => {
      res.status(200).json({
        courses: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// home api
router.get("/home", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const newFees = await fee.find({ uId: verify.uId })
      .sort({ $natural: -1 })
      .limit(5);
    const newStudents = await Student.find({ uId: verify.uId })
      .sort({ $natural: -1 })
      .limit(5);
      const totalCourse = await Course.countDocuments({ uId: verify.uId });
      const totalStudent = await Student.countDocuments({ uId: verify.uId });
      const totalAmount = await fee.aggregate([
        { $match: { uId: verify.uId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalAmountValue =
        totalAmount.length > 0 ? totalAmount[0].total : 0;

    res.status(200).json({
      fees: newFees,
      students: newStudents,
      totalCourse: totalCourse,
      totalStudent: totalStudent,
      totalAmount: totalAmountValue,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
