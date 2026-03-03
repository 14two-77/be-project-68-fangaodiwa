const mongoose = require("mongoose");
const { setServers } = require("node:dns/promises");

const connectDB = async () => {
  // Override DNS to use public resolvers (Cloudflare, Google) to get around local DNS issues with MongoDB SRV records
  setServers(["1.1.1.1", "8.8.8.8"]);

  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;