import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Check, Save } from 'lucide-react';
import { MyDetails } from '../types';

interface MyDetailsSectionProps {
  details: MyDetails;
  onChange: (details: MyDetails) => void;
  savedTime: string | null;
}

export const MyDetailsSection: React.FC<MyDetailsSectionProps> = ({
  details,
  onChange,
  savedTime,
}) => {
  const handleChange = (field: keyof MyDetails, value: string) => {
    onChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div id="section-my-details" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">My Details</h2>
            <p className="text-xs text-slate-500">Saved locally in your browser for quick reuse.</p>
          </div>
        </div>

        {savedTime && (
          <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Saved {savedTime}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            My Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="input-my-name"
              placeholder="e.g. Alex Morgan"
              value={details.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            My Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              id="input-my-email"
              placeholder="alex.morgan@example.com"
              value={details.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              id="input-my-phone"
              placeholder="+1 (555) 019-2834"
              value={details.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Current Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="input-my-location"
              placeholder="San Francisco, CA"
              value={details.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              id="input-my-linkedin"
              placeholder="https://linkedin.com/in/alexmorgan"
              value={details.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub URL</label>
          <div className="relative">
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              id="input-my-github"
              placeholder="https://github.com/alexmorgan"
              value={details.github}
              onChange={(e) => handleChange('github', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Portfolio URL */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio URL</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              id="input-my-portfolio"
              placeholder="https://alexmorgan.dev"
              value={details.portfolio}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
