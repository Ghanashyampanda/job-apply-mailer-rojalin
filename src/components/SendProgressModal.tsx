import React from 'react';
import { CheckCircle2, XCircle, Clock, Loader2, AlertTriangle, Check, StopCircle, PartyPopper } from 'lucide-react';
import { BatchProgressItem } from '../types';

interface SendProgressModalProps {
  isOpen: boolean;
  progressList: BatchProgressItem[];
  currentIndex: number;
  totalBatchSize: number;
  isSending: boolean;
  isFinished: boolean;
  onDone: () => void;
  onStopBatch: () => void;
  stoppedReason?: string | null;
}

export const SendProgressModal: React.FC<SendProgressModalProps> = ({
  isOpen,
  progressList,
  currentIndex,
  totalBatchSize,
  isSending,
  isFinished,
  onDone,
  onStopBatch,
  stoppedReason,
}) => {
  if (!isOpen) return null;

  const sentCount = progressList.filter((item) => item.status === 'sent').length;
  const failedCount = progressList.filter((item) => item.status === 'failed').length;
  const skippedCount = progressList.filter((item) => item.status === 'skipped').length;
  const processedCount = sentCount + failedCount + skippedCount;

  const percentage = totalBatchSize > 0 ? Math.round((processedCount / totalBatchSize) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isFinished ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {isFinished ? <PartyPopper className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isFinished ? 'Batch Dispatch Completed' : 'Sending Applications...'}
              </h2>
              <p className="text-xs text-slate-500">
                {isFinished
                  ? `${processedCount} applications processed.`
                  : `Processing recipient ${Math.min(currentIndex + 1, totalBatchSize)} of ${totalBatchSize}`}
              </p>
            </div>
          </div>

          {isSending && (
            <button
              type="button"
              id="btn-stop-batch"
              onClick={onStopBatch}
              className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop Batch</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Progress: {processedCount} / {totalBatchSize}</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFinished ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Error / Restriction Banner if stopped */}
        {stoppedReason && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Batch halted:</span>
              <p className="mt-0.5 text-red-700 leading-relaxed">{stoppedReason}</p>
            </div>
          </div>
        )}

        {/* Individual Items List */}
        <div className="mt-4 border border-slate-200 rounded-xl bg-slate-50/50 p-3 max-h-60 overflow-y-auto space-y-1.5">
          {progressList.map((item) => (
            <div
              key={item.index}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all border ${
                item.status === 'sent'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                  : item.status === 'failed'
                  ? 'bg-red-50/80 border-red-200 text-red-800'
                  : item.status === 'skipped'
                  ? 'bg-indigo-50/80 border-indigo-200 text-indigo-800'
                  : item.status === 'sending'
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate pr-2">
                <span className="text-[10px] text-slate-400 font-sans w-8 text-right">
                  {item.index + 1} / {totalBatchSize}
                </span>

                {item.status === 'sent' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                {item.status === 'failed' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                {item.status === 'skipped' && <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                {item.status === 'sending' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />}
                {item.status === 'pending' && <Clock className="w-4 h-4 text-slate-300 flex-shrink-0" />}

                <span className="truncate">{item.email}</span>
              </div>

              <div className="flex items-center space-x-1 font-sans text-[11px] font-semibold flex-shrink-0">
                {item.status === 'sent' && <span className="text-emerald-700">✓ Sent</span>}
                {item.status === 'failed' && <span className="text-red-700">✕ Failed</span>}
                {item.status === 'skipped' && <span className="text-indigo-700">Skipped</span>}
                {item.status === 'sending' && <span className="text-blue-700">⏳ Sending...</span>}
                {item.status === 'pending' && <span className="text-slate-400">Pending</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Metrics Summary */}
        {isFinished && (
          <div className="mt-5 p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Batch Summary</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="text-lg font-bold text-white block">{processedCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Processed</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="text-lg font-bold text-emerald-400 block">{sentCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Sent</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="text-lg font-bold text-red-400 block">{failedCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Failed</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg">
                <span className="text-lg font-bold text-indigo-400 block">{skippedCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Skipped</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            id="btn-progress-done"
            disabled={!isFinished}
            onClick={onDone}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
