'use client';

import React, { useState } from 'react';
import { Truck, XCircle, CheckCircle2, AlertTriangle, Send, Phone, MapPin, Calendar } from 'lucide-react';

interface HomeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomeCollectionModal({ isOpen, onClose }: HomeCollectionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [messageText, setMessageText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    setMessageText('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setStatus('ERROR');
      setMessageText('Name, phone number, and address are required.');
      return;
    }

    try {
      const res = await fetch('/api/home-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('SUCCESS');
        setFormData({ name: '', phone: '', address: '', preferredDate: '', preferredTime: '', honeypot: '' });
      } else {
        setStatus('ERROR');
        setMessageText(data.error || 'Failed to submit home collection request.');
      }
    } catch (err) {
      setStatus('ERROR');
      setMessageText('Connection error. Please call our lab desk directly at 0422-2674699.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl text-left space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Schedule Home Collection</h3>
              <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Phlebotomist Home Visit</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Emergency/Medical Notice */}
        <div className="flex gap-2.5 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-900 text-xs font-semibold leading-relaxed">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> Home phlebotomy visits are conducted daily from 7:00 AM onwards around Sundarapuram & nearby Coimbatore localities.
          </span>
        </div>

        {status === 'SUCCESS' ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto border border-sky-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Appointment Requested</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-medium">
                Our phlebotomy coordinator will call your phone number shortly to confirm slot timing and fasting instructions.
              </p>
            </div>
            <button
              onClick={() => {
                setStatus('IDLE');
                onClose();
              }}
              className="bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Patient Full Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Mobile Phone Number <span className="text-rose-500">*</span></label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Collection Address <span className="text-rose-500">*</span></label>
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium resize-none"
                placeholder="Door No, Street Name, Area (e.g. Sundarapuram / Madukkarai / Podanur)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Preferred Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Preferred Time Slot</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                >
                  <option value="">Morning (7:00 AM - 9:30 AM)</option>
                  <option value="Mid-Morning">Mid-Morning (9:30 AM - 12:00 PM)</option>
                  <option value="Afternoon">Afternoon (12:00 PM - 3:00 PM)</option>
                </select>
              </div>
            </div>

            {status === 'ERROR' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold">
                {messageText}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'LOADING'}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {status === 'LOADING' ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Home Collection Booking</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
