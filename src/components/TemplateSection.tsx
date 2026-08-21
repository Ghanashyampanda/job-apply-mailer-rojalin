import React, { useState } from 'react';
import { FileCode, Eye, Edit3, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { EmailTemplate, MyDetails, JobDetails } from '../types';
import { TEMPLATE_PLACEHOLDERS, renderTemplate } from '../lib/templateUtils';

interface TemplateSectionProps {
  template: EmailTemplate;
  myDetails: MyDetails;
  jobDetails: JobDetails;
  onTemplateChange: (template: EmailTemplate) => void;
  onResetTemplate: () => void;
}

export const TemplateSection: React.FC<TemplateSectionProps> = ({
  template,
  myDetails,
  jobDetails,
  onTemplateChange,
  onResetTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [copied, setCopied] = useState(false);

  const renderedSubject = renderTemplate(template.subject, myDetails, jobDetails);
  const renderedBody = renderTemplate(template.body, myDetails, jobDetails);

  const handleInsertTag = (tag: string) => {
    onTemplateChange({
      ...template,
      body: template.body + (template.body.endsWith('\n') ? '' : '\n') + tag,
    });
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(`Subject: ${renderedSubject}\n\n${renderedBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="section-email-template" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Email Template</h2>
            <p className="text-xs text-slate-500">Customize the application email content and template variables.</p>
          </div>
        </div>

        {/* Tab Switcher & Reset */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              type="button"
              id="tab-edit-template"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'edit'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Template</span>
            </button>
            <button
              type="button"
              id="tab-preview-template"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Preview</span>
            </button>
          </div>

          <button
            type="button"
            id="btn-reset-template"
            onClick={onResetTemplate}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-colors flex items-center space-x-1"
            title="Reset email template to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className="space-y-4">
          {/* Quick Variable Insert Pills */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Available Template Variables (Click to append)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATE_PLACEHOLDERS.map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => handleInsertTag(item.tag)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg px-2.5 py-1 text-[11px] font-mono transition-colors"
                >
                  {item.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              id="input-email-subject"
              value={template.subject}
              onChange={(e) => onTemplateChange({ ...template, subject: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Email Body Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Body
            </label>
            <textarea
              id="textarea-email-body"
              rows={10}
              value={template.body}
              onChange={(e) => onTemplateChange({ ...template, body: e.target.value })}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
            />
          </div>
        </div>
      ) : (
        /* Rendered Email Preview */
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rendered Subject</span>
              <h3 className="text-xs font-bold text-slate-800">{renderedSubject}</h3>
            </div>
            <button
              type="button"
              id="btn-copy-preview"
              onClick={handleCopyPreview}
              className="text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Rendered Email Content</span>
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
              {renderedBody}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
