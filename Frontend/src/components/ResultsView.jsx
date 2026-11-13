import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, ArrowRight, Copy, Check, FileText } from 'lucide-react';

const SCAM_TYPE_LABELS = {
  DIGITAL_ARREST: 'Digital Arrest / Police Impersonation',
  INVESTMENT_FRAUD: 'Investment / High-Return Fraud',
  KYC_PHISHING: 'KYC / Account Suspension Phishing',
  UPI_COLLECT: 'UPI Collect Request Fraud',
  FAKE_JOB: 'Fake Job / Work-From-Home Task Scam',
  LOTTERY_PRIZE: 'Lottery / Prize Money Fraud',
  LOAN_APP: 'Instant Loan / Blackmail App',
  SEXTORTION: 'Video Call Blackmail / Sextortion',
  E_COMMERCE: 'Fake Delivery / Courier Fraud',
  IMPERSONATION_OTHER: 'Impersonation of Known Person / Official',
  OTHER: 'Fraudulent Activity',
  NONE: 'No Scam Pattern Detected',
};

export default function ResultsView({ result, onGenerateCaseFile }) {
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    verdict,
    risk_score,
    confidence,
    scam_type,
    incident_stage,
    red_flags = [],
    extracted = {},
    needs_verification = [],
    explanation_en,
    explanation_hi,
    immediate_steps = [],
  } = result;

  // Verdict styling
  const isScam = verdict === 'SCAM';
  const isSuspicious = verdict === 'SUSPICIOUS';
  const isSafe = verdict === 'SAFE';

  const verdictStyles = isScam
    ? {
        container: 'bg-status-scamBg border-status-scamBorder text-status-scamText',
        badge: 'bg-[#991B1B] text-white',
        icon: AlertTriangle,
        label: 'SCAM DETECTED',
      }
    : isSuspicious
    ? {
        container: 'bg-status-suspiciousBg border-status-suspiciousBorder text-status-suspiciousText',
        badge: 'bg-[#B45309] text-white',
        icon: ShieldAlert,
        label: 'SUSPICIOUS ACTIVITY',
      }
    : isSafe
    ? {
        container: 'bg-status-safeBg border-status-safeBorder text-status-safeText',
        badge: 'bg-[#15803D] text-white',
        icon: CheckCircle2,
        label: 'LIKELY SAFE',
      }
    : {
        container: 'bg-[#F7F7F7] border-[#EAEAEA] text-[#191919]',
        badge: 'bg-[#737373] text-white',
        icon: HelpCircle,
        label: 'NOT ENOUGH INFO',
      };

  const VerdictIcon = verdictStyles.icon;

  const handleCopySummary = () => {
    const summaryText = `[ScamShield Analysis]
Verdict: ${verdict}
Risk Score: ${risk_score}/100
Pattern: ${SCAM_TYPE_LABELS[scam_type] || scam_type || 'N/A'}
Stage: ${incident_stage || 'Unknown'}

Red Flags:
${red_flags.map((flag) => `- ${flag}`).join('\n')}

Recommended Actions:
${immediate_steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasExtractedData =
    extracted &&
    (extracted.amount_inr ||
      extracted.transaction_id ||
      extracted.scammer_upi_or_account ||
      extracted.scammer_phone ||
      extracted.scammer_url_or_app ||
      extracted.contact_channel ||
      extracted.incident_time_text);

  return (
    <div className="mt-8 space-y-6">
      {/* Top Banner: Classification and Score */}
      <div className={`p-5 rounded-lg border ${verdictStyles.container} shadow-subtle`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <VerdictIcon className="w-6 h-6 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-semibold tracking-tight">
                  {verdictStyles.label}
                </span>
                {scam_type && scam_type !== 'NONE' && (
                  <span className="text-[12px] opacity-80">
                    • {SCAM_TYPE_LABELS[scam_type] || scam_type}
                  </span>
                )}
              </div>
              {incident_stage && (
                <div className="text-[12px] opacity-75 mt-0.5">
                  Incident Stage: {incident_stage.replace('_', ' ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-current/20">
            {typeof risk_score === 'number' && (
              <div className="text-left sm:text-right">
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-medium">Risk Score</div>
                <div className="text-xl font-bold">{risk_score} <span className="text-xs font-normal opacity-75">/ 100</span></div>
              </div>
            )}
            {typeof confidence === 'number' && (
              <div className="text-left sm:text-right">
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-medium">Confidence</div>
                <div className="text-xl font-bold">{Math.round(confidence * 100)}%</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation Section with EN / HI Language Switcher */}
      <div className="p-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold text-[#191919]">
            Analysis Explanation
          </h3>
          <div className="flex items-center gap-1 bg-[#F7F7F7] p-0.5 rounded border border-[#EAEAEA] text-[12px]">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'en' ? 'bg-[#FFFFFF] text-[#191919] font-medium shadow-subtle' : 'text-[#737373] hover:text-[#191919]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'hi' ? 'bg-[#FFFFFF] text-[#191919] font-medium shadow-subtle' : 'text-[#737373] hover:text-[#191919]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <p className="text-[14px] text-[#191919] leading-relaxed whitespace-pre-line">
          {lang === 'hi' && explanation_hi ? explanation_hi : explanation_en || 'No explanation provided.'}
        </p>
      </div>

      {/* Red Flags List */}
      {red_flags.length > 0 && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#191919] mb-3">
            Identified Red Flags ({red_flags.length})
          </h3>
          <ul className="space-y-2">
            {red_flags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[#191919]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-2 shrink-0" />
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Artifacts / Indicators (Only if actual data present) */}
      {hasExtractedData && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#191919] mb-3">
            Extracted Incident Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            {extracted.amount_inr != null && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">Amount In Question</div>
                <div className="font-semibold text-[#191919] mt-0.5">₹{extracted.amount_inr.toLocaleString('en-IN')}</div>
              </div>
            )}
            {extracted.scammer_upi_or_account && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">Suspect UPI / Account</div>
                <div className="font-mono text-[#191919] mt-0.5 break-all">{extracted.scammer_upi_or_account}</div>
              </div>
            )}
            {extracted.scammer_phone && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">Suspect Phone / Contact</div>
                <div className="font-mono text-[#191919] mt-0.5">{extracted.scammer_phone}</div>
              </div>
            )}
            {extracted.contact_channel && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">Channel Used</div>
                <div className="font-medium text-[#191919] mt-0.5">{extracted.contact_channel}</div>
              </div>
            )}
            {extracted.scammer_url_or_app && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA] sm:col-span-2">
                <div className="text-[11px] text-[#737373]">Suspect URL / Download Link</div>
                <div className="font-mono text-[12px] text-[#991B1B] mt-0.5 break-all">{extracted.scammer_url_or_app}</div>
              </div>
            )}
            {extracted.transaction_id && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">Transaction ID</div>
                <div className="font-mono text-[#191919] mt-0.5 break-all">{extracted.transaction_id}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended Safety Actions */}
      {immediate_steps.length > 0 && (
        <div className="p-5 bg-[#F7F7F7] border border-[#EAEAEA] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#191919] mb-3">
            Recommended Immediate Actions
          </h3>
          <ol className="space-y-2 text-[13px] text-[#191919]">
            {immediate_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-semibold text-[#2383E2] min-w-[16px]">{idx + 1}.</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Case File Generator Callout if Money Was Lost */}
      {incident_stage === 'MONEY_LOST' && (
        <div className="p-5 bg-[#FFFFFF] border-2 border-[#2383E2] rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2383E2]" />
                <h4 className="text-[15px] font-semibold text-[#191919]">
                  Generate Official Case File
                </h4>
              </div>
              <p className="text-[13px] text-[#737373] mt-1 max-w-xl">
                Because money was transferred, you can generate ready-to-use complaint text for the National Cyber Crime Portal (1930) and an official dispute email for your bank.
              </p>
            </div>
            <button
              onClick={onGenerateCaseFile}
              className="px-4 py-2 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors whitespace-nowrap self-start sm:self-center"
            >
              Generate Case File
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between text-[12px] text-[#737373]">
        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 hover:text-[#191919] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied' : 'Copy Analysis Summary'}</span>
        </button>
        <span>Backend Verified Inference</span>
      </div>
    </div>
  );
}

