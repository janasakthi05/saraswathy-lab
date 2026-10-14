'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Inbox, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminInboxesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `/api/admin/inquiries?search=${encodeURIComponent(search)}&status=${status}&type=${type}&sort=${sort}&page=${page}&limit=10`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch messages.');
      } else {
        setInquiries(data.inquiries || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      }
    } catch (err) {
      console.error('Fetch inbox error:', err);
      setError('Connection failed. Database server offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [search, status, type, sort, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const inquiryTypes = [
    'General Enquiry',
    'Test Information',
    'Health Checkup Information',
    'Home Collection Inquiry',
    'Location / Timing',
    'Other',
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left flex-grow flex flex-col min-w-0 bg-slate-50">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inquiry Inbox</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Review, search, filter, and track diagnostic queries submitted by patients.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center shadow-md">
        
        {/* Search */}
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search patient, email, subject..."
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3 shrink-0" />
        </div>

        {/* Status */}
        <div className="lg:col-span-2.5">
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New (Unread)</option>
            <option value="READ">Read</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Category */}
        <div className="lg:col-span-2.5">
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="lg:col-span-3">
          <select
            value={sort}
            onChange={handleSortChange}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 transition-all font-medium cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>

      </div>

      {/* Main Inbox Box */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex-grow flex flex-col justify-between shadow-md min-h-[400px]">
        <div>
          {loading ? (
            <div className="py-24 text-center text-slate-400 font-semibold text-sm">
              Loading entries...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center gap-2 text-rose-600 py-24 font-bold text-sm bg-rose-50 border border-rose-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-24 text-slate-400 space-y-3">
              <Inbox className="w-12 h-12 mx-auto opacity-40" />
              <p className="text-sm font-semibold">No inquiries matched your current filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                    <th className="pb-3 pr-4">Patient Details</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Subject</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/80 group">
                      <td className="py-4 pr-4">
                        <Link href={`/admin/messages/${inq.id}`} className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors block">
                          {inq.fullName}
                        </Link>
                        <span className="text-xs text-slate-500 block mt-0.5">{inq.phone}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                          {inq.inquiryType}
                        </span>
                      </td>
                      <td className="py-4 pr-4 font-semibold text-slate-600 max-w-[200px] truncate">
                        {inq.subject}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full block w-fit ${
                            inq.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : inq.status === 'IN_PROGRESS'
                              ? 'bg-teal-100 text-teal-800'
                              : inq.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span
                          className={`text-[9px] font-bold block mt-1 uppercase ${
                            inq.emailDeliveryStatus === 'SENT'
                              ? 'text-emerald-600'
                              : inq.emailDeliveryStatus === 'FAILED'
                              ? 'text-rose-600'
                              : 'text-slate-400'
                          }`}
                        >
                          Email: {inq.emailDeliveryStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 text-right text-slate-400 font-semibold text-xs whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 pt-5 mt-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-800 rounded-lg disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                className="p-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-800 rounded-lg disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
