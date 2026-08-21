export interface SmtpConfig {
  user: string;
  pass: string;
}

export interface MyDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface JobDetails {
  title: string;
  company: string;
  url: string;
  shortMessage: string;
}

export interface AttachmentFile {
  name: string;
  type: string; // MIME type e.g. application/pdf
  size: number; // in bytes
  contentBase64: string;
}

export interface ParsedEmailItem {
  id: string;
  email: string;
  isValid: boolean;
  isAlreadyContacted: boolean;
  selected: boolean;
  reason?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SendHistoryItem {
  id: string;
  hrEmail: string;
  company: string;
  jobTitle: string;
  status: 'sent' | 'failed' | 'skipped';
  date: string; // ISO string
  errorMessage?: string;
}

export interface BatchProgressItem {
  index: number;
  email: string;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'skipped';
  errorMessage?: string;
}
