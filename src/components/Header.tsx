import React from 'react';
import { Mail, CheckCircle2, LogOut, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';

interface HeaderProps {
  connectedEmail: string | null;
  connectionMode: 'smtp' | 'oauth' | null;
  isConnecting: boolean;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectedEmail,
  connectionMode,
  isConnecting,
  onOpenConnectModal,
  onDisconnect,
  onOpenHelp,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-inner text-white flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Job Apply Mailer
              <span className="text-xs bg-blue-500/20 text-blue-300 font-medium px-2 py-0.5 rounded-full border border-blue-400/30">
                Personal Utility
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Send personalized job applications to multiple HR contacts.
            </p>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            id="btn-oauth-help-header"
            onClick={onOpenHelp}
            title="Google Sign-In Help & Error 403 Solution"
            className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-2.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Sign-In Help</span>
          </button>

          {connectedEmail ? (
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs space-x-3">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                    {connectionMode === 'smtp' ? 'Gmail App Password Active' : 'OAuth Active'}
                  </span>
                  <span className="font-semibold text-emerald-300 truncate max-w-45 sm:max-w-60">
                    {connectedEmail}
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="btn-manage-gmail"
                onClick={onOpenConnectModal}
                title="Change or configure sender credentials"
                className="text-xs text-slate-300 hover:text-white underline ml-1"
              >
                Change
              </button>
              <button
                type="button"
                id="btn-disconnect-gmail"
                onClick={onDisconnect}
                title="Disconnect Gmail Account"
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="btn-connect-gmail"
              onClick={onOpenConnectModal}
              disabled={isConnecting}
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 text-xs"
            >
              <KeyRound className="w-4 h-4" />
              <span>Connect Gmail (dasrojalindas03@gmail.com)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
