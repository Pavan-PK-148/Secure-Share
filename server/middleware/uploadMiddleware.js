import multer from 'multer';

// Use memory storage so raw binaries are never written to disk unencrypted
const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Strict 50MB file size restriction ceiling
  }
});

export default uploadMiddleware;