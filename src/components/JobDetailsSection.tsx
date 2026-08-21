import React from 'react';
import { Briefcase, Building, Link2, MessageSquareText } from 'lucide-react';
import { JobDetails } from '../types';

interface JobDetailsSectionProps {
  details: JobDetails;
  onChange: (details: JobDetails) => void;
}

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  details,
  onChange,
}) => {
  const handleChange = (field: keyof JobDetails, value: string) => {
    onChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div id="section-job-details" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
          2
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Job Details</h2>
          <p className="text-xs text-slate-500">Specify the role and company for this application batch.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="input-job-title"
              placeholder="e.g. Software Developer"
              value={details.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="input-company-name"
              placeholder="e.g. ABC Technologies"
              value={details.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Job URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Job Posting URL</label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              id="input-job-url"
              placeholder="https://example.com/job"
              value={details.url}
              onChange={(e) => handleChange('url', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Short Additional Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Short Additional Note <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <MessageSquareText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="input-job-short-message"
            placeholder="e.g. Available for immediate start and flexible with remote/hybrid arrangements."
            value={details.shortMessage}
            onChange={(e) => handleChange('shortMessage', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
};
