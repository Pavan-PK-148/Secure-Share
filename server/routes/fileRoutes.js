import express from 'express';
import protect from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import { uploadFile, verifyFileLink, downloadFileStream, getFileMetadata } from '../controllers/fileController.js';

const router = express.Router();

// 1. Secure ingestion endpoint intercepting multipart stream allocations (Protected)
router.post('/upload', protect, uploadMiddleware.single('file'), uploadFile);

// 2. Dynamic client verification metadata readout route (Publicly Accessible)
router.get('/verify/:id', verifyFileLink);

// 3. Form-handled dynamic server-side decipher streaming extraction route (Publicly Accessible)
router.post('/download/:id', downloadFileStream);

router.get('/metadata/:id', protect, getFileMetadata);

export default router;