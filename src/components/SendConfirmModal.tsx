import React from 'react';
import { Send, FileText, CheckCircle2, ShieldCheck, AlertTriangle, X, Paperclip } from 'lucide-react';
import { AttachmentFile, ParsedEmailItem, MyDetails, JobDetails, EmailTemplate } from '../types';
import { renderTemplate } from '../lib/templateUtils';

interface SendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipients: ParsedEmailItem[];
  myDetails: MyDetails;
  jobDetails: JobDetails;
  template: EmailTemplate;
  resume: AttachmentFile | null;
  coverLetter: AttachmentFile | null;
  gmailAddress: string | null;
}

export const SendConfirmModal: React.FC<SendConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipients,
  myDetails,
  jobDetails,
  template,
  resume,
  coverLetter,
  gmailAddress,
}) => {
  if (!isOpen) return null;

  // Max batch size is 30
  const activeBatch = recipients.slice(0, 30);
  const totalCount = activeBatch.length;
  const remainingCount = Math.max(0, recipients.length - 30);

  const renderedSubject = renderTemplate(template.subject, myDetails, jobDetails);
  const renderedBody = renderTemplate(template.body, myDetails, jobDetails);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Confirm Email Dispatch</h2>
              <p className="text-xs text-slate-500">Review batch details before sending individual job applications.</p>
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

        {/* Highlight Notice */}
        <div className="mt-4 bg-blue-50 border border-blue-200/80 rounded-xl p-3.5 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <p className="font-semibold">
              You are about to send this application individually to {totalCount} recipient{totalCount > 1 ? 's' : ''}.
            </p>
            <p className="text-blue-700/90 text-[11px] mt-0.5">
              Each HR contact will receive a distinct, personalized email directly from your Gmail account ({gmailAddress}). Other HR recipients will never see each other's email addresses (no CC or BCC).
            </p>
          </div>
        </div>

        {remainingCount > 0 && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-amber-800 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Note:</strong> {totalCount} recipients selected for this batch. The remaining {remainingCount} recipient{remainingCount > 1 ? 's' : ''} will stay pending for the next run.
            </span>
          </div>
        )}

        {/* Summary Details */}
        <div className="mt-4 space-y-3">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Job Title</span>
              <span className="font-semibold text-slate-800">{jobDetails.title || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Company</span>
              <span className="font-semibold text-slate-800">{jobDetails.company || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Sender Account</span>
              <span className="font-semibold text-slate-800 truncate block">{gmailAddress}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Attachments</span>
              <div className="flex flex-col gap-0.5 mt-0.5">
                {resume ? (
                  <span className="text-purple-700 font-medium flex items-center gap-1 text-[11px]">
                    <Paperclip className="w-3 h-3" /> {resume.name}
                  </span>
                ) : (
                  <span className="text-red-500 font-medium text-[11px]">No Resume Attached</span>
                )}
                {coverLetter && (
                  <span className="text-blue-700 font-medium flex items-center gap-1 text-[11px]">
                    <Paperclip className="w-3 h-3" /> Cover Letter: {coverLetter.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Email Subject & Preview */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">Subject Preview:</span>
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800">
              {renderedSubject}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">Body Preview (Sample):</span>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-36 overflow-y-auto text-[11px] font-sans text-slate-700 whitespace-pre-wrap leading-relaxed">
              {renderedBody}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            id="btn-modal-cancel"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-confirm-and-send"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Send ({totalCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
