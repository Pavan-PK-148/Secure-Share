import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return toast.error('All validation fields must be systematically filled');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setFormLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name, // Shipped gracefully to backend architecture context
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration structural setup rejected');
      }

      // Automatically log the user in using the returned JWT token session descriptor
      login(data.token);

      toast.success('Account constructed cleanly! Workspace authorized.');
      navigate('/upload');
    } catch (err) {
      toast.error(err.message || 'Registration failure encountered');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-16">
      {/* BACKGROUND GLOW */}
      <div className="hero-glow" />
      <div className="absolute top-16 left-0 h-72 w-72 rounded-full bg-mint/30 blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sage/10 blur-3xl animate-float" />

      {/* REGISTER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/30 shadow-2xl"
      >
        {/* TOP STRIP */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-mint via-sage to-mint-light" />

        <div className="p-8 md:p-10">
          {/* HEADER */}
          <div className="mb-8 text-center">
            {/* ICON */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-sage shadow-xl shadow-sage/10">
              <ShieldCheck className="h-9 w-9 text-mint" />
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-black tracking-tight text-charcoal">
              Create Secure Identity
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              Register your encrypted workspace and deploy protected file-sharing operations.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal/65">
                Display Name
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/35 transition group-focus-within:text-sage">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Smith"
                  required
                  className="w-full rounded-2xl border border-sage/10 bg-white/70 py-4 pl-12 pr-4 text-sm text-charcoal outline-none transition-all duration-300 placeholder:text-charcoal/35 focus:border-sage focus:bg-white focus:shadow-lg focus:shadow-sage/5"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal/65">
                Email Address
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/35 transition group-focus-within:text-sage">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-sage/10 bg-white/70 py-4 pl-12 pr-4 text-sm text-charcoal outline-none transition-all duration-300 placeholder:text-charcoal/35 focus:border-sage focus:bg-white focus:shadow-lg focus:shadow-sage/5"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal/65">
                Security Password
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/35 transition group-focus-within:text-sage">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-sage/10 bg-white/70 py-4 pl-12 pr-4 text-sm text-charcoal outline-none transition-all duration-300 placeholder:text-charcoal/35 focus:border-sage focus:bg-white focus:shadow-lg focus:shadow-sage/5"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal/65">
                Confirm Password
              </label>
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/35 transition group-focus-within:text-sage">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-sage/10 bg-white/70 py-4 pl-12 pr-4 text-sm text-charcoal outline-none transition-all duration-300 placeholder:text-charcoal/35 focus:border-sage focus:bg-white focus:shadow-lg focus:shadow-sage/5"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={formLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-sage py-4 font-semibold text-white shadow-xl shadow-sage/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#243c33] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {formLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Generate Secure Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-sage/10" />
            <span className="text-xs font-medium uppercase tracking-widest text-charcoal/35">
              Protected Registration
            </span>
            <div className="h-px flex-1 bg-sage/10" />
          </div>

          {/* FOOTER */}
          <div className="space-y-4 text-center">
            <p className="text-sm text-charcoal/60">
              Already possess credentials?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-sage/10 bg-mint-light px-6 py-3 text-sm font-bold text-sage transition-all duration-300 hover:-translate-y-0.5 hover:bg-mint"
            >
              Sign Into SecureShare
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}