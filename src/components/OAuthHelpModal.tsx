import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, X, Mail, Sparkles, KeyRound } from 'lucide-react';

interface OAuthHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetrySignIn: () => void;
}

export const OAuthHelpModal: React.FC<OAuthHelpModalProps> = ({
  isOpen,
  onClose,
  onRetrySignIn,
}) => {
  if (!isOpen) return null;

  return (
    <div id="oauth-help-modal" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Google OAuth Verification & Access Guide</h2>
              <p className="text-xs text-slate-500">Why Google showed "Access blocked: Error 403" and how to proceed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core explanation */}
        <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Why does Google show "Access blocked / Error 403"?</p>
              <p className="text-amber-800 text-[11.5px] mt-1">
                Because sending emails via Gmail is a high-security permission, Google Cloud only permits the <strong>project developer account</strong> to sign in while the project is in testing mode.
              </p>
            </div>
          </div>

          {/* Steps to Fix */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              How to Connect Successfully:
            </h3>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-800">Use your primary project Google Account</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    When prompted by Google, sign in using <span className="font-semibold text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-200">dasrojalindas03@gmail.com</span> (the registered developer account).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pt-1">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-800">Bypass the "Google hasn't verified this app" warning</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    If Google shows a warning screen: Click <strong>"Advanced"</strong> (bottom-left link) &rarr; Click <strong>"Go to gen-lang-client-... (unsafe)"</strong> &rarr; Click <strong>"Continue"</strong> to grant email send access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative: Direct mail dispatch */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3.5">
            <div className="flex items-start space-x-2.5">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900">Alternative: Direct Mailto / Gmail Web Fallback</strong>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  You can also use our built-in <strong>"1-Click Gmail Web / Mailto"</strong> launcher from the Outbox preview to dispatch each personalized application directly through your web browser without requiring OAuth authorization!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            id="btn-close-oauth-help"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Got it
          </button>
          <button
            type="button"
            id="btn-retry-google-signin"
            onClick={() => {
              onClose();
              onRetrySignIn();
            }}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retry Sign In with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
