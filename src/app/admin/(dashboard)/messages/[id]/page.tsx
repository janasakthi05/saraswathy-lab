'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Mail, Clock, AlertCircle, Trash2, ArrowLeft, Copy } from 'lucide-react';

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  emailDeliveryStatus?: string;
  createdAt: string;
}

export default function AdminInquiryDetailPage() {
  const { id } = useParams() as { id: string };
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchInquiryDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to retrieve inquiry record.');
      } else {
        setInquiry(data.inquiry || null);
        
        // If the message is NEW, auto-mark it as READ on open
        if (data.inquiry && data.inquiry.status === 'NEW') {
          handleStatusUpdate('READ', data.inquiry);
        }
      }
    } catch (err) {
      console.error('Fetch inquiry detail error:', err);
      setError('Connection failed. Database server offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInquiryDetail();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus: string, currentInq = inquiry) => {
    if (!currentInq) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${currentInq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Status patch error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!inquiry) return;
    if (!confirm('Are you sure you want to delete this patient inquiry from the database?')) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/admin/messages';
      } else {
        alert('Failed to delete record.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed. Database server offline.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyEmail = () => {
    if (!inquiry) return;
    navigator.clipboard.writeText(inquiry.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400 font-semibold text-sm flex-grow flex items-center justify-center bg-slate-50">
        Loading details...
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="p-10 text-center flex-grow flex flex-col items-center justify-center space-y-4 bg-slate-50">
        <div className="flex items-center gap-2 text-rose-600 font-bold bg-rose-50 border border-rose-200 px-6 py-4 rounded-2xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error || 'Inquiry record not found.'}</span>
        </div>
        <Link href="/admin/messages" className="text-sky-600 font-bold text-sm hover:underline">
          Return to Inbox
        </Link>
      </div>
    );
  }

  // Pre-fill mailto parameters
  const mailtoSubject = encodeURIComponent(`Re: [Saraswathy Lab] ${inquiry.subject}`);
  const mailtoBody = encodeURIComponent(
    `Hello ${inquiry.fullName},\n\nThank you for reaching out to Saraswathy Lab & Medicals. Regarding your diagnostic inquiry about "${inquiry.subject}":\n\n[Write details here]\n\nBest regards,\nSaraswathy Lab Diagnostics Team\nSundarapuram, Coimbatore\nPhone: 0422 2674699`
  );
  const mailtoUrl = `mailto:${inquiry.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left flex-grow flex flex-col min-w-0 bg-slate-50">
      
      {/* Back to Inbox */}
      <div>
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Return to Inbox</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main details column */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 p-6 sm:p-10 rounded-3xl space-y-6 shadow-md">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
              {inquiry.inquiryType}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight pt-2">
              {inquiry.subject}
            </h2>
            <div className="flex gap-4 text-xs font-semibold text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Submitted: {new Date(inquiry.createdAt).toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Details body */}
          <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</h4>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 font-medium text-slate-800 whitespace-pre-wrap">
                {inquiry.message || 'No additional message text submitted.'}
              </div>
            </div>
          </div>

          {/* Contact coordinates list */}
          <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-600 text-sm">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Information</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-16">Name:</span>
                  <span className="text-slate-900 font-bold">{inquiry.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-16">Phone:</span>
                  <a href={`tel:${inquiry.phone}`} className="text-sky-600 font-bold hover:underline">
                    {inquiry.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communication Options</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold w-16">Email:</span>
                  <a href={`mailto:${inquiry.email}`} className="text-sky-600 font-bold hover:underline truncate max-w-[180px]">
                    {inquiry.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Copy Email Address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Copied</span>}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right status panels column */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 p-6 rounded-3xl space-y-6 shadow-md text-left">
          
          {/* Status Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Management</h4>
            <div className="flex items-center gap-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
              <div
                className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                  inquiry.status === 'NEW'
                    ? 'bg-amber-500'
                    : inquiry.status === 'IN_PROGRESS'
                    ? 'bg-teal-500'
                    : inquiry.status === 'RESOLVED'
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
                }`}
              />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Current State</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{inquiry.status}</span>
              </div>
            </div>
            {/* Email Dispatch Info Card */}
            <div className="flex items-center gap-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
              <div
                className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                  inquiry.emailDeliveryStatus === 'SENT'
                    ? 'bg-emerald-500'
                    : inquiry.emailDeliveryStatus === 'FAILED'
                    ? 'bg-rose-500'
                    : 'bg-slate-400'
                }`}
              />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Email Notification</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {inquiry.emailDeliveryStatus || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick status actions */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mark Status As:</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={updating || inquiry.status === 'IN_PROGRESS'}
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                className="bg-slate-50 hover:bg-slate-100 text-teal-700 font-bold py-3 px-2 rounded-xl text-xs border border-slate-200 hover:border-slate-300 cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
              >
                In Progress
              </button>
              <button
                disabled={updating || inquiry.status === 'RESOLVED'}
                onClick={() => handleStatusUpdate('RESOLVED')}
                className="bg-slate-50 hover:bg-slate-100 text-emerald-700 font-bold py-3 px-2 rounded-xl text-xs border border-slate-200 hover:border-slate-300 cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
              >
                Resolved
              </button>
              <button
                disabled={updating || inquiry.status === 'ARCHIVED'}
                onClick={() => handleStatusUpdate('ARCHIVED')}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-2 rounded-xl text-xs border border-slate-200 hover:border-slate-300 cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
              >
                Archive
              </button>
              <button
                disabled={updating || inquiry.status === 'NEW'}
                onClick={() => handleStatusUpdate('NEW')}
                className="bg-slate-50 hover:bg-slate-100 text-amber-700 font-bold py-3 px-2 rounded-xl text-xs border border-slate-200 hover:border-slate-300 cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
              >
                New (Unread)
              </button>
            </div>
          </div>

          {/* Action trigger panel */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            
            {/* Mail Draft */}
            <a
              href={mailtoUrl}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-sky-600/20 transition-all text-xs uppercase tracking-wider text-center"
            >
              <Mail className="w-4 h-4" />
              <span>Draft Reply Email</span>
            </a>

            {/* Delete row */}
            <button
              disabled={updating}
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 py-3.5 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider shadow-xs"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Inquiry</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
