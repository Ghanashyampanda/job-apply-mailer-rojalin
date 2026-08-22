import React, { useState } from 'react';
import { Users, AlertCircle, CheckCircle, Trash2, RotateCcw, Clock, ShieldAlert, PlusCircle, Filter } from 'lucide-react';
import { ParsedEmailItem } from '../types';

interface HrEmailSectionProps {
  rawText: string;
  onRawTextChange: (text: string) => void;
  items: ParsedEmailItem[];
  stats: {
    totalExtracted: number;
    validCount: number;
    invalidCount: number;
    duplicatesRemovedCount: number;
    alreadyContactedCount: number;
  };
  onRemoveItem: (id: string) => void;
  onToggleItemSelection: (id: string) => void;
  onClearAll: () => void;
}

export const HrEmailSection: React.FC<HrEmailSectionProps> = ({
  rawText,
  onRawTextChange,
  items,
  stats,
  onRemoveItem,
  onToggleItemSelection,
  onClearAll,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'valid' | 'contacted' | 'invalid'>('all');

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'valid') return item.isValid && !item.isAlreadyContacted;
    if (activeFilter === 'contacted') return item.isAlreadyContacted;
    if (activeFilter === 'invalid') return !item.isValid;
    return true;
  });

  const selectedValidCount = items.filter((item) => item.isValid && item.selected).length;

  const handleLoadSample = () => {
    const sample = `hr1@company.com
hr2@company.com
careers@company.com
recruitment@company.com
jobs@company.com
[talent@company.com](mailto:talent@company.com)
hr1@company.com (duplicate)
invalid-email-address`;
    onRawTextChange(sample);
  };

  return (
    <div id="section-hr-emails" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">HR Email List</h2>
            <p className="text-xs text-slate-500">Paste multiple HR emails (lines, commas, or semicolons).</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="btn-load-sample-emails"
            onClick={handleLoadSample}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Load Sample Emails</span>
          </button>
          {items.length > 0 && (
            <button
              type="button"
              id="btn-clear-hr-emails"
              onClick={onClearAll}
              className="text-xs font-medium text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Textarea */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Paste Email Addresses
        </label>
        <textarea
          id="textarea-hr-emails"
          rows={4}
          placeholder={`hr1@company.com\nhr2@company.com\ncareers@company.com, recruitment@company.com; jobs@company.com`}
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all leading-relaxed"
        />
      </div>

      {/* Automatic Extraction & Statistics Cards */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Valid Stats */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
                <span>Valid Recipients</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xl font-bold text-emerald-800 mt-1">{stats.validCount}</span>
              <span className="text-[10px] text-emerald-600/90 font-medium">Ready to send</span>
            </div>

            {/* Invalid Stats */}
            <div className="bg-red-50/70 border border-red-200/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between text-red-700 text-xs font-semibold">
                <span>Invalid Format</span>
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xl font-bold text-red-800 mt-1">{stats.invalidCount}</span>
              <span className="text-[10px] text-red-600/90 font-medium">Format errors</span>
            </div>

            {/* Duplicates Stats */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
                <span>Duplicates Removed</span>
                <RotateCcw className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xl font-bold text-amber-800 mt-1">{stats.duplicatesRemovedCount}</span>
              <span className="text-[10px] text-amber-600/90 font-medium">Auto-deduplicated</span>
            </div>

            {/* Already Contacted Stats */}
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold">
                <span>Already Contacted</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-indigo-800 mt-1">{stats.alreadyContactedCount}</span>
              <span className="text-[10px] text-indigo-600/90 font-medium">In send history</span>
            </div>
          </div>

          {/* Batch Notice if > 30 */}
          {selectedValidCount > 30 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-blue-800">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{selectedValidCount} valid recipients selected.</span> Batch limit is 30 recipients. The first 30 will be sent in this run, and remaining {selectedValidCount - 30} will remain pending for your next batch.
              </div>
            </div>
          )}

          {/* Recipient Filter Tabs & List */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" /> Review Recipients List ({items.length})
              </span>
              <div className="flex space-x-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('valid')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    activeFilter === 'valid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Valid ({stats.validCount - stats.alreadyContactedCount})
                </button>
                {stats.alreadyContactedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('contacted')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      activeFilter === 'contacted'
                        ? 'bg-indigo-600 text-white'
                        : 'text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    Contacted ({stats.alreadyContactedCount})
                  </button>
                )}
                {stats.invalidCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('invalid')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      activeFilter === 'invalid'
                        ? 'bg-red-600 text-white'
                        : 'text-red-700 hover:bg-red-100'
                    }`}
                  >
                    Invalid ({stats.invalidCount})
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Chip Items */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    !item.isValid
                      ? 'bg-red-50/80 border-red-200 text-red-700'
                      : item.isAlreadyContacted
                      ? 'bg-indigo-50/80 border-indigo-200 text-indigo-800'
                      : item.selected
                      ? 'bg-white border-emerald-300 text-slate-800 shadow-2xs'
                      : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <input
                      type="checkbox"
                      disabled={!item.isValid}
                      checked={item.selected}
                      onChange={() => onToggleItemSelection(item.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-40"
                    />
                    <span className="font-mono text-[11px] truncate">{item.email}</span>
                    {item.isAlreadyContacted && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Already contacted
                      </span>
                    )}
                    {!item.isValid && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Invalid
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-200/50 transition-colors"
                    title="Remove recipient"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
