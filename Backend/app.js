import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './Config/db.js';
import { userRouter } from './Routes/UserRoutes.js';


// Load environment variables
dotenv.config();

// Create Express App
const app = express();


// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies from requests
app.use(morgan('dev')); // Log HTTP requests (using 'dev' format for concise output)
app.use(helmet()); // Add security-related HTTP headers

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World! Your server is secure and running.');
});

app.use("/api/user", userRouter);



// Start Server
const PORT = process.env.PORT || 3000;

// Coonect Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`);
    });
});

