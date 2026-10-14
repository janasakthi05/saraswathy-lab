'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: 'Do I need to fast before a blood sugar or cholesterol test?',
      a: 'Yes, tests like Fasting Blood Sugar (FBS) and Lipid Profiles require you to fast for 10-12 hours prior to sample collection. You may drink plain water, but black tea, coffee, breakfast, or juices must be avoided as they will spike sugar levels.',
    },
    {
      q: 'What are the operating hours of Saraswathy Lab?',
      a: 'Our diagnostic laboratory opens early at 7:00 AM for morning draws and stays open until 10:00 PM daily. The pharmacy (Saraswathy Medicals) operates opposite the lab from 9:00 AM to 10:30 PM.',
    },
    {
      q: 'How long does it take to get my reports?',
      a: 'Most routine blood pathology panels, CBC, sugar, and urine tests are processed within 12 hours. Signed printed copies can be collected opposite the lab, or we can send a PDF report directly to your WhatsApp or email.',
    },
    {
      q: 'Do you offer home sample collections in Coimbatore?',
      a: 'Yes. We coordinate local phlebotomy collections for elderly or bedridden patients around Sundarapuram and nearby localities. Please contact us at 0422-2674699 to confirm slot availability.',
    },
    {
      q: 'How is clinical quality maintained?',
      a: 'Established in 1986, Saraswathy Lab operates automated analyzers managed by experienced laboratory technicians. All assays are run alongside strict daily calibration checks to ensure diagnostic accuracy.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-16">
          <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            Help Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-200 ${
                  isOpen
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                }`}
              >
                {/* Header button */}
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isOpen ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-slate-900 text-base md:text-lg leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <span className={`p-1.5 rounded-lg ${isOpen ? 'bg-sky-100 text-sky-700' : 'text-slate-400'}`}>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {/* Collapsible panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-60 border-t border-slate-200/80' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 md:p-6 text-slate-600 text-sm sm:text-base leading-relaxed bg-white font-medium">
                    {faq.a}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
