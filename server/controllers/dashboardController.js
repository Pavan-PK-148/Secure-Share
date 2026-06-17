import File from '../models/File.js';

// Helper to convert dynamic standard formatted text sizes back into raw bytes for statistical addition
const parseSizeToBytes = (sizeStr) => {
  if (!sizeStr) return 0;
  const num = parseFloat(sizeStr);
  const unit = sizeStr.replace(/[0-9. ]/g, '').toUpperCase();
  
  if (unit.includes('KB')) return num * 1024;
  if (unit.includes('MB')) return num * 1024 * 1024;
  if (unit.includes('GB')) return num * 1024 * 1024 * 1024;
  return num; // Default bytes fallback
};

// Helper to re-compile numerical calculations back into premium layout metrics text
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// @desc    Retrieve combined historical and aggregate file analysis profiles
// @route   GET /api/dashboard/overview
export const getDashboardOverview = async (req, res) => {
  try {
    // 1. Fetch complete records explicitly mapped to the authenticated user identity
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });

    let activeVolumeBytes = 0;
    let totalPayloadTransfersCount = files.length;
    let activeLinksCount = 0;

    // 2. Compute runtime analysis states line by line
    const computedHistoryList = files.map(file => {
      const isStale = file.isInvalid();
      const fileBytes = parseSizeToBytes(file.size);

      if (!isStale) {
        activeLinksCount++;
        activeVolumeBytes += fileBytes;
      }

      return {
        id: file._id,
        name: file.name,
        size: file.size,
        downloadsRemaining: file.downloadsRemaining,
        downloadLimit: file.downloadLimit,
        expiryAt: file.expiryAt,
        isPasswordProtected: file.isPasswordProtected,
        isExpired: isStale,
        createdAt: file.createdAt
      };
    });

    // 3. Return a clean telemetry manifest payload directly to your React components
    return res.status(200).json({
      metrics: {
        totalUploads: totalPayloadTransfersCount,
        activeLinks: activeLinksCount,
        totalStorageUsed: formatBytes(activeVolumeBytes),
      },
      history: computedHistoryList
    });

  } catch (error) {
    console.error(`[Dashboard Metric Calculation Interruption]:`, error);
    return res.status(500).json({ message: 'Telemetry calculation pipeline encountered a system compilation error.' });
  }
};

// @desc    Instantly revoke active links and purge files manually
// @route   DELETE /api/dashboard/revoke/:id
export const revokeFileLink = async (req, res) => {
  try {
    // Locate target node while enforcing strict identity constraints
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });

    if (!file) {
      return res.status(404).json({ message: 'Target package resource not found or unauthorized' });
    }

    // Force authorization limits to absolute zero to disable future client handshake validation pipelines
    file.downloadsRemaining = 0;
    file.expiryAt = new Date(); // Hard clamp clock index to current date context
    await file.save();

    return res.status(200).json({ message: 'Cryptographic node access paths invalidated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Node access disruption routine processing breakdown.' });
  }
};