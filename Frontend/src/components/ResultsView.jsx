import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, Copy, Check, FileText, Globe } from 'lucide-react';

const I18N = {
  en: {
    scamDetected: 'SCAM DETECTED',
    suspiciousActivity: 'SUSPICIOUS ACTIVITY',
    likelySafe: 'LIKELY SAFE',
    notEnoughInfo: 'NOT ENOUGH INFO',
    incidentStage: 'Incident Stage',
    riskScore: 'Risk Score',
    confidence: 'Confidence',
    analysisExplanation: 'Analysis Explanation',
    identifiedRedFlags: 'Identified Red Flags',
    extractedDetails: 'Extracted Incident Details',
    amountInQuestion: 'Amount In Question',
    suspectUpiAccount: 'Suspect UPI / Account',
    suspectPhone: 'Suspect Phone / Contact',
    channelUsed: 'Channel Used',
    suspectUrlApp: 'Suspect URL / Download Link',
    transactionId: 'Transaction ID',
    immediateActions: 'Recommended Immediate Actions',
    generateCaseFileTitle: 'Generate Official Case File',
    generateCaseFileDesc: 'Because money was transferred, you can generate ready-to-use complaint text for the National Cyber Crime Portal (1930) and an official dispute email for your bank.',
    generateCaseFileBtn: 'Generate Case File',
    copySummary: 'Copy Analysis Summary',
    summaryCopied: 'Summary Copied',
    verifiedInference: 'Backend Verified Inference',
    languageToggleLabel: 'Language',
  },
  hi: {
    scamDetected: 'धोखाधड़ी / स्कैम की पुष्टि',
    suspiciousActivity: 'संदिग्ध गतिविधि',
    likelySafe: 'सुरक्षित प्रतीत होता है',
    notEnoughInfo: 'पर्याप्त जानकारी नहीं',
    incidentStage: 'घटना का चरण',
    riskScore: 'जोखिम स्कोर',
    confidence: 'विश्वसनीयता',
    analysisExplanation: 'विश्लेषण और निष्कर्ष',
    identifiedRedFlags: 'पहचाने गए खतरे / रेड फ्लैग्स',
    extractedDetails: 'निकाले गए मुख्य विवरण',
    amountInQuestion: 'संबंधित राशि',
    suspectUpiAccount: 'संदिग्ध UPI / बैंक खाता',
    suspectPhone: 'संदिग्ध फ़ोन / संपर्क',
    channelUsed: 'इस्तेमाल किया गया माध्यम',
    suspectUrlApp: 'संदिग्ध लिंक या ऐप डाउनलोड URL',
    transactionId: 'लेनदेन संदर्भ संख्या (UTR / ID)',
    immediateActions: 'तुरंत उठाए जाने वाले सुरक्षा कदम',
    generateCaseFileTitle: 'आधिकारिक केस फाइल तैयार करें',
    generateCaseFileDesc: 'चूंकि पैसे कट चुके हैं, आप राष्ट्रीय साइबर अपराध पोर्टल (1930) के लिए तैयार शिकायत पत्र और अपने बैंक के लिए आधिकारिक ईमेल तुरंत बना सकते हैं।',
    generateCaseFileBtn: 'केस फाइल बनाएं',
    copySummary: 'विश्लेषण का सार कॉपी करें',
    summaryCopied: 'कॉपी हो गया!',
    verifiedInference: 'बैकएंड द्वारा सत्यापित रिपोर्ट',
    languageToggleLabel: 'भाषा',
  },
};

const SCAM_TYPE_LABELS = {
  en: {
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
  },
  hi: {
    DIGITAL_ARREST: 'डिजिटल अरेस्ट / पुलिस बनकर धोखाधड़ी',
    INVESTMENT_FRAUD: 'निवेश घोटाला / ज्यादा मुनाफे का लालच (Investment Fraud)',
    KYC_PHISHING: 'केवाईसी (KYC) / बैंक खाता बंद होने का झांसा',
    UPI_COLLECT: 'यूपीआई (UPI) कलेक्ट रिक्वेस्ट फ्रॉड',
    FAKE_JOB: 'फर्जी नौकरी / वर्क फ्रॉम होम टास्क स्कैम',
    LOTTERY_PRIZE: 'लॉटरी / इनाम राशि का झांसा',
    LOAN_APP: 'इंस्टेंट लोन / ब्लैकमेलिंग ऐप',
    SEXTORTION: 'वीडियो कॉल ब्लैकमेल / सेक्सटॉर्शन',
    E_COMMERCE: 'फर्जी डिलीवरी / कूरियर फ्रॉड',
    IMPERSONATION_OTHER: 'परिचित या अधिकारी बनकर धोखाधड़ी',
    OTHER: 'संदिग्ध धोखाधड़ी गतिविधि',
    NONE: 'कोई धोखाधड़ी नहीं पाई गई',
  },
};

