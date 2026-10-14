'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, AlertCircle, Star } from 'lucide-react';

interface HealthPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  includedTests: string;
  targetAudience?: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    includedTests: '',
    targetAudience: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
  });

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/packages');
      const data = await res.json();
      if (res.ok) {
        setPackages(data.packages || []);
      } else {
        setError(data.error || 'Failed to fetch health packages.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingId ? 'Health package updated.' : 'New health package created.');
        fetchPackages();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save health package.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete health package "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Health package deleted.');
        fetchPackages();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filtered = packages.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left bg-slate-50 min-h-screen">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Preventive Health Packages</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage Master Health Checkup, Diabetes Panel, and Senior Citizen profiles.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: '',
              slug: '',
              description: '',
              includedTests: '',
              targetAudience: '',
              displayOrder: packages.length + 1,
              isActive: true,
              isFeatured: false,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Health Package</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search health packages..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3 shrink-0" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading health packages...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Package className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No health packages found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((pkg) => (
              <div key={pkg.id} className="bg-slate-50/70 border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-xs relative">
                {pkg.isFeatured && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>Featured Package</span>
                  </span>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">/{pkg.slug}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{pkg.description}</p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Included Assays & Tests</span>
                  <span className="text-slate-800 font-semibold">{pkg.includedTests}</span>
                </div>
                {pkg.targetAudience && (
                  <div className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 w-fit">
                    Target: {pkg.targetAudience}
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {pkg.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(pkg.id);
                        setForm({
                          name: pkg.name,
                          slug: pkg.slug,
                          description: pkg.description,
                          includedTests: pkg.includedTests,
                          targetAudience: pkg.targetAudience || '',
                          displayOrder: pkg.displayOrder,
                          isActive: pkg.isActive,
                          isFeatured: pkg.isFeatured,
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Package' : 'Add Health Package'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Package Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                  placeholder="e.g. Master Health Checkup"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">URL Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Package Description</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Included Tests (List)</label>
                <textarea
                  rows={2}
                  required
                  value={form.includedTests}
                  onChange={(e) => setForm({ ...form, includedTests: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none"
                  placeholder="e.g. CBC, Lipid Profile, LFT, KFT, Fasting Sugar, Urine"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Target Audience</label>
                <input
                  type="text"
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                  placeholder="e.g. Adults over 30 or Senior citizens"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pkgActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                  <label htmlFor="pkgActive" className="text-xs font-bold text-slate-700">Active</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pkgFeatured"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="pkgFeatured" className="text-xs font-bold text-slate-700">Featured</label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Health Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
