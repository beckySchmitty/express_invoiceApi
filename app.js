// express invoice assignment

const express = require("express");
const app = express();
const ExpressError = require("./expressError")
const db = require("./db");



app.use(express.json());

const cRoutes = require("./routes/companies");
app.use("/companies", cRoutes);

const iRoutes = require("./routes/invoices");
app.use("/invoices", iRoutes);

const uRoutes = require('./routes/users');
const mRoutes = require('./routes/messages');
app.use('/users', uRoutes);
app.use('/messages', mRoutes);

// 404 handler
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

// general error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    // message: err.message
  });
});

// export app for server.js
module.exports = app;
