'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      } else {
        setError(data.error || 'Failed to fetch audit logs.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 sm:p-10 space-y-8 text-left bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Audit Logs</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Traceable record of administrator actions, content updates, and database mutations.</p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm">Loading audit trail...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <History className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm font-semibold">No audit logs recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 pr-4">Admin Email</th>
                  <th className="pb-3 pr-4">Action</th>
                  <th className="pb-3 pr-4">Resource</th>
                  <th className="pb-3 pr-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 pr-4 text-xs font-semibold text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-4 font-bold text-slate-900 text-xs">
                      {log.adminEmail}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'UPDATE' || log.action === 'STATUS_CHANGE'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-slate-700 text-xs">
                      {log.resource}
                    </td>
                    <td className="py-3.5 pr-4 text-xs font-medium text-slate-600">
                      {log.details || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
