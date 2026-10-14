import React from 'react';
import db from '@/lib/db';
import Link from 'next/link';
import {
  Inbox,
  Clock,
  FileText,
  CheckCircle,
  Truck,
  Microscope,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  ChevronRight,
  PlusCircle,
  Building2,
  Calendar
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardHome() {
  const [
    totalEnquiries,
    newEnquiries,
    homeCollectionCount,
    categoriesCount,
    testsCount,
    galleryCount,
    testimonialsCount,
    recentEnquiries,
  ] = await Promise.all([
    db.enquiry.count(),
    db.enquiry.count({ where: { status: 'NEW' } }),
    db.homeCollectionRequest.count({ where: { status: 'NEW' } }),
    db.diagnosticCategory.count(),
    db.diagnosticTest.count(),
    db.galleryItem.count(),
    db.testimonial.count({ where: { isPublished: true } }),
    db.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const stats = [
    { label: 'Total Enquiries', value: totalEnquiries, icon: Inbox, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { label: 'New Messages', value: newEnquiries, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Home Collections', value: homeCollectionCount, icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Test Categories', value: categoriesCount, icon: Layers, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { label: 'Total Diagnostic Tests', value: testsCount, icon: Microscope, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { label: 'Gallery Items', value: galleryCount, icon: ImageIcon, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'Published Reviews', value: testimonialsCount, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const quickActions = [
    { title: 'Manage Diagnostic Tests', href: '/admin/tests', icon: Microscope, desc: 'Add or edit blood, sugar, and pathology tests' },
    { title: 'X-Ray & Imaging Services', href: '/admin/xray', icon: FileText, desc: 'Configure radiology & chest X-Ray catalog' },
    { title: 'Home Collection Requests', href: '/admin/home-collection', icon: Truck, desc: 'View phlebotomist dispatch appointments' },
    { title: 'View General Inbox', href: '/admin/messages', icon: Inbox, desc: 'Review and answer website enquiries' },
    { title: 'Edit Business Information', href: '/admin/business', icon: Building2, desc: 'Update lab address, timings, and phone lines' },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-10 text-left bg-slate-50 min-h-screen">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Saraswathy Lab Control Center</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Centralized Content Management & Diagnostic Inquiry Portal.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs w-fit">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>ESTD 1986 &bull; Sundarapuram, CBE</span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 p-6 rounded-3xl flex items-center justify-between shadow-md hover:shadow-lg transition-all"
            >
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider block">{stat.label}</span>
                <span className="text-3xl font-extrabold text-slate-900 block">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${stat.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Admin Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Link
                key={idx}
                href={act.href}
                className="bg-white border border-slate-200/90 p-6 rounded-3xl hover:border-sky-500 hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center border border-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end text-xs font-bold text-sky-600">
                  <span>Open Section</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <h2 className="text-lg font-bold text-slate-900">Recent Website Enquiries</h2>
          <Link
            href="/admin/messages"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View Complete Inbox</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <Inbox className="w-12 h-12 mx-auto opacity-40" />
            <p className="text-sm font-semibold">No patient inquiries stored in database yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                  <th className="pb-3 pr-4">Patient</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Subject</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.map((inq) => (
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
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
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

    </div>
  );
}
