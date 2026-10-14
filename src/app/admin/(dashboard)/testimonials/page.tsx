'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Clock,
  Check,
  Ban,
  RotateCcw,
  Mail,
  Phone,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface Testimonial {
  id: string;
  patientName: string;
  reviewText: string;
  rating: number;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  displayOrder: number;
  isPublished: boolean;
  consent?: boolean;
  createdAt: string;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  
  // Status filter tab
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PUBLISHED' | 'REJECTED'>('PENDING');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state (for Add Manually or Edit)
  const [form, setForm] = useState({
    patientName: '',
    reviewText: '',
    rating: 5,
    email: '',
    phone: '',
    status: 'PUBLISHED' as 'PENDING' | 'PUBLISHED' | 'REJECTED',
  });

  // Confirmation Modal state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'primary',
    onConfirm: () => {},
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.testimonials || []);
      } else {
        setError(data.error || 'Failed to fetch patient reviews.');
      }
    } catch (err) {
      setError('Connection failure. Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const pendingReviews = testimonials.filter(
    (t) => t.status === 'PENDING' || (!t.isPublished && t.status !== 'REJECTED')
  );
  const publishedReviews = testimonials.filter(
    (t) => t.status === 'PUBLISHED' || t.isPublished
  );
  const rejectedReviews = testimonials.filter(
    (t) => t.status === 'REJECTED'
  );

  const displayedList =
    activeTab === 'PENDING'
      ? pendingReviews
      : activeTab === 'PUBLISHED'
      ? publishedReviews
      : rejectedReviews;

  // Change review status (Approve, Reject, Unpublish, Restore)
  const handleUpdateStatus = async (id: string, newStatus: 'PENDING' | 'PUBLISHED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const actionLabel =
          newStatus === 'PUBLISHED'
            ? 'Review approved and published live!'
            : newStatus === 'REJECTED'
            ? 'Review rejected.'
            : 'Review moved to pending queue.';
        showToast(actionLabel);
        fetchTestimonials();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to update review status.');
      }
    } catch (err) {
      alert('Network error while updating status.');
    }
  };

  // Open confirmation modal
  const openConfirm = (
    title: string,
    message: string,
    confirmText: string,
    confirmVariant: 'danger' | 'warning' | 'primary',
    onConfirm: () => void
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmVariant,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Save manual review or edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsFormModalOpen(false);
        showToast(editingId ? 'Review updated successfully.' : 'Manual review added successfully.');
        fetchTestimonials();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save review.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // Delete review
  const handleDelete = (id: string, patientName: string) => {
    openConfirm(
      'Delete Patient Review',
      `Are you sure you want to permanently delete the review from "${patientName}"? This action cannot be undone.`,
      'Delete Permanently',
      'danger',
      async () => {
        try {
          const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast('Review permanently deleted.');
            fetchTestimonials();
          } else {
            alert('Delete failed.');
          }
        } catch (err) {
          alert('Network error while deleting.');
        }
      }
    );
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left bg-slate-50 min-h-screen">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Reviews & Feedback Workflow
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage patient submissions, approve reviews for website display, and add offline reception feedback.
          </p>
        </div>

        {/* Action Button: Add Review Manually */}
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              patientName: '',
              reviewText: '',
              rating: 5,
              email: '',
              phone: '',
              status: 'PUBLISHED',
            });
            setIsFormModalOpen(true);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Review Manually</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'PENDING'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
            {pendingReviews.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PUBLISHED')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'PUBLISHED'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Published Live</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
            {publishedReviews.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'REJECTED'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Rejected Reviews</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
            {rejectedReviews.length}
          </span>
        </button>
      </div>

      {/* Main Reviews Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">
            Loading patient reviews...
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <MessageSquare className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">
              No reviews in the {activeTab.toLowerCase()} queue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedList.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50/70 border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  {/* Top Row: Patient Name & Rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {rev.patientName}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-amber-400 shrink-0">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium bg-white p-3.5 rounded-2xl border border-slate-200/80">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>

                  {/* Optional Contact Information */}
                  {(rev.email || rev.phone) && (
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold pt-1">
                      {rev.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-sky-600" />
                          <span>{rev.email}</span>
                        </span>
                      )}
                      {rev.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-teal-600" />
                          <span>{rev.phone}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Status Badge & Action Controls */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  {/* Status Badge */}
                  {rev.status === 'PUBLISHED' || rev.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Published Live
                    </span>
                  ) : rev.status === 'REJECTED' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      <Ban className="w-3 h-3" /> Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3" /> Pending Approval
                    </span>
                  )}

                  {/* Workflow Action Buttons */}
                  <div className="flex items-center gap-2">
                    
                    {/* Approve / Publish Action */}
                    {rev.status !== 'PUBLISHED' && !rev.isPublished && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'PUBLISHED')}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                        title="Approve and Publish on website"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Reject Action (for Pending reviews) */}
                    {rev.status === 'PENDING' && (
                      <button
                        onClick={() =>
                          openConfirm(
                            'Reject Review',
                            `Are you sure you want to reject this review by "${rev.patientName}"? It will not appear on the website.`,
                            'Reject Review',
                            'warning',
                            () => handleUpdateStatus(rev.id, 'REJECTED')
                          )
                        }
                        className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border border-rose-200 cursor-pointer"
                        title="Reject review"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Unpublish Action (for Published reviews) */}
                    {(rev.status === 'PUBLISHED' || rev.isPublished) && (
                      <button
                        onClick={() =>
                          openConfirm(
                            'Unpublish Review',
                            `Move "${rev.patientName}" review back to Pending status? It will be hidden from the public website.`,
                            'Unpublish',
                            'warning',
                            () => handleUpdateStatus(rev.id, 'PENDING')
                          )
                        }
                        className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border border-amber-200 cursor-pointer"
                        title="Unpublish to Pending"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Unpublish</span>
                      </button>
                    )}

                    {/* Edit Action */}
                    <button
                      onClick={() => {
                        setEditingId(rev.id);
                        setForm({
                          patientName: rev.patientName,
                          reviewText: rev.reviewText,
                          rating: rev.rating,
                          email: rev.email || '',
                          phone: rev.phone || '',
                          status: rev.status || 'PUBLISHED',
                        });
                        setIsFormModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                      title="Edit review"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDelete(rev.id, rev.patientName)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200 cursor-pointer"
                      title="Delete review"
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

      {/* MODAL 1: ADD MANUAL REVIEW OR EDIT REVIEW */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingId ? 'Edit Patient Review' : '+ Add Review Manually'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editingId ? 'Modify review details or rating' : 'Enter feedback received via reception, WhatsApp, or paper form'}
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Patient Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Patient Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                  placeholder="e.g. S. Lakshmi (Madukkarai)"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Rating (1 to 5 Stars) <span className="text-rose-500">*</span></label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 cursor-pointer focus:outline-none focus:border-sky-500"
                >
                  <option value={5}>5 Stars (Excellent Service)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Satisfactory)</option>
                  <option value={2}>2 Stars (Needs Improvement)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Review Feedback <span className="text-rose-500">*</span></label>
                <textarea
                  rows={4}
                  required
                  value={form.reviewText}
                  onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 resize-none focus:outline-none focus:border-sky-500"
                  placeholder="Patient's review feedback..."
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                    placeholder="patient@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Status selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Publishing Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as 'PENDING' | 'PUBLISHED' | 'REJECTED' })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 cursor-pointer focus:outline-none focus:border-sky-500"
                >
                  <option value="PUBLISHED">Published Live (Appears on Website immediately)</option>
                  <option value="PENDING">Pending (Send to pending queue for approval)</option>
                  <option value="REJECTED">Rejected (Hidden from Website)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer transition-all"
              >
                {editingId ? 'Save Review Changes' : 'Add Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMATION DIALOG FOR DESTRUCTIVE / STATUS ACTIONS */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left space-y-5">
            <div className="flex items-center gap-3 text-slate-900">
              <div
                className={`p-2.5 rounded-2xl ${
                  confirmDialog.confirmVariant === 'danger'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{confirmDialog.title}</h3>
                <span className="text-xs text-slate-400 font-medium">Confirmation Required</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className={`font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider text-white shadow-md cursor-pointer transition-all ${
                  confirmDialog.confirmVariant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
