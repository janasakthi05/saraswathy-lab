'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit3, Trash2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    category: 'Laboratory',
    displayOrder: 0,
    isPublished: true,
  });

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      } else {
        setError(data.error || 'Failed to fetch gallery items.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showToast(editingId ? 'Gallery item updated.' : 'New gallery item created.');
        fetchItems();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save gallery item.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete gallery item "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Gallery item deleted.');
        fetchItems();
      }
    } catch (err) {
      alert('Delete failed.');
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laboratory Gallery</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage facility photos, automated clinical analyzers, and lab infrastructure images.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              title: '',
              description: '',
              imageUrl: '',
              altText: '',
              category: 'Laboratory',
              displayOrder: items.length + 1,
              isPublished: true,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Image</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading gallery...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No gallery images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-50/70 border border-slate-200/90 rounded-3xl overflow-hidden space-y-4 shadow-xs flex flex-col justify-between">
                <div className="h-44 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={item.imageUrl || DEFAULT_PLACEHOLDER_IMAGE}
                    alt={item.altText || item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>
                <div className="px-6 space-y-2 text-left">
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-medium">{item.description || 'No description provided.'}</p>
                </div>
                <div className="p-6 pt-0 border-t border-slate-200/80 mt-2 flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {item.isPublished ? 'Published' : 'Hidden'}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setForm({
                          title: item.title,
                          description: item.description || '',
                          imageUrl: item.imageUrl,
                          altText: item.altText || '',
                          category: item.category || 'Laboratory',
                          displayOrder: item.displayOrder,
                          isPublished: item.isPublished,
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Gallery Image' : 'Add Gallery Image'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Image Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                  placeholder="e.g. Automated Biochemistry Analyzer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Image Asset URL / Web Link</label>
                <input
                  type="text"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900"
                  placeholder="e.g. https://images.unsplash.com/... or /images/lab.jpg"
                />
                <p className="text-[11px] text-slate-400 font-medium">Use a valid image Web URL (https://...) or a public path (/images/...).</p>
              </div>

              {/* Live Preview Box */}
              {form.imageUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Live Image Preview</span>
                  <div className="h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category Tag</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900"
                >
                  <option value="Laboratory">Laboratory & Equipment</option>
                  <option value="Facility">Sundarapuram Facility</option>
                  <option value="Phlebotomy">Phlebotomy & Sample Collection</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="galPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                />
                <label htmlFor="galPublished" className="text-xs font-bold text-slate-700 cursor-pointer">Published on Website Gallery</label>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Gallery Image
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
