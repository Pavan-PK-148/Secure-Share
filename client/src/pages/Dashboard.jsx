import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  FileText,
  Trash2,
  Clock,
  Key,
  BarChart3,
  Download,
  RefreshCw,
  Layers,
  ShieldCheck,
  Activity,
  LockKeyhole,
  ArrowUpRight,
  Sparkles,
  Database,
  Shield,
  HardDrive,
  TimerReset,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({
    totalUploads: 0,
    activeLinks: 0,
    totalStorageUsed: '0 Bytes',
  });

  const cursorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [revocationTarget, setRevocationTarget] = useState(null);
  const [activeQrFile, setActiveQrFile] = useState(null);

  /* FETCH DASHBOARD METRICS FROM BACKEND */
  const fetchDashboardMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/overview`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error processing metrics');
      }

      setFiles(data.history || []);
      setStats(
        data.metrics || {
          totalUploads: 0,
          activeLinks: 0,
          totalStorageUsed: '0 Bytes',
        }
      );
    } catch (err) {
      toast.error(err.message || 'Failed to sync with real-time metrics server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  /* CURSOR EFFECT */
  useEffect(() => {
    const moveCursor = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  /* EXECUTE REVOCATION ENGINE */
  const executeRevocation = async (fileId) => {
    setRevocationTarget(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/revoke/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Revocation engine failure');
      }

      toast.success('Cryptographic access paths invalidated.');
      
      // Refresh telemetry automatically after a revocation event
      fetchDashboardMetrics();
    } catch (err) {
      toast.error(err.message || 'Payload revocation routine broken.');
    }
  };

  // Helper function to format the dates cleanly inside rows
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to parse remaining hours or days cleanly
  const formatExpiryDisplay = (isExpired, expiryAt) => {
    if (isExpired) return 'Expired';
    const diffMs = new Date(expiryAt) - new Date();
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours} Hours left`;
    
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays} Days left`;
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream">
        <div className="hero-glow" />
        <div className="glass flex flex-col items-center gap-4 rounded-[2rem] px-10 py-8 shadow-2xl">
          <RefreshCw className="h-10 w-10 animate-spin text-sage" />
          <div className="text-center">
            <h3 className="text-lg font-bold text-charcoal">Initializing Control Hub</h3>
            <p className="mt-1 text-sm text-charcoal/60">Synchronizing encrypted object metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream cursor-default">
      {/* BACKGROUND */}
      <div className="hero-glow" />

      {/* CURSOR GLOW */}
      <motion.div
        ref={cursorRef}
        animate={{
          x: mousePosition.x - 180,
          y: mousePosition.y - 180,
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 180,
          mass: 0.6,
        }}
        className="pointer-events-none fixed left-0 top-0 z-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(163,230,181,0.18)_0%,rgba(163,230,181,0.08)_35%,transparent_72%)] blur-3xl"
      />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#2C4A3E_1px,transparent_1px),linear-gradient(to_bottom,#2C4A3E_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* FLOATING BLOBS */}
      <div className="absolute top-20 left-0 h-72 w-72 rounded-full bg-mint/30 blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sage/10 blur-3xl animate-float" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sage shadow-xl shadow-sage/10">
              <LayoutDashboard className="h-8 w-8 text-mint" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sage/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sage backdrop-blur-xl">
                <Sparkles className="h-3 w-3" />
                Secure Analytics Node
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-charcoal">Analytical Control Hub</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
                Monitor encrypted payload operations, expiring transfer links, access governance, and delivery activity in real time.
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div className="glass flex items-center gap-4 rounded-3xl px-6 py-5 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-light">
              <Activity className="h-6 w-6 text-sage" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal/45">Infrastructure Status</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold text-sage">Secure Systems Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: 'Total Managed Objects',
              value: stats.totalUploads,
              desc: 'Encrypted payload records',
              bg: 'bg-white',
            },
            {
              icon: Key,
              title: 'Active Secure Links',
              value: stats.activeLinks,
              desc: 'Operational share tokens',
              bg: 'bg-sage',
              light: true,
            },
            {
              icon: BarChart3,
              title: 'Storage Volume Allocation',
              value: stats.totalStorageUsed,
              desc: 'Cumulative encrypted storage footprint',
              bg: 'bg-white',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/30 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_25px_80px_rgba(44,74,62,0.14)] ${item.bg} ${item.light ? 'text-white' : 'text-charcoal'}`}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  <div className="absolute -left-20 top-0 h-full w-32 rotate-12 bg-white/20 blur-2xl transition-all duration-1000 group-hover:left-[120%]" />
                </div>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-mint/10 blur-3xl" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${item.light ? 'text-white/60' : 'text-charcoal/45'}`}>
                      {item.title}
                    </p>
                    <h3 className="mt-4 text-4xl font-black">{item.value}</h3>
                    <p className={`mt-2 text-sm ${item.light ? 'text-white/70' : 'text-charcoal/60'}`}>{item.desc}</p>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.light ? 'bg-white/10' : 'bg-mint-light'}`}>
                    <Icon className={`h-7 w-7 ${item.light ? 'text-mint' : 'text-sage'}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* QUICK INSIGHTS */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div whileHover={{ y: -6 }} className="glass rounded-[2rem] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage">
                <Shield className="h-7 w-7 text-mint" />
              </div>
              <span className="rounded-full bg-mint-light px-3 py-1 text-xs font-bold text-sage">Protected</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-charcoal">Encryption Integrity</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
              All managed objects are continuously monitored through AES-256 verification protocols.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="glass rounded-[2rem] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-light">
                <HardDrive className="h-7 w-7 text-sage" />
              </div>
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-white">Cloud Synced</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-charcoal">Secure Storage</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
              Distributed encrypted object persistence with automated expiry pruning and cleanup.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="glass rounded-[2rem] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage">
                <TimerReset className="h-7 w-7 text-mint" />
              </div>
              <span className="rounded-full bg-mint-light px-3 py-1 text-xs font-bold text-sage">Automated</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-charcoal">Lifecycle Cleanup</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
              Expired and exhausted transfer links are automatically purged by background db rules.
            </p>
          </motion.div>
        </div>

        {/* MAIN TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass relative overflow-hidden rounded-[2rem] border border-white/30 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,230,181,0.12),transparent_35%)] pointer-events-none" />

          {/* HEADER */}
          <div className="flex flex-col gap-4 border-b border-sage/5 bg-white/70 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-sage" />
                <h3 className="text-lg font-black text-charcoal">Encrypted Object Registry</h3>
              </div>
              <p className="mt-1 text-sm text-charcoal/55">Active and archived encrypted file objects.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-sage/10 bg-cream px-4 py-2 text-sm font-semibold text-charcoal/70">
              <ShieldCheck className="h-4 w-4 text-sage" />
              {files.length} Registered Payloads
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-sage/5 bg-cream/40 text-xs uppercase tracking-[0.16em] text-charcoal/45">
                  <th className="px-6 py-5 font-bold">File Metadata</th>
                  <th className="px-6 py-5 font-bold">Upload Date</th>
                  <th className="px-6 py-5 font-bold">Transfer Metrics</th>
                  <th className="px-6 py-5 font-bold">Expiry Lifecycle</th>
                  <th className="px-6 py-5 font-bold">Security</th>
                  <th className="px-6 py-5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/5">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-sm text-charcoal/40 font-medium">
                      No encrypted objects initialized yet. Head to the upload station to share a file.
                    </td>
                  </tr>
                ) : (
                  files.map((fileItem, index) => (
                    <motion.tr
                      key={fileItem.id || fileItem._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="group transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-xl"
                    >
                      {/* FILE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-light shadow-lg shadow-mint/20 transition-all duration-300 group-hover:scale-105">
                            <FileText className="h-5 w-5 text-sage" />
                          </div>
                          <div>
                            <p className="max-w-xs truncate font-semibold text-charcoal">{fileItem.name}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-charcoal/45">
                              <ArrowUpRight className="h-3 w-3" />
                              Payload size: {fileItem.size}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5">
                        <span className="rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-charcoal/65">
                          {formatDate(fileItem.createdAt)}
                        </span>
                      </td>

                      {/* METRICS */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                          <Download className="h-4 w-4 text-sage" />
                          {fileItem.downloadLimit - fileItem.downloadsRemaining}
                          <span className="text-charcoal/35">/</span>
                          <span className="text-charcoal/45">{fileItem.downloadLimit}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage/5">
                          <div
                            className="h-full rounded-full bg-sage"
                            style={{
                              width: `${((fileItem.downloadLimit - fileItem.downloadsRemaining) / fileItem.downloadLimit) * 100}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* EXPIRY */}
                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                            fileItem.isExpired ? 'bg-red-50 text-red-500' : 'bg-mint-light text-sage'
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {formatExpiryDisplay(fileItem.isExpired, fileItem.expiryAt)}
                        </div>
                      </td>

                      {/* SECURITY */}
                      <td className="px-6 py-5">
                        <div
                          className={`flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                            fileItem.isPasswordProtected ? 'bg-sage text-white' : 'bg-cream text-charcoal/60'
                          }`}
                        >
                          <LockKeyhole className="h-3.5 w-3.5" />
                          {fileItem.isPasswordProtected ? 'Protected' : 'Open'}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* QR CODE GENERATOR BUTTON */}
                          <button
                            onClick={() => {
                              const downloadUrl = `${window.location.origin}/download/${fileItem.id || fileItem._id}`;
                              setActiveQrFile({ name: fileItem.name, url: downloadUrl });
                            }}
                            disabled={fileItem.isExpired}
                            className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sage/10 bg-white/70 text-charcoal/45 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-sage/30 hover:bg-mint-light hover:text-sage hover:shadow-lg disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-white/70 disabled:hover:text-charcoal/45 disabled:cursor-not-allowed cursor-pointer"
                            title="Generate Share QR Link"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16V21H16"/><path d="M21 16H16V21"/><rect width="1" height="1" x="9" y="9"/><rect width="1" height="1" x="14" y="14"/><rect width="1" height="1" x="14" y="9"/><rect width="1" height="1" x="9" y="14"/></svg>
                          </button>

                          {/* REVOCATION BUTTON */}
                          <button
                            onClick={() => setRevocationTarget(fileItem)}
                            disabled={fileItem.isExpired}
                            className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sage/10 bg-white/70 text-charcoal/45 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-red-200 hover:bg-red-50 hover:text-red-500 hover:shadow-lg disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-white/70 disabled:hover:text-charcoal/45 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FOOTER STATUS */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-sage/10 bg-white/60 px-6 py-5 backdrop-blur-xl md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage">
              <ShieldCheck className="h-6 w-6 text-mint" />
            </div>
            <div>
              <h4 className="font-bold text-charcoal">SecureShare Protection Layer</h4>
              <p className="text-sm text-charcoal/55">Continuous encrypted object governance and automated lifecycle protection.</p>
            </div>
          </div>
          <button 
            onClick={fetchDashboardMetrics}
            className="group inline-flex items-center gap-2 rounded-2xl bg-sage px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sage/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#243c33] cursor-pointer"
          >
            <span>Sync Registry</span>
            <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
          </button>
        </div>
      </div>

      {/* QR CODE OVERLAY MODAL */}
      <AnimatePresence>
        {activeQrFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActiveQrFile(null)} 
              className="absolute inset-0 bg-charcoal/30 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              transition={{ type: 'spring', duration: 0.4 }}
              className="glass relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/40 bg-white/95 p-6 shadow-2xl text-charcoal text-center flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-sage/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-sage backdrop-blur-xl mb-3">
                <Sparkles className="h-3 w-3 text-sage" />
                Instant Wireless Routing
              </div>
              
              <h3 className="text-base font-black text-charcoal truncate w-full px-2" title={activeQrFile.name}>
                Share: {activeQrFile.name}
              </h3>
              <p className="text-xs text-charcoal/60 mt-2 mb-5 leading-relaxed">
                Scan this matrix code on any mobile device to grab the secure file payload entry instantly.
              </p>

              {/* QR BOX Container matching your glass styles */}
              <div className="p-4 bg-white rounded-2xl border border-sage/5 shadow-inner inline-block">
                <QRCodeSVG 
                  value={activeQrFile.url} 
                  size={180}
                  level={"M"}
                  fgColor={"#2C4A3E"} 
                  bgColor={"#FFFFFF"}
                />
              </div>

              <p className="mt-4 text-[10px] font-mono text-charcoal/40 bg-cream/50 border border-sage/5 rounded-xl p-2 w-full truncate select-all">
                {activeQrFile.url}
              </p>

              <button 
                onClick={() => setActiveQrFile(null)} 
                className="mt-6 w-full rounded-xl bg-sage py-3 text-sm font-semibold text-white shadow-lg shadow-sage/10 cursor-pointer hover:bg-[#243c33] transition-colors"
              >
                Dismiss Gateway
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {revocationTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRevocationTarget(null)}
              className="absolute inset-0 bg-charcoal/30 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="glass relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/40 bg-white/95 p-6 shadow-2xl text-charcoal"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-charcoal">Revoke Encrypted Object?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                    Are you sure you want to permanently revoke access token layers for <span className="font-semibold text-charcoal">{revocationTarget.name}</span>? This structural payload operation cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setRevocationTarget(null)}
                  className="rounded-xl border border-sage/10 bg-cream px-4 py-2.5 text-sm font-bold text-charcoal/70 transition-all hover:bg-sage/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeRevocation(revocationTarget.id || revocationTarget._id)}
                  className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 hover:-translate-y-0.5 cursor-pointer"
                >
                  Confirm Revocation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}