import React from 'react';
import { FileText, Upload, Trash2, CheckCircle2, FileCheck } from 'lucide-react';
import { AttachmentFile } from '../types';

interface ResumeSectionProps {
  resume: AttachmentFile | null;
  coverLetter: AttachmentFile | null;
  onResumeChange: (file: AttachmentFile | null) => void;
  onCoverLetterChange: (file: AttachmentFile | null) => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  resume,
  coverLetter,
  onResumeChange,
  onCoverLetterChange,
}) => {
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'resume' | 'coverLetter'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Content = event.target?.result as string;
      const attachment: AttachmentFile = {
        name: file.name,
        type: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf'),
        size: file.size,
        contentBase64: base64Content,
      };

      if (type === 'resume') {
        onResumeChange(attachment);
      } else {
        onCoverLetterChange(attachment);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value to allow re-uploading same file if cleared
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div id="section-resume" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
          3
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Resume & Attachments</h2>
          <p className="text-xs text-slate-500">Attach your primary Resume (PDF / DOCX) and optional Cover Letter.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume Attachment Upload */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Resume (PDF / DOCX) <span className="text-red-500">*</span>
          </label>

          {resume ? (
            <div className="flex items-center justify-between p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
              <div className="flex items-center space-x-3 truncate">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-purple-900 truncate">{resume.name}</p>
                  <p className="text-[10px] text-purple-600 font-medium">{formatFileSize(resume.size)}</p>
                </div>
              </div>
              <button
                type="button"
                id="btn-remove-resume"
                onClick={() => onResumeChange(null)}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-purple-100 transition-colors ml-2"
                title="Remove resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
              <Upload className="w-6 h-6 text-purple-500 mb-1.5" />
              <span className="text-xs font-semibold text-slate-700">Click to upload Resume</span>
              <span className="text-[10px] text-slate-400 mt-0.5">PDF or DOCX (Max 10MB)</span>
              <input
                type="file"
                id="file-input-resume"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Cover Letter Attachment Upload (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Cover Letter <span className="text-slate-400 font-normal">(Optional)</span>
          </label>

          {coverLetter ? (
            <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-3 truncate">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-blue-900 truncate">{coverLetter.name}</p>
                  <p className="text-[10px] text-blue-600 font-medium">{formatFileSize(coverLetter.size)}</p>
                </div>
              </div>
              <button
                type="button"
                id="btn-remove-cover-letter"
                onClick={() => onCoverLetterChange(null)}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-blue-100 transition-colors ml-2"
                title="Remove cover letter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
              <FileText className="w-6 h-6 text-blue-500 mb-1.5" />
              <span className="text-xs font-semibold text-slate-700">Click to upload Cover Letter</span>
              <span className="text-[10px] text-slate-400 mt-0.5">PDF or DOCX (Optional)</span>
              <input
                type="file"
                id="file-input-cover-letter"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileUpload(e, 'coverLetter')}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
