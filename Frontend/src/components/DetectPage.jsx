import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Mic, X, Loader2, AlertCircle, FileText, Sparkles, Lock } from 'lucide-react';
import { analyzeIncident } from '../services/api';
import ResultsView from './ResultsView';
import CaseFileModal from './CaseFileModal';

// Genuine Indian scam test scenarios for 1-click verification
const GENUINE_SCENARIOS = [
  {
    id: 1,
    tag: 'Digital Arrest',
    title: 'CBI / Police Courier Parcel Notice',
    text: 'Notice from Mumbai Crime Branch & Cyber Cell: A parcel booked under your Aadhaar Number has been confiscated at Delhi Airport containing 5 Passports, 140g MDMA narcotics, and 3 forged debit cards. You are charged under PMLA & NDPS Act. You are ordered to connect immediately to mandatory Skype Video Investigation Room or a non-bailable arrest warrant will be issued.',
  },
  {
    id: 2,
    tag: 'Utility Disconnection',
    title: 'Electricity Bill Disconnection Threat',
    text: 'URGENT: Your electricity power supply for Consumer No 8940-1928 will be permanently disconnected tonight at 9:30 PM because your previous month bill update has failed. Immediately call Electricity Verification Officer Sharma on 98214-99812 to pay ₹120 meter surcharge and avoid disconnection.',
  },
  {
    id: 3,
    tag: 'Job Task Fraud',
    title: 'Work-from-Home Telegram Task',
    text: 'Part-time opportunity: Global media agency hiring remote contractors. Earn ₹3,000 to ₹8,000 daily by simply rating Google hotels & liking YouTube videos. Payment credited instantly to UPI. Contact dispatcher on Telegram @task_director_99. Deposit ₹1,000 enrollment security fee to unlock VIP tasks.',
  },
  {
    id: 4,
    tag: 'KYC Phishing',
    title: 'SBI YONO PAN Block Threat',
    text: 'Dear Customer, Your SBI YONO Account has been suspended due to incomplete PAN card KYC. Click http://bit.ly/sbi-pan-kyc-reactivate to update credentials immediately and prevent debit card block.',
  },
];

