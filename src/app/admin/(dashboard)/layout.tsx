'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Home,
  Info,
  Microscope,
  Radio,
  Activity,
  HeartHandshake,
  Package,
  Image as ImageIcon,
  MessageSquare,
  Inbox,
  Truck,
  Building2,
  Search,
  Lock,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  History
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/business');
        if (res.status === 401) {
          window.location.href = '/admin/login';
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'WEBSITE CONTENT',
      items: [
        { label: 'Homepage Content', href: '/admin/homepage', icon: Home },
        { label: 'About Page', href: '/admin/about', icon: Info },
      ],
    },
    {
      title: 'DIAGNOSTIC SERVICES',
      items: [
        { label: 'Diagnostic Tests', href: '/admin/tests', icon: Microscope },
        { label: 'X-Ray & Imaging', href: '/admin/xray', icon: Radio },
        { label: 'ECG Services', href: '/admin/ecg', icon: Activity },
      ],
    },
    {
      title: 'HEALTHCARE & PACKAGES',
      items: [
        { label: 'Healthcare Initiatives', href: '/admin/initiatives', icon: HeartHandshake },
        { label: 'Health Packages', href: '/admin/packages', icon: Package },
      ],
    },
    {
      title: 'MEDIA & REVIEWS',
      items: [
        { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
        { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
      ],
    },
    {
      title: 'ENQUIRIES & REQUESTS',
      items: [
        { label: 'General Enquiries', href: '/admin/messages', icon: Inbox },
        { label: 'Home Collections', href: '/admin/home-collection', icon: Truck },
      ],
    },
    {
      title: 'BUSINESS & SETTINGS',
      items: [
        { label: 'Business Info', href: '/admin/business', icon: Building2 },
        { label: 'SEO Settings', href: '/admin/seo', icon: Search },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
        { label: 'Admin Security', href: '/admin/security', icon: Lock },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased selection:bg-sky-500 selection:text-white">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="bg-linear-to-r from-sky-600 to-teal-600 text-white p-2 rounded-xl shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 leading-none block">Saraswathy Admin</span>
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest leading-none mt-1 block">Control Center</span>
          </div>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 shrink-0 text-left flex flex-col justify-between shadow-xs transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] md:max-h-none">
          
          {/* Logo brand */}
          <div className="hidden md:flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="bg-linear-to-r from-sky-600 to-teal-600 text-white p-2 rounded-xl shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 block leading-tight">Saraswathy Admin</span>
              <span className="text-[9.5px] font-bold text-sky-600 uppercase tracking-widest block">Control Center</span>
            </div>
          </div>

          {/* Nav Sections */}
          <div className="space-y-6">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 block">
                  {sec.title}
                </span>
                <nav className="flex flex-col gap-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-teal-600" />
                  <span>View Public Website</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>

          </div>

        </div>

        {/* Logout at bottom */}
        <div className="p-5 border-t border-slate-200/90 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 py-3 rounded-xl font-bold transition-all cursor-pointer text-xs uppercase tracking-wider shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>

      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Main Panel Content Area */}
      <main className="grow flex flex-col min-w-0 bg-slate-50 min-h-screen">
        {children}
      </main>

    </div>
  );
}
