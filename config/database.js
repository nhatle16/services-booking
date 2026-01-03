const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

module.exports = connectDatabase;
