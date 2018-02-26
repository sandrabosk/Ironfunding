const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

// authentication:
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);

const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
// Passport Strategy & Configuration
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user-model");
const Campaign = require("./models/campaign-model");
const bcrypt = require("bcrypt");

// Load our ENVIRONMENT VARIABLES from the .env file in dev
// (this is for dev only, but in prod it just doesn't do anything)
require("dotenv").config();
require("./config/passport-config.js");

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
// sessions: 
app.use(
  session({
    secret: "ironfundingdev",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
// THIS GOES AFTER THE SESSION PART:




app.use(flash());

// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());
// ... and BEFORE our routes



// current user:
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

const authRoutes = require("./routes/auth.js");
app.use("/", authRoutes);

const campaignRoutes = require("./routes/campaign.js");
app.use("/campaigns", campaignRoutes);
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
