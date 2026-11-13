import React, { useState } from 'react';
import { X, Copy, Check, FileText, Loader2, AlertCircle } from 'lucide-react';
import { generateCaseFile } from '../services/api';

export default function CaseFileModal({ analysis, user, onClose }) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || user?.trustedContact?.phone || '');
  const [bankName, setBankName] = useState('');
  const [incidentTime, setIncidentTime] = useState(analysis?.extracted?.incident_time_text || '');
  const [language, setLanguage] = useState('en');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [caseFile, setCaseFile] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

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
      if (err.message && (err.message.includes('authorized') || err.message.includes('token'))) {
        setError('Please sign in to generate official case files.');
      } else {
        setError(err.message || 'Failed to generate case file.');
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg max-w-2xl w-full my-8 p-6 shadow-card relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#737373] hover:text-[#191919] rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-[#2383E2]" />
          <h2 className="text-lg font-semibold text-[#191919]">
            Incident Case File Generator
          </h2>
        </div>
        <p className="text-[13px] text-[#737373] mb-5">
          Generate structured complaint drafts for the National Cyber Crime Helpline (1930) and your bank's fraud dispute cell.
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
                <label className="block text-[#191919] font-medium mb-1">Your Full Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div>
                <label className="block text-[#191919] font-medium mb-1">Mobile Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98XXXXXXXX"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div>
                <label className="block text-[#191919] font-medium mb-1">Bank / Wallet Name (Optional)</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India / HDFC"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>

              <div>
                <label className="block text-[#191919] font-medium mb-1">Approx Incident Date & Time (Optional)</label>
                <input
                  type="text"
                  value={incidentTime}
                  onChange={(e) => setIncidentTime(e.target.value)}
                  placeholder="e.g. Today at 2:30 PM"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded bg-[#FFFFFF] text-[#191919] focus:outline-none focus:border-[#2383E2]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-[13px]">
              <span className="text-[#191919] font-medium">Output Language:</span>
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Generate Official Drafts</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {/* 1930 Helpline Call Script */}
            {caseFile.call_script_1930?.length > 0 && (
              <div className="p-4 bg-[#F7F7F7] border border-[#EAEAEA] rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold text-[#191919]">
                    Dial 1930 — Helpline Phone Script
                  </h3>
                  <button
                    onClick={() => handleCopy(caseFile.call_script_1930.join('\n'), 'call')}
                    className="flex items-center gap-1 text-[12px] text-[#2383E2] hover:underline"
                  >
                    {copiedKey === 'call' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'call' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <ol className="space-y-1.5 text-[12px] text-[#191919]">
                  {caseFile.call_script_1930.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-[#737373]">{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Cybercrime Portal Complaint Text */}
            <div className="p-4 bg-[#FFFFFF] border border-[#EAEAEA] rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-semibold text-[#191919]">
                  cybercrime.gov.in Complaint Description
                </h3>
                <button
                  onClick={() => handleCopy(language === 'hi' ? caseFile.complaint_text_hi || caseFile.complaint_text : caseFile.complaint_text, 'complaint')}
                  className="flex items-center gap-1 text-[12px] text-[#2383E2] hover:underline"
                >
                  {copiedKey === 'complaint' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'complaint' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[12px] text-[#191919] whitespace-pre-wrap font-mono p-3 bg-[#F7F7F7] rounded border border-[#EAEAEA]">
                {language === 'hi' && caseFile.complaint_text_hi ? caseFile.complaint_text_hi : caseFile.complaint_text}
              </p>
            </div>

            {/* Bank Email */}
            {caseFile.bank_email && (
              <div className="p-4 bg-[#FFFFFF] border border-[#EAEAEA] rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-semibold text-[#191919]">
                    Official Bank Fraud Notice Email
                  </h3>
                  <button
                    onClick={() => {
                      const emailObj = language === 'hi' && caseFile.bank_email_hi ? caseFile.bank_email_hi : caseFile.bank_email;
                      handleCopy(`Subject: ${emailObj.subject}\n\n${emailObj.body}`, 'bank');
                    }}
                    className="flex items-center gap-1 text-[12px] text-[#2383E2] hover:underline"
                  >
                    {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'bank' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[12px] p-3 bg-[#F7F7F7] rounded border border-[#EAEAEA] space-y-2">
                  <div>
                    <span className="font-semibold text-[#737373]">Subject: </span>
                    <span className="text-[#191919]">
                      {language === 'hi' && caseFile.bank_email_hi ? caseFile.bank_email_hi.subject : caseFile.bank_email.subject}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#EAEAEA] whitespace-pre-wrap text-[#191919]">
                    {language === 'hi' && caseFile.bank_email_hi ? caseFile.bank_email_hi.body : caseFile.bank_email.body}
                  </div>
                </div>
              </div>
            )}

            {/* Evidence Checklist */}
            {caseFile.evidence_checklist?.length > 0 && (
              <div className="p-4 bg-[#F7F7F7] border border-[#EAEAEA] rounded">
                <h3 className="text-[13px] font-semibold text-[#191919] mb-2">
                  Evidence Checklist to Attach
                </h3>
                <ul className="space-y-1 text-[12px] text-[#191919]">
                  {caseFile.evidence_checklist.map((item, idx) => (
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
                onClick={onClose}
                className="px-4 py-1.5 bg-[#191919] text-white text-[13px] font-medium rounded hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

