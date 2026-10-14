'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, AlertCircle, MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function AdminBusinessPage() {
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    phone: '',
    mobile: '',
    timing: '',
    email: '',
    mapUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fetchBusiness = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/business');
      const data = await res.json();
      if (res.ok && data.business) {
        setForm({
          businessName: data.business.businessName || '',
          address: data.business.address || '',
          phone: data.business.phone || '',
          mobile: data.business.mobile || '',
          timing: data.business.timing || '',
          email: data.business.email || '',
          mapUrl: data.business.mapUrl || '',
        });
      } else {
        setError('Failed to fetch business information.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Business contact information saved successfully.');
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save business settings.');
      }
    } catch (err) {
      alert('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left bg-slate-50 min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Information</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Central contact details, laboratory timings, phone lines, and address settings.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading business settings...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-md max-w-4xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Laboratory Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Physical Address</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Landline Phone</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Mobile Line / WhatsApp</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Laboratory Operating Hours</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span>Official Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Google Maps Directions Link</label>
                <input
                  type="url"
                  value={form.mapUrl}
                  onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Business Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
