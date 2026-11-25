'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Search, ChevronLeft, ChevronRight, AlertCircle, Phone, MapPin, Calendar, Clock, Trash2, RefreshCw } from 'lucide-react';

interface HomeCollectionRequest {
  id: string;
  name: string;
  phone: string;
  address: string;
  preferredDate?: string;
  preferredTime?: string;
  status: string;
  emailDeliveryStatus: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminHomeCollectionPage() {
  const [requests, setRequests] = useState<HomeCollectionRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetryEmail = async (id: string) => {
    setRetryingId(id);
    try {
      const res = await fetch(`/api/admin/home-collection/${id}/retry-email`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) =>
          prev.map((item) => (item.id === id ? { ...item, emailDeliveryStatus: 'SENT' } : item))
        );
        alert('Notification email successfully sent to administrator!');
      } else {
        alert(`Failed to send email:\n${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Network error retrying email: ${err.message}`);
    } finally {
      setRetryingId(null);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `/api/admin/home-collection?search=${encodeURIComponent(search)}&status=${status}&page=${page}&limit=10`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      } else {
        setError(data.error || 'Failed to fetch home collection requests.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [search, status, page]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/home-collection/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this home collection appointment record?')) return;
    try {
      const res = await fetch(`/api/admin/home-collection/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRequests();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const statuses = ['NEW', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Home Collection Requests</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Manage phlebotomy home sample collection appointments and patient dispatches.</p>
      </div>

      <div className="bg-white border border-slate-200/90 p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-12 gap-4 items-center shadow-md">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by patient name, phone, or address..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3 shrink-0" />
        </div>

        <div className="sm:col-span-4">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
          >
            <option value="">All Appointment Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading appointments...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Truck className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No home collection requests found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((reqItem) => (
              <div key={reqItem.id} className="bg-slate-50/80 border border-slate-200/90 p-6 rounded-3xl space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl border border-sky-200">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{reqItem.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${reqItem.phone}`} className="hover:underline">{reqItem.phone}</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
                    <select
                      value={reqItem.status}
                      onChange={(e) => handleStatusChange(reqItem.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none cursor-pointer ${
                        reqItem.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : reqItem.status === 'SCHEDULED'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : reqItem.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDelete(reqItem.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-medium text-slate-700">
                  <div className="md:col-span-8 flex items-start gap-2 bg-white p-4 rounded-2xl border border-slate-200">
                    <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Collection Address</span>
                      <span className="text-slate-900 font-semibold leading-relaxed block mt-0.5">{reqItem.address}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Preferred: <strong>{reqItem.preferredDate || 'Asap'}</strong> {reqItem.preferredTime ? `(${reqItem.preferredTime})` : ''}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-1.5 flex items-center justify-between flex-wrap gap-1">
                      <span>Submitted: {new Date(reqItem.createdAt).toLocaleString()} &bull; Email: <span className={reqItem.emailDeliveryStatus === 'SENT' ? 'text-emerald-600 font-bold' : reqItem.emailDeliveryStatus === 'FAILED' ? 'text-rose-600 font-bold' : 'text-slate-500'}>{reqItem.emailDeliveryStatus}</span></span>
                      {reqItem.emailDeliveryStatus === 'FAILED' && (
                        <button
                          type="button"
                          disabled={retryingId === reqItem.id}
                          onClick={() => handleRetryEmail(reqItem.id)}
                          className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                          title="Retry sending notification email"
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${retryingId === reqItem.id ? 'animate-spin' : ''}`} />
                          <span>{retryingId === reqItem.id ? 'Retrying...' : 'Retry'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="border-t border-slate-100 pt-5 mt-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2 border border-slate-200 bg-white text-slate-700 rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                className="p-2 border border-slate-200 bg-white text-slate-700 rounded-lg disabled:opacity-40"
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