const STAGE_LABELS = {
  en: {
    MONEY_LOST: 'Money Transferred / Lost',
    ATTEMPT_ONLY: 'Attempt Only (No Money Lost)',
    UNKNOWN: 'Stage Unconfirmed',
  },
  hi: {
    MONEY_LOST: 'पैसे कट चुके हैं (नुकसान हुआ)',
    ATTEMPT_ONLY: 'केवल प्रयास (पैसे नहीं कटे)',
    UNKNOWN: 'अज्ञात चरण',
  },
};

const CHANNEL_LABELS = {
  en: {
    WHATSAPP: 'WhatsApp',
    TELEGRAM: 'Telegram',
    SMS: 'SMS Text',
    CALL: 'Phone Call',
    EMAIL: 'Email',
    SOCIAL_MEDIA: 'Social Media',
    APP: 'Mobile App',
    OTHER: 'Other Channel',
  },
  hi: {
    WHATSAPP: 'व्हाट्सएप (WhatsApp)',
    TELEGRAM: 'टेलीग्राम (Telegram)',
    SMS: 'एसएमएस (SMS)',
    CALL: 'फ़ोन कॉल (Call)',
    EMAIL: 'ईमेल (Email)',
    SOCIAL_MEDIA: 'सोशल मीडिया (Social Media)',
    APP: 'मोबाइल ऐप (Mobile App)',
    OTHER: 'अन्य माध्यम',
  },
};

// Fallback translator for older scan results that do not have red_flags_hi
function translateRedFlagToHi(text) {
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('guaranteed') && (lower.includes('return') || lower.includes('%'))) {
    return 'कम समय में अस्वाभाविक और गारंटीड मुनाफे का झूठा वादा';
  }
  if (lower.includes('telegram') && lower.includes('vip')) {
    return 'टेलीग्राम पर वीआईपी (VIP) स्टॉक या ट्रेडिंग टिप्स ग्रुप';
  }
  if (lower.includes('fake trading') || lower.includes('fictitious profit')) {
    return 'फर्जी ट्रेडिंग ऐप जिसमें नकली मुनाफा दिखाया जा रहा है';
  }
  if (lower.includes('withdrawal') || lower.includes('additional money')) {
    return 'पैसे निकालने (विड्रॉल) के लिए अतिरिक्त रकम जमा करने का दबाव';
  }
  if (lower.includes('urgency') || lower.includes('hours') || lower.includes('immediate')) {
    return 'जल्दबाजी और डर पैदा करने के लिए तुरंत कार्रवाई का दबाव';
  }
  if (lower.includes('kyc') || lower.includes('suspended') || lower.includes('blocked')) {
    return 'केवाईसी (KYC) अधूरा होने या खाता बंद होने का फर्जी डर';
  }
  if (lower.includes('police') || lower.includes('cbi') || lower.includes('arrest') || lower.includes('narcotics')) {
    return 'पुलिस/सीबीआई या कूरियर में नशीली दवा होने का झूठा आरोप और गिरफ्तारी की धमकी';
  }
  if (lower.includes('shortlink') || lower.includes('link') || lower.includes('apk') || lower.includes('url')) {
    return 'बैंक के आधिकारिक डोमेन के बजाय संदिग्ध शॉर्टलिंक या अज्ञात लिंक का इस्तेमाल';
  }
  if (lower.includes('otp') || lower.includes('pin') || lower.includes('password')) {
    return 'गोपनीय ओटीपी (OTP) या यूपीआई पिन (PIN) दर्ज करने का आग्रह';
  }
  return text;
}

