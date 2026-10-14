'use client';

import React, { useState, useEffect } from 'react';
import { Microscope, Plus, Search, Filter, Edit3, Trash2, CheckCircle2, XCircle, AlertCircle, Layers, ArrowLeft } from 'lucide-react';

interface DiagnosticCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

interface DiagnosticTest {
  id: string;
  categoryId: string;
  category?: DiagnosticCategory;
  name: string;
  slug: string;
  shortDescription?: string;
  overview?: string;
  whoFor?: string;
  preparation?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminDiagnosticTestsPage() {
  const [categories, setCategories] = useState<DiagnosticCategory[]>([]);
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState('');

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catEditingId, setCatEditingId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', icon: 'Microscope', displayOrder: 0, isActive: true });

  // Test Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEditingId, setTestEditingId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState({
    categoryId: '',
    name: '',
    slug: '',
    shortDescription: '',
    overview: '',
    whoFor: '',
    preparation: '',
    displayOrder: 0,
    isActive: true,
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [catRes, testRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/tests'),
      ]);
      const catData = await catRes.json();
      const testData = await testRes.json();

      if (!catRes.ok || !testRes.ok) {
        setError('Failed to fetch diagnostic catalog from server.');
      } else {
        setCategories(catData.categories || []);
        setTests(testData.tests || []);
      }
    } catch (err) {
      setError('Connection failure. Please check database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Helper auto slug generator
  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  // Handle Category Submit
  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = catEditingId ? 'PUT' : 'POST';
      const url = catEditingId ? `/api/admin/categories/${catEditingId}` : '/api/admin/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      });

      if (res.ok) {
        setIsCatModalOpen(false);
        showToast(catEditingId ? 'Category updated successfully.' : 'New category created.');
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'Operation failed.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // Handle Test Submit
  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = testEditingId ? 'PUT' : 'POST';
      const url = testEditingId ? `/api/admin/tests/${testEditingId}` : '/api/admin/tests';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm),
      });

      if (res.ok) {
        setIsTestModalOpen(false);
        showToast(testEditingId ? 'Test updated successfully.' : 'New diagnostic test created.');
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'Operation failed.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  const handleDeleteTest = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the diagnostic catalog?`)) return;
    try {
      const res = await fetch(`/api/admin/tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Diagnostic test deleted.');
        fetchData();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" and all its sub-tests?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Category deleted.');
        fetchData();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.shortDescription && t.shortDescription.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = !selectedCatId || t.categoryId === selectedCatId;
    const matchesStatus =
      !statusFilter || (statusFilter === 'active' ? t.isActive : !t.isActive);
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left bg-slate-50 min-h-screen">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostic Test Catalog</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage pathology categories, individual blood tests, sugar profiles, and laboratory assays.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCatEditingId(null);
              setCatForm({ name: '', slug: '', description: '', icon: 'Microscope', displayOrder: categories.length + 1, isActive: true });
              setIsCatModalOpen(true);
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-4 py-2.5 rounded-xl shadow-xs text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => {
              setTestEditingId(null);
              setTestForm({
                categoryId: categories[0]?.id || '',
                name: '',
                slug: '',
                shortDescription: '',
                overview: '',
                whoFor: '',
                preparation: '',
                displayOrder: tests.length + 1,
                isActive: true,
              });
              setIsTestModalOpen(true);
            }}
            className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-sky-600/20 text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Diagnostic Test</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Quick Filter Bar */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter By Pathology Category</span>
          <span className="text-xs font-semibold text-slate-500">{categories.length} Categories Configured</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCatId('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !selectedCatId ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories ({tests.length})
          </button>
          {categories.map((cat) => {
            const count = tests.filter((t) => t.categoryId === cat.id).length;
            const isSel = selectedCatId === cat.id;
            return (
              <div key={cat.id} className="inline-flex items-center gap-1">
                <button
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSel ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
                <button
                  onClick={() => {
                    setCatEditingId(cat.id);
                    setCatForm({
                      name: cat.name,
                      slug: cat.slug,
                      description: cat.description || '',
                      icon: cat.icon || 'Microscope',
                      displayOrder: cat.displayOrder,
                      isActive: cat.isActive,
                    });
                    setIsCatModalOpen(true);
                  }}
                  className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                  title="Edit Category"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Search and Status filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-3 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diagnostic test by name or description..."
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium placeholder:text-slate-400"
            />
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3 shrink-0" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
            >
              <option value="">All Statuses (Active & Disabled)</option>
              <option value="active">Active Only</option>
              <option value="inactive">Disabled Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Diagnostic Tests Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">
            Loading diagnostic catalog...
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Microscope className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No diagnostic tests matched your search or category filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <th className="pb-3 pr-4">Test Name</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Short Overview</th>
                  <th className="pb-3 pr-4">Fasting / Preparation</th>
                  <th className="pb-3 pr-4 text-center">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/80 group">
                    <td className="py-4 pr-4">
                      <span className="font-bold text-slate-900 block">{test.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">/{test.slug}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        {test.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-slate-600 max-w-[220px] truncate">
                      {test.shortDescription || test.overview || 'N/A'}
                    </td>
                    <td className="py-4 pr-4 text-xs font-medium text-slate-600 max-w-[180px] truncate">
                      {test.preparation || 'No fasting required'}
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                          test.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {test.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setTestEditingId(test.id);
                          setTestForm({
                            categoryId: test.categoryId,
                            name: test.name,
                            slug: test.slug,
                            shortDescription: test.shortDescription || '',
                            overview: test.overview || '',
                            whoFor: test.whoFor || '',
                            preparation: test.preparation || '',
                            displayOrder: test.displayOrder,
                            isActive: test.isActive,
                          });
                          setIsTestModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Edit Test"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id, test.name)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Test"
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

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {catEditingId ? 'Edit Pathology Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => {
                    setCatForm({
                      ...catForm,
                      name: e.target.value,
                      slug: catEditingId ? catForm.slug : slugify(e.target.value),
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                  placeholder="e.g. Blood Tests"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">URL Slug</label>
                <input
                  type="text"
                  required
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium resize-none"
                  placeholder="Category scope summary..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={catForm.isActive}
                  onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="catActive" className="text-xs font-bold text-slate-700">Category Active on Public Website</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diagnostic Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-left space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {testEditingId ? 'Edit Diagnostic Test' : 'Add New Diagnostic Test'}
              </h3>
              <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <select
                    required
                    value={testForm.categoryId}
                    onChange={(e) => setTestForm({ ...testForm, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Test Name</label>
                  <input
                    type="text"
                    required
                    value={testForm.name}
                    onChange={(e) => {
                      setTestForm({
                        ...testForm,
                        name: e.target.value,
                        slug: testEditingId ? testForm.slug : slugify(e.target.value),
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                    placeholder="e.g. Fasting Blood Sugar"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">URL Slug</label>
                <input
                  type="text"
                  required
                  value={testForm.slug}
                  onChange={(e) => setTestForm({ ...testForm, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Short Description</label>
                <input
                  type="text"
                  value={testForm.shortDescription}
                  onChange={(e) => setTestForm({ ...testForm, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                  placeholder="Brief summary of what this assay checks..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Detailed Overview</label>
                <textarea
                  rows={3}
                  value={testForm.overview}
                  onChange={(e) => setTestForm({ ...testForm, overview: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium resize-none"
                  placeholder="Clinical diagnostic significance..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Target Audience (Who is this for?)</label>
                  <input
                    type="text"
                    value={testForm.whoFor}
                    onChange={(e) => setTestForm({ ...testForm, whoFor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                    placeholder="e.g. Patients over 30 or diabetic monitoring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Fasting / Preparation</label>
                  <input
                    type="text"
                    value={testForm.preparation}
                    onChange={(e) => setTestForm({ ...testForm, preparation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium"
                    placeholder="e.g. Requires 8-12 hours overnight fasting"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="testActive"
                  checked={testForm.isActive}
                  onChange={(e) => setTestForm({ ...testForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="testActive" className="text-xs font-bold text-slate-700">Test Published on Public Website</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-sky-600 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Diagnostic Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
