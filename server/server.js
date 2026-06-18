import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cron from 'node-cron'; // Added for automated background cleanup tasks

// Configuration imports
import connectDB from './config/db.js';

// Model import required by the cron job lifecycle routines
import File from './models/File.js'; 

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


// 1. AUTOMATED BACKGROUND LIFE-CYCLE CRON JOB
cron.schedule('0 * * * *', async () => {
  console.log('[Cron Job]: Initiating background registry lifecycle audit...');
  try {
    const now = new Date();

    // MATCHES YOUR EXACT SCHEMA KEYS: expiryAt & downloadsRemaining
    const expiredFiles = await File.find({
      $or: [
        { expiryAt: { $lt: now } },                // If expiration time is in the past
        { downloadsRemaining: { $lte: 0 } }        // If no downloads are left (e.g., 0)
      ]
    });

    if (expiredFiles.length === 0) {
      console.log('[Cron Job]: Lifecycle audit complete. Storage is optimal.');
      return;
    }

    for (const file of expiredFiles) {
      const diskName = file.filenameOnDisk || file.filename;
      const filePath = path.join(uploadsDir, diskName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Cron Job]: Physically purged expired payload binary: ${diskName}`);
      }

      // Wipe the structural tracking item entry out of MongoDB
      await File.deleteOne({ _id: file._id });
      console.log(`[Cron Job]: Purged database tracking metadata for: ${file.name}`);
    }

    console.log(`[Cron Job]: Successfully targeted and cleaned up ${expiredFiles.length} stale object(s).`);
  } catch (error) {
    console.error(`[Cron Job Error Interceptor]: Lifecycle routine broken: ${error.message}`);
  }
});

// 2. CORSOVERLAY ROUTING AND PERMISSIONS
const allowedOrigins = [
  'http://localhost:5173',
  'https://secureshare148.netlify.app',
  'https://secureshare148.netlify.app/'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow service-to-service requests or developer tools with no origin header
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: Request from unauthorized origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
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