export default function DetectPage({ user, onOpenAuth, onSaveHistory, initialScenarioId }) {
  const [message, setMessage] = useState(() => {
    if (initialScenarioId) {
      const match = GENUINE_SCENARIOS.find((s) => s.id === initialScenarioId);
      return match ? match.text : '';
    }
    return '';
  });

  const [screenshot, setScreenshot] = useState(null);
  const [audio, setAudio] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showCaseFileModal, setShowCaseFileModal] = useState(false);

  const screenshotInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleClear = () => {
    setMessage('');
    setScreenshot(null);
    setAudio(null);
    setError(null);
    setResult(null);
    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (!user) {
      if (onOpenAuth) onOpenAuth();
      setError('Please sign in or create an account to run AI scam detection.');
      return;
    }

    if (!message.trim() && !screenshot && !audio) {
      setError('Please paste a message or upload a screenshot/audio recording.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeIncident({
        message: message.trim() || undefined,
        screenshot: screenshot || undefined,
        audio: audio || undefined,
      });

      setResult(data);

      // Save to real history
      if (onSaveHistory) {
        onSaveHistory({
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          messageSnippet: message.trim() ? message.trim().slice(0, 140) : (screenshot ? `Screenshot: ${screenshot.name}` : `Audio: ${audio.name}`),
          fullMessage: message.trim(),
          result: data,
        });
      }
    } catch (err) {
      if (err.message && (err.message.includes('authorized') || err.message.includes('token') || err.message.includes('401'))) {
        setError('Your session has expired. Please sign in to analyze messages.');
        if (onOpenAuth) onOpenAuth();
      } else {
        setError(err.message || 'An error occurred during analysis. Please check backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#191919]">
          Scam Detection
        </h1>
        <p className="mt-1 text-[14px] text-[#737373]">
          Paste a suspicious message, SMS alert, payment request, or upload evidence to evaluate threat patterns.
        </p>
      </div>

      {/* Sign-in protection notice if unauthenticated */}
      {!user && (
        <div className="mb-4 p-3.5 bg-[#F7F7F7] border border-[#EAEAEA] rounded-lg text-[13px] text-[#191919] flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#737373] shrink-0" />
            <span>AI detection is protected. Sign in or create an account to analyze messages.</span>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#EAEAEA] border border-[#EAEAEA] text-[#191919] font-medium text-[12px] rounded transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Input Form Box */}
      <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg p-4 sm:p-5 shadow-card">
        {/* Text Area */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Paste a suspicious message here..."
            rows={5}
            className="w-full text-[14px] text-[#191919] placeholder:text-[#737373] bg-transparent border-0 focus:ring-0 focus:outline-none p-0 resize-y leading-relaxed"
          />
        </div>

        {/* Upload Attachments Area */}
        <div className="mt-4 pt-4 border-t border-[#EAEAEA] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          {/* Screenshot upload */}
          <div>
            <input
              ref={screenshotInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError('Screenshot must be 5MB or smaller.');
                    return;
                  }
                  setScreenshot(file);
                  if (error) setError(null);
                }
              }}
              className="hidden"
            />
            {screenshot ? (
              <div className="flex items-center justify-between p-2 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="flex items-center gap-1.5 truncate">
                  <ImageIcon className="w-3.5 h-3.5 text-[#2383E2] shrink-0" />
                  <span className="truncate text-[#191919]">{screenshot.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setScreenshot(null);
                    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
                  }}
                  className="p-0.5 text-[#737373] hover:text-[#991B1B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => screenshotInputRef.current?.click()}
                className="w-full flex items-center justify-between p-2 rounded border border-dashed border-[#EAEAEA] hover:border-[#2383E2] hover:bg-[#F7F7F7] text-[#737373] hover:text-[#191919] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Attach Screenshot (PNG, JPG)</span>
                </div>
                <span className="text-[11px] text-[#2383E2] font-medium">Browse</span>
              </button>
            )}
          </div>

          {/* Audio upload */}
          <div>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError('Audio recording must be 5MB or smaller.');
                    return;
                  }
                  setAudio(file);
                  if (error) setError(null);
                }
              }}
              className="hidden"
            />
            {audio ? (
              <div className="flex items-center justify-between p-2 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="flex items-center gap-1.5 truncate">
                  <Mic className="w-3.5 h-3.5 text-[#2383E2] shrink-0" />
                  <span className="truncate text-[#191919]">{audio.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAudio(null);
                    if (audioInputRef.current) audioInputRef.current.value = '';
                  }}
                  className="p-0.5 text-[#737373] hover:text-[#991B1B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="w-full flex items-center justify-between p-2 rounded border border-dashed border-[#EAEAEA] hover:border-[#2383E2] hover:bg-[#F7F7F7] text-[#737373] hover:text-[#191919] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Attach Audio Call Recording</span>
                </div>
                <span className="text-[11px] text-[#2383E2] font-medium">Browse</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
          <div className="text-[12px] text-[#737373]">
            {message.length > 0 ? `${message.length} characters` : 'Zero data retained'}
          </div>

          <div className="flex items-center gap-2">
            {(message.length > 0 || screenshot || audio) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="px-3 py-1.5 text-[13px] text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7] rounded transition-colors"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-1.5 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-70 shadow-subtle"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {!user && !loading && <Lock className="w-3.5 h-3.5" />}
              <span>{loading ? 'Analyzing...' : (!user ? 'Sign In to Analyze' : 'Analyze')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="mt-4 p-3 bg-status-scamBg border border-status-scamBorder rounded text-[13px] text-status-scamText flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {loading && (
        <div className="mt-8 p-8 border border-[#EAEAEA] rounded-lg bg-[#FFFFFF] text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#2383E2] mx-auto mb-3" />
          <div className="text-[14px] font-medium text-[#191919]">
            Analyzing message indicators...
          </div>
          <div className="text-[12px] text-[#737373] mt-1">
            Evaluating urgency tactics, payment references, domain routing, and contact vectors.
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <ResultsView
          result={result}
          onGenerateCaseFile={() => setShowCaseFileModal(true)}
        />
      )}

      {/* Genuine Test Scenarios Presets */}
      <div className="mt-12 pt-8 border-t border-[#EAEAEA]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-[#191919]">
            Common Threat Patterns (1-Click Test)
          </h2>
          <span className="text-[12px] text-[#737373]">
            Click any scenario to populate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {GENUINE_SCENARIOS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMessage(item.text);
                setScreenshot(null);
                setAudio(null);
                setResult(null);
                setError(null);
              }}
              className="text-left p-3 rounded border border-[#EAEAEA] bg-[#FFFFFF] hover:bg-[#F7F7F7] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-[#2383E2] bg-[#EBF3FC] px-1.5 py-0.5 rounded">
                  {item.tag}
                </span>
                <span className="text-[11px] text-[#737373]">Test</span>
              </div>
              <div className="text-[13px] font-medium text-[#191919]">
                {item.title}
              </div>
              <p className="text-[12px] text-[#737373] line-clamp-2 mt-1">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Case File Generator Modal */}
      {showCaseFileModal && result && (
        <CaseFileModal
          analysis={result}
          user={user}
          onClose={() => setShowCaseFileModal(false)}
        />
      )}
    </div>
  );
}

