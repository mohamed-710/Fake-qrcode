import express from 'express';

import dotenv from 'dotenv';

import connectDB from './config/DB.js';

import authRoutes from './routes/authRoute.js'

import errorHandler from './middleware/errorHandler.js';

import bankRoutes from "./routes/bankRoutes.js";

import cookieParser from 'cookie-parser';

import userRoute from "./routes/userRoute.js"

import cors from 'cors';

dotenv.config();


const app = express();

app.use(express.json());

app.use(cookieParser()); 

app.use(cors({
  origin: "*", 
  credentials: false, 
}));
app.use("/api/auth", authRoutes);

app.use("/api/bank", bankRoutes);

app.use("/api/Manage", userRoute);


app.use(errorHandler);




const PORT = process.env.PORT || 3000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
  });
