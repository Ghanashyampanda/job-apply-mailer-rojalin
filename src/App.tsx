import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from 'firebase/auth';
import { Send, AlertCircle, Sparkles, CheckCircle2, FileText, ArrowRight, ShieldCheck, Mail, RefreshCw } from 'lucide-react';

import {
  MyDetails,
  JobDetails,
  AttachmentFile,
  ParsedEmailItem,
  EmailTemplate,
  SendHistoryItem,
  BatchProgressItem,
  SmtpConfig,
} from './types';

import {
  loadMyDetails,
  saveMyDetails,
  loadJobDetails,
  saveJobDetails,
  loadTemplate,
  saveTemplate,
  DEFAULT_TEMPLATE,
  loadHistory,
  addHistoryItems,
  clearHistory,
  getContactedEmailsSet,
  loadSmtpConfig,
  saveSmtpConfig,
} from './lib/storage';

import { parseHrEmails } from './lib/emailParser';
import { renderTemplate } from './lib/templateUtils';
import { initAuth, googleSignIn, logoutAccount, getAccessToken } from './lib/firebase';

import { Header } from './components/Header';
import { MyDetailsSection } from './components/MyDetailsSection';
import { JobDetailsSection } from './components/JobDetailsSection';
import { HrEmailSection } from './components/HrEmailSection';
import { ResumeSection } from './components/ResumeSection';
import { TemplateSection } from './components/TemplateSection';
import { SendConfirmModal } from './components/SendConfirmModal';
import { SendProgressModal } from './components/SendProgressModal';
import { HistorySection } from './components/HistorySection';
import { OAuthHelpModal } from './components/OAuthHelpModal';
import { ConnectGmailModal } from './components/ConnectGmailModal';

