import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+, but kept for clarity
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`=================================`);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`=================================`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('MongoDB connection failed. Please check your MONGODB_URI in .env file');
    // Don't exit - let server continue running
  }
};

export default connectDB;
