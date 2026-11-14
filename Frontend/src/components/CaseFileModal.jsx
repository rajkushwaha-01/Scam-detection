import React, { useState } from 'react';
import { X, Copy, Check, FileText, Loader2, AlertCircle, Globe } from 'lucide-react';
import { generateCaseFile } from '../services/api';

const I18N = {
  en: {
    title: 'Incident Case File Generator',
    subtitle: "Generate structured complaint drafts for the National Cyber Crime Helpline (1930) and your bank's fraud dispute cell.",
    nameLabel: 'Your Full Name (Optional)',
    namePlaceholder: 'e.g. Rahul Sharma',
    phoneLabel: 'Mobile Number (Optional)',
    phonePlaceholder: 'e.g. 98XXXXXXXX',
    bankLabel: 'Bank / Wallet Name (Optional)',
    bankPlaceholder: 'e.g. State Bank of India / HDFC',
    incidentTimeLabel: 'Approx Incident Date & Time (Optional)',
    incidentTimePlaceholder: 'e.g. Today at 2:30 PM',
    outputLang: 'Output Language:',
    cancel: 'Cancel',
    generateBtn: 'Generate Official Drafts',
    generating: 'Generating Drafts...',
    callScriptTitle: 'Dial 1930 — Helpline Phone Script',
    complaintTitle: 'cybercrime.gov.in Complaint Description',
    bankEmailTitle: 'Official Bank Fraud Notice Email',
    evidenceTitle: 'Evidence Checklist to Attach',
    copy: 'Copy',
    copied: 'Copied',
    done: 'Done',
    subject: 'Subject',
    errorSignIn: 'Please sign in to generate official case files.',
    errorGeneral: 'Failed to generate case file. Please try again.',
  },
  hi: {
    title: 'घटना केस फाइल जनरेटर',
    subtitle: 'राष्ट्रीय साइबर अपराध हेल्पलाइन (1930) और अपने बैंक के लिए आधिकारिक शिकायत पत्र व ईमेल तुरंत तैयार करें।',
    nameLabel: 'आपका पूरा नाम (वैकल्पिक)',
    namePlaceholder: 'उदा. राहुल शर्मा',
    phoneLabel: 'मोबाइल नंबर (वैकल्पिक)',
    phonePlaceholder: 'उदा. 98XXXXXXXX',
    bankLabel: 'बैंक / वॉलेट का नाम (वैकल्पिक)',
    bankPlaceholder: 'उदा. भारतीय स्टेट बैंक (SBI) / एचडीएफसी',
    incidentTimeLabel: 'घटना का समय व तारीख (वैकल्पिक)',
    incidentTimePlaceholder: 'उदा. आज दोपहर 2:30 बजे',
    outputLang: 'दस्तावेज़ की भाषा:',
    cancel: 'रद्द करें',
    generateBtn: 'आधिकारिक ड्राफ्ट तैयार करें',
    generating: 'ड्राफ्ट तैयार हो रहा है...',
    callScriptTitle: '1930 साइबर हेल्पलाइन — कॉल करते समय बोलने के लिए स्क्रिप्ट',
    complaintTitle: 'cybercrime.gov.in पोर्टल शिकायत विवरण',
    bankEmailTitle: 'बैंक को भेजने हेतु आधिकारिक धोखाधड़ी सूचना ईमेल',
    evidenceTitle: 'साथ में जोड़ने वाले आवश्यक साक्ष्य (Checklist)',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    done: 'पूर्ण (Done)',
    subject: 'विषय',
    errorSignIn: 'केस फाइल बनाने के लिए कृपया साइन इन करें।',
    errorGeneral: 'केस फाइल जनरेट करने में समस्या आई। कृपया पुनः प्रयास करें।',
  },
};

