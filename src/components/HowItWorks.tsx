import React from 'react';
import { ClipboardList, AlertCircle, Syringe, FileText } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Select / Ask About a Test',
      desc: 'Browse our services or submit a query about a test prescription. We will verify pricing and instructions.',
      icon: ClipboardList,
    },
    {
      num: '02',
      title: 'Verify Preparation Vitals',
      desc: 'Make sure to check fasting requirements. Sugar and cholesterol tests require 10-12 hours of water-only fasting.',
      icon: AlertCircle,
    },
    {
      num: '03',
      title: 'Visit Sundarapuram Lab',
      desc: 'Drop in during our operating hours (7:00 AM – 10:00 PM). Samples are drawn in a clean, sanitized environment.',
      icon: Syringe,
    },
    {
      num: '04',
      title: 'Retrieve Printed Reports',
      desc: 'Pick up your signed physical copies opposite Saraswathy Medicals, or request digital PDF reports sent via WhatsApp/email.',
      icon: FileText,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-20">
          <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            Our Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            How The Diagnostics Process Works
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex flex-col items-start text-left relative group">
                
                {/* Connector line (desktop only) */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-12 left-[50%] right-[-50%] h-0.5 bg-slate-200 z-0" />
                )}

                {/* Step number badge & icon container */}
                <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-md group-hover:border-sky-500 transition-all duration-350 z-10">
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {st.num}
                  </span>
                  
                  <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{st.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-[250px] font-medium">{st.desc}</p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
