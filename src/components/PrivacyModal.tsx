import React from 'react';
import { X, Lock, ShieldAlert } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 text-left shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">Patient Data Privacy Statement</h3>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">HIPAA & Clinical Guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Disclaimer warning */}
        <div className="flex items-start gap-3 bg-teal-50/80 border border-teal-200/80 p-4 rounded-xl text-teal-950 text-xs leading-relaxed font-medium">
          <ShieldAlert className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <p>
            Saraswathy Lab & Medicals implements security parameters to protect user inquiry logs. We do not distribute patient contact numbers or diagnostic inquiries to third-party entities.
          </p>
        </div>

        {/* Content body */}
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h4 className="font-bold text-slate-900 text-base">1. Collection of Details</h4>
          <p>
            We collect your full name, email address, phone number, and test inquiries. These details are used exclusively to arrange test collection timings and coordinate prescription requirements.
          </p>

          <h4 className="font-bold text-slate-900 text-base">2. Storage Security</h4>
          <p>
            Patient inquiry records are stored behind authenticated database partitions and are only reachable by authorized medical laboratory administrators.
          </p>

          <h4 className="font-bold text-slate-900 text-base">3. HIPAA Notice</h4>
          <p>
            General email and web forms are not secure end-to-end channels. We request that patients do not send sensitive files or clinical medical reports through this inquiry page. Full clinical medical profiles are delivered only via verified offline print collection or secure email links.
          </p>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 pt-5 text-right">
          <button
            onClick={onClose}
            className="bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
