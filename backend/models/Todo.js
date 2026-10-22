const mongoose = require("mongoose");
const User = require("./User.js")
const Review = require("./Review.js")


  
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  completed: {
    type: Boolean,
    default: false
  },
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},
reviews: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
],

}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
