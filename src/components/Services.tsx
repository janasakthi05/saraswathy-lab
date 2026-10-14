'use client';

import React, { useState, useEffect } from 'react';
import { Microscope, Activity, Heart, ArrowRight, ShieldCheck, Radio, Search, Bone } from 'lucide-react';
import Link from 'next/link';

interface DiagnosticTest {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  preparation?: string;
}

interface DiagnosticCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  tests?: DiagnosticTest[];
}

interface XRayService {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bodyPart?: string;
}

interface ECGService {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type?: string;
}

interface ServicesProps {
  onServiceSelect: (serviceTitle: string) => void;
  categoriesData?: DiagnosticCategory[];
  xraysData?: XRayService[];
  ecgsData?: ECGService[];
}

export default function Services({ onServiceSelect, categoriesData = [], xraysData = [], ecgsData = [] }: ServicesProps) {
  const [categories, setCategories] = useState<DiagnosticCategory[]>(categoriesData);
  const [xrays, setXrays] = useState<XRayService[]>(xraysData);
  const [ecgs, setEcgs] = useState<ECGService[]>(ecgsData);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (categoriesData.length > 0) {
      setCategories(categoriesData);
      if (!selectedTab) setSelectedTab(categoriesData[0].id);
    }
    if (xraysData.length > 0) setXrays(xraysData);
    if (ecgsData.length > 0) setEcgs(ecgsData);

    if (categoriesData.length === 0 && xraysData.length === 0 && ecgsData.length === 0) {
      fetch('/api/public/data')
        .then((res) => res.json())
        .then((data) => {
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
            if (!selectedTab) setSelectedTab(data.categories[0].id);
          }
          if (data.xrays) setXrays(data.xrays);
          if (data.ecgs) setEcgs(data.ecgs);
        })
        .catch(console.error);
    }
  }, [categoriesData, xraysData, ecgsData]);

  const cleanName = (name: string) => name.replace(/^[•\s\t]+/, '').trim();

  const isXRayTab = selectedTab === 'xray-services';
  const isECGTab = selectedTab === 'ecg-services';

  const activeCategory = categories.find((c) => c.id === selectedTab) || (categories.length > 0 ? categories[0] : null);

  const filteredTests = activeCategory?.tests?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.shortDescription && t.shortDescription.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  const filteredXRays = xrays.filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase()) ||
    (x.description && x.description.toLowerCase().includes(search.toLowerCase())) ||
    (x.bodyPart && x.bodyPart.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredECGs = ecgs.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
    (e.type && e.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section id="services" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
            Diagnostic Test Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Comprehensive Pathology, X-Ray & ECG Diagnostics
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed font-medium">
            Providing trusted diagnostic laboratory evaluations, digital radiography, and electrocardiograms since 1986. Select a category below to explore available tests.
          </p>
        </div>

        {/* Category & Service Tabs Scroll Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {/* Pathology Categories */}
          {categories.map((cat) => {
            const isSel = selectedTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedTab(cat.id);
                  setSearch('');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.name} ({cat.tests?.length || 0})
              </button>
            );
          })}

          {/* X-Ray Radiography Tab */}
          {xrays.length > 0 && (
            <button
              onClick={() => {
                setSelectedTab('xray-services');
                setSearch('');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isXRayTab
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Bone className="w-3.5 h-3.5" />
              <span>X-Ray Radiography ({xrays.length})</span>
            </button>
          )}

          {/* ECG Cardiac Tab */}
          {ecgs.length > 0 && (
            <button
              onClick={() => {
                setSelectedTab('ecg-services');
                setSearch('');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isECGTab
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              <span>ECG Cardiac ({ecgs.length})</span>
            </button>
          )}
        </div>

        {/* Search Field */}
        <div className="mb-8 relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isXRayTab
                ? 'Search X-Ray services...'
                : isECGTab
                ? 'Search ECG cardiac tests...'
                : `Search tests in ${activeCategory?.name || 'catalog'}...`
            }
            className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium placeholder:text-slate-400 shadow-xs"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 shrink-0" />
        </div>

        {/* TAB CONTENT 1: X-RAY SERVICES */}
        {isXRayTab && (
          filteredXRays.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200/80">
              <Bone className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-semibold">No X-Ray services match your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredXRays.map((xray) => (
                <div
                  key={xray.id}
                  className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/90 hover:border-sky-500/80 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                        <Bone className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                        {xray.bodyPart || 'Digital Radiography'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                      {cleanName(xray.name)}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed mb-4 font-medium line-clamp-3">
                      {xray.description || 'High-clarity digital radiography imaging evaluated by experienced radiological technicians.'}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between mt-2">
                    <button
                      onClick={() => onServiceSelect(`X-Ray: ${cleanName(xray.name)}`)}
                      className="text-sky-600 hover:text-sky-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Enquire X-Ray</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/services/${xray.slug}`}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* TAB CONTENT 2: ECG SERVICES */}
        {isECGTab && (
          filteredECGs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200/80">
              <Activity className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-semibold">No ECG services match your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredECGs.map((ecg) => (
                <div
                  key={ecg.id}
                  className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/90 hover:border-teal-500/80 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                        {ecg.type || 'Cardiac Assay'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {cleanName(ecg.name)}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed mb-4 font-medium line-clamp-3">
                      {ecg.description || 'Non-invasive cardiac rhythm assessment using resting 12-lead electrocardiography.'}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between mt-2">
                    <button
                      onClick={() => onServiceSelect(`ECG: ${cleanName(ecg.name)}`)}
                      className="text-teal-700 hover:text-teal-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Enquire ECG</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/services/${ecg.slug}`}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* TAB CONTENT 3: PATHOLOGY CATEGORIES & TESTS */}
        {!isXRayTab && !isECGTab && (
          filteredTests.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200/80">
              <Microscope className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-semibold">No tests match your query in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/90 hover:border-sky-500/80 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                        <Microscope className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Pathology Assay
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                      {cleanName(test.name)}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed mb-4 font-medium line-clamp-3">
                      {test.shortDescription || 'Diagnostic assay evaluated under strict laboratory calibration protocols.'}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between mt-2">
                    <button
                      onClick={() => onServiceSelect(cleanName(test.name))}
                      className="text-sky-600 hover:text-sky-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Enquire About Test</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/services/${test.slug}`}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Special Stool & Urine diagnostics banner */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-sky-50 p-6 sm:p-8 rounded-3xl border border-teal-200/80 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <h4 className="text-slate-900 font-bold text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Diagnostic Specialty: Routine Stool & Urine Analysis</span>
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm">
              We process routine stool analysis (Routine, pH test, and Hanging Drop tests) alongside regular urine examinations.
            </p>
          </div>
          <button
            onClick={() => onServiceSelect('Urine/Stool Analysis Specialty')}
            className="w-full md:w-auto bg-white hover:bg-slate-50 text-teal-700 font-bold border border-teal-300 px-6 py-3 rounded-2xl transition-all cursor-pointer text-sm whitespace-nowrap text-center shadow-xs"
          >
            Ask About Testing
          </button>
        </div>

      </div>
    </section>
  );
}
