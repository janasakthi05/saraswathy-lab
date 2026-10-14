import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Saraswathy Lab',
  description: 'Understand patient booking terms, phlebotomist dispatch rules, and diagnostic liability limitations.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <Header />

      <main className="flex-grow pt-28 pb-16 text-left">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500">Terms of Service</span>
          </nav>

          {/* Back Action */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Terms Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
            
            <div className="border-b border-slate-100 pb-6">
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-500 mt-2 font-medium">Last updated: July 14, 2026</p>
            </div>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <h2 className="text-lg font-bold text-slate-900">1. Service Coordination</h2>
              <p>
                By scheduling a test or inquiry on our portal, you consent to our dispatch team contacting you to verify details and coordinate blood draw logistics.
              </p>

              <h2 className="text-lg font-bold text-slate-900">2. Sample Viability & Delays</h2>
              <p>
                All patient samples are analyzed using calibrated laboratory equipment. Although we operate temperature-controlled transport, sample viability can be affected by physical parameters. Saraswathy Lab is not responsible for diagnostic delays arising from equipment re-runs or physiological factors.
              </p>

              <h2 className="text-lg font-bold text-slate-900">3. Cancellation & Fees</h2>
              <p>
                We request at least 12 hours notice for canceling home collection dispatches. This helps our phlebotomy team coordinate Coimbatore routes efficiently.
              </p>

              <h2 className="text-lg font-bold text-slate-900">4. Governing Law</h2>
              <p>
                These terms are governed by healthcare laws. If you disagree with these terms, you should coordinate tests offline directly at our clinic.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
