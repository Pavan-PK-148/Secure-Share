import React from 'react';
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

import {
  UploadCloud,
  LayoutDashboard,
  LogOut,
  LogIn,
} from 'lucide-react';

import lock from "../assets/lock1.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="sticky top-0 z-50 w-full bg-sage border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
    >
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="relative w-full px-6 lg:px-10">
        <div className="flex h-24 w-full items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="group flex items-center gap-4"
          >
            {/* Custom Logo Image Container */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-sage shadow-lg shadow-black/10 transition-all duration-300 group-hover:scale-105 group-hover:border-white/20 p-2 overflow-hidden">
              <img 
                src={lock} 
                alt="SecureShare Logo" 
                className="h-full w-full object-contain filter brightness-110"
              />

              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <span className="text-[1.45rem] font-black tracking-tight text-white transition-colors duration-300 group-hover:text-mint">
                SecureShare
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                End-to-End Encrypted Transfer
              </span>
            </div>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* NAVIGATION */}
                <div className="hidden items-center gap-2 md:flex">
                  {/* Upload */}
                  <Link
                    to="/upload"
                    className={`group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 border border-transparent hover:scale-[1.02] ${
                      isActive('/upload')
                        ? 'bg-white text-sage font-bold shadow-lg shadow-black/10'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Hub</span>
                  </Link>

                  {/* Dashboard */}
                  <Link
                    to="/dashboard"
                    className={`group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 border border-transparent hover:scale-[1.02] ${
                      isActive('/dashboard')
                        ? 'bg-white text-sage font-bold shadow-lg shadow-black/10'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="hidden h-6 w-px bg-white/20 md:block" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur-xl transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/20 hover:text-white hover:scale-[1.02] cursor-pointer"
                >
                  <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  <span className="hidden sm:block">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <Link
                  to="/login"
                  className="hidden rounded-2xl px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-[1.02] sm:inline-flex border border-transparent hover:border-white/10"
                >
                  Login
                </Link>

                {/* CTA */}
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-sage shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-white/5"
                >
                  <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.nav>
  );
}