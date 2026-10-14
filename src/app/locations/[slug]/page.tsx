import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { locationsData } from '@/data/locations';
import { ChevronRight, ArrowLeft, MapPin, Compass, Phone, Clock } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = locationsData[slug];
  if (!loc) return {};

  return {
    title: `Diagnostics in ${loc.name} | Saraswathy Lab`,
    description: loc.metaDescription,
    alternates: {
      canonical: `/locations/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(locationsData).map((slug) => ({
    slug,
  }));
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const loc = locationsData[slug];

  if (!loc) {
    notFound();
  }

  // LocalBusiness Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `Saraswathy Lab & Medicals - ${loc.name} service`,
    'description': loc.metaDescription,
    'telephone': loc.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': loc.address,
      'addressLocality': 'Coimbatore',
      'addressRegion': 'Tamil Nadu',
      'addressCountry': 'IN',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Header />

      <main className="flex-grow pt-28 pb-16 text-left">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500">Locations</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-sky-600 font-bold">{loc.slug}</span>
          </nav>

          {/* Back Action */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Content Card */}
          <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
            
            <div className="border-b border-slate-100 pb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  Diagnostic Services in {loc.name}
                </h1>
                <p className="text-xs text-sky-600 mt-2 font-bold uppercase tracking-wider">
                  Saraswathy Lab Service Radius &bull; Coimbatore
                </p>
              </div>
              <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl border border-sky-100 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              <div>
                <h3 className="text-slate-900 font-bold text-base mb-2">Area Overview</h3>
                <p>{loc.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <h4 className="text-slate-900 font-bold text-sm">Branch Coordinates</h4>
                  <p className="text-xs sm:text-sm leading-snug">
                    <strong>Address:</strong> {loc.address}<br />
                    <strong>Phone:</strong> {loc.phone}<br />
                    <strong>Hours:</strong> {loc.hours}
                  </p>
                </div>
                {loc.directions && (
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-sky-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Directions</span>
                    </h4>
                    <p className="text-xs leading-normal">{loc.directions}</p>
                  </div>
                )}
              </div>

              {/* Local FAQs */}
              {loc.localFAQs && loc.localFAQs.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-slate-900 font-bold text-base mb-4">Location Support FAQs</h3>
                  {loc.localFAQs.map((faq, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h4 className="text-slate-900 font-bold text-sm">{faq.q}</h4>
                      <p className="text-xs sm:text-sm text-slate-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA action */}
            <div className="border-t border-slate-100 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Need a blood draw in {loc.name}?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Submit an online enquiry or call our desk to schedule a home sample collection.</p>
              </div>
              <Link
                href={`/#contact`}
                className="w-full sm:w-auto text-center bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:from-sky-700 hover:to-teal-700 transition-all text-sm whitespace-nowrap"
              >
                Book collection
              </Link>
            </div>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
