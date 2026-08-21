import React, { useState } from 'react';
import { Mail, KeyRound, ShieldCheck, CheckCircle2, AlertCircle, X, ExternalLink, RefreshCw, Sparkles, Check } from 'lucide-react';
import { SmtpConfig } from '../types';

interface ConnectGmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  smtpConfig: SmtpConfig;
  onSaveSmtpConfig: (config: SmtpConfig) => void;
  onConnectOAuth: () => void;
  isOAuthConnecting: boolean;
  connectedEmail: string | null;
  onDisconnectAll: () => void;
}

export const ConnectGmailModal: React.FC<ConnectGmailModalProps> = ({
  isOpen,
  onClose,
  smtpConfig,
  onSaveSmtpConfig,
  onConnectOAuth,
  isOAuthConnecting,
  connectedEmail,
  onDisconnectAll,
}) => {
  const [activeTab, setActiveTab] = useState<'app_password' | 'oauth'>('app_password');
  const [emailInput, setEmailInput] = useState(smtpConfig.user || 'dasrojalindas03@gmail.com');
  const [appPasswordInput, setAppPasswordInput] = useState(smtpConfig.pass || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleVerifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setVerifyStatus({ success: false, message: 'Please enter your Gmail address.' });
      return;
    }
    if (!appPasswordInput.trim()) {
      setVerifyStatus({ success: false, message: 'Please enter your 16-character Google App Password.' });
      return;
    }

    setIsVerifying(true);
    setVerifyStatus(null);

    try {
      const response = await fetch('/api/verify-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: emailInput.trim(),
          pass: appPasswordInput.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerifyStatus({ success: true, message: `Connected to ${emailInput.trim()} successfully!` });
        onSaveSmtpConfig({
          user: emailInput.trim(),
          pass: appPasswordInput.trim(),
        });
      } else {
        setVerifyStatus({
          success: false,
          message: data.error || 'Authentication failed. Please check that 2-Step Verification is ON and you generated a 16-character App Password.',
        });
      }
    } catch (err: any) {
      setVerifyStatus({
        success: false,
        message: err.message || 'Failed to verify connection with Gmail server.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div id="connect-gmail-modal" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Connect Gmail Sender Account</h2>
              <p className="text-xs text-slate-500">Configure your email account to send job applications</p>
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

        {/* Current status if already connected */}
        {connectedEmail && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">Active Sender Connected</p>
                <p className="text-xs text-emerald-700 font-mono font-medium">{connectedEmail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDisconnectAll}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Method Tabs */}
        <div className="mt-4 flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('app_password')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'app_password'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Gmail App Password (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('oauth')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'oauth'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google OAuth Login</span>
          </button>
        </div>

        {/* Tab 1: Gmail App Password Method */}
        {activeTab === 'app_password' && (
          <form onSubmit={handleVerifyAndSave} className="mt-4 space-y-4">
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5 text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Why Gmail App Password is the fastest & most reliable:
              </p>
              <p className="text-[11.5px] text-blue-800 leading-relaxed">
                Connects directly to <strong>{emailInput || 'dasrojalindas03@gmail.com'}</strong> without any Google Cloud test-user 403 blocks or unverified app errors.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gmail Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    id="input-smtp-email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="dasrojalindas03@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 items-center justify-between">
                  <span>16-Character Google App Password <span className="text-red-500">*</span></span>
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <span>Generate in Google Account</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    id="input-smtp-password"
                    required
                    value={appPasswordInput}
                    onChange={(e) => setAppPasswordInput(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx (16 characters)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
              <strong className="text-slate-800 block text-xs">How to get a 16-character App Password in 30 seconds:</strong>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Google Account Security</a> for {emailInput || 'dasrojalindas03@gmail.com'}.</li>
                <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
                <li>Search or open <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">App Passwords</a>.</li>
                <li>Enter app name <em>"Job Apply Mailer"</em>, click Create, and copy the 16-letter password here.</li>
              </ol>
            </div>

            {/* Validation Feedback */}
            {verifyStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                  verifyStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {verifyStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-tight">{verifyStatus.message}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-verify-smtp"
                disabled={isVerifying}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Connect & Save</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: OAuth Sign-In Method */}
        {activeTab === 'oauth' && (
          <div className="mt-4 space-y-4 text-xs text-slate-700">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Google OAuth Policy Note:
              </p>
              <p className="text-[11.5px] text-amber-800 leading-relaxed">
                Google Cloud blocks accounts that are not registered in the project's developer test list (Error 403). To send from <strong>dasrojalindas03@gmail.com</strong> without restrictions, we strongly recommend using the <strong>Gmail App Password tab above</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                If you have configured Google OAuth permissions:
              </p>
              <button
                type="button"
                id="btn-modal-oauth-signin"
                onClick={() => {
                  onConnectOAuth();
                  onClose();
                }}
                disabled={isOAuthConnecting}
                className="inline-flex items-center justify-center space-x-2.5 bg-white text-slate-800 hover:bg-slate-100 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                <div className="w-4 h-4 shrink-0">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {isOAuthConnecting ? 'Connecting...' : 'Sign In with Google OAuth'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
