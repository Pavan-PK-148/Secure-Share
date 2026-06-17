import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Key,
  Zap,
  Sliders,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  CloudCog,
  RefreshCw,
  Fingerprint,
  Trash2,
  Database,
  Lock,
  ChevronDown,
  HelpCircle,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Self-contained session state reader to guarantee compilation succeeds in all build sandboxes
const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setUser({ token: savedToken });
      }
    } catch (e) {
      console.warn("Storage access restricted:", e);
    }
  }, []);

  return { user };
};

function CustomCountUp({ end, duration = 2, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endVal = parseFloat(end);
    if (start === endVal) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / endVal));
    
    if (incrementTime < 10) incrementTime = 10;
    
    let timer = setInterval(() => {
      start += Math.ceil(endVal / (totalMiliseconds / incrementTime));
      if (start >= endVal) {
        clearInterval(timer);
        setCount(endVal);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  {
    icon: Key,
    title: 'Zero-Knowledge Encryption',
    description: 'Files undergo robust AES-256 symmetric key operations locally on your client machine before streaming into persistent infrastructure.',
    badge: 'AES-256'
  },
  {
    icon: Sliders,
    title: 'Download Restrictions',
    description: 'Configure volumetric download limits mapping instant token invalidation once downloading thresholds are completed.',
    badge: 'Volumetric'
  },
  {
    icon: Zap,
    title: 'Dynamic Expiry',
    description: 'Enforce strict temporary lifespans ranging from 1 hour up to 7 days, powered by an automated background system cron pruning task.',
    badge: 'Self-Destruct'
  },
  {
    icon: ShieldAlert,
    title: 'Password Firewalls',
    description: 'Provide an additional cryptographic validation layer. Receivers must input passphrases matching your local key values.',
    badge: 'Multi-Layer'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: 'easeOut',
    }
  })
};

