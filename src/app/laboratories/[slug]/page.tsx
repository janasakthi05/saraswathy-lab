import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { laboratoriesData } from '@/data/laboratories';
import { ChevronRight, ArrowLeft, Building, Phone, Clock, Mail } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = laboratoriesData[slug];
  if (!lab) return {};

  return {
    title: lab.name,
    description: lab.metaDescription,
    alternates: {
      canonical: `/laboratories/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(laboratoriesData).map((slug) => ({
    slug,
  }));
}

export default async function LaboratoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const lab = laboratoriesData[slug];

  if (!lab) {
    notFound();
  }

  // LocalBusiness Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    'name': lab.name,
    'description': lab.metaDescription,
    'telephone': lab.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': lab.address,
      'addressLocality': lab.city,
      'addressRegion': lab.state,
      'postalCode': lab.postalCode,
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
            <span className="text-slate-500">Laboratories</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-sky-600 font-bold">{lab.slug}</span>
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
                  {lab.name}
                </h1>
                <p className="text-xs text-sky-600 mt-2 font-bold uppercase tracking-wider">
                  Established 1986 &bull; Code: {lab.labId}
                </p>
              </div>
              <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl border border-sky-100 shrink-0">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 text-sm">
              <div className="space-y-4">
                <h3 className="text-slate-900 font-bold text-base">Facility Details</h3>
                <p className="leading-relaxed">{lab.description}</p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{lab.address}, {lab.city}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">Phone: {lab.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">Hours: {lab.hours}</span>
                  </div>
                </div>
              </div>

              {/* Service list */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-slate-900 font-bold text-base">Available Diagnostics</h3>
                <ul className="space-y-2.5">
                  {lab.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA action */}
            <div className="border-t border-slate-100 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Need information about test costs?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Send a query to the Sundarapuram signal center desk.</p>
              </div>
              <Link
                href={`/#contact`}
                className="w-full sm:w-auto text-center bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:from-sky-700 hover:to-teal-700 transition-all text-sm whitespace-nowrap"
              >
                Send Inquiry
              </Link>
            </div>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Inline fallback since MapPin from lucide-react is already imported or we can map it
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
