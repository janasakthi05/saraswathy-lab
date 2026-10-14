'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Packages from '@/components/Packages';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import PrivacyModal from '@/components/PrivacyModal';
import HomeCollectionModal from '@/components/HomeCollectionModal';
import { MapPin, Clock, Compass, Phone } from 'lucide-react';

export default function Home() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [homeCollectionOpen, setHomeCollectionOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState('General Enquiry');
  const [cmsData, setCmsData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/public/data')
      .then((res) => res.json())
      .then((data) => {
        setCmsData(data);
      })
      .catch(console.error);
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServiceSelect = (title: string) => {
    setInquiryType(title);
    scrollToContact();
  };

  const business = cmsData?.business;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
      
      {/* Sticky Navigation Header */}
      <Header
        onBookClick={scrollToContact}
        onHomeCollectionClick={() => setHomeCollectionOpen(true)}
        businessPhone={business?.phone || '+91 9489516699'}
      />

      {/* Main Page Sections */}
      <main className="grow">
        
        {/* Visual Hero Panel */}
        <Hero
          onBookClick={scrollToContact}
          onServicesClick={scrollToServices}
          homepageData={cmsData?.homepage}
          businessData={cmsData?.business}
        />

        {/* Diagnostic Services Section */}
        <Services
          onServiceSelect={handleServiceSelect}
          categoriesData={cmsData?.categories}
          xraysData={cmsData?.xrays}
          ecgsData={cmsData?.ecgs}
        />

        {/* Healthcare Initiatives & Packages Section */}
        <Packages
          packagesData={cmsData?.packages}
          initiativesData={cmsData?.initiatives}
          onSelectPackage={handleServiceSelect}
        />

        {/* About Section */}
        <About homepageData={cmsData?.homepage} />

        {/* Patient Reviews & Testimonials */}
        <Testimonials testimonialsData={cmsData?.testimonials} />

        {/* Laboratory Photo Gallery */}
        <Gallery galleryData={cmsData?.gallery} />

        {/* Why Choose Us Trust Panel */}
        <WhyChooseUs />

        {/* Step-by-Step Patient Process */}
        <HowItWorks />

        {/* FAQs Accordion */}
        <FAQ />

        {/* Locations Section */}
        <section id="locations" className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-left max-w-3xl mb-16">
              <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                Our Branch
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                Sundarapuram Signal Central Facility
              </h2>
              <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed font-medium">
                We serve patients across Sundarapuram, Madukkarai, and Podanur. Visit us directly or query for local phlebotomist collections.
              </p>
            </div>

            {/* Location Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Detailed Card */}
              <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 p-6 sm:p-8 rounded-3xl text-left space-y-6 shadow-md">
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-sky-600">
                    {business?.businessName || 'Saraswathy Lab & Medicals'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">ESTABLISHED 1986 &bull; COIMBATORE</p>
                </div>

                <div className="space-y-4">
                  
                  {/* Address info */}
                  <div className="flex items-start gap-3 text-slate-700">
                    <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Address</h4>
                      <p className="text-sm font-semibold mt-0.5 leading-snug">
                        {business?.address || 'No. 1/1, Madukkarai Main Road, Near Signal, Sundarapuram, Coimbatore - 641024'}
                      </p>
                    </div>
                  </div>

                  {/* Hours info */}
                  <div className="flex items-start gap-3 text-slate-700">
                    <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Operating Hours</h4>
                      <p className="text-sm font-semibold mt-0.5 leading-snug text-slate-900">
                        {business?.timing || 'Daily 7:00 AM – 9:30 PM'}
                      </p>
                    </div>
                  </div>

                  {/* Direct Directions */}
                  <div className="flex items-start gap-3 text-slate-700">
                    <Compass className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Directions</h4>
                      <p className="text-sm font-semibold mt-0.5 leading-snug">
                        Located right near the main Sundarapuram signal junction, opposite the pharmacy branch. Dedicated parking space available.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Mobile action call buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <a
                    href={`tel:${business?.phone || '04222674699'}`}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl border border-slate-300 transition-colors text-xs uppercase tracking-wider shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span>Call Landline</span>
                  </a>
                  <a
                    href={business?.mapUrl || "https://maps.google.com/?q=Saraswathy+Lab+Sundarapuram+Coimbatore"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider text-center shadow-md shadow-sky-600/20"
                  >
                    <span>Get Directions</span>
                  </a>
                </div>

              </div>

              {/* Map embed / Directions summary */}
              <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/90 p-6 sm:p-8 rounded-3xl text-left space-y-6 shadow-md">
                <h4 className="text-slate-900 font-bold text-base">Local Proximity Directions</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Our laboratory sits along the critical Madukkarai Main Road corridor, making it easily accessible for residents of:
                </p>
                <ul className="grid grid-cols-2 gap-3 text-xs font-bold uppercase text-slate-800">
                  <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>Sundarapuram</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>Madukkarai</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>Podanur</span>
                  </li>
                  <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>Kurichi</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 font-medium leading-relaxed">
                  To request a home blood collection dispatch to any of these Coimbatore areas, please fill in the contact form below or click Schedule Home Collection.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Contact Form & Warnings */}
        <ContactForm prefilledInquiryType={inquiryType} onPrivacyClick={() => setPrivacyOpen(true)} />

      </main>

      {/* Global Footer */}
      <Footer onPrivacyClick={() => setPrivacyOpen(true)} onBookClick={scrollToContact} />

      {/* HIPAA Compliance Privacy Modal */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      {/* Home Collection Request Modal */}
      <HomeCollectionModal isOpen={homeCollectionOpen} onClose={() => setHomeCollectionOpen(false)} />

    </div>
  );
}
