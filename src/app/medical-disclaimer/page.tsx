import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, ShieldAlert, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | Saraswathy Lab',
  description: 'Understand that all diagnostic listings and educational parameters require professional physician interpretation.',
  alternates: {
    canonical: '/medical-disclaimer',
  },
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <Header />

      <main className="flex-grow pt-28 pb-16 text-left">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500">Medical Disclaimer</span>
          </nav>

          {/* Back Action */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Disclaimer Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
            
            <div className="border-b border-slate-100 pb-6">
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight flex items-center gap-2.5">
                <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
                <span>Medical Disclaimer</span>
              </h1>
              <p className="text-xs text-slate-500 mt-2 font-medium">Last updated: July 14, 2026</p>
            </div>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <h2 className="text-lg font-bold text-slate-900">1. Educational Context Only</h2>
              <p>
                The information, text, lists, and articles hosted on our portal are intended strictly for educational and test coordination purposes. None of the content represents professional medical advice, clinical diagnostics, or treatment prescriptions.
              </p>

              <h2 className="text-lg font-bold text-slate-900">2. No Physician-Patient Relationship</h2>
              <p>
                Your submission of contact forms, inquiry profiles, or reading of wellness articles does not initiate a physician-patient relationship. All laboratory findings should be discussed directly with a certified medical doctor or clinical specialist.
              </p>

              <h2 className="text-lg font-bold text-slate-900">3. Non-Emergency Coordination</h2>
              <p>
                Our booking dashboard is designed for routine pathology and wellness screenings. It must <strong>never</strong> be used to request emergency medical services. If you are experiencing a medical crisis, chest pain, or severe symptoms, please contact your local emergency number immediately.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
