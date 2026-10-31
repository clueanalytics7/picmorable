import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Server, 
  HardDrive,
  CreditCard,
  Scale
} from 'lucide-react';
import { PhotoItem } from '../types';

interface PrivacyPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
}

export const PrivacyPricingModal: React.FC<PrivacyPricingModalProps> = ({
  isOpen,
  onClose,
  photos,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'pricing' | 'export'>('privacy');
  const [privacyMode, setPrivacyMode] = useState<'standard' | 'enhanced'>('standard');
  const [facialRecognitionEnabled, setFacialRecognitionEnabled] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const trustCommitments = [
    'Your photographs remain exclusively yours.',
    'Your photographs are never publicly visible or shared by default.',
    'Your photographs are never used to train external foundation AI models.',
    'Facial recognition is disabled by default; strictly opt-in and local.',
    'Complete data portability: export your entire high-res library anytime.',
    'Permanent deletion guarantee with verified cryptographic purge.',
    'Clear provenance: system always distinguishes camera facts from AI suggestions.',
  ];

  const handleExportData = () => {
    // Generate JSON archive export
    const exportData = {
      platform: 'Memoria Personal Memory Preservation Platform',
      exportDate: new Date().toISOString(),
      user: 'clueanalytics7@gmail.com',
      gdpr_compliance: 'UK GDPR / ICO Standard Protocol',
      photoCount: photos.length,
      library: photos.map(p => ({
        id: p.id,
        title: p.title,
        exif: p.exif,
        captions: p.captions,
        provenance: p.provenance,
        tags: p.tags,
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memoria_archive_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <div>
              <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider block">
                Trust & Commercial Architecture · Sections 6 & 7
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Privacy, Trust & Preservation Plans
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-stone-200 px-6 text-xs font-semibold bg-stone-50">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 mr-6 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'text-amber-800 border-b-2 border-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            7 Trust Commitments & UK GDPR
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 mr-6 transition-colors cursor-pointer ${
              activeTab === 'pricing'
                ? 'text-amber-800 border-b-2 border-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Subscriptions vs One-Off Preservation
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'text-amber-800 border-b-2 border-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Data Portability & Export
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: PRIVACY & TRUST */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              
              {/* Trust Statement */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Privacy-First Personal Memory Management</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Personal photographs contain sensitive family moments, children, private celebrations, and home interiors. 
                  Memoria is architected under UK GDPR and Data Protection principles with zero AI training on user media.
                </p>
              </div>

              {/* The 7 Commitments (§6.2) */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Our Seven Core Trust Commitments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {trustCommitments.map((cmt, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="text-stone-700 leading-snug">{cmt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing Mode Architecture Switch (§6.1) */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <h3 className="font-serif font-bold text-stone-900 text-sm">
                  Processing Mode Architecture
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPrivacyMode('standard')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      privacyMode === 'standard'
                        ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs text-stone-900 mb-1">
                      <Server className="w-4 h-4 text-amber-700" />
                      <span>Mode A: Standard Private Cloud</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Photographs stored encrypted at rest (AES-256). Multimodal AI captioning performed on secure stateless inference nodes with contractual deletion SLAs.
                    </p>
                  </div>

                  <div
                    onClick={() => setPrivacyMode('enhanced')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      privacyMode === 'enhanced'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs text-emerald-950 mb-1">
                      <HardDrive className="w-4 h-4 text-emerald-700" />
                      <span>Mode B: Privacy-Enhanced Local</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Metadata, hashing, and perceptual embeddings computed on-device in browser. Raw image pixels never leave your device without explicit request.
                    </p>
                  </div>
                </div>
              </div>

              {/* Facial Recognition Policy (§5.2.E) */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-stone-900">
                    Facial Recognition & Biometric Identification
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Disabled by default under UK ICO DPIA guidelines. Requires explicit opt-in.
                  </p>
                </div>
                <button
                  onClick={() => setFacialRecognitionEnabled(!facialRecognitionEnabled)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    facialRecognitionEnabled
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {facialRecognitionEnabled ? 'Enabled (Opt-in)' : 'Disabled by Default'}
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PRICING & COMMERCIAL MODEL */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Transparent UK Pricing Structure (§7.2)
                </h3>
                <p className="text-xs text-stone-600">
                  We decouple memory organisation software from raw storage so you never overpay for gigabytes.
                </p>
              </div>

              {/* Recurring Subscription Plans */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                
                {/* Free */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                  <div>
                    <span className="font-serif font-bold text-stone-900 text-sm block">Free Entry</span>
                    <span className="text-xl font-bold font-serif text-stone-900 block mt-1">£0</span>
                    <p className="text-[11px] text-stone-500 mt-2">
                      Import up to 500 photos, chronological timeline, and basic albums.
                    </p>
                  </div>
                  <button className="w-full mt-4 py-1.5 text-xs font-medium bg-stone-200 text-stone-800 rounded">
                    Current Plan
                  </button>
                </div>

                {/* Personal */}
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between">
                  <div>
                    <span className="font-serif font-bold text-amber-900 text-sm block">Personal</span>
                    <span className="text-xl font-bold font-serif text-amber-950 block mt-1">£3.99<span className="text-xs font-normal">/mo</span></span>
                    <p className="text-[11px] text-stone-600 mt-2">
                      Up to 10,000 photos, automatic event clustering, context-aware captions & natural search.
                    </p>
                  </div>
                  <button className="w-full mt-4 py-1.5 text-xs font-semibold bg-amber-800 text-white rounded hover:bg-amber-900 cursor-pointer">
                    Upgrade
                  </button>
                </div>

                {/* Premium */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="font-serif font-bold text-stone-900 text-sm block">Premium</span>
                    <span className="text-xl font-bold font-serif text-stone-900 block mt-1">£6.99<span className="text-xs font-normal">/mo</span></span>
                    <p className="text-[11px] text-stone-600 mt-2">
                      Advanced memory discovery, deeper AI clustering, layflat photo book layout tools.
                    </p>
                  </div>
                  <button className="w-full mt-4 py-1.5 text-xs font-medium bg-stone-900 text-white rounded hover:bg-stone-800 cursor-pointer">
                    Select
                  </button>
                </div>

                {/* Family */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                  <div>
                    <span className="font-serif font-bold text-stone-900 text-sm block">Family</span>
                    <span className="text-xl font-bold font-serif text-stone-900 block mt-1">£10.99<span className="text-xs font-normal">/mo</span></span>
                    <p className="text-[11px] text-stone-600 mt-2">
                      Up to 5 members, shared family milestones, cross-device sync and family vault.
                    </p>
                  </div>
                  <button className="w-full mt-4 py-1.5 text-xs font-medium bg-stone-900 text-white rounded hover:bg-stone-800 cursor-pointer">
                    Select
                  </button>
                </div>

              </div>

              {/* The One-Off Memory Preservation Package (§7.3) */}
              <div className="p-5 bg-gradient-to-r from-amber-900 to-stone-900 text-white rounded-2xl border border-amber-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Alternative: One-Off Preservation (No Subscription)</span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">
                    "Your Life in Pictures" — 20-Year Archive Package (£39.00)
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Have an old external drive or boxes of digital archives? Pay once to have your complete historical collection deduplicated, arranged chronologically, captioned, and packaged with downloadable layflat photobook specs.
                  </p>
                </div>

                <button 
                  onClick={() => alert('One-Off Archive Preservation package selected. You will receive an exportable, permanently organised digital memory vault.')}
                  className="px-5 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Choose One-Off Package
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: DATA PORTABILITY */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Complete Data Portability & Archive Export
                </h3>
                <p className="text-xs text-stone-600">
                  You are never locked into Memoria. Export your high-resolution photographs alongside structured EXIF metadata, AI captions, and album manifests.
                </p>
              </div>

              {exportSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Archive metadata exported successfully as JSON manifest.</span>
                </div>
              )}

              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-stone-900 block">
                      Download Full Personal Archive Manifest (JSON + EXIF)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Includes all verified camera tags, GPS coordinates, event clusters, and edited captions.
                    </span>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Manifest</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-rose-800">
                  <div>
                    <span className="font-semibold block">Permanent Account & Media Deletion</span>
                    <span className="text-[11px] text-stone-500">
                      Triggers full cryptographic erasure across all storage nodes in accordance with UK GDPR Article 17.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to permanently delete all archived photographs and account data? This cannot be undone.')) {
                        alert('All data cryptographically purged.');
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 text-xs text-rose-700 border border-rose-300 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    Purge Account
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Memoria Trust & Privacy Governance Framework · 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
