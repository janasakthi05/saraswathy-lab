'use client';

import React, { useState } from 'react';
import { Package, HeartHandshake, CheckCircle, Sparkles, ChevronRight, Building2, Stethoscope, Factory, ClipboardList } from 'lucide-react';

interface HealthPackageItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  includedTests: string;
  targetAudience?: string;
  isFeatured?: boolean;
}

interface InitiativeItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  icon?: string;
  isFeatured?: boolean;
}

interface PackagesProps {
  packagesData?: HealthPackageItem[];
  initiativesData?: InitiativeItem[];
  onSelectPackage?: (name: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Building2: Building2,
  Stethoscope: Stethoscope,
  Factory: Factory,
  ClipboardList: ClipboardList,
  HeartHandshake: HeartHandshake,
};

export default function Packages({ packagesData = [], initiativesData = [], onSelectPackage }: PackagesProps) {
  const [activeTab, setActiveTab] = useState<'initiatives' | 'packages'>('initiatives');

  // Swapped initial/fallback data as requested by requirement #3
  // Health Packages tab displays the 4 health program items (Free Medical Camps, Doctor Network, Industry Partnerships, Customized Packages)
  const swappedHealthPackages: InitiativeItem[] = (initiativesData.length > 0) ? initiativesData : [
    {
      id: 'swapped-pkg-1',
      title: 'Free Medical Camps',
      slug: 'free-medical-camps',
      shortDescription: 'We regularly organize free medical camps in association with hospitals and healthcare partners, helping communities access essential health screenings and medical consultations.',
      fullDescription: 'Our community medical camps provide free blood sugar checks, blood pressure screenings, and doctor consultations around Sundarapuram, Madukkarai, and Podanur.',
      icon: 'Building2',
      isFeatured: true,
    },
    {
      id: 'swapped-pkg-2',
      title: 'Doctor Network & Clinical Support',
      slug: 'doctor-network-clinical-support',
      shortDescription: 'We maintain strong connections with experienced and trusted doctors across specialties, helping patients receive appropriate medical guidance and supporting better interpretation of diagnostic results.',
      fullDescription: 'Direct clinical collaboration ensuring immediate critical result reporting and seamless doctor referrals.',
      icon: 'Stethoscope',
      isFeatured: true,
    },
    {
      id: 'swapped-pkg-3',
      title: 'Industry Health Partnerships',
      slug: 'industry-health-partnerships',
      shortDescription: 'We partner with industries and organizations to promote employee health through customized health-checkup packages, periodic screening programs, and preventive healthcare initiatives.',
      fullDescription: 'Custom occupational health evaluations and annual employee wellness checkups for industrial units along the Madukkarai corridor.',
      icon: 'Factory',
      isFeatured: false,
    },
    {
      id: 'swapped-pkg-4',
      title: 'Customized Health Packages',
      slug: 'customized-health-packages-initiative',
      shortDescription: 'We offer tailored health packages designed for individuals, families, institutions, and corporate employees, based on their specific health-screening requirements.',
      fullDescription: 'Flexible multi-parameter health checkup bundles tailored for family preventive screening and chronic condition monitoring.',
      icon: 'ClipboardList',
      isFeatured: false,
    },
  ];

  // Healthcare Initiatives tab displays the 4 bundled health package items (Master Health Checkup, Executive Diabetes, Senior Citizen, Basic Cardiac)
  const swappedInitiatives: HealthPackageItem[] = (packagesData.length > 0) ? packagesData : [
    {
      id: 'swapped-init-1',
      name: 'Master Health Checkup',
      slug: 'master-health-checkup',
      description: 'Comprehensive 50+ parameter screening evaluating blood counts, lipid cholesterol, liver, kidney, fasting sugar, and urine routine.',
      includedTests: 'Complete Blood Count (CBC), Lipid Profile, Liver Function Test (LFT), Kidney Function Test (KFT), Fasting Sugar, Routine Urine',
      targetAudience: 'Adults 30+ seeking annual full-body diagnostic baseline',
      isFeatured: true,
    },
    {
      id: 'swapped-init-2',
      name: 'Executive Diabetes Panel',
      slug: 'executive-diabetes-panel',
      description: 'Targeted glucose and metabolic profile measuring Fasting Sugar, Post-Prandial, HbA1c 3-month average, and Kidney filtration.',
      includedTests: 'FBS, PPBS, HbA1c, Serum Creatinine, Urine Microalbumin',
      targetAudience: 'Diabetic patients & prediabetes monitoring',
      isFeatured: true,
    },
    {
      id: 'swapped-init-3',
      name: 'Senior Citizen Vitality Checkup',
      slug: 'senior-citizen-vitality',
      description: 'Gentle, comprehensive profile tailored for seniors covering Vitamin D3, B12, bone calcium, cardiac hs-CRP, and renal health.',
      includedTests: 'Vitamin D3, B12, Serum Calcium, hs-CRP, KFT, CBC',
      targetAudience: 'Senior citizens aged 55+',
      isFeatured: false,
    },
    {
      id: 'swapped-init-4',
      name: 'Basic Cardiac Wellness',
      slug: 'basic-cardiac-wellness',
      description: 'Focuses on arterial risk factors combining Lipid Profile, hs-CRP inflammation, Fasting Sugar, and 12-Lead ECG.',
      includedTests: 'Lipid Profile Complete, hs-CRP, Fasting Sugar, 12-Lead ECG',
      targetAudience: 'Patients with hypertension or family cardiac history',
      isFeatured: false,
    },
  ];

  return (
    <section id="packages" className="py-20 bg-slate-50 border-t border-slate-200 text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
              Healthcare & Wellness
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Healthcare Initiatives & Health Packages
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base font-medium max-w-2xl">
              Making quality healthcare more accessible through health programs, community screening camps, and preventive diagnostic checkup bundles across Coimbatore.
            </p>
          </div>

          {/* Toggle Pills - Healthcare Initiatives first */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab('initiatives')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'initiatives'
                  ? 'bg-linear-to-r from-sky-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Healthcare Initiatives ({swappedInitiatives.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-linear-to-r from-sky-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Health Packages ({swappedHealthPackages.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Healthcare Initiatives (Displays first) */}
        {activeTab === 'initiatives' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {swappedInitiatives.map((pkg) => {
              const testsList = pkg.includedTests ? pkg.includedTests.split(',').map((t) => t.trim()) : [];
              return (
                <div
                  key={pkg.id}
                  className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl ${
                    pkg.isFeatured
                      ? 'border-sky-400 ring-2 ring-sky-500/10 relative'
                      : 'border-slate-200/90 hover:border-sky-300'
                  }`}
                >
                  {pkg.isFeatured && (
                    <span className="absolute -top-3 right-6 bg-linear-to-r from-sky-600 to-teal-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured Initiative
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="p-3 bg-sky-50 border border-sky-100 rounded-2xl w-fit text-sky-600">
                      <HeartHandshake className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{pkg.name}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed font-medium">
                        {pkg.description}
                      </p>
                    </div>

                    {pkg.targetAudience && (
                      <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Target Focus</span>
                        <span className="text-xs text-slate-800 font-semibold">{pkg.targetAudience}</span>
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Included Diagnostics</span>
                      <ul className="space-y-1.5">
                        {testsList.map((test, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      onClick={() => onSelectPackage && onSelectPackage(`Healthcare Initiative: ${pkg.name}`)}
                      className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      <span>Inquire Initiative</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Health Packages */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-left">
            {swappedHealthPackages.map((item) => {
              const IconComp = (item.icon && iconMap[item.icon]) ? iconMap[item.icon] : Package;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/90 hover:border-sky-400 rounded-3xl p-8 space-y-5 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl w-fit text-sky-600">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-teal-600 mt-1 uppercase font-semibold tracking-wider">
                        Saraswathy Health Package Program
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {item.shortDescription}
                    </p>

                    {item.fullDescription && (
                      <p className="text-xs text-slate-500 leading-relaxed font-normal pt-3 border-t border-slate-100">
                        {item.fullDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-right">
                    <button
                      onClick={() => onSelectPackage && onSelectPackage(`Health Package Query: ${item.title}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 uppercase tracking-wider cursor-pointer"
                    >
                      <span>Inquire / Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
