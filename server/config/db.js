import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Database Connected Successfully`);
  } catch (error) {
    console.error(`Database Connection failure`);
    process.exit(1);
  }
};

export default connectDB;