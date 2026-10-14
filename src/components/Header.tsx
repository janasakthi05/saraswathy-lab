'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Menu, X, PhoneCall, Truck } from 'lucide-react';

interface HeaderProps {
  onBookClick?: () => void;
  onHomeCollectionClick?: () => void;
  businessPhone?: string;
}

export default function Header({ onBookClick, onHomeCollectionClick, businessPhone = '+91 9489516699' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBook = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      window.location.href = '/#contact';
    }
  };

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'Packages', href: '/#packages' },
    { name: 'About', href: '/#about' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Locations', href: '/#locations' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-2.5 border-b border-slate-200/80'
          : 'bg-white/90 backdrop-blur-sm py-3 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo (Prevent flex shrink/overlap) */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="bg-linear-to-r from-sky-600 to-teal-600 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left shrink-0">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors block leading-none whitespace-nowrap">
                Saraswathy
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-sky-600 uppercase leading-none mt-1 block whitespace-nowrap">
                Lab & Medicals
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs xl:text-[13px] font-bold text-slate-700 hover:text-sky-600 transition-colors whitespace-nowrap px-1 py-1 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-sky-600 after:transition-all hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${businessPhone.replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-1.5 text-sky-700 font-bold hover:text-sky-800 transition-colors text-xs whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-600 animate-pulse shrink-0" />
              <span>{businessPhone}</span>
            </a>

            {onHomeCollectionClick && (
              <button
                onClick={onHomeCollectionClick}
                className="hidden sm:flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer text-[11px] uppercase tracking-wider whitespace-nowrap"
              >
                <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Home Visit</span>
              </button>
            )}

            <button
              onClick={handleBook}
              className="hidden md:flex items-center justify-center bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl font-bold shadow-md shadow-sky-600/20 hover:-translate-y-0.5 transition-all cursor-pointer text-[11px] uppercase tracking-wider whitespace-nowrap"
            >
              Send Enquiry
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-200 shadow-2xl py-4 px-6 animate-fadeIn">
          <div className="flex flex-col gap-3 text-left">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-sky-600 py-2 border-b border-slate-100"
              >
                {link.name}
              </a>
            ))}
            <a
              href={`tel:${businessPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-sky-700 font-bold py-2 border-b border-slate-100 text-sm"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span>Call Lab: {businessPhone}</span>
            </a>

            {onHomeCollectionClick && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onHomeCollectionClick();
                }}
                className="flex items-center justify-center gap-2 bg-sky-50 text-sky-700 border border-sky-200 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider mt-1 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Schedule Home Collection</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleBook();
              }}
              className="flex items-center justify-center bg-linear-to-r from-sky-600 to-teal-600 text-white py-2.5 px-4 rounded-xl font-bold shadow-md text-xs uppercase tracking-wider cursor-pointer"
            >
              Send an Enquiry
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
