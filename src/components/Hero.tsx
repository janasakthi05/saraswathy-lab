import React from 'react';
import { CalendarRange, ShieldCheck, Award, MapPin } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
  onServicesClick: () => void;
  homepageData?: {
    heroHeading?: string;
    heroSubheading?: string;
    heroCtaText?: string;
    heroCtaLink?: string;
  };
  businessData?: {
    address?: string;
    mapUrl?: string;
    timing?: string;
    businessName?: string;
  };
}

export default function Hero({ onBookClick, onServicesClick, homepageData, businessData }: HeroProps) {
  const stats = [
    { value: '40 Years', label: 'Diagnostic Trust' },
    { value: 'Coimbatore', label: 'Sundarapuram Signal' },
    { value: businessData?.timing ? businessData.timing.split('–')[0].trim() : '7:00 AM', label: 'Morning Collections' },
    { value: 'Secure', label: 'Encrypted Records' },
  ];

  const heroHeading = homepageData?.heroHeading || 'Saraswathy Lab and Medicals';
  const heroSubheading = homepageData?.heroSubheading || 'Saraswathy Lab & Medicals provides local, professional diagnostic testing and laboratory services at Sundarapuram, Coimbatore. We deliver accurate findings under strict sanitary protocols, focusing on clarity, comfort, and patient-first medical care.';
  const ctaText = homepageData?.heroCtaText || 'Book / Send Enquiry';

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50 text-slate-900">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/15 blur-3xl -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-400/15 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-sky-700 px-3.5 py-1.5 rounded-full w-fit shadow-xs">
              <Award className="w-4.5 h-4.5 text-teal-600" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                Established 1986 — 40 Years of Diagnostic Trust
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 whitespace-pre-line">
              {heroHeading}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium whitespace-pre-line">
              {heroSubheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={onBookClick}
                className="flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-sky-600/20 hover:-translate-y-0.5 transition-all cursor-pointer text-base"
              >
                <CalendarRange className="w-5 h-5" />
                <span>{ctaText}</span>
              </button>
              <button
                onClick={onServicesClick}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 px-8 py-4 rounded-2xl font-bold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer text-base"
              >
                <span>Explore Diagnostics</span>
              </button>
            </div>

            {/* Quick Stats Block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Location Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="absolute inset-0 bg-linear-to-r from-sky-500 to-teal-500 rounded-3xl transform rotate-2 scale-[1.01] opacity-15 blur-sm -z-10" />
              
              <div className="bg-white border border-slate-200/90 p-8 rounded-3xl shadow-xl text-left space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-7xl select-none text-slate-900">
                  ESTD
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span>Sundarapuram Central Lab</span>
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Located opposite Saraswathy Medicals and near the main Sundarapuram signal junction. Drop by for fasting blood draws from 7:00 AM onwards.
                </p>

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Address</h4>
                      <p className="text-sm text-slate-700 font-semibold mt-0.5 leading-snug">
                        No. 1/1, Madukkarai Main Road,<br />
                        Near Signal, Sundarapuram,<br />
                        Coimbatore, Tamil Nadu - 641024
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Saraswathy+Lab+Sundarapuram+Coimbatore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3.5 rounded-xl border border-slate-200 transition-colors text-sm"
                  >
                    <span>Get Map Directions</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
