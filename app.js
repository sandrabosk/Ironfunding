const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

// Load our ENVIRONMENT VARIABLES from the .env file in dev
// (this is for dev only, but in prod it just doesn't do anything)
require("dotenv").config();

// Tell node to run the code contained in this file
// (this sets up passport and our strategies)
// require("./config/passport-config.js");
mongoose.connect("mongodb://localhost:27017/ironfunds");

// mongoose.connect(process.env.MONGODB_URI);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");
app.use(expressLayouts);

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
// app.use(
//   session({
//     secret: "my cool passport app",

//     // these two options are there to prevent warnings in terminal
//     resave: true,
//     saveUninitialized: true
//   })
// );
app.use(flash());

// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());
// ... and BEFORE our routes



// // current user:
// app.use((req, res, next) => {
//   if (typeof req.user !== "undefined") {
//     res.locals.userSignedIn = true;
//   } else {
//     res.locals.userSignedIn = false;
//   }
//   next();
// });


// This middleware sets the user variable for all views
// (only if logged in)
//   user: req.user     for all renders!
app.use((req, res, next) => {
  if (req.user) {
    // Creates a variable "user" for views
    res.locals.user = req.user;
  }

  next();
});

// OUR ROUTES HERE
// ----------------------------------------------------------
const index = require("./routes/index");
app.use("/", index);
;
// ----------------------------------------------------------

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
