'use client';

import React, { useState, useEffect } from 'react';
import { Search, Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface SEOSetting {
  id: string;
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string;
}

export default function AdminSEOPage() {
  const [seoList, setSeoList] = useState<SEOSetting[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    pageSlug: 'home',
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    keywords: '',
  });

  const fetchSEO = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      if (res.ok) {
        setSeoList(data.seoSettings || []);
        const current = (data.seoSettings || []).find((s: SEOSetting) => s.pageSlug === selectedSlug);
        if (current) {
          setForm({
            pageSlug: current.pageSlug,
            metaTitle: current.metaTitle || '',
            metaDescription: current.metaDescription || '',
            ogTitle: current.ogTitle || '',
            ogDescription: current.ogDescription || '',
            keywords: current.keywords || '',
          });
        }
      } else {
        setError(data.error || 'Failed to fetch SEO settings.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, [selectedSlug]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('SEO settings saved successfully.');
        fetchSEO();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save SEO settings.');
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SEO & Open Graph Metadata</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Configure search engine titles, meta descriptions, and social preview cards.</p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-md max-w-4xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-slate-500 uppercase">Select Target Page:</span>
          {['home', 'about', 'services'].map((slug) => (
            <button
              key={slug}
              onClick={() => setSelectedSlug(slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                selectedSlug === slug ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {slug} Page
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading SEO settings...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta Title Tag (Character Count: {form.metaTitle.length} / 60)</label>
              <input
                type="text"
                required
                maxLength={70}
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                placeholder="e.g. Saraswathy Lab | Diagnostic Testing Sundarapuram"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Meta Description (Character Count: {form.metaDescription.length} / 160)</label>
              <textarea
                rows={3}
                required
                maxLength={170}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Open Graph Social Title</label>
              <input
                type="text"
                value={form.ogTitle}
                onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Open Graph Description</label>
              <textarea
                rows={2}
                value={form.ogDescription}
                onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Keywords (Comma-Separated)</label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
                placeholder="e.g. Saraswathy Lab, blood test, HbA1c, Sundarapuram"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save SEO Metadata'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