export default function CaseFileModal({ analysis, user, initialLanguage = 'en', onClose }) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || user?.trustedContact?.phone || '');
  const [bankName, setBankName] = useState('');
  const [incidentTime, setIncidentTime] = useState(analysis?.extracted?.incident_time_text || '');
  const [language, setLanguage] = useState(initialLanguage);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [caseFile, setCaseFile] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const t = I18N[language] || I18N.en;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await generateCaseFile({
        analysis,
        user: {
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          bank_name: bankName.trim() || undefined,
          incident_time: incidentTime.trim() || undefined,
        },
        language,
      });
      setCaseFile(result);
    } catch (err) {
      if (err.message && (err.message.includes('authorized') || err.message.includes('token') || err.message.includes('401'))) {
        setError(t.errorSignIn);
      } else {
        setError(err.message || t.errorGeneral);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Get active text based on selected language
  const activeCallScript =
    language === 'hi'
      ? caseFile?.call_script_1930_hi && caseFile.call_script_1930_hi.length > 0
        ? caseFile.call_script_1930_hi
        : caseFile?.call_script_1930
      : caseFile?.call_script_1930;

  const activeComplaintText =
    language === 'hi' && caseFile?.complaint_text_hi
      ? caseFile.complaint_text_hi
      : caseFile?.complaint_text;

  const activeBankEmail =
    language === 'hi' && caseFile?.bank_email_hi?.subject
      ? caseFile.bank_email_hi
      : caseFile?.bank_email;

  const activeEvidenceChecklist =
    language === 'hi'
      ? caseFile?.evidence_checklist_hi && caseFile.evidence_checklist_hi.length > 0
        ? caseFile.evidence_checklist_hi
        : caseFile?.evidence_checklist
      : caseFile?.evidence_checklist;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg max-w-2xl w-full my-8 p-6 shadow-card relative">
        {/* Top Controls: Language Switcher and Close Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-1.5 text-[12px] text-[#737373]">
            <Globe className="w-3.5 h-3.5" />
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#191919] text-white font-medium'
                  : 'hover:text-[#191919] bg-[#F7F7F7]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded transition-colors ${
                language === 'hi'
                  ? 'bg-[#191919] text-white font-medium'
                  : 'hover:text-[#191919] bg-[#F7F7F7]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#737373] hover:text-[#191919] rounded transition-colors"
            title={t.cancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <FileText className="w-5 h-5 text-[#2383E2]" />
          <h2 className="text-lg font-semibold text-[#191919]">
            {t.title}
          </h2>
        </div>
        <p className="text-[13px] text-[#737373] mb-5 leading-relaxed">
          {t.subtitle}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-status-scamBg border border-status-scamBorder rounded text-[13px] text-status-scamText flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!caseFile ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <label className="block text-[#191919] font-medium mb-1">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div>
                <label className="block text-[#191919] font-medium mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div>
                <label className="block text-[#191919] font-medium mb-1">
                  {t.bankLabel}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder={t.bankPlaceholder}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div>
                <label className="block text-[#191919] font-medium mb-1">
                  {t.incidentTimeLabel}
                </label>
                <input
                  type="text"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  placeholder={t.incidentTimePlaceholder}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-[13px]">
              <span className="text-[#191919] font-medium">{t.outputLang}</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="caseLang"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="accent-[#2383E2]"
                />
                <span>English</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="caseLang"
                  checked={language === 'hi'}
                  onChange={() => setLanguage('hi')}
                  className="accent-[#2383E2]"
                />
                <span>हिन्दी (Hindi)</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#EAEAEA] hover:bg-[#F7F7F7] text-[13px] text-[#191919] rounded transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-70 shadow-subtle"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? t.generating : t.generateBtn}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {/* 1930 Helpline Call Script */}
            {activeCallScript?.length > 0 && (
              <div className="p-4 bg-[#F7F7F7] border border-[#EAEAEA] rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold text-[#191919]">
                    {t.callScriptTitle}
                  </h3>
                  <button
                    onClick={() => handleCopy(activeCallScript.join('\n'), 'call')}
                    className="flex items-center gap-1 text-[12px] text-[#2383E2] hover:underline"
                  >
                    {copiedKey === 'call' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'call' ? t.copied : t.copy}</span>
                  </button>
                </div>
                <ol className="space-y-1.5 text-[12px] text-[#191919]">
                  {activeCallScript.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-[#737373]">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Cybercrime Portal Complaint Text */}
            {activeComplaintText && (
              <div className="p-4 bg-[#FFFFFF] border border-[#EAEAEA] rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold text-[#191919]">
                    {t.complaintTitle}
                  </h3>
                  <button
                    onClick={() => handleCopy(activeComplaintText, 'complaint')}
                    className="flex items-center gap-1 text-[12px] text-[#2383E2] hover:underline"
                  >
                    {copiedKey === 'complaint' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'complaint' ? t.copied : t.copy}</span>
                  </button>
                </div>
                <p className="text-[12px] text-[#191919] whitespace-pre-wrap font-mono p-3 bg-[#F7F7F7] rounded border border-[#EAEAEA] leading-relaxed">
                  {activeComplaintText}
                </p>
              </div>
            )}

            {/* Bank Email */}
            {activeBankEmail && (
              <div className="p-4 bg-[#FFFFFF] border border-[#EAEAEA] rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold text-[#191919]">
                    {t.bankEmailTitle}
                  </h3>
                  <button
                    onClick={() => {
                      handleCopy(`Subject: ${activeBankEmail.subject}\n\n${activeBankEmail.body}`, 'bank');
                    }}
                    className="flex items-center gap-1 text-[12px] text-[#2383E2] hover:underline"
                  >
                    {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'bank' ? t.copied : t.copy}</span>
                  </button>
                </div>
                <div className="text-[12px] p-3 bg-[#F7F7F7] rounded border border-[#EAEAEA] space-y-2">
                  <div>
                    <span className="font-semibold text-[#737373]">{t.subject}: </span>
                    <span className="text-[#191919]">
                      {activeBankEmail.subject}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#EAEAEA] whitespace-pre-wrap text-[#191919] leading-relaxed">
                    {activeBankEmail.body}
                  </div>
                </div>
              </div>
            )}

            {/* Evidence Checklist */}
            {activeEvidenceChecklist?.length > 0 && (
              <div className="p-4 bg-[#F7F7F7] border border-[#EAEAEA] rounded">
                <h3 className="text-[13px] font-semibold text-[#191919] mb-2">
                  {t.evidenceTitle}
                </h3>
                <ul className="space-y-1 text-[12px] text-[#191919]">
                  {activeEvidenceChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2383E2]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-[#191919] text-white text-[13px] font-medium rounded hover:bg-black transition-colors"
              >
                {t.done}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
