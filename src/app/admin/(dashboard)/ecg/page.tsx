'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Plus, Search, Edit3, Trash2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ECGService {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminECGPage() {
  const [services, setServices] = useState<ECGService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', type: 'Resting 12-Lead', displayOrder: 0, isActive: true });

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/ecg');
      const data = await res.json();
      if (res.ok) {
        setServices(data.ecgs || []);
      } else {
        setError(data.error || 'Failed to fetch ECG catalog.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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
      const url = editingId ? `/api/admin/ecg/${editingId}` : '/api/admin/ecg';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingId ? 'ECG service updated.' : 'New ECG service created.');
        fetchServices();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save ECG service.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ECG service "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ecg/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('ECG service deleted.');
        fetchServices();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ECG Services</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage 12-Lead Electrocardiogram and digital cardiac monitoring entries.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ name: '', slug: '', description: '', type: 'Resting 12-Lead', displayOrder: services.length + 1, isActive: true });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add ECG Service</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ECG by service name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3 shrink-0" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading ECG services...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Activity className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No ECG services found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <th className="pb-3 pr-4">Service Name</th>
                  <th className="pb-3 pr-4">ECG Type</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 group">
                    <td className="py-4 pr-4">
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">/{s.slug}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        {s.type || 'Resting 12-Lead'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-slate-600 max-w-[280px] truncate">
                      {s.description || 'N/A'}
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {s.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingId(s.id);
                          setForm({ name: s.name, slug: s.slug, description: s.description || '', type: s.type || 'Resting 12-Lead', displayOrder: s.displayOrder, isActive: s.isActive });
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit ECG Service' : 'Add ECG Service'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Service Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                  placeholder="e.g. 12-Lead Resting ECG"
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
                <label className="text-xs font-bold text-slate-500 uppercase">ECG Type / Method</label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                  placeholder="e.g. Resting 12-Lead or Digital Analysis"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="ecgActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="ecgActive" className="text-xs font-bold text-slate-700">Active on Public Website</label>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
              >
                Save ECG Service
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
