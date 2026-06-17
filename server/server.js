import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuration imports
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

// Establish backend pipeline instance
const app = express();

connectDB();

// Handle ESM directory path definitions cleanly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the local uploads storage container folder exists safely on server runtime init
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Global Cross-Origin Resource Policy Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express Payload Ingestion Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Dynamic Health check heartbeat endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date(),
    service: 'Cryptographic Secure Share Pipeline'
  });
});

// Centralized Catch-All Express Error Interceptor Guard Layer
app.use((err, req, res, next) => {
  console.error(`[Global Error Interceptor]: ${err.stack}`);
  res.status(err.status || 500).json({
    message: err.message || 'An unhandled exception disrupted the transmission pipeline.'
  });
});

// Bind Server Interface Port Allocation Rules
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Secure Share Online and listening on port: ${PORT}`);
});