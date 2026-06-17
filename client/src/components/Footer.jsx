import React from 'react';

import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

import { ShieldCheck } from 'lucide-react';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-sage text-white">
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,181,0.10),transparent_45%)] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:26px_26px]" />

      {/* Top Glow Border */}
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-mint/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* MAIN SECTION */}
        <div className="flex flex-col items-center justify-between gap-10 py-12 lg:flex-row">
          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            viewport={{
              once: true,
            }}
            className="max-w-md"
          >
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-sage shadow-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  SecureShare
                </h3>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mint/80">
                  Secure File Distribution
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              SecureShare provides encrypted file transfer
              pipelines with dynamic expiry policies,
              download governance, password protection,
              and zero-knowledge architecture.
            </p>

            {/* TAGS */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                'AES-256',
                'Zero-Knowledge',
                'Encrypted Sharing',
              ].map((item, index) => (
                <span
                  key={index}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-mint backdrop-blur-xl"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="flex flex-col items-center lg:items-end"
          >
            {/* HEADING */}
            <span className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-mint/80">
              Connect & Explore
            </span>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3">
              {/* YOUTUBE */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <FaYoutube className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* LINKEDIN */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <FaLinkedin className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* GITHUB */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-mint/30 hover:bg-mint/10 hover:text-mint"
              >
                <FaGithub className="transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>

            {/* STATUS */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-mint animate-pulse" />

                <span className="text-sm font-medium text-white/75">
                  End-to-End Encryption Active
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/8 py-5">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            {/* COPYRIGHT */}
            <p className="text-sm text-white/55">
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-mint">
                SecureShare
              </span>
              . All rights reserved.
            </p>

            {/* LINKS */}
            <div className="flex items-center gap-5 text-sm text-white/55">
              <button className="transition hover:text-mint">
                Privacy
              </button>

              <button className="transition hover:text-mint">
                Security
              </button>

              <button className="transition hover:text-mint">
                Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}