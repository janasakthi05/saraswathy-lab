import React from 'react';
import { Award, Heart, Activity } from 'lucide-react';

interface AboutProps {
  homepageData?: {
    aboutHeading?: string;
    aboutDescription?: string;
    aboutImage?: string;
  };
}

export default function About({ homepageData }: AboutProps) {
  const points = [
    {
      title: 'Established in 1986',
      desc: 'Serving the Sundarapuram and wider Coimbatore communities with trustworthy diagnostics for nearly 40 years.',
      icon: Award,
    },
    {
      title: 'Patient-First Focus',
      desc: 'Ensuring blood collection procedures are gentle, sterile, and stress-free for seniors, adults, and children alike.',
      icon: Heart,
    },
    {
      title: 'Pharmacy Support',
      desc: 'Located opposite Saraswathy Medicals, giving you quick access to medical supplies and prescription support.',
      icon: Activity,
    },
  ];

  const aboutHeading = homepageData?.aboutHeading || 'Decades of Medical Diagnostics';
  const aboutDescription = homepageData?.aboutDescription || 'Saraswathy Lab & Medicals was built on a simple foundation: bringing reliable diagnostic services closer to the residents of Coimbatore.';

  return (
    <section id="about" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual left column */}
          <div className="lg:col-span-5 relative text-left">
            <div className="bg-white border border-slate-200/90 p-8 rounded-3xl space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 rounded-full bg-sky-500/10 blur-2xl" />
              
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line">
                {aboutHeading}
              </h3>
              
              <div className="h-1.5 w-16 bg-linear-to-r from-sky-600 to-teal-600 rounded-full" />
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                {aboutDescription}
              </p>
            </div>
          </div>

          {/* Core points right column */}
          <div className="lg:col-span-7 flex flex-col gap-8 text-left">
            
            <div>
              <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                About The Laboratory
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                Local Diagnostic Care You Can Depend On
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {points.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start p-4 hover:bg-white rounded-2xl transition-colors duration-200 shadow-xs border border-transparent hover:border-slate-200">
                    <div className="bg-white text-sky-600 p-3 rounded-xl border border-slate-200 shrink-0 shadow-xs">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{pt.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{pt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
