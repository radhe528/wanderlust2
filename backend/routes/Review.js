const express = require("express");
const router = express.Router({ mergeParams: true });
const Todo = require("../models/Todo.js");
const Review = require("../models/Review");
const { validateListing, isLoggedIn, isOwner  } = require("../middleware.js");
const{createReview, deleteReview} = require("../controllers/reviewController.js")


router.post("/create/:id",isLoggedIn, createReview);
 

router.delete("/deleteReview/:id/:reviewId", isLoggedIn,deleteReview );


module.exports = router;