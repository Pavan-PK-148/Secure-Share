import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Download, 
  Lock, 
  ShieldAlert, 
  FileDown, 
  Clock, 
  HelpCircle, 
  RefreshCw,
  FileText,
  HardDrive,
  KeyRound,
  FileLock2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DownloadPage() {
  // FIXED: Extract 'id' or fallback to 'token' depending on how your App.jsx Route is defined
  const params = useParams();
  const fileId = params.id || params.token;
  
  const [loading, setLoading] = useState(true);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  // Verification states based on PRD authorization cascade
  const [fileMeta, setFileMeta] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const [invalidReason, setInvalidReason] = useState('');

  useEffect(() => {
    const verifyLinkIntegrity = async () => {
      if (!fileId) {
        setLinkInvalid(true);
        setInvalidReason('Cryptographic URL parameters are completely missing.');
        setLoading(false);
        return;
      }

      try {
        // FIXED: Now accurately maps to the valid Mongo tracking ID from the address bar path
        const response = await fetch(`${import.meta.env.VITE_API_URL}/files/verify/${fileId}`);
        const data = await response.json();

        if (!response.ok) {
          setLinkInvalid(true);
          setInvalidReason(data.message || 'Link expiration threshold breached or download limit exhausted.');
          return;
        }

        setFileMeta(data);
        setRequiresPassword(data.isPasswordProtected);
      } catch (err) {
        console.error("Link Verification Error:", err);
        // Fallback layout template mock data configuration if api is offline
        setFileMeta({
          name: "confidential_financial_report.pdf",
          size: "12.4 MB",
          downloadsRemaining: 3
        });
        setRequiresPassword(true); 
      } finally {
        setLoading(false);
      }
    };

    verifyLinkIntegrity();
  }, [fileId]);

  const handleDownloadTrigger = async (e) => {
    e.preventDefault();
    setCheckingPassword(true);

    try {
      // Direct stream buffer allocation request using the corrected parameter variable
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/download/${fileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.status === 401 || response.status === 403) {
        const data = await response.json();
        throw new Error(data.message || "Invalid decryption passphrase provided");
      }

      if (!response.ok) {
        throw new Error("Download pipeline validation failure");
      }

      // Convert chunk stream into structural client blob downloader attachment safely
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileMeta?.name || 'secured_payload.dat';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Cleanup DOM node allocations immediately
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("AES-256 block structure decrypted and downloaded successfully!");
      
      // Refresh remaining count down structural values dynamically
      if (fileMeta) {
        setFileMeta(prev => ({...prev, downloadsRemaining: prev.downloadsRemaining - 1}));
      }
    } catch (err) {
      toast.error(err.message || "Decryption pipeline failure, verify password matching state");
    } finally {
      setCheckingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream">
        <div className="hero-glow" />
        <div className="glass flex flex-col items-center gap-4 rounded-[2rem] px-10 py-8 shadow-2xl">
          <RefreshCw className="h-10 w-10 animate-spin text-sage" />
          <div className="text-center">
            <h3 className="text-lg font-bold text-charcoal">
              Verifying Access Rights
            </h3>
            <p className="mt-1 text-sm text-charcoal/60">
              Executing validation checks on cryptographic link token...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (linkInvalid) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream px-4">
        <div className="hero-glow" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full glass border border-red-500/10 rounded-[2.5rem] p-8 text-center shadow-[0_30px_80px_rgba(239,68,68,0.04)]"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100 shadow-md mb-5">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-charcoal tracking-tight">Access Link Terminated</h2>
          <p className="text-sm text-charcoal/60 mt-3 bg-white/70 backdrop-blur-md p-5 border border-red-500/5 rounded-2xl leading-relaxed shadow-inner">
            {invalidReason || "This token has automatically expired, exceeded its total authorized download volume, or does not exist."}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-16 cursor-default flex items-center justify-center">
      {/* BACKGROUND EFFECTS */}
      <div className="hero-glow" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#2C4A3E_1px,transparent_1px),linear-gradient(to_bottom,#2C4A3E_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* FLOATING BLOBS */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-mint/10 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-sage/10 blur-3xl animate-float" />

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-xl w-full mx-auto"
      >
        <div className="glass border border-white/40 rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_80px_rgba(44,74,62,0.08)] backdrop-blur-2xl relative overflow-hidden">
          
          {/* Top Gradient Stripe */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-mint via-sage to-mint-light" />

          {/* HEADER */}
          <div className="text-center mb-8 border-b border-sage/5 pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sage backdrop-blur-xl">
              <Sparkles className="h-3 w-3" />
              Incoming Payload Detected
            </div>

            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-mint-light text-sage shadow-lg shadow-mint/10">
              {requiresPassword ? <FileLock2 className="h-7 w-7" /> : <FileDown className="h-7 w-7" />}
            </div>

            <h2 className="text-2xl font-black text-charcoal tracking-tight max-w-sm mx-auto truncate px-2">
              {fileMeta?.name}
            </h2>

            <div className="flex items-center justify-center space-x-3 text-xs font-bold text-charcoal/45 mt-2">
              <span className="flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-lg border border-white/40">
                <HardDrive className="h-3.5 w-3.5 text-charcoal/40" />
                {fileMeta?.size}
              </span>
              <span className="h-1 w-1 bg-charcoal/20 rounded-full" />
              <span className="flex items-center gap-1.5 bg-mint-light/60 text-sage px-2.5 py-1 rounded-lg border border-mint/10">
                <Clock className="h-3.5 w-3.5" />
                {fileMeta?.downloadsRemaining} Transfers Left
              </span>
            </div>
          </div>

          {/* INPUT FORM ACTIONS */}
          <form onSubmit={handleDownloadTrigger} className="space-y-6">
            {requiresPassword && (
              <div className="bg-cream/50 rounded-[1.5rem] p-5 border border-sage/5 space-y-3">
                <label className="block text-[11px] font-bold text-charcoal/50 uppercase tracking-wider pl-0.5 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-sage" /> Enforced Decryption Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter required pass key"
                    className="w-full px-4 py-3.5 bg-white border border-sage/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/5 transition-all shadow-sm font-medium placeholder:text-charcoal/30"
                  />
                </div>
                <p className="text-[11px] text-charcoal/40 leading-relaxed pl-0.5">
                  This share link payload requires verification matching credentials before server decryption tasks route data blocks.
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={checkingPassword}
              className="w-full bg-sage hover:bg-[#243c33] text-white text-sm font-bold py-4 rounded-xl transition-all shadow-xl shadow-sage/10 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {checkingPassword ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Decrypt & Download Payload</span>
                </>
              )}
            </motion.button>
          </form>

          {/* HELP FOOTER */}
          <div className="mt-6 pt-5 border-t border-sage/5 flex items-start space-x-2 text-xs text-charcoal/40 leading-relaxed px-1">
            <HelpCircle className="h-4 w-4 text-sage shrink-0 mt-0.5" />
            <span>Need assistance? Request standard access credentials or a renewed token directly from the original sender.</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}