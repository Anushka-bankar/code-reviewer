// const mongoose = require("mongoose");
// require('dotenv').config();

// const dbConnect = async () => {
//   try {
//     await mongoose.connect(process.env.DBURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected successfully!");
//   } catch (error) {
//     console.log("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = dbConnect;

const mongoose = require("mongoose");
require('dotenv').config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
