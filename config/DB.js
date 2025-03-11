import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${db.connection.host}`);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error");
        process.exit(1);
    }
};

export default connectDB;