export default function App() {
  // 1. My Details State
  const [myDetails, setMyDetails] = useState<MyDetails>(loadMyDetails);
  const [detailsSavedTime, setDetailsSavedTime] = useState<string | null>(null);

  // 2. Job Details State
  const [jobDetails, setJobDetails] = useState<JobDetails>(loadJobDetails);

  // 3. HR Email List State
  const [rawHrEmails, setRawHrEmails] = useState<string>('');
  const [removedItemIds, setRemovedItemIds] = useState<Set<string>>(new Set());
  const [deselectedItemIds, setDeselectedItemIds] = useState<Set<string>>(new Set());

  // 4. Resume & Attachments
  const [resume, setResume] = useState<AttachmentFile | null>(null);
  const [coverLetter, setCoverLetter] = useState<AttachmentFile | null>(null);

  // 5. Email Template State
  const [template, setTemplate] = useState<EmailTemplate>(loadTemplate);

  // 6. History & Contacted Emails
  const [history, setHistory] = useState<SendHistoryItem[]>(loadHistory);

  // SMTP Gmail App Password State
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(loadSmtpConfig);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // OAuth / Gmail Account State
  const [user, setUser] = useState<User | null>(null);
  const [gmailAddress, setGmailAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isOAuthHelpOpen, setIsOAuthHelpOpen] = useState(false);

  // Resolved Active Sender Email & Mode
  const activeSenderEmail = useMemo(() => {
    if (smtpConfig && smtpConfig.user && smtpConfig.pass) {
      return smtpConfig.user;
    }
    if (user && gmailAddress) {
      return gmailAddress;
    }
    return null;
  }, [smtpConfig, user, gmailAddress]);

  const connectionMode = useMemo<'smtp' | 'oauth' | null>(() => {
    if (smtpConfig && smtpConfig.user && smtpConfig.pass) {
      return 'smtp';
    }
    if (user && gmailAddress) {
      return 'oauth';
    }
    return null;
  }, [smtpConfig, user, gmailAddress]);

  // Modals & Batch Dispatch State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [batchProgress, setBatchProgress] = useState<BatchProgressItem[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stoppedReason, setStoppedReason] = useState<string | null>(null);

  const isStopRequested = useRef(false);

  // Load Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        setNeedsAuth(false);
        // Try fetching actual Gmail profile email
        try {
          const res = await fetch('/api/gmail-profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const profile = await res.json();
            if (profile.emailAddress) {
              setGmailAddress(profile.emailAddress);
              return;
            }
          }
        } catch (e) {
          console.error('Error fetching profile', e);
        }
        setGmailAddress(authUser.email || 'Connected Account');
      },
      () => {
        setUser(null);
        setGmailAddress(null);
        setNeedsAuth(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // Auto-save My Details with slight debounce indicator
  const handleMyDetailsChange = (updated: MyDetails) => {
    setMyDetails(updated);
    saveMyDetails(updated);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDetailsSavedTime(timeStr);
  };

  // Auto-save Job Details
  const handleJobDetailsChange = (updated: JobDetails) => {
    setJobDetails(updated);
    saveJobDetails(updated);
  };

  // Auto-save Template
  const handleTemplateChange = (updated: EmailTemplate) => {
    setTemplate(updated);
    saveTemplate(updated);
  };

  const handleResetTemplate = () => {
    setTemplate(DEFAULT_TEMPLATE);
    saveTemplate(DEFAULT_TEMPLATE);
  };

  // Connect Gmail
  const handleConnectGmail = async () => {
    setIsConnecting(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        // Fetch Gmail email address profile
        try {
          const res = await fetch('/api/gmail-profile', {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          });
          if (res.ok) {
            const profile = await res.json();
            if (profile.emailAddress) {
              setGmailAddress(profile.emailAddress);
              return;
            }
          }
        } catch (e) {
          console.warn('Error fetching gmail profile, falling back to auth email', e);
        }
        setGmailAddress(result.user.email || 'Connected Account');
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        alert('The Google Sign-In popup was blocked by your browser. Please allow popups for this site or open the app in a new tab.');
      } else {
        console.warn('Sign-in issue:', err);
        // Open the OAuth help modal on access denied / verification errors
        setIsOAuthHelpOpen(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setSmtpConfig({ user: 'dasrojalindas03@gmail.com', pass: '' });
    saveSmtpConfig({ user: 'dasrojalindas03@gmail.com', pass: '' });
    await logoutAccount();
    setUser(null);
    setGmailAddress(null);
    setNeedsAuth(true);
  };

  const handleSaveSmtpConfig = (cfg: SmtpConfig) => {
    setSmtpConfig(cfg);
    saveSmtpConfig(cfg);
    if (cfg.user && myDetails.email !== cfg.user) {
      const updated = { ...myDetails, email: cfg.user };
      setMyDetails(updated);
      saveMyDetails(updated);
    }
  };

  // Compute contacted emails set from history
  const contactedSet = useMemo(() => {
    const sentOrSkipped = history.filter((item) => item.status === 'sent' || item.status === 'skipped');
    return new Set(sentOrSkipped.map((item) => item.hrEmail.toLowerCase().trim()));
  }, [history]);

  // Parse HR emails dynamically
  const parseResult = useMemo(() => {
    const res = parseHrEmails(rawHrEmails, contactedSet);
    // Apply manual removals & deselections
    const filteredItems = res.items
      .filter((item) => !removedItemIds.has(item.id))
      .map((item) => ({
        ...item,
        selected: deselectedItemIds.has(item.id) ? false : item.selected,
      }));

    return {
      items: filteredItems,
      stats: {
        ...res.stats,
        validCount: filteredItems.filter((i) => i.isValid).length,
      },
    };
  }, [rawHrEmails, contactedSet, removedItemIds, deselectedItemIds]);

  const handleRemoveHrItem = (id: string) => {
    setRemovedItemIds((prev) => new Set(prev).add(id));
  };

  const handleToggleHrItemSelection = (id: string) => {
    setDeselectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearHrEmails = () => {
    setRawHrEmails('');
    setRemovedItemIds(new Set());
    setDeselectedItemIds(new Set());
  };

  // Clear History
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your application history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  // Valid recipients ready to send
  const validRecipientsToSubmit = useMemo(() => {
    return parseResult.items.filter((item) => item.isValid && item.selected);
  }, [parseResult.items]);

  // Trigger Send Modal
  const handleInitiateSend = () => {
    if (!activeSenderEmail) {
      setIsConnectModalOpen(true);
      return;
    }

    if (!myDetails.name || !myDetails.email) {
      alert('Please fill in your Name and Email in Section 1 (My Details).');
      return;
    }

    if (!jobDetails.title || !jobDetails.company) {
      alert('Please fill in the Job Title and Company Name in Section 2 (Job Details).');
      return;
    }

    if (validRecipientsToSubmit.length === 0) {
      alert('Please enter at least one valid HR recipient email address in Section 3.');
      return;
    }

    if (!resume) {
      const confirmNoResume = window.confirm(
        'You have not attached a Resume. Are you sure you want to proceed without a resume attachment?'
      );
      if (!confirmNoResume) return;
    }

    setIsConfirmModalOpen(true);
  };

  // Perform Actual Batch Sending
  const handleConfirmAndSend = async () => {
    setIsConfirmModalOpen(false);

    // Take up to 30 recipients for this batch
    const batchTarget = validRecipientsToSubmit.slice(0, 30);
    const initialProgressList: BatchProgressItem[] = batchTarget.map((item, idx) => ({
      index: idx,
      email: item.email,
      status: 'pending',
    }));

    setBatchProgress(initialProgressList);
    setCurrentBatchIndex(0);
    setIsSending(true);
    setIsFinished(false);
    setStoppedReason(null);
    isStopRequested.current = false;
    setIsProgressModalOpen(true);

    const newHistoryEntries: SendHistoryItem[] = [];

    // Prepare attachment payload array
    const attachmentsPayload: AttachmentFile[] = [];
    if (resume) attachmentsPayload.push(resume);
    if (coverLetter) attachmentsPayload.push(coverLetter);

    const renderedSubject = renderTemplate(template.subject, myDetails, jobDetails);
    const renderedBody = renderTemplate(template.body, myDetails, jobDetails);

    for (let i = 0; i < batchTarget.length; i++) {
      if (isStopRequested.current) {
        setStoppedReason('Batch sending was manually stopped by user.');
        break;
      }

      const item = batchTarget[i];
      setCurrentBatchIndex(i);

      // Update current status to sending
      setBatchProgress((prev) =>
        prev.map((p, idx) => (idx === i ? { ...p, status: 'sending' } : p))
      );

      try {
        const isUsingSmtp = connectionMode === 'smtp';
        const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        const requestBody: any = {
          to: item.email,
          fromName: myDetails.name,
          fromEmail: myDetails.email || activeSenderEmail,
          subject: renderedSubject,
          body: renderedBody,
          attachments: attachmentsPayload,
        };

        if (isUsingSmtp) {
          requestBody.smtpConfig = smtpConfig;
        } else {
          const token = getAccessToken();
          if (!token) {
            throw new Error('OAuth access token expired or missing. Please connect Gmail.');
          }
          requestHeaders.Authorization = `Bearer ${token}`;
        }

        // Send request to server proxy endpoint
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok) {
          const errMsg = result.error || 'Failed to send email';
          setBatchProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status: 'failed', errorMessage: errMsg } : p))
          );

          newHistoryEntries.push({
            id: `hist-${Math.random().toString(36).substring(2, 9)}`,
            hrEmail: item.email,
            company: jobDetails.company,
            jobTitle: jobDetails.title,
            status: 'failed',
            date: new Date().toISOString(),
            errorMessage: errMsg,
          });

          // Check if error is quota restriction or security stop
          if (
            response.status === 429 ||
            response.status === 403 ||
            errMsg.toLowerCase().includes('quota') ||
            errMsg.toLowerCase().includes('rate limit') ||
            errMsg.toLowerCase().includes('restricted')
          ) {
            setStoppedReason(`Gmail sending restriction triggered: ${errMsg}`);
            break;
          }
        } else {
          // Success
          setBatchProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status: 'sent' } : p))
          );

          newHistoryEntries.push({
            id: `hist-${Math.random().toString(36).substring(2, 9)}`,
            hrEmail: item.email,
            company: jobDetails.company,
            jobTitle: jobDetails.title,
            status: 'sent',
            date: new Date().toISOString(),
          });
        }
      } catch (err: any) {
        const errMsg = err.message || 'Network error';
        setBatchProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: 'failed', errorMessage: errMsg } : p))
        );

        newHistoryEntries.push({
          id: `hist-${Math.random().toString(36).substring(2, 9)}`,
          hrEmail: item.email,
          company: jobDetails.company,
          jobTitle: jobDetails.title,
          status: 'failed',
          date: new Date().toISOString(),
          errorMessage: errMsg,
        });
      }

      // Small delay between emails to respect provider rate limits
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    // Save newly sent history entries
    if (newHistoryEntries.length > 0) {
      const updatedHistory = addHistoryItems(newHistoryEntries);
      setHistory(updatedHistory);
    }

    // Remove sent items from current input textarea or mark them
    const sentEmailsSet = new Set(newHistoryEntries.filter((e) => e.status === 'sent').map((e) => e.hrEmail.toLowerCase()));
    if (sentEmailsSet.size > 0) {
      setRemovedItemIds((prev) => {
        const next = new Set(prev);
        batchTarget.forEach((item) => {
          if (sentEmailsSet.has(item.email.toLowerCase())) {
            next.add(item.id);
          }
        });
        return next;
      });
    }

    setIsSending(false);
    setIsFinished(true);
  };

  const handleStopBatch = () => {
    isStopRequested.current = true;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        connectedEmail={activeSenderEmail}
        connectionMode={connectionMode}
        isConnecting={isConnecting}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onDisconnect={handleDisconnect}
        onOpenHelp={() => setIsOAuthHelpOpen(true)}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Alert if Sender is not connected */}
        {!activeSenderEmail && (
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Connect your Gmail (dasrojalindas03@gmail.com)</h3>
                <p className="text-xs text-blue-100">
                  Connect using a Google App Password for 100% reliable sending without OAuth 403 blocks.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                id="btn-banner-oauth-help"
                onClick={() => setIsOAuthHelpOpen(true)}
                className="px-3 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs rounded-xl transition-all whitespace-nowrap"
              >
                Sign-In Guide
              </button>
              <button
                type="button"
                id="btn-banner-connect-gmail"
                onClick={() => setIsConnectModalOpen(true)}
                className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
              >
                Connect Sender Account
              </button>
            </div>
          </div>
        )}

        {/* 1. My Details Section */}
        <MyDetailsSection
          details={myDetails}
          onChange={handleMyDetailsChange}
          savedTime={detailsSavedTime}
        />

        {/* 2. Job Details Section */}
        <JobDetailsSection
          details={jobDetails}
          onChange={handleJobDetailsChange}
        />

        {/* 3. HR Email List Section */}
        <HrEmailSection
          rawText={rawHrEmails}
          onRawTextChange={setRawHrEmails}
          items={parseResult.items}
          stats={parseResult.stats}
          onRemoveItem={handleRemoveHrItem}
          onToggleItemSelection={handleToggleHrItemSelection}
          onClearAll={handleClearHrEmails}
        />

        {/* 4. Resume & Cover Letter Section */}
        <ResumeSection
          resume={resume}
          coverLetter={coverLetter}
          onResumeChange={setResume}
          onCoverLetterChange={setCoverLetter}
        />

        {/* 5. Email Template & Live Preview Section */}
        <TemplateSection
          template={template}
          myDetails={myDetails}
          jobDetails={jobDetails}
          onTemplateChange={handleTemplateChange}
          onResetTemplate={handleResetTemplate}
        />

        {/* 6. Prominent Send Applications Action Bar */}
        <div id="section-send-action" className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold flex items-center justify-center sm:justify-start gap-2">
              <span>Ready to Send Applications</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                {validRecipientsToSubmit.length} Valid Recipient{validRecipientsToSubmit.length === 1 ? '' : 's'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Each email will be sent individually from {activeSenderEmail || 'dasrojalindas03@gmail.com'} without exposing other HR addresses (No CC/BCC).
            </p>
          </div>

          <button
            type="button"
            id="btn-send-job-applications"
            onClick={handleInitiateSend}
            disabled={validRecipientsToSubmit.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>Send Job Applications</span>
          </button>
        </div>

        {/* History Table Section */}
        <HistorySection
          history={history}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Connect Gmail Modal */}
      <ConnectGmailModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        smtpConfig={smtpConfig}
        onSaveSmtpConfig={handleSaveSmtpConfig}
        onConnectOAuth={handleConnectGmail}
        isOAuthConnecting={isConnecting}
        connectedEmail={activeSenderEmail}
        onDisconnectAll={handleDisconnect}
      />

      {/* Confirmation Modal */}
      <SendConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAndSend}
        recipients={validRecipientsToSubmit}
        myDetails={myDetails}
        jobDetails={jobDetails}
        template={template}
        resume={resume}
        coverLetter={coverLetter}
        gmailAddress={activeSenderEmail || 'dasrojalindas03@gmail.com'}
      />

      {/* Real-time Progress Modal */}
      <SendProgressModal
        isOpen={isProgressModalOpen}
        progressList={batchProgress}
        currentIndex={currentBatchIndex}
        totalBatchSize={batchProgress.length}
        isSending={isSending}
        isFinished={isFinished}
        stoppedReason={stoppedReason}
        onDone={() => setIsProgressModalOpen(false)}
        onStopBatch={handleStopBatch}
      />

      {/* OAuth Verification & 403 Troubleshooting Modal */}
      <OAuthHelpModal
        isOpen={isOAuthHelpOpen}
        onClose={() => setIsOAuthHelpOpen(false)}
        onRetrySignIn={handleConnectGmail}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Job Apply Mailer &bull; Designed & Developed by <span className="text-blue-600 font-bold">Rojalin Das</span>
        </p>
        <p className="mt-1 text-slate-400">Direct Gmail SMTP / API &bull; Private & Secure Client-Side Execution</p>
      </footer>
    </div>
  );
}
