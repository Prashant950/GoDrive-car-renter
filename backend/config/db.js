import mongoose from "mongoose";

/**
 * Connect to MongoDB using the MONGO_URI env variable.
 * Exits the process on failure so problems are obvious during boot.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
