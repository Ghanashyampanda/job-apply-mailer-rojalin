import React, { useState } from 'react';
import { History, Trash2, CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';
import { SendHistoryItem } from '../types';

interface HistorySectionProps {
  history: SendHistoryItem[];
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'skipped'>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.hrEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div id="section-history" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Application History</h2>
            <p className="text-xs text-slate-500">Track sent emails and duplicate prevention logs.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            id="btn-clear-history"
            onClick={onClearHistory}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No application history yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Dispatched emails will be logged here for duplicate protection.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Controls: Search and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search HR email, company, job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {(['all', 'sent', 'failed', 'skipped'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">HR Email</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Job Title</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {item.hrEmail}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {item.company || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {item.jobTitle || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      {item.status === 'sent' && (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Sent</span>
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span
                          className="inline-flex items-center space-x-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          title={item.errorMessage || 'Failed to send'}
                        >
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>Failed</span>
                        </span>
                      )}
                      {item.status === 'skipped' && (
                        <span className="inline-flex items-center space-x-1 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Clock className="w-3 h-3 text-indigo-600" />
                          <span>Skipped</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[10px]">
                      {formatDate(item.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
