'use client';

import React, { useState, useEffect } from 'react';
import { Info, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAboutCMSPage() {
  const [form, setForm] = useState({
    aboutHeading: '',
    aboutDescription: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fetchAbout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/homepage');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (res.ok && data.homepage) {
        setForm({
          aboutHeading: data.homepage.aboutHeading || '',
          aboutDescription: data.homepage.aboutDescription || '',
        });
      } else {
        setError('Failed to fetch about content.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
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
        showToast('About section content saved successfully.');
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save about content.');
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">About Laboratory Content</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Edit laboratory history, established year highlights, and patient care commitment.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading content...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-md max-w-3xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600" />
                <span>Section Heading</span>
              </label>
              <input
                type="text"
                required
                value={form.aboutHeading}
                onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Laboratory History & Mission</label>
              <textarea
                rows={6}
                required
                value={form.aboutDescription}
                onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save About Content'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
