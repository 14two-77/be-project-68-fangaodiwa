// package
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db.js");
const mongoSenitize = require('@exortek/express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');

// routes
const auth = require("./routes/auth.js");
const shops = require("./routes/shops.js");

// create collection models
require('./models/User.js');
require('./models/Shop.js');
require('./models/Service.js');
require('./models/Reservation.js');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

dotenv.config({
    path: "./config/config.env"
});

connectDB();

app.set('query parser', 'extended');

app.use([
    express.json(),
    cookieParser(),
    mongoSenitize(),
    helmet(),
    xss(),
    limiter
]);

app.use("/api/v1/auth", auth);
app.use("/api/v1/shops", shops);

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV;

const server = app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
});