const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload=require('express-fileupload')

const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const studentRoute = require("./routes/student");
const feeRoute = require("./routes/fee");
const cors=require('cors')
mongoose
  .connect(
    "mongodb+srv://management:1616@cluster0.op44o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(bodyParser.json())
app.use(cors());
app.use(fileUpload({
    useTempFiles:true,
    // tempFileDir:'/tmp'
}))


app.use("/user", userRoute);
app.use("/course",courseRoute);
app.use("/student", studentRoute);
app.use("/fee", feeRoute);

app.use("*", (req, res) => {
  res.status(404).json({
    msg: "bad request",
  });
});

module.exports = app;
