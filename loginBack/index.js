import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './database/connectDB.js';
import authRoutes from "./routes/auth.route.js"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    connectDB();
    console.log("Server is running on port:",PORT);
})

// mongodb+srv://ayoubsqlehi50:<db_password>@expressp.2ekhw.mongodb.net/?retryWrites=true&w=majority&appName=ExpressP

// UcDIGq3jacZP8kNd