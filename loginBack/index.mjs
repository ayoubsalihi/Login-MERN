import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/login_example', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
app.use('/api/users', userRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
connectDB();