import { MyDetails, JobDetails } from '../types';

export interface TemplateVariables {
  myDetails: MyDetails;
  jobDetails: JobDetails;
}

export const TEMPLATE_PLACEHOLDERS = [
  { tag: '{{Job Title}}', label: 'Job Title', example: 'Software Developer' },
  { tag: '{{Company Name}}', label: 'Company Name', example: 'ABC Technologies' },
  { tag: '{{Job URL}}', label: 'Job URL', example: 'https://example.com/job' },
  { tag: '{{My Name}}', label: 'My Name', example: 'John Doe' },
  { tag: '{{Phone}}', label: 'Phone Number', example: '+1 (555) 019-2834' },
  { tag: '{{Email}}', label: 'Email', example: 'john@example.com' },
  { tag: '{{LinkedIn}}', label: 'LinkedIn', example: 'https://linkedin.com/in/johndoe' },
  { tag: '{{GitHub}}', label: 'GitHub', example: 'https://github.com/johndoe' },
  { tag: '{{Portfolio}}', label: 'Portfolio', example: 'https://johndoe.dev' },
];

export function renderTemplate(
  text: string,
  myDetails: MyDetails,
  jobDetails: JobDetails
): string {
  if (!text) return '';

  let result = text;

  // Replace placeholders dynamically
  result = result.replace(/\{\{\s*Job Title\s*\}\}/gi, jobDetails.title || '[Job Title]');
  result = result.replace(/\{\{\s*Company Name\s*\}\}/gi, jobDetails.company || '[Company Name]');
  result = result.replace(/\{\{\s*Job URL\s*\}\}/gi, jobDetails.url || '[Job URL]');
  result = result.replace(/\{\{\s*My Name\s*\}\}/gi, myDetails.name || '[My Name]');
  result = result.replace(/\{\{\s*Phone\s*\}\}/gi, myDetails.phone || '[Phone]');
  result = result.replace(/\{\{\s*Email\s*\}\}/gi, myDetails.email || '[Email]');
  result = result.replace(/\{\{\s*LinkedIn\s*\}\}/gi, myDetails.linkedin || '[LinkedIn]');
  result = result.replace(/\{\{\s*GitHub\s*\}\}/gi, myDetails.github || '[GitHub]');
  result = result.replace(/\{\{\s*Portfolio\s*\}\}/gi, myDetails.portfolio || '[Portfolio]');

  // If shortMessage is present, replace or append if tagged
  if (jobDetails.shortMessage && jobDetails.shortMessage.trim()) {
    result = result.replace(/\{\{\s*Short Message\s*\}\}/gi, jobDetails.shortMessage);
  } else {
    result = result.replace(/\{\{\s*Short Message\s*\}\}/gi, '');
  }

  return result;
}