// Fallback translator for older scan results that do not have immediate_steps_hi
function translateImmediateStepToHi(text) {
  if (!text) return '';
  const lower = text.toLowerCase();
  if (lower.includes('1930') || lower.includes('helpline') || lower.includes('cybercrime')) {
    return 'राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर 1930 पर तुरंत कॉल करके शिकायत दर्ज कराएं।';
  }
  if (lower.includes('do not pay') || lower.includes('further amount') || lower.includes('stop payment') || lower.includes('additional')) {
    return 'मांगी गई अतिरिक्त रकम या कोई भी अन्य पैसा आगे बिल्कुल न भेजें।';
  }
  if (lower.includes('inform your bank') || lower.includes('bank immediately')) {
    return 'धोखाधड़ी वाले लेनदेन के बारे में अपने बैंक को तुरंत सूचित करें और खाता सुरक्षित कराएं।';
  }
  if (lower.includes('screenshot') || lower.includes('evidence') || lower.includes('chats')) {
    return 'सभी चैट, स्क्रीनशॉट, ट्रांजेक्शन आईडी और फोन नंबर का साक्ष्य सुरक्षित रखें।';
  }
  if (lower.includes('cybercrime.gov.in')) {
    return 'cybercrime.gov.in पोर्टल पर विस्तृत ऑनलाइन शिकायत दर्ज कराएं।';
  }
  if (lower.includes('do not click') || lower.includes('do not share') || lower.includes('credentials')) {
    return 'संदिग्ध लिंक पर क्लिक न करें और न ही बैंक विवरण या पासवर्ड किसी से साझा करें।';
  }
  if (lower.includes('block') || lower.includes('report the number')) {
    return 'संदिग्ध नंबर या सोशल मीडिया प्रोफाइल को तुरंत ब्लॉक और रिपोर्ट करें।';
  }
  return text;
}

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
    red_flags_hi = [],
    extracted = {},
    explanation_en,
    explanation_hi,
    immediate_steps = [],
    immediate_steps_hi = [],
  } = result;

  const t = I18N[lang];

  // Verdict styling & localized label
  const isScam = verdict === 'SCAM';
  const isSuspicious = verdict === 'SUSPICIOUS';
  const isSafe = verdict === 'SAFE';

  const verdictStyles = isScam
    ? {
        container: 'bg-status-scamBg border-status-scamBorder text-status-scamText',
        badge: 'bg-[#991B1B] text-white',
        icon: AlertTriangle,
        label: t.scamDetected,
      }
    : isSuspicious
    ? {
        container: 'bg-status-suspiciousBg border-status-suspiciousBorder text-status-suspiciousText',
        badge: 'bg-[#B45309] text-white',
        icon: ShieldAlert,
        label: t.suspiciousActivity,
      }
    : isSafe
    ? {
        container: 'bg-status-safeBg border-status-safeBorder text-status-safeText',
        badge: 'bg-[#15803D] text-white',
        icon: CheckCircle2,
        label: t.likelySafe,
      }
    : {
        container: 'bg-[#F7F7F7] border-[#EAEAEA] text-[#191919]',
        badge: 'bg-[#737373] text-white',
        icon: HelpCircle,
        label: t.notEnoughInfo,
      };

  const VerdictIcon = verdictStyles.icon;

  // Active Red Flags in current language
  const activeRedFlags =
    lang === 'hi'
      ? red_flags_hi && red_flags_hi.length > 0
        ? red_flags_hi
        : red_flags.map(translateRedFlagToHi)
      : red_flags;

  // Active Immediate Steps in current language
  const activeImmediateSteps =
    lang === 'hi'
      ? immediate_steps_hi && immediate_steps_hi.length > 0
        ? immediate_steps_hi
        : immediate_steps.map(translateImmediateStepToHi)
      : immediate_steps;

  // Active Scam Pattern Label
  const scamPatternLabel =
    SCAM_TYPE_LABELS[lang][scam_type] ||
    SCAM_TYPE_LABELS['en'][scam_type] ||
    scam_type;

  // Active Incident Stage Label
  const incidentStageLabel =
    STAGE_LABELS[lang][incident_stage] ||
    incident_stage?.replace(/_/g, ' ');

  // Active Channel Label
  const channelLabel = extracted.contact_channel
    ? CHANNEL_LABELS[lang][extracted.contact_channel] || extracted.contact_channel
    : null;

  const handleCopySummary = () => {
    const summaryText =
      lang === 'hi'
        ? `[ScamShield विश्लेषण रिपोर्ट]
निष्कर्ष: ${verdictStyles.label}
जोखिम स्कोर: ${risk_score}/100
पैटर्न: ${scamPatternLabel}
घटना का चरण: ${incidentStageLabel || 'अज्ञात'}

पहचाने गए खतरे:
${activeRedFlags.map((flag) => `- ${flag}`).join('\n')}

सुझाए गए सुरक्षा कदम:
${activeImmediateSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`
        : `[ScamShield Analysis]
Verdict: ${verdict}
Risk Score: ${risk_score}/100
Pattern: ${SCAM_TYPE_LABELS['en'][scam_type] || scam_type || 'N/A'}
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
      {/* Top Banner: Classification, Score, and Global Language Switcher */}
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
                  <span className="text-[12px] opacity-85">
                    • {scamPatternLabel}
                  </span>
                )}
              </div>
              {incident_stage && (
                <div className="text-[12px] opacity-80 mt-0.5">
                  {t.incidentStage}: <span className="font-medium">{incidentStageLabel}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-current/20 justify-between sm:justify-end">
            {typeof risk_score === 'number' && (
              <div className="text-left sm:text-right">
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-medium">{t.riskScore}</div>
                <div className="text-xl font-bold">{risk_score} <span className="text-xs font-normal opacity-75">/ 100</span></div>
              </div>
            )}
            {typeof confidence === 'number' && (
              <div className="text-left sm:text-right">
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-medium">{t.confidence}</div>
                <div className="text-xl font-bold">{Math.round(confidence * 100)}%</div>
              </div>
            )}

            {/* Language Switcher pill in Top Banner */}
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm p-1 rounded border border-current/20 text-[12px]">
              <Globe className="w-3.5 h-3.5 text-current opacity-70 ml-1 hidden sm:inline-block" />
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  lang === 'en'
                    ? 'bg-[#191919] text-white font-medium shadow-subtle'
                    : 'opacity-70 hover:opacity-100 font-normal'
                }`}
                title="Switch to English"
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  lang === 'hi'
                    ? 'bg-[#191919] text-white font-medium shadow-subtle'
                    : 'opacity-70 hover:opacity-100 font-normal'
                }`}
                title="हिन्दी में देखें"
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="p-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold text-[#191919]">
            {t.analysisExplanation}
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
          {lang === 'hi'
            ? explanation_hi || explanation_en || 'कोई विवरण उपलब्ध नहीं है।'
            : explanation_en || 'No explanation provided.'}
        </p>
      </div>

      {/* Red Flags List */}
      {activeRedFlags.length > 0 && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#191919] mb-3">
            {t.identifiedRedFlags} ({activeRedFlags.length})
          </h3>
          <ul className="space-y-2">
            {activeRedFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[#191919]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-2 shrink-0" />
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Extracted Artifacts / Indicators */}
      {hasExtractedData && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#191919] mb-3">
            {t.extractedDetails}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            {extracted.amount_inr != null && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">{t.amountInQuestion}</div>
                <div className="font-semibold text-[#191919] mt-0.5">₹{extracted.amount_inr.toLocaleString('en-IN')}</div>
              </div>
            )}
            {extracted.scammer_upi_or_account && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">{t.suspectUpiAccount}</div>
                <div className="font-mono text-[#191919] mt-0.5 break-all">{extracted.scammer_upi_or_account}</div>
              </div>
            )}
            {extracted.scammer_phone && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">{t.suspectPhone}</div>
                <div className="font-mono text-[#191919] mt-0.5">{extracted.scammer_phone}</div>
              </div>
            )}
            {extracted.contact_channel && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">{t.channelUsed}</div>
                <div className="font-medium text-[#191919] mt-0.5">{channelLabel}</div>
              </div>
            )}
            {extracted.scammer_url_or_app && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA] sm:col-span-2">
                <div className="text-[11px] text-[#737373]">{t.suspectUrlApp}</div>
                <div className="font-mono text-[12px] text-[#991B1B] mt-0.5 break-all">{extracted.scammer_url_or_app}</div>
              </div>
            )}
            {extracted.transaction_id && (
              <div className="p-2.5 rounded bg-[#F7F7F7] border border-[#EAEAEA]">
                <div className="text-[11px] text-[#737373]">{t.transactionId}</div>
                <div className="font-mono text-[#191919] mt-0.5 break-all">{extracted.transaction_id}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended Safety Actions */}
      {activeImmediateSteps.length > 0 && (
        <div className="p-5 bg-[#F7F7F7] border border-[#EAEAEA] rounded-lg">
          <h3 className="text-[14px] font-semibold text-[#191919] mb-3">
            {t.immediateActions}
          </h3>
          <ol className="space-y-2 text-[13px] text-[#191919]">
            {activeImmediateSteps.map((step, idx) => (
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
                  {t.generateCaseFileTitle}
                </h4>
              </div>
              <p className="text-[13px] text-[#737373] mt-1 max-w-xl">
                {t.generateCaseFileDesc}
              </p>
            </div>
            <button
              onClick={onGenerateCaseFile}
              className="px-4 py-2 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors whitespace-nowrap self-start sm:self-center"
            >
              {t.generateCaseFileBtn}
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
          <span>{copied ? t.summaryCopied : t.copySummary}</span>
        </button>
        <span>{t.verifiedInference}</span>
      </div>
    </div>
  );
}
