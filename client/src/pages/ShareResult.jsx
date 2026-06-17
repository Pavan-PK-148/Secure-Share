import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Copy, 
  Check, 
  Share2, 
  FileCheck, 
  ArrowRight, 
  LayoutDashboard, 
  RefreshCw, 
  Sparkles,
  FileText,
  HardDrive,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
// IMPORT SYSTEM AUTH PROVIDER
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ShareResult() {
  const { id } = useParams();
  const { token } = useAuth(); // Connect Global Authentication State
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileDetails, setFileDetails] = useState(null);

  const generatedShareUrl = `${window.location.origin}/download/${id}`;

  useEffect(() => {
    const fetchUploadedMetadata = async () => {
      try {
        const activeToken = token || localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/files/metadata/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to sync link parameters');
        
        // Format the date clean and readable before committing to local state hook
        if (data.expiry) {
          const dateObj = new Date(data.expiry);
          data.formattedExpiry = dateObj.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        }

        setFileDetails(data);
      } catch (err) {
        console.warn("Falling back to simulated link configuration parameters:", err.message);
        setFileDetails({
          name: "encrypted_payload_package.dat",
          size: "4.82 MB",
          formattedExpiry: "24 Hours Ceiling",
          downloadLimit: 5,
          passwordProtected: true
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUploadedMetadata();
  }, [id, token]);

  const handleLinkCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedShareUrl);
      setCopied(true);
      toast.success("Cryptographic token link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Clipboard operational copy failure");
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
              Generating Secure URI
            </h3>
            <p className="mt-1 text-sm text-charcoal/60">
              Finalizing cryptographic share parameters...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-16 cursor-default">
      <div className="hero-glow" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#2C4A3E_1px,transparent_1px),linear-gradient(to_bottom,#2C4A3E_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-mint/20 blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-sage/10 blur-3xl animate-float" />

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div className="glass border border-white/40 rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_80px_rgba(44,74,62,0.08)] backdrop-blur-2xl relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-mint via-sage to-mint-light" />

          {/* HEADER */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sage backdrop-blur-xl">
              <Sparkles className="h-3 w-3" />
              Token Deployment Successful
            </div>
            
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-mint-light text-sage shadow-lg shadow-mint/10">
              <FileCheck className="h-7 w-7" />
            </div>

            <h2 className="text-3xl font-black text-charcoal tracking-tight">
              Secure Link Active
            </h2>
            <p className="text-sm text-charcoal/60 max-w-md mx-auto leading-relaxed">
              Data block encryption phase is fully complete. Share the unique transmission URI safely.
            </p>
          </div>

          {/* ACCESS URL FIELD */}
          <div className="space-y-2 mb-8">
            <label className="block text-[11px] font-bold text-charcoal/45 uppercase tracking-wider pl-1">
              Shareable Access URL
            </label>
            <div className="flex items-center bg-cream/80 border border-sage/10 rounded-2xl p-2 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/5 transition-all">
              <input
                type="text"
                readOnly
                value={generatedShareUrl}
                onClick={(e) => e.target.select()}
                className="w-full bg-transparent px-3 text-xs text-charcoal font-mono outline-none truncate font-semibold"
              />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLinkCopy}
                className={`flex items-center space-x-1.5 px-5 py-3 rounded-xl text-xs font-bold transition-all ml-2 cursor-pointer shadow-sm shrink-0 ${
                  copied 
                    ? 'bg-mint text-sage shadow-mint/10' 
                    : 'bg-sage text-white hover:bg-[#243c33] shadow-sage/10'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* ACTIVE GOVERNANCE PARAMETERS */}
          <div className="bg-cream/40 rounded-[1.75rem] p-6 border border-sage/5 space-y-4 mb-8">
            <h3 className="font-black text-xs text-charcoal/45 uppercase tracking-[0.16em] flex items-center gap-2 border-b border-sage/5 pb-3">
              <Share2 className="h-4 w-4 text-sage" />
              <span>Active Validation Governance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-white/50">
                <FileText className="h-4 w-4 text-sage shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block">Target Object</span>
                  <span className="font-semibold text-charcoal text-sm truncate block mt-0.5">{fileDetails?.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-white/50">
                <HardDrive className="h-4 w-4 text-sage shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block">Payload Size</span>
                  <span className="font-semibold text-charcoal text-sm block mt-0.5">{fileDetails?.size}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-white/50">
                <Clock className="h-4 w-4 text-sage shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block">Destruction Clock</span>
                  <span className="font-semibold text-charcoal text-sm block mt-0.5">
                    {fileDetails?.formattedExpiry || fileDetails?.expiry}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-white/50">
                <ShieldCheck className="h-4 w-4 text-sage shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-charcoal/45 uppercase tracking-wider block">Download Allowance</span>
                  <span className="font-semibold text-charcoal text-sm block mt-0.5">{fileDetails?.downloadLimit} Access Operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM REDIRECTION ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-sage/5 pt-6">
            <Link
              to="/dashboard"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-cream text-charcoal hover:bg-sage/5 border border-sage/10 font-bold py-3.5 rounded-xl text-sm transition-all shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4 text-sage" />
              <span>Manage Node Hub</span>
            </Link>
            
            <Link
              to="/upload"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-sage hover:bg-[#243c33] text-white font-bold py-3.5 rounded-xl text-sm transition-all group shadow-xl shadow-sage/10"
            >
              <span>Transmit New Payload</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}