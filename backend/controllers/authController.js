const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const User = require("../models/User");
const asyncWrap = require("../utils/asyncWrap.js")
const mongoose = require("mongoose")
const passport = require("passport");



module.exports.userRegister  =   async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid username, email and password (at least 8 characters) are required",
      });
    }

    const user = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
    });

    const registeredUser = await User.register(user, password);

    // Registration ke baad user ko automatically log in karna
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        user: {
          id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });
  } catch (err) {
    if (err.name === "UserExistsError" || err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username or account already exists",
      });
    }

    next(err);
  }
};

module.exports.userLogin =   (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid username or password",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

module.exports.checkLogin =   (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      success: false,
      authenticated: false,
      user: null,
      message: "Not logged in",
    });
  }

  res.json({
    success: true,
    authenticated: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

module.exports.userLogout =   (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        message: "Logout successful",
      });
    });
  });
}





















