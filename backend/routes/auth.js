const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const User = require("../models/User");
const asyncWrap = require("../utils/asyncWrap.js")
const mongoose = require("mongoose")
const passport = require("passport");
const {userRegister, userLogin, checkLogin, userLogout} = require("../controllers/authController.js")

router.post("/register", userRegister  );
  
 
// POST /api/auth/login
router.post("/login", userLogin);
  
 
// GET /api/auth/me — current logged-in user
router.get("/me", checkLogin);
  
 
// POST /api/auth/logout
router.post("/Logout", userLogout);
  

module.exports = router;
























