import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { servicesData } from '@/data/services';
import db from '@/lib/db';
import { ChevronRight, ArrowLeft, ShieldCheck, Microscope } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getServiceData(slug: string) {
  // 1. Check static servicesData
  if (servicesData[slug]) {
    return servicesData[slug];
  }

  // 2. Check DiagnosticTest from Database
  const test = await db.diagnosticTest.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (test) {
    return {
      slug: test.slug,
      title: `${test.name} | Saraswathy Lab & Medicals`,
      heading: test.name,
      metaDescription: test.shortDescription || `Get precise ${test.name} testing at Saraswathy Lab & Medicals, Sundarapuram, Coimbatore.`,
      overview: test.overview || test.shortDescription || 'Professional diagnostic pathology evaluation with accurate report turnaround.',
      whoFor: test.whoFor || 'Recommended for patients with relevant symptoms, regular health checks, or doctor referrals.',
      preparation: test.preparation || 'No special preparation required unless specified by your referring doctor.',
      faqs: [],
      relatedServices: test.category ? [{ title: test.category.name, slug: test.category.slug }] : [],
    };
  }

  // 3. Check DiagnosticCategory from Database
  const cat = await db.diagnosticCategory.findUnique({
    where: { slug },
    include: { tests: true },
  });

  if (cat) {
    return {
      slug: cat.slug,
      title: `${cat.name} Pathology Category | Saraswathy Lab`,
      heading: cat.name,
      metaDescription: cat.description || `Explore ${cat.name} diagnostic testing options at Saraswathy Lab & Medicals, Coimbatore.`,
      overview: cat.description || 'Comprehensive diagnostic category testing available daily under strict sanitary protocols.',
      whoFor: 'Patients seeking specialized pathology, blood, organ panels, or doctor-prescribed profiles.',
      preparation: 'Varies by individual test. Please check specific test instructions or consult our phlebotomist.',
      faqs: cat.tests.slice(0, 4).map((t) => ({
        q: `What is included in ${t.name}?`,
        a: t.shortDescription || t.overview || 'Standard laboratory assay.',
      })),
      relatedServices: [],
    };
  }

  // 4. Check XRayService
  const xray = await db.xRayService.findUnique({ where: { slug } });
  if (xray) {
    return {
      slug: xray.slug,
      title: `${xray.name} | Saraswathy Lab`,
      heading: xray.name,
      metaDescription: xray.description || `Digital radiography & X-Ray services for ${xray.name} at Sundarapuram, Coimbatore.`,
      overview: xray.description || 'High-clarity digital radiography imaging conducted by experienced radiological technicians.',
      whoFor: 'Patients requiring bone, joint, chest, or structural imaging.',
      preparation: 'Remove metal objects, jewelry, and belts before entering the imaging room.',
      faqs: [],
      relatedServices: [],
    };
  }

  // 5. Check ECGService
  const ecg = await db.eCGService.findUnique({ where: { slug } });
  if (ecg) {
    return {
      slug: ecg.slug,
      title: `${ecg.name} | Saraswathy Lab`,
      heading: ecg.name,
      metaDescription: ecg.description || `Resting 12-lead electrocardiogram testing at Saraswathy Lab & Medicals.`,
      overview: ecg.description || 'Non-invasive cardiac rhythm assessment using resting 12-lead electrocardiography.',
      whoFor: 'Patients evaluating heart rate, chest discomfort, or routine pre-operative cardiac clearance.',
      preparation: 'Wear loose-fitting upper clothing for easy electrode placement.',
      faqs: [],
      relatedServices: [],
    };
  }

  // 6. Check HealthPackage
  const pkg = await db.healthPackage.findUnique({ where: { slug } });
  if (pkg) {
    return {
      slug: pkg.slug,
      title: `${pkg.name} | Saraswathy Lab`,
      heading: pkg.name,
      metaDescription: pkg.description,
      overview: pkg.description,
      whoFor: pkg.targetAudience || 'Ideal for general health monitoring and preventive wellness screenings.',
      preparation: 'Requires 10-12 hours of overnight fasting before morning sample collection.',
      faqs: [],
      relatedServices: [],
    };
  }

  return null;
}

// 1. Generate Metadata dynamically for SEO crawler indexing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceData(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.metaDescription,
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceData(slug);

  if (!service) {
    notFound();
  }

  // Generate medical business diagnostic JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    'name': service.title,
    'description': service.metaDescription,
    'about': {
      '@type': 'MedicalBusiness',
      'name': 'Saraswathy Lab & Medicals',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'No. 1/1, Madukkarai Main Road, Near Signal, Sundarapuram',
        'addressLocality': 'Sundarapuram, Coimbatore',
        'addressRegion': 'Tamil Nadu',
        'postalCode': '641024',
        'addressCountry': 'IN',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* Inject JSON-LD */}
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
            <span className="text-slate-500">Services</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-sky-600 font-bold">{service.heading}</span>
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
                  {service.heading}
                </h1>
                <p className="text-xs text-sky-600 mt-2 font-bold uppercase tracking-wider">
                  Saraswathy Diagnostics &bull; Established 1986
                </p>
              </div>
              <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl border border-sky-100 shrink-0">
                <Microscope className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              <div>
                <h3 className="text-slate-900 font-bold text-base mb-2">Test Overview</h3>
                <p>{service.overview}</p>
              </div>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-slate-900 font-bold text-base mb-4">Related Test Questions</h3>
                  {service.faqs.map((faq, idx) => (
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
                <h4 className="text-base font-bold text-slate-900">Need to schedule this test?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Send us an enquiry. We process reports within 12 hours.</p>
              </div>
              <Link
                href={`/#contact`}
                className="w-full sm:w-auto text-center bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:from-sky-700 hover:to-teal-700 transition-all text-sm whitespace-nowrap"
              >
                Send Enquiry
              </Link>
            </div>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
