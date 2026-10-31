/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, WifiOff, FileCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-emerald-300">
                Privacy-First Architecture
              </h2>
              <p className="text-[11px] text-stone-400">
                How your memories remain 100% private on your device.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-stone-200 font-serif">1. Zero Cloud Uploads</h4>
                <p className="text-stone-400 mt-0.5 leading-relaxed">
                  When you select photos, they are held in your browser's private memory sandbox via local blob references (<code className="text-amber-300 font-mono">URL.createObjectURL</code>). Not a single picture is sent to any server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
              <HardDrive className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-stone-200 font-serif">2. Client-Side Arrangement Engine</h4>
                <p className="text-stone-400 mt-0.5 leading-relaxed">
                  Photo dimensions, aspect-ratio clustering, and album spread layouts are computed entirely by client-side JavaScript in your browser.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
              <FileCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-stone-200 font-serif">3. In-Browser ZIP & Caption Packaging</h4>
                <p className="text-stone-400 mt-0.5 leading-relaxed">
                  When you download your rearranged album and captions, the ZIP archive and transcripts are assembled in-memory using <code className="text-blue-300 font-mono">JSZip</code> with zero server round-trips.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800">
              <WifiOff className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-stone-200 font-serif">4. Works Fully Offline</h4>
                <p className="text-stone-400 mt-0.5 leading-relaxed">
                  You can disconnect your computer from WiFi or Ethernet, load your local pictures, edit your captions, and download the full rearranged package without an internet connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
