import { MyDetails, JobDetails, EmailTemplate, SendHistoryItem, SmtpConfig } from '../types';

const MY_DETAILS_KEY = 'jam_my_details';
const JOB_DETAILS_KEY = 'jam_job_details';
const TEMPLATE_KEY = 'jam_email_template';
const HISTORY_KEY = 'jam_send_history';
const SMTP_CONFIG_KEY = 'jam_smtp_config';

export const DEFAULT_MY_DETAILS: MyDetails = {
  name: 'Rojalin Das',
  email: 'dasrojalindas03@gmail.com',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
};

export const DEFAULT_SMTP_CONFIG: SmtpConfig = {
  user: 'dasrojalindas03@gmail.com',
  pass: '',
};

export const loadSmtpConfig = (): SmtpConfig => {
  try {
    const raw = localStorage.getItem(SMTP_CONFIG_KEY);
    if (raw) return { ...DEFAULT_SMTP_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load SMTP config from localStorage', e);
  }
  return DEFAULT_SMTP_CONFIG;
};

export const saveSmtpConfig = (config: SmtpConfig): void => {
  try {
    localStorage.setItem(SMTP_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save SMTP config to localStorage', e);
  }
};

export const DEFAULT_JOB_DETAILS: JobDetails = {
  title: 'Software Developer',
  company: 'ABC Technologies',
  url: 'https://example.com/job',
  shortMessage: '',
};

export const DEFAULT_TEMPLATE: EmailTemplate = {
  subject: 'Application for {{Job Title}} – {{My Name}}',
  body: `Dear Hiring Team,

I am writing to express my interest in the {{Job Title}} position at {{Company Name}}.

I have a background in software and application development with experience in Java, Python, JavaScript, React, PHP, databases, Git/GitHub, and web development. I am interested in contributing my technical skills and learning within your team.

Please find my resume attached for your consideration. I would appreciate the opportunity to discuss how my skills could contribute to the role.

Job posting:
{{Job URL}}

Thank you for your time and consideration.

Best regards,
{{My Name}}
{{Phone}}
{{Email}}
{{LinkedIn}}
{{GitHub}}`,
};

export const loadMyDetails = (): MyDetails => {
  try {
    const raw = localStorage.getItem(MY_DETAILS_KEY);
    if (raw) return { ...DEFAULT_MY_DETAILS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load My Details from localStorage', e);
  }
  return DEFAULT_MY_DETAILS;
};

export const saveMyDetails = (details: MyDetails): void => {
  try {
    localStorage.setItem(MY_DETAILS_KEY, JSON.stringify(details));
  } catch (e) {
    console.error('Failed to save My Details to localStorage', e);
  }
};

export const loadJobDetails = (): JobDetails => {
  try {
    const raw = localStorage.getItem(JOB_DETAILS_KEY);
    if (raw) return { ...DEFAULT_JOB_DETAILS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load Job Details from localStorage', e);
  }
  return DEFAULT_JOB_DETAILS;
};

export const saveJobDetails = (details: JobDetails): void => {
  try {
    localStorage.setItem(JOB_DETAILS_KEY, JSON.stringify(details));
  } catch (e) {
    console.error('Failed to save Job Details to localStorage', e);
  }
};

export const loadTemplate = (): EmailTemplate => {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY);
    if (raw) return { ...DEFAULT_TEMPLATE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load Template from localStorage', e);
  }
  return DEFAULT_TEMPLATE;
};

export const saveTemplate = (template: EmailTemplate): void => {
  try {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(template));
  } catch (e) {
    console.error('Failed to save Template to localStorage', e);
  }
};

export const loadHistory = (): SendHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load History from localStorage', e);
  }
  return [];
};

export const saveHistory = (history: SendHistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save History to localStorage', e);
  }
};

export const addHistoryItems = (newItems: SendHistoryItem[]): SendHistoryItem[] => {
  const current = loadHistory();
  const updated = [...newItems, ...current];
  saveHistory(updated);
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const getContactedEmailsSet = (): Set<string> => {
  const history = loadHistory();
  const sentOrSkipped = history.filter(item => item.status === 'sent' || item.status === 'skipped');
  return new Set(sentOrSkipped.map(item => item.hrEmail.toLowerCase().trim()));
};
