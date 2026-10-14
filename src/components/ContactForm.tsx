'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  prefilledInquiryType?: string;
  onPrivacyClick: () => void;
}

export default function ContactForm({ prefilledInquiryType = 'General Enquiry', onPrivacyClick }: ContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: prefilledInquiryType,
    subject: '',
    message: '',
    termsAccepted: false,
    honeypot: '', // bot trap
  });

  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [messageText, setMessageText] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    setMessageText('');
    setReferenceId('');

    // 1. Basic validation
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setStatus('ERROR');
      setMessageText('Please fill in all mandatory fields (including your message).');
      return;
    }

    // 2. Client-side length checks
    if (formData.fullName.length > 100) {
      setStatus('ERROR');
      setMessageText('Full Name must not exceed 100 characters.');
      return;
    }
    if (formData.email.length > 254) {
      setStatus('ERROR');
      setMessageText('Email Address must not exceed 254 characters.');
      return;
    }
    if (formData.phone.length > 30) {
      setStatus('ERROR');
      setMessageText('Phone Number must not exceed 30 characters.');
      return;
    }
    if (formData.subject.length > 150) {
      setStatus('ERROR');
      setMessageText('Subject must not exceed 150 characters.');
      return;
    }
    if (formData.message.length > 5000) {
      setStatus('ERROR');
      setMessageText('Message must not exceed 5000 characters.');
      return;
    }

    if (!formData.termsAccepted) {
      setStatus('ERROR');
      setMessageText('You must review and accept the HIPAA data terms.');
      return;
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('ERROR');
        setMessageText(data.error || 'Something went wrong. Please try again.');
      } else {
        setStatus('SUCCESS');
        setReferenceId(data.id || '');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          inquiryType: 'General Enquiry',
          subject: '',
          message: '',
          termsAccepted: false,
          honeypot: '',
        });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('ERROR');
      setMessageText('Unable to connect to the database. Please contact us directly via phone.');
    }
  };

  const inquiryTypes = [
    'General Enquiry',
    'Test Information',
    'Health Checkup Information',
    'Home Collection Inquiry',
    'Location / Timing',
    'Other',
  ];

  return (
    <section id="contact" className="py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-8">
            
            <div>
              <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                Contact Saraswathy Lab & Medicals
              </h2>
              <p className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed font-medium">
                Use our diagnostic contact form to ask about test preparations, request home phlebotomy visits, or query results.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="bg-white text-sky-600 p-3.5 rounded-xl border border-slate-200 shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Location</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-1 leading-snug">
                    No. 1/1, Madukkarai Main Road,<br />
                    Near Signal, Sundarapuram,<br />
                    Coimbatore, Tamil Nadu - 641024
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="bg-white text-sky-600 p-3.5 rounded-xl border border-slate-200 shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Phone Lines</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-1 leading-snug">
                    Landline: <a href="tel:04222674699" className="hover:text-sky-600 transition-colors">0422 2674699</a><br />
                    Mobile: <a href="tel:+919489516699" className="hover:text-sky-600 transition-colors">+91 9489516699</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="bg-white text-sky-600 p-3.5 rounded-xl border border-slate-200 shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Official Email</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-1">
                    <a href="mailto:saraswathylab27@gmail.com" className="hover:text-sky-600 transition-colors">
                      saraswathylab27@gmail.com
                    </a>
                  </p>
                </div>
              </div>

            </div>

            {/* Timings summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-slate-600 text-xs shadow-xs font-medium">
              <span className="font-bold text-slate-900 block mb-1">Operating Hours:</span>
              <span className="block">Laboratory: Daily 7:00 AM – 10:00 PM</span>
              <span className="block">Pharmacy: Daily 9:00 AM – 10:30 PM</span>
            </div>

          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 p-6 sm:p-10 rounded-3xl shadow-xl text-left">
              
              {/* Emergency Alert Banner */}
              <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4.5 rounded-2xl text-amber-900 mb-8">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-semibold">
                  <strong className="text-amber-900">Important:</strong> Please do not submit highly sensitive medical records, passwords, payment information, or emergency requests through this general enquiry form. For emergencies, contact local emergency services immediately.
                </p>
              </div>

              {status === 'SUCCESS' ? (
                <div className="space-y-6 py-8 text-center">
                  <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto border border-sky-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Enquiry Received</h3>
                    <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto font-medium">
                      Thank you. We have saved your enquiry in our central database. Our team will review your parameters shortly.
                    </p>
                  </div>
                  {referenceId && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit mx-auto text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block">Reference ID</span>
                      <span className="font-mono text-sky-600 font-bold text-sm select-all mt-1 block">
                        {referenceId}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setStatus('IDLE')}
                    className="bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Honeypot field (hidden from users) */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    className="hidden"
                    autoComplete="off"
                  />

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold text-slate-500 uppercase">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone and Type Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="inquiryType" className="text-xs font-bold text-slate-500 uppercase">
                        Inquiry Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium appearance-none"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type} className="bg-white text-slate-900">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase">
                      Subject / Test Prescribed <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
                      placeholder="e.g. HbA1c Sugar Test checkup"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400 resize-none"
                      placeholder="Specify test details or preferred scheduling dates here..."
                    />
                  </div>

                  {/* HIPAA Terms Checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleCheckboxChange}
                      required
                      className="w-4 h-4 text-sky-600 border-slate-300 bg-slate-50 rounded focus:ring-sky-500 mt-1 cursor-pointer"
                    />
                    <label htmlFor="termsAccepted" className="text-xs text-slate-600 leading-relaxed font-medium">
                      I agree that my submitted details are handled securely. I acknowledge the{' '}
                      <button
                        type="button"
                        onClick={onPrivacyClick}
                        className="text-sky-600 hover:underline inline font-semibold focus:outline-none"
                      >
                        Privacy Policy
                      </button>{' '}
                      governing general pathology communications.
                    </label>
                  </div>

                  {/* Errors display */}
                  {status === 'ERROR' && (
                    <div className="text-rose-600 text-xs font-bold bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
                      {messageText}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'LOADING'}
                      className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer disabled:opacity-50 text-sm uppercase tracking-wider"
                    >
                      {status === 'LOADING' ? (
                        <span>Processing Booking...</span>
                      ) : (
                        <>
                          <Send className="w-4.5 h-4.5" />
                          <span>Submit Diagnostic Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
