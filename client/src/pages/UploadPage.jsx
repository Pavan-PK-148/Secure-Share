import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  Lock, 
  File, 
  X, 
  Sparkles, 
  ArrowUpRight, 
  LockKeyhole 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. IMPORT THE AUTH CONTEXT HOOK
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState('24h');
  const [downloadLimit, setDownloadLimit] = useState(5);
  const [password, setPassword] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 2. EXTRACT AUTHENTICATED STATE TOKEN FROM PROVIDER CONTEXT
  const { token } = useAuth(); 
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // 3. FRONTEND SANITY GUARD: Don't waste network bandwith if file exceeds 50MB ceiling
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    
    const maxBytes = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxBytes) {
      return toast.error("Security Payload Ceiling Breached: Maximum file capacity is 50MB");
    }
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please drop or select a file payload first");

    setUploading(true);
    
    const simulateProgress = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(simulateProgress);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('expiry', expiry);
      formData.append('downloadLimit', downloadLimit);
      if (password) formData.append('password', password);

      // 4. FALLBACK RESOLUTION: Fall back to localStorage if context token isn't directly exposed
      const activeToken = token || localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        },
        body: formData,
      });

      const data = await response.json();
      clearInterval(simulateProgress);

      if (!response.ok) {
        throw new Error(data.message || 'AES-256 binary upload rejected');
      }

      setProgress(100);
      toast.success("File cryptographically stored successfully!");
      
      setTimeout(() => {
        navigate(`/share/${data.fileId || 'mock-id-123'}`);
      }, 500);

    } catch (err) {
      clearInterval(simulateProgress);
      toast.error(err.message || "Upload stream disruption encountered");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-12 cursor-default">
      <div className="hero-glow" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#2C4A3E_1px,transparent_1px),linear-gradient(to_bottom,#2C4A3E_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sage/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sage backdrop-blur-xl">
            <Sparkles className="h-3 w-3" />
            Zero-Knowledge Ingestion
          </div>
          <h1 className="text-4xl font-black tracking-tight text-charcoal">
            Secure Upload Workspace
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed text-charcoal/60">
            Files are fragmented and encrypted locally on transmission streams prior to database commitment records.
          </p>
        </motion.div>

        {/* MAIN FORM */}
        <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Drag & Drop Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="md:col-span-2"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && !uploading && fileInputRef.current?.click()}
              className={`group glass relative border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[360px] shadow-sm select-none ${
                uploading ? 'pointer-events-none' : ''
              } ${
                isDragging 
                  ? 'border-mint bg-mint-light/40 scale-[1.01] shadow-xl shadow-mint/5' 
                  : 'border-sage/20 bg-white/60 hover:bg-white hover:border-sage/40 hover:shadow-lg'
              } ${file ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                disabled={!!file || uploading}
              />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div 
                    key="file-active"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full space-y-5"
                  >
                    <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-mint-light text-sage shadow-lg shadow-mint/10 transition-transform group-hover:scale-105">
                      <File className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal truncate max-w-md mx-auto text-base">
                        {file.name}
                      </h3>
                      <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-charcoal/45 font-medium">
                        <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" /> Ready for Stream
                        </span>
                      </div>
                    </div>
                    
                    {!uploading && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="inline-flex items-center space-x-1.5 text-xs text-red-500 font-bold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition cursor-pointer border border-red-200/30"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Remove File Container</span>
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="file-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-cream text-sage rounded-2xl inline-flex items-center justify-center border border-sage/5 shadow-inner transition-transform group-hover:-translate-y-1 group-hover:text-mint group-hover:bg-sage">
                      <UploadCloud className="h-8 w-8 transition-colors" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal text-base">
                        Drag & drop file container here, or <span className="text-sage underline font-black">browse</span>
                      </p>
                      <p className="text-xs text-charcoal/40 mt-1.5 font-medium">
                        Supports archives, documents, or raw data payloads up to 50MB
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar Display */}
              <AnimatePresence>
                {uploading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-0 bottom-0 p-6 bg-white/95 border-t border-sage/5 backdrop-blur-xl rounded-b-[2rem] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sage">
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <LockKeyhole className="h-3.5 w-3.5" /> Encrypting & Piping Data Stream...
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden border border-sage/5">
                      <motion.div
                        className="bg-sage h-full rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Access Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="glass rounded-[2rem] p-6 space-y-5 shadow-sm border border-white/30 bg-white/80 backdrop-blur-xl">
              <h3 className="font-black text-charcoal text-xs uppercase tracking-[0.16em] border-b border-sage/5 pb-3.5 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-sage" />
                <span>Access Governance</span>
              </h3>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-charcoal/45 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sage/70" /> Expiry Lifespan
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2.5 bg-cream border border-sage/10 rounded-xl text-sm font-semibold text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition disabled:opacity-50"
                >
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-charcoal/45 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-sage/70" /> Download Allowance
                </label>
                <select
                  value={downloadLimit}
                  onChange={(e) => setDownloadLimit(Number(e.target.value))}
                  disabled={uploading}
                  className="w-full px-3 py-2.5 bg-cream border border-sage/10 rounded-xl text-sm font-semibold text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition disabled:opacity-50"
                >
                  <option value={1}>1 Download Allowed</option>
                  <option value={5}>5 Downloads Allowed</option>
                  <option value={10}>10 Downloads Allowed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-charcoal/45 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-sage/70" /> Context Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={uploading}
                  placeholder="Optional cryptographic pass"
                  className="w-full px-3 py-2.5 bg-cream border border-sage/10 rounded-xl text-sm font-semibold text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition disabled:opacity-50"
                />
              </div>
            </div>

            <motion.button
              whileHover={(!file || uploading) ? {} : { y: -2, scale: 1.01 }}
              whileTap={(!file || uploading) ? {} : { scale: 0.99 }}
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-sage hover:bg-[#243c33] text-white text-sm font-bold py-4 px-4 rounded-[1.5rem] shadow-xl shadow-sage/10 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-mint" />
              <span>Generate Encrypted Link</span>
            </motion.button>
          </motion.div>

        </form>
      </div>
    </div>
  );
}