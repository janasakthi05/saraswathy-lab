import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & HIPAA Statement | Saraswathy Lab',
  description: 'Understand how Saraswathy Lab & Medicals protects and encrypts user and diagnostic records under HIPAA guidelines.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <Header />

      <main className="flex-grow pt-28 pb-16 text-left">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500">Privacy Policy</span>
          </nav>

          {/* Back Action */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Policy Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
            
            <div className="border-b border-slate-100 pb-6">
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Privacy Policy & HIPAA Statement
              </h1>
              <p className="text-xs text-slate-500 mt-2 font-medium">Last updated: July 14, 2026</p>
            </div>

            <div className="flex items-start gap-3 bg-teal-50/80 border border-teal-200/80 p-4.5 rounded-2xl text-teal-950">
              <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed font-semibold">
                Saraswathy Lab & Medicals operates under strict clinical privacy protections. This statement defines how we collect, encrypt, and manage patient diagnostic parameters.
              </p>
            </div>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                To coordinate local phlebotomy visits and deliver reports, we collect contact credentials (name, email, phone) and inquiry subjects (desired testing profile).
              </p>

              <h2 className="text-lg font-bold text-slate-900">2. Data Security & Storage</h2>
              <p>
                Patient details are never shared with marketing companies or insurance groups. Information is used exclusively for scheduling technicians and providing report sheets. We align data transmission protocols with HIPAA health privacy requirements.
              </p>

              <h2 className="text-lg font-bold text-slate-900">3. Cookies & Session Storage</h2>
              <p>
                We set cookies to verify user settings and admin credentials. Administrative dashboards utilize secure HTTP-only cookies which are encrypted and expire automatically.
              </p>

              <h2 className="text-lg font-bold text-slate-900">4. Policy Adjustments</h2>
              <p>
                We may periodically update this document as local diagnostic regulations evolve. For inquiries regarding data handling, contact us at <strong>saraswathylab27@gmail.com</strong>.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
