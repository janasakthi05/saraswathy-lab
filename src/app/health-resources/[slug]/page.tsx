import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articlesData } from '@/data/articles';
import { ChevronRight, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const art = articlesData[slug];
  if (!art) return {};

  return {
    title: art.title,
    description: art.excerpt,
    alternates: {
      canonical: `/health-resources/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(articlesData).map((slug) => ({
    slug,
  }));
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const art = articlesData[slug];

  if (!art) {
    notFound();
  }

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': art.title,
    'description': art.excerpt,
    'datePublished': '2026-07-14T00:00:00Z',
    'author': {
      '@type': 'Person',
      'name': art.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Saraswathy Lab & Medicals',
      'logo': {
        '@type': 'ImageObject',
        'url': '/favicon.svg',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Header />

      <main className="flex-grow pt-28 pb-16 text-left">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-500">Resources</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-sky-600 font-bold">{art.slug}</span>
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
                  {art.title}
                </h1>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Published by {art.author} &bull; {art.date} &bull; {art.readTime}
                </p>
              </div>
              <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl border border-sky-100 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            {/* Content Body */}
            <div
              className="prose max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: art.content }}
            />

            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-600">
                <strong className="text-slate-900">Medical Disclaimer:</strong> {art.medicalDisclaimer}
              </div>
            </div>

            {/* CTA action */}
            <div className="border-t border-slate-100 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Need professional laboratory answers?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Schedule a blood draw or request cost coordinates directly from our team.</p>
              </div>
              <Link
                href={`/#contact`}
                className="w-full sm:w-auto text-center bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:from-sky-700 hover:to-teal-700 transition-all text-sm whitespace-nowrap"
              >
                Inquire / Send Message
              </Link>
            </div>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
