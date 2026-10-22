const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const Todo = require("./models/Todo");

module.exports.validateListing = (req, res, next) => {
  const { error, value } = listingSchema.validate(req.body);

  if (error) {
    const message = error.details
      .map((el) => el.message)
      .join(", ");

    next(new ExpressError(400, message));
    return;
  }

  req.body = value;
  next();
};


module.exports.isLoggedIn = (req, res, next) => {
 
   if (!req.isAuthenticated()) {
     return res.status(401).json({
      success: false,
      message: "Not logged in",
    });
  }
   next();
};


module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (!todo.author.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not the owner of this Todo",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};













