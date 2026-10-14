'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    setErrorMessage('');

    if (!email || !password) {
      setStatus('ERROR');
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('ERROR');
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        // Redirect to dashboard index
        window.location.href = '/admin';
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setStatus('ERROR');
      setErrorMessage('Unreachable connection. Please ensure your local database is online.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative antialiased selection:bg-sky-500 selection:text-white">
      
      {/* Back to public site */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-xl relative z-10 text-left">
        
        {/* Brand mark */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-linear-to-r from-sky-600 to-teal-600 text-white p-3 rounded-2xl shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Saraswathy Admin</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Central Inquiries Database</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">
              Administrator Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
              placeholder="admin@saraswathylab.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase">
              Secret Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Warning banner */}
          {status === 'ERROR' && (
            <div className="flex gap-2.5 bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-600 text-xs leading-normal font-semibold">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={status === 'LOADING'}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              <Lock className="w-4 h-4" />
              <span>{status === 'LOADING' ? 'Decrypting Session...' : 'Secure Log In'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
