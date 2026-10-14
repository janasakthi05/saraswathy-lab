'use client';

import React, { useState, useEffect } from 'react';
import { Home, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminHomepageCMSPage() {
  const [form, setForm] = useState({
    heroHeading: '',
    heroSubheading: '',
    heroCtaText: '',
    heroCtaLink: '',
    heroImage: '',
    aboutHeading: '',
    aboutDescription: '',
    aboutImage: '',
    contactHeading: '',
    contactDescription: '',
    contactButtonText: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fetchHomepage = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      if (res.ok && data.homepage) {
        setForm({
          heroHeading: data.homepage.heroHeading || '',
          heroSubheading: data.homepage.heroSubheading || '',
          heroCtaText: data.homepage.heroCtaText || '',
          heroCtaLink: data.homepage.heroCtaLink || '',
          heroImage: data.homepage.heroImage || '',
          aboutHeading: data.homepage.aboutHeading || '',
          aboutDescription: data.homepage.aboutDescription || '',
          aboutImage: data.homepage.aboutImage || '',
          contactHeading: data.homepage.contactHeading || '',
          contactDescription: data.homepage.contactDescription || '',
          contactButtonText: data.homepage.contactButtonText || '',
        });
      } else {
        setError('Failed to fetch homepage content.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Homepage CMS content saved successfully.');
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to update homepage content.');
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Homepage Content Management</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Update Hero banner copy, call-to-action links, and introductory content without touching code.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading homepage content...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-md max-w-4xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hero Section Box */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-sky-600" />
                <span>Hero Banner Section</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Hero Headline</label>
                <textarea
                  rows={2}
                  required
                  value={form.heroHeading}
                  onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Hero Subheading Paragraph</label>
                <textarea
                  rows={3}
                  required
                  value={form.heroSubheading}
                  onChange={(e) => setForm({ ...form, heroSubheading: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Button Label</label>
                  <input
                    type="text"
                    required
                    value={form.heroCtaText}
                    onChange={(e) => setForm({ ...form, heroCtaText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Button Link Target</label>
                  <input
                    type="text"
                    required
                    value={form.heroCtaLink}
                    onChange={(e) => setForm({ ...form, heroCtaLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* About Section Box */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="text-base font-bold text-slate-900">About Laboratory Summary</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">About Section Heading</label>
                <input
                  type="text"
                  required
                  value={form.aboutHeading}
                  onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">About Summary Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.aboutDescription}
                  onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
                />
              </div>
            </div>

            {/* Contact CTA Section Box */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Contact Enquiry Section CTA</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Heading</label>
                <input
                  type="text"
                  required
                  value={form.contactHeading}
                  onChange={(e) => setForm({ ...form, contactHeading: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Description</label>
                <textarea
                  rows={2}
                  required
                  value={form.contactDescription}
                  onChange={(e) => setForm({ ...form, contactDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
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
                <span>{saving ? 'Saving Content...' : 'Save Homepage CMS Content'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
