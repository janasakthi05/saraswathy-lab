'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onPrivacyClick?: () => void;
  onBookClick?: () => void;
}

export default function Footer({ onPrivacyClick, onBookClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handlePrivacy = (e: React.MouseEvent) => {
    if (onPrivacyClick) {
      e.preventDefault();
      onPrivacyClick();
    }
  };

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200 pt-16 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-200">
          
          {/* Brand Info Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-linear-to-r from-sky-600 to-teal-600 text-white p-2 rounded-xl shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">
                  Saraswathy
                </span>
                <span className="text-[10px] font-bold tracking-widest text-sky-600 uppercase leading-none mt-1 block">
                  Lab & Medicals
                </span>
              </div>
            </Link>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Providing medical diagnostics and laboratory testing services in Coimbatore since 1986. Located near Sundarapuram signal, opposite Saraswathy Medicals.
            </p>
            <div className="text-xs font-bold text-slate-500">
              ESTD. CODE: ESTD-1986-CBE
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="/#home" className="hover:text-sky-600 transition-colors">Home</a>
              </li>
              <li>
                <a href="/#services" className="hover:text-sky-600 transition-colors">Test Offerings</a>
              </li>
              <li>
                <a href="/#about" className="hover:text-sky-600 transition-colors">About Lab</a>
              </li>
              <li>
                <a href="/#why-us" className="hover:text-sky-600 transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="/#locations" className="hover:text-sky-600 transition-colors">Locations</a>
              </li>
            </ul>
          </div>

          {/* Service Area Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Service Regions</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/locations/sundarapuram" className="hover:text-sky-600 transition-colors">
                  Sundarapuram Signal
                </Link>
              </li>
              <li>
                <Link href="/locations/madukkarai" className="hover:text-sky-600 transition-colors">
                  Madukkarai Main Road
                </Link>
              </li>
              <li>
                <a href="/#contact" className="hover:text-sky-600 transition-colors">
                  Coimbatore Central
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Compliance Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Clinical Disclosures</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/privacy-policy" onClick={handlePrivacy} className="hover:text-sky-600 transition-colors">
                  Privacy Policy & HIPAA
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sky-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/medical-disclaimer" className="hover:text-sky-600 transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-sky-600 transition-colors inline-flex items-center gap-1">
                  <span>Admin Login</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Base */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>
            &copy; {currentYear} Saraswathy Lab & Medicals. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Coimbatore, Tamil Nadu</span>
            <span>&bull;</span>
            <span>Diagnostics ESTD 1986</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
