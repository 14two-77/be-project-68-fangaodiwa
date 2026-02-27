const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db.js");
const mongoSenitize = require('@exortek/express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');

// โหลด Environment Variables
dotenv.config({
    path: "./config/config.env"
});

// เชื่อมต่อ Database
connectDB();

const app = express();

// กำหนด Rate Limit
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

// เรียกใช้ Collection Models
require('./models/User.js');
require('./models/Shop.js');
require('./models/Service.js');
require('./models/Reservation.js');

// นำเข้า Routes
const auth = require("./routes/auth.js");
const shops = require("./routes/shops.js");
const reservations = require('./routes/reservations'); // ✅ รวม import ไว้ด้วยกัน

app.set('query parser', 'extended');

// เรียกใช้ Middlewares
app.use([
    express.json(),
    cookieParser(),
    mongoSenitize(),
    helmet(),
    xss(),
    limiter
]);

// ใช้งาน Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/shops", shops);
app.use('/api/v1/reservations', reservations); // ✅ แก้ไขเป็น v1 แล้ว

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV;

const server = app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});