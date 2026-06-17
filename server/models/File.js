import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String, // Pre-formatted string e.g., "4.82 MB"
    required: true,
  },
  filenameOnDisk: {
    type: String,
    required: true, // Points to the actual encrypted payload file name
  },
  iv: {
    type: String,
    required: true, // Initialization vector used to safely seed the AES decryption block
  },
  authTag: {
    type: String,
    required: true, // GCM authentication tag verifying absolute block integrity
  },
  expiryAt: {
    type: Date,
    required: true, // Expiration clock boundary rule evaluation target
  },
  downloadLimit: {
    type: Number,
    required: true,
    default: 5,
  },
  downloadsRemaining: {
    type: Number,
    required: true,
  },
  password: {
    type: String, // Optional hashed password protecting server-side asset stream execution
    default: null,
  },
  isPasswordProtected: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Check if a specific file instance has expired or reached zero remaining downloads
fileSchema.methods.isInvalid = function () {
  return this.downloadsRemaining <= 0 || new Date() > this.expiryAt;
};

const File = mongoose.model('File', fileSchema);
export default File;