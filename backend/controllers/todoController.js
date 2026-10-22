const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const Todo = require("../models/Todo");
const asyncWrap = require("../utils/asyncWrap.js")
const mongoose = require("mongoose")
const { validateListing, isLoggedIn, isOwner  } = require("../middleware.js");
const passport = require("passport");


module.exports.findTodo = async (req, res) => {
  try {
    const todos = await Todo.find().populate("author");
    // console.log(todos)
     res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports.createTodoo = asyncWrap(async (req, res, next) => {
    const { title } = req.body;
 
    const newTodo = new Todo({
      title: title
    });
    newTodo.author = req.user;
     const savedTodo = await newTodo.save();

     if(!savedTodo){
     return next(new ExpressError(400, "err mongoDB me hai"));
    }
     res.status(201).json(savedTodo);
})

module.exports.editTodo =  async (req, res, next) => {
  try {
    const { liting } = req.body;
      if (!liting ) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: liting.title },
      {
        // returnDocument: "after",
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports.isDoneTodo =   async (req, res) => {
  try {
    const { completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports.deleteTodor  =    async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTodo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
      todo: deletedTodo
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

module.exports.showTodooo =   asyncWrap(async (req, res,next) => {

    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
       next(new ExpressError(400, "id galat hai"));
        return;
      }

    const listing = await Todo.findById(req.params.id).populate("author").populate({
    path: "reviews",
    populate: {
      path: "author",
      select: "username",
    },
  });
     if(!listing){
        next(new ExpressError(400, "Listing nhi mili"));
        return;
    }

      res.json(listing);
   
})

























