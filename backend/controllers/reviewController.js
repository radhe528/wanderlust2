const express = require("express");
const router = express.Router({ mergeParams: true });
const Todo = require("../models/Todo.js");
const Review = require("../models/Review");
const { validateListing, isLoggedIn, isOwner  } = require("../middleware.js");

module.exports.createReview = async (req, res, next) => {
  try {
    const listing = await Todo.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const review = new Review({
      comment: req.body.comment,
      rating: req.body.rating,
      author: req.user._id,
    });

    await review.save();

    listing.reviews.push(review._id);
    let list = await listing.save();
    const listin = await Todo.findById(list.id).populate("author").populate({
    path: "reviews",
    populate: {
      path: "author",
      select: "username",
    },
  });

    res.status(201).json({
      updateListing: listin,  
      message: "Review created successfully",
      review,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview =   async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    const listing = await Todo.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Sirf review ka author ya authorized admin delete kar sake
    if (!review.author?.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not allowed to delete this review",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    // Listing ke reviews array se ID remove karo
    await Todo.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
}



























