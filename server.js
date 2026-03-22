// Package
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db.js");
const mongoSenitize = require('@exortek/express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');

// Create Collection Models
require('./models/User.js');
require('./models/Shop.js');
require('./models/Service.js');
require('./models/Reservation.js');

// Routes
const auth = require("./routes/auth.js");
const shops = require("./routes/shops.js");
const services = require('./routes/services');
const users = require('./routes/users');
const reservations = require('./routes/reservations');

// Environment
dotenv.config({
  path: "./config/config.env"
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

const app = express();

// Connect Database
connectDB();

app.set('query parser', 'extended');

// Middlewares
app.use([
  express.json(),
  cookieParser(),
  mongoSenitize(),
  helmet(),
  xss(),
  // limiter
]);

// apis
app.use("/api/v1/auth", auth);
app.use("/api/v1/shops", shops);
app.use('/api/v1/services', services);
app.use('/api/v1/users', users);
app.use('/api/v1/reservations', reservations);

// Start server 
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV;

const server = app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});