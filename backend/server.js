require("dotenv").config();
const express = require("express");
const todoRoutes = require("./routes/todoRoutes");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const {MongoStore} = require("connect-mongo");
const passport = require("passport");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/Review.js");
const User = require("./models/User");
const ExpressError = require("./utils/ExpressError.js")


const app = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

const sessionObj =   {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    httpOnly: true,
    secure: true, // Local HTTP development ke liye
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}
app.use(session(sessionObj));

app.use(passport.initialize());
app.use(passport.session());
 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());


app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

   mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });


app.use("/review", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/api", todoRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
   });
});
