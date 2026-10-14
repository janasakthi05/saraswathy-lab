'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle, MessageSquarePlus, MessageSquare, XCircle, Send, ExternalLink, ShieldCheck } from 'lucide-react';

interface GoogleReviewItem {
  id: string;
  patientName: string;
  reviewText: string;
  rating: number;
  photoUrl?: string;
  relativeTime?: string;
  source?: string;
}

interface TestimonialsProps {
  testimonialsData?: GoogleReviewItem[];
}

export default function Testimonials({ testimonialsData = [] }: TestimonialsProps) {
  const [googleData, setGoogleData] = useState<{
    rating: number;
    totalRatings: number;
    writeReviewUrl: string;
    reviews: GoogleReviewItem[];
  }>({
    rating: 5.0,
    totalRatings: 48,
    writeReviewUrl: 'https://maps.google.com/?q=Saraswathy+Lab+Sundarapuram+Coimbatore',
    reviews: [],
  });

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);

  // Write Review Form State
  const [formData, setFormData] = useState({
    patientName: '',
    rating: 5,
    reviewText: '',
    email: '',
    phone: '',
    consent: false,
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetch('/api/google-reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.reviews) {
          setGoogleData({
            rating: data.rating || 5.0,
            totalRatings: data.totalRatings || 48,
            writeReviewUrl: data.writeReviewUrl || 'https://maps.google.com/?q=Saraswathy+Lab+Sundarapuram+Coimbatore',
            reviews: data.reviews,
          });
        }
      })
      .catch((err) => console.error('Failed to load Google Reviews:', err));
  }, []);

  const displayReviews = googleData.reviews.length > 0 ? googleData.reviews : testimonialsData;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('LOADING');
    setStatusMessage('');

    if (!formData.patientName.trim()) {
      setSubmitStatus('ERROR');
      setStatusMessage('Please enter your full name.');
      return;
    }

    if (!formData.reviewText.trim()) {
      setSubmitStatus('ERROR');
      setStatusMessage('Please write your review feedback.');
      return;
    }

    if (!formData.consent) {
      setSubmitStatus('ERROR');
      setStatusMessage('You must check the consent box to agree to publication rules.');
      return;
    }

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('SUCCESS');
        setStatusMessage(data.message || 'Thank you for your feedback. Your review has been submitted for verification.');
        setFormData({
          patientName: '',
          rating: 5,
          reviewText: '',
          email: '',
          phone: '',
          consent: false,
        });
      } else {
        setSubmitStatus('ERROR');
        setStatusMessage(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setSubmitStatus('ERROR');
      setStatusMessage('Network connection error. Please try again.');
    }
  };

  return (
    <section id="reviews" className="py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Action Buttons & Google Rating Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 border border-sky-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-current text-sky-600" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
                </svg>
                <span>Google Business Reviews</span>
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{googleData.rating.toFixed(1)} / 5.0 Rating</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Google Reviews & Patient Feedback
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed font-medium">
              Read authentic Google reviews from local patients and families who trust Saraswathy Lab for their diagnostic testing and health screening.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <a
              href={googleData.writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider whitespace-nowrap"
            >
              <span>Write a Review on Google</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 px-5 py-3 rounded-2xl transition-colors cursor-pointer text-xs uppercase tracking-wider whitespace-nowrap shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4 text-sky-600" />
              <span>Submit Site Review</span>
            </button>
          </div>
        </div>

        {/* Featured Google Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {displayReviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-md flex flex-col justify-between space-y-6 relative hover:shadow-xl transition-all duration-300"
            >
              {/* Google Verified Icon Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600">
                <svg className="w-3 h-3 fill-sky-600" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
                </svg>
                <span>Google</span>
              </div>

              <div className="space-y-4">
                {/* Star Ratings */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium italic">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center font-bold text-sm shrink-0">
                  {rev.photoUrl ? (
                    <img src={rev.photoUrl} alt={rev.patientName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    rev.patientName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>{rev.patientName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 inline-block" />
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {rev.relativeTime || 'Verified Google Review'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL 1: WRITE A REVIEW MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl text-left space-y-6 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-200">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Share Your Patient Experience</h3>
                  <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Patient Feedback Form</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsWriteModalOpen(false);
                  setSubmitStatus('IDLE');
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {submitStatus === 'SUCCESS' ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Review Submitted</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
                    {statusMessage}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWriteModalOpen(false);
                    setSubmitStatus('IDLE');
                  }}
                  className="bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Rating Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">
                    Rating <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating !== null ? hoverRating : formData.rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Patient Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. R. Murugesan"
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Your Review / Feedback <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    placeholder="Describe your experience with blood draws, reports, staff, or facilities..."
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium resize-none focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Optional Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="reviewConsent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                  <label htmlFor="reviewConsent" className="text-xs text-slate-600 font-medium leading-tight cursor-pointer">
                    I agree that my feedback may be published on the website after verification.
                  </label>
                </div>

                {submitStatus === 'ERROR' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold">
                    {statusMessage}
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitStatus === 'LOADING'}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {submitStatus === 'LOADING' ? (
                    <span>Submitting Review...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
