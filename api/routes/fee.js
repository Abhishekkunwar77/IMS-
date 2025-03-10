const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Fee = require("../model/Fee");
const mongoose = require("mongoose");

router.post("/add-fee", checkAuth, (req, res) => {
  const { fullName, phone, amount, courseId, remark } = req.body; // Extract fields from req.body

  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  if (!fullName || !phone || !amount || !courseId) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const newFee = new Fee({
    _id: new mongoose.Types.ObjectId(),
    fullName: req.body.fullName,
    phone: req.body.phone,
    courseId: req.body.courseId,
    uId: verify.uId,
    amount: req.body.amount,
    remark: req.body.remark,
  });
  newFee
    .save()
    .then((result) => {
      res.status(200).json({
        newFee: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get all fee collection data for any user
router.get("/payment-history", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Fee.find({ uId: verify.uId })
    .then((result) => {
      res.status(200).json({
        paymentHistory: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//get all payments for any students in a course
router.get("/all-payment", checkAuth, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  Fee.find({
    uId: verify.uId,
    courseId: req.query.courseId,
    phone: req.query.phone,
  })
    .then((result) => {
      res.status(200).json({
        rees: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
