import React from 'react';
import { Shield, Sparkles, Map, Clock } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      title: 'Convenient Local Access',
      desc: 'Located directly near the Sundarapuram signal junction, saving you trips to busy city hospitals.',
      icon: Map,
    },
    {
      title: 'Decades of Experience',
      desc: 'Trusted by families and local clinics in Coimbatore since our establishment in 1986.',
      icon: Shield,
    },
    {
      title: 'Patient-Friendly Draws',
      desc: 'Our staff are trained to make collections simple and painless, especially for elderly patients.',
      icon: Sparkles,
    },
    {
      title: 'Fasting Timing Support',
      desc: 'We open from 7:00 AM onwards so you can complete your fasting glucose draws early and get on with your day.',
      icon: Clock,
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            Our Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Setting the Benchmark for Diagnostic Trust
          </h2>
        </div>

        {/* Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/90 p-8 rounded-3xl text-left hover:border-sky-500/80 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col gap-5 hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 bg-white text-sky-600 border border-slate-200 flex items-center justify-center rounded-xl shadow-xs">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{pt.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">{pt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proximity / WhatsApp banner */}
        <div className="mt-16 bg-gradient-to-r from-sky-50 to-teal-50 p-8 rounded-3xl border border-sky-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden shadow-sm">
          <div className="space-y-1.5 max-w-2xl z-10">
            <h3 className="text-lg font-bold text-slate-900">Have a specific test prescription or inquiry?</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              We process a wide range of standard blood, stool, and urine diagnostics. Send us a message or call to check pricing parameters.
            </p>
          </div>
          <a
            href="tel:04222674699"
            className="w-full md:w-auto text-center bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer text-sm whitespace-nowrap z-10"
          >
            Call 0422 2674699
          </a>
        </div>

      </div>
    </section>
  );
}
