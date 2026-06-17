import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import File from '../models/File.js';

// Resolve ESM local paths safely
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// SYSTEMIC GUARD: Guarantee that the physical isolated encrypted directory exists right away
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to determine the lifecycle expiration date ceiling based on select configuration
const calculateExpiryDate = (expiryString) => {
  const amount = parseInt(expiryString);
  const unit = expiryString.slice(-1);
  const now = new Date();

  if (unit === 'h') {
    now.setHours(now.getHours() + amount);
  } else if (unit === 'd') {
    // FIXED: Use setDate + getDate to prevent mathematical boundary overflow errors inside node runtimes
    now.setDate(now.getDate() + amount);
  }
  return now;
};

// Helper to convert input raw byte allocations into scannable string layouts
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// @desc    Upload, Localize, and Encrypt Binary File Payload Stream
// @route   POST /api/files/upload
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Zero binary stream payloads intercepted' });
    }

    const { expiry, downloadLimit, password } = req.body;
    
    // Ensure you have an encryption key configured in your environment variables
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('Critical configuration error: process.env.ENCRYPTION_KEY is completely missing');
    }
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

    // 1. Generate randomized 12-byte cryptographic vector initialization seeds
    const iv = crypto.randomBytes(12);

    // 2. Initialize the heavy cipher engine using AES-256-GCM architecture standard
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);

    // 3. Encrypt the inbound raw memory buffer allocations entirely
    const encryptedBuffer = Buffer.concat([
      cipher.update(req.file.buffer),
      cipher.final()
    ]);

    // 4. Extract authentic GCM verification checking headers
    const authTag = cipher.getAuthTag();

    // 5. Build isolated target storage paths inside host file allocation tree structures
    const uniqueFilename = `${crypto.randomUUID()}.enc`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFilename);

    // 6. Write physical block allocation arrays out to server storage paths safely
    fs.writeFileSync(destinationPath, encryptedBuffer);

    // 7. Calculate conditional invalidation parameters matching input rules
    const expiryAt = calculateExpiryDate(expiry || '24h');
    const totalDownloads = parseInt(downloadLimit) || 5;

    // 8. Hash access authorization keys if specified by client uploads
    let securePassHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      securePassHash = await bcrypt.hash(password, salt);
    }

    // 9. Document data profile specifications straight into the DB system node records
    const fileRecord = await File.create({
      user: req.user._id,
      name: req.file.originalname,
      size: formatBytes(req.file.size),
      filenameOnDisk: uniqueFilename,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      expiryAt,
      downloadLimit: totalDownloads,
      downloadsRemaining: totalDownloads,
      password: securePassHash,
      isPasswordProtected: !!password
    });

    return res.status(201).json({
      message: 'Zero-knowledge binary cryptographically isolated',
      fileId: fileRecord._id // Cleanly maps straight to the frontend navigate destination target!
    });

  } catch (error) {
    console.error(`[Upload Processing Interruption Error]:`, error);
    return res.status(500).json({ message: 'AES-256 pipeline compilation processing breakdown' });
  }
};

// @desc    Verify Link token validity and return file metadata parameters safely
// @route   GET /api/files/verify/:id
export const verifyFileLink = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'Target structural link address not found.' });
    }

    if (file.isInvalid()) {
      return res.status(410).json({ message: 'Link validation thresholds breached or lifecycle expired.' });
    }

    return res.status(200).json({
      name: file.name,
      size: file.size,
      downloadsRemaining: file.downloadsRemaining,
      isPasswordProtected: file.isPasswordProtected
    });

  } catch (error) {
    return res.status(500).json({ message: 'Validation check integrity failure' });
  }
};

// @desc    Authorize decryption parameters and pipeline dynamic file download stream blocks
// @route   POST /api/files/download/:id
export const downloadFileStream = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'Target access identity mapping non-existent' });
    }

    if (file.isInvalid()) {
      return res.status(410).json({ message: 'The asset requested has crossed invalidation rules criteria' });
    }

    if (file.isPasswordProtected) {
      const { password } = req.body;
      if (!password) {
        return res.status(401).json({ message: 'Decryption operation rejected, password field missing' });
      }

      const match = await bcrypt.compare(password, file.password);
      if (!match) {
        return res.status(403).json({ message: 'Invalid decryption passphrase provided' });
      }
    }

    const targetFilePath = path.join(UPLOADS_DIR, file.filenameOnDisk);
    if (!fs.existsSync(targetFilePath)) {
      return res.status(404).json({ message: 'Physical encrypted file package block absent on machine server data pools' });
    }

    const encryptedBuffer = fs.readFileSync(targetFilePath);

    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(file.iv, 'hex');
    const authTag = Buffer.from(file.authTag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv);
    decipher.setAuthTag(authTag);

    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final()
    ]);

    file.downloadsRemaining = file.downloadsRemaining - 1;
    await file.save();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    
    return res.send(decryptedBuffer);

  } catch (error) {
    console.error(`[Decryption Routing Pipeline Error]:`, error);
    return res.status(500).json({ message: 'Decryption pipeline failure, structural data manipulation check triggered.' });
  }
};

export const getFileMetadata = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });

    if (!file) {
      return res.status(404).json({ message: 'Target secure record profile not found' });
    }

    // Return human-readable configuration parameters straight back to dashboard trackers
    return res.status(200).json({
      name: file.name,
      size: file.size,
      expiry: file.expiryAt, 
      downloadLimit: file.downloadLimit,
      downloadsRemaining: file.downloadsRemaining,
      isPasswordProtected: file.isPasswordProtected
    });
  } catch (error) {
    console.error(`[Metadata Mapping Read Error]:`, error);
    return res.status(500).json({ message: 'Structural database metadata access restriction anomaly' });
  }
};