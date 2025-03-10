const mongoose = require("mongoose");
const courseShema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  courseName: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  startingDate: { type: String, required: true },
  endDate: { type: String, required: true },
  imageId: { type: String, required: true },
  imageUrl: { type: String, required: true },

});

module.exports = mongoose.model("Course", courseShema);