export default function LandingPage() {
  const { user } = useAuth();
  
  // Interactive Key Simulator States
  const [simFileName, setSimFileName] = useState('project_specs.pdf');
  const [simProgress, setSimProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simKey, setSimKey] = useState('');
  const [simEncryptedHex, setSimEncryptedHex] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    generateMockCredentials();
  }, [simFileName]);

  const generateMockCredentials = () => {
    const chars = '0123456789ABCDEFabcdef';
    let keyResult = '';
    let hexResult = '';
    for (let i = 0; i < 32; i++) keyResult += chars[Math.floor(Math.random() * chars.length)];
    for (let i = 0; i < 48; i++) hexResult += chars[Math.floor(Math.random() * chars.length)];
    setSimKey(`0x${keyResult.toUpperCase()}`);
    setSimEncryptedHex(`U2FsdGVkX18${hexResult}...`);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimProgress(0);
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          generateMockCredentials();
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-cream selection:bg-sage selection:text-cream">
      {/* Absolute Beautiful Background Glow */}
      <div className="hero-glow" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          
          {/* Left Text Layer (Span 7) */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            {/* Custom Modern Badge */}
            <motion.div
              variants={fadeUp}
              custom={0.1}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm border border-sage/10"
            >
              <ShieldCheck className="h-4 w-4 text-sage" />
              <span className="text-xs font-semibold text-sage uppercase tracking-wider">
                Advanced Access Sovereignty Platform
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              custom={0.2}
              className="text-5xl md:text-7xl font-black tracking-tight text-charcoal leading-[1.1]"
            >
              Your Files. <br />
              <span className="text-sage">Under Your Strict</span> <br />
              <span className="relative">
                Control.
                <span className="absolute bottom-1 left-0 w-full h-3 bg-mint-light -z-10 rounded-full" />
              </span>
            </motion.h1>

            {/* Descriptive Pitch */}
            <motion.p
              variants={fadeUp}
              custom={0.3}
              className="text-lg leading-relaxed text-charcoal/70 max-w-xl"
            >
              SecureShare integrates local symmetric key file operations with zero-knowledge metadata pipelines. Share archives, PDFs, or private keys with exact expiry timers and automatic destruction.
            </motion.p>

            {/* Strategic CTAs */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to={user ? '/upload' : '/login'}
                className="group inline-flex items-center justify-center rounded-xl bg-sage px-8 py-4 font-semibold text-white shadow-xl shadow-sage/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-sage/95 cursor-pointer"
              >
                <span>{user ? 'Open Upload Hub' : 'Secure Your First Link'}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-sage/15 bg-white/60 px-8 py-4 font-semibold text-sage backdrop-blur-xl transition-all duration-300 hover:border-sage/30 hover:bg-white"
              >
                See Security Pipeline
              </a>
            </motion.div>

            {/* Realtime Live Counts Section */}
            <motion.div
              variants={fadeUp}
              custom={0.5}
              className="pt-8 border-t border-sage/10 grid grid-cols-3 gap-8"
            >
              <div>
                <h3 className="text-3xl font-black text-sage">
                  <CustomCountUp end={256} suffix="-bit" />
                </h3>
                <p className="mt-1 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">AES Protection</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-sage">
                  <CustomCountUp end={99} suffix=".9%" />
                </h3>
                <p className="mt-1 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Pruning Accuracy</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-sage">
                  <CustomCountUp end={100} suffix="%" />
                </h3>
                <p className="mt-1 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Zero-Knowledge</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Preview Interactive Interface (Span 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 45 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            {/* Background Blob Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-mint/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sage/10 rounded-full blur-2xl animate-pulse" />

            <div className="glass rounded-3xl border border-white/30 p-8 shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-sage/5">
                <div>
                  <h3 className="text-lg font-extrabold text-charcoal">Secure Pipeline</h3>
                  <p className="text-xs text-charcoal/50">Active end-to-end stream state</p>
                </div>
                <div className="rounded-2xl bg-mint-light p-3">
                  <LockKeyhole className="h-6 w-6 text-sage animate-pulse" />
                </div>
              </div>

              {/* Simulated States */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-center justify-between rounded-xl border border-sage/5 bg-white/75 p-3.5 hover:shadow-sm transition">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-mint-light p-2 text-sage"><CloudCog className="h-4 w-4" /></div>
                    <span className="text-sm font-semibold text-charcoal">Local Client Stream</span>
                  </div>
                  <span className="text-xs bg-mint text-sage px-2 py-0.5 rounded-md font-bold">Encrypted</span>
                </div>

                {/* Step 2 */}
                <div className="flex items-center justify-between rounded-xl border border-sage/5 bg-white/75 p-3.5 hover:shadow-sm transition">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-mint-light p-2 text-sage"><Fingerprint className="h-4 w-4" /></div>
                    <span className="text-sm font-semibold text-charcoal">Metadata Registration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-xs font-bold text-green-700">Isolated</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center justify-between rounded-xl border border-sage/5 bg-white/75 p-3.5 hover:shadow-sm transition">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-mint-light p-2 text-sage"><Database className="h-4 w-4" /></div>
                    <span className="text-sm font-semibold text-charcoal">Encrypted Storage</span>
                  </div>
                  <span className="text-xs text-charcoal/50 font-mono">Zero-Plaintext</span>
                </div>

                {/* Step 4 */}
                <div className="flex items-center justify-between rounded-xl border border-sage/5 bg-white/75 p-3.5 hover:shadow-sm transition">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-50 p-2 text-red-500"><Trash2 className="h-4 w-4" /></div>
                    <span className="text-sm font-semibold text-charcoal">Cron Self-Destruct</span>
                  </div>
                  <span className="text-xs text-red-600 font-bold uppercase tracking-wide">Automated</span>
                </div>
              </div>

              {/* Dashboard Snapshot Widget */}
              <div className="mt-8 rounded-2xl bg-sage p-5 text-white shadow-lg shadow-sage/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-mint">Crypto Status</span>
                    <h4 className="font-extrabold text-lg mt-1">Operational Sovereign</h4>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-mint" />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-cream/70 pt-3 border-t border-white/10">
                  <span>Authorized Token Session</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded">VERIFIED</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="overflow-hidden rounded-[2.5rem] border border-sage/10 bg-white p-8 shadow-xl md:p-12">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-6">
              <span className="rounded-full bg-mint-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-sage">
                Interactive Dev Tool
              </span>

              <h2 className="text-3xl font-black leading-tight">
                Simulate Local AES Encryption
              </h2>

              <p className="text-sm leading-relaxed text-charcoal/70">
                Witness how SecureShare encrypts your
                documents before transmission.
              </p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={simFileName}
                  onChange={(e) =>
                    setSimFileName(e.target.value)
                  }
                  className="w-full rounded-2xl border border-sage/10 bg-cream/60 px-4 py-4 text-sm outline-none transition focus:border-sage"
                />

                <button
                  onClick={handleRunSimulation}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sage px-5 py-4 font-semibold text-white transition hover:bg-[#1f352c]"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isSimulating
                        ? 'animate-spin'
                        : ''
                    }`}
                  />

                  {isSimulating
                    ? 'Encrypting Payload...'
                    : 'Initialize Encryption'}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-charcoal p-6 font-mono text-xs text-sky-300 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4 text-white/50">
                <span className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  SECURESHARE COMPILER v4.3
                </span>

                <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">
                  LOCAL SESSION
                </span>
              </div>

              {isSimulating ? (
                <div className="space-y-3">
                  <p className="text-yellow-400">
                    Generating symmetric keys...
                  </p>

                  <div className="h-2 overflow-hidden rounded bg-white/10">
                    <div
                      className="h-full bg-mint transition-all"
                      style={{
                        width: `${simProgress}%`,
                      }}
                    />
                  </div>

                  <p className="text-white/50">
                    Buffering chunks...
                    {simProgress}%
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    AES-256 handshake complete
                  </p>

                  <div className="break-all rounded-xl border border-white/5 bg-white/5 p-3 text-white">
                    {simKey}
                  </div>

                  <div className="break-all rounded-xl border border-white/5 bg-white/5 p-3 text-yellow-300">
                    {simEncryptedHex}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black">
            Uncompromising Security Layers
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-charcoal/60">
            Designed for enterprise-grade encrypted file
            delivery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                whileHover={{
                  y: -8,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                viewport={{
                  once: true,
                }}
                className="glass group rounded-3xl border border-white/20 p-7 shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <span className="rounded-full bg-mint-light px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sage">
                  {feature.badge}
                </span>

                <h3 className="mt-4 text-xl font-black">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative z-10 max-w-5xl mx-auto px-6 py-20"
      >
        <div className="mb-16 text-center">
          <span className="rounded-full bg-mint-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-sage">
            Operational Lifecycle
          </span>

          <h2 className="mt-4 text-4xl font-black">
            The Flow of an Encrypted Byte
          </h2>
        </div>

        <div className="relative space-y-12 before:absolute before:left-8 before:top-0 before:h-full before:w-0.5 before:bg-sage/10">
          {[
            {
              step: '01',
              title:
                'Local File Processing',
              desc:
                'The browser generates random symmetric keys and encrypts the file locally.',
            },

            {
              step: '02',
              title:
                'Isolated Upload Validation',
              desc:
                'Only encrypted output streams leave your device.',
            },

            {
              step: '03',
              title:
                'Key Expiries & Passphrases',
              desc:
                'Share links receive configurable security rules.',
            },

            {
              step: '04',
              title:
                'Automated Cleanups',
              desc:
                'Expired encrypted payloads are automatically destroyed.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative z-10 flex items-start gap-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage text-lg font-black text-white shadow-lg">
                {item.step}
              </div>

              <div className="flex-grow rounded-3xl border border-sage/10 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-black">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      {/* Strategic Security FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="h-8 w-8 text-sage mx-auto mb-3" />
          <h2 className="text-3xl font-black text-charcoal">Security FAQ</h2>
          <p className="text-charcoal/50 mt-2 text-sm">Critical technical questions answered plainly by our development architecture team.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Can SecureShare developers or host server administrators read my uploaded file contents?",
              a: "Absolutely not. The AES-256 process happens in-memory locally. By the time the file reaches backend infrastructure streams, it is an indecipherable cipher block. Your browser owns the master keys."
            },
            {
              q: "What happens when a file reaches its maximum download limit or expires?",
              a: "The metadata is instantly flagged as void in our database. Following this status change, the server permanently deletes the raw encrypted binary from standard blocks, ensuring zero remaining traces."
            },
            {
              q: "Why is an optional secondary password recommended?",
              a: "Adding a dynamic firewall passphrase means that even if someone gets unauthorized physical access to your sharing link, they still cannot request decryptions without the secondary credentials."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border border-sage/5 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-charcoal hover:bg-cream/20 transition cursor-pointer"
                type="button"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-sage transition-transform ${activeFaq === idx ? 'transform rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-xs text-charcoal/70 leading-relaxed border-t border-cream/50 bg-cream/10">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* COMPACT PREMIUM CTA SECTION */}
<section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="relative overflow-hidden rounded-[2rem]"
  >
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#1E342C] via-sage to-[#14241E]" />

    {/* Glow */}
    <div className="absolute -top-20 -left-20 h-52 w-52 rounded-full bg-mint/20 blur-3xl" />

    <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

    {/* Grid Overlay */}
    <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:26px_26px]" />

    {/* Content */}
    <div className="relative z-10 px-8 py-12 md:px-14 md:py-14 text-center">
      {/* Badge */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
        <ShieldCheck className="h-4 w-4 text-mint" />

        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
          Enterprise Encryption
        </span>
      </div>

      {/* Heading */}
      <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
        Ready to Secure Your
        <span className="block bg-gradient-to-r from-mint via-white to-mint-light bg-clip-text text-transparent">
          Confidential File Transfers?
        </span>
      </h2>

      {/* Description */}
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
        Share sensitive documents, encrypted archives, and
        private assets with military-grade AES-256 security
        and zero-knowledge architecture.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to={user ? '/upload' : '/register'}
          className="group inline-flex items-center justify-center rounded-2xl bg-mint px-7 py-3.5 text-sm font-bold text-sage shadow-xl shadow-mint/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white"
        >
          <span>
            {user
              ? 'Open Secure Workspace'
              : 'Initialize Platform Gateway'}
          </span>

          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
        >
          Existing User Login
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 border-t border-white/10 pt-6">
        {[
          'AES-256 Encryption',
          'Zero-Knowledge Storage',
          'Expiring Share Links',
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-white/65"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-mint" />

            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
</section>

    </div>
  );
}