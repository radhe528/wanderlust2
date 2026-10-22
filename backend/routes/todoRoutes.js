const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const Todo = require("../models/Todo");
const asyncWrap = require("../utils/asyncWrap.js")
const mongoose = require("mongoose")
const { validateListing, isLoggedIn, isOwner  } = require("../middleware.js");
const passport = require("passport");
const {findTodo,createTodoo,editTodo,isDoneTodo,deleteTodor,showTodooo} = require("../controllers/todoController.js")

router.get("/find", findTodo);

router.post("/create", isLoggedIn, validateListing, createTodoo);

// Update Todo Title
router.patch("/Edit/:id", isLoggedIn, isOwner, editTodo);


router.patch("/isDone/:id", isLoggedIn,isOwner, isDoneTodo);


router.delete("/delete/:id",isLoggedIn, isOwner, deleteTodor);


router.get("/Show/:id", showTodooo);


module.exports = router;