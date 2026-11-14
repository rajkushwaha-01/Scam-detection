import React from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export default function LandingPage({ onStartDetection, onLoadScenario }) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#191919] leading-tight">
          Detect online scams before taking action.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#737373] max-w-xl mx-auto leading-relaxed">
          Analyze suspicious messages, screenshots, and audio recordings to identify fraudulent requests, extract payment details, and protect yourself.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartDetection}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[14px] font-medium rounded transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>Analyze a Message</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onLoadScenario(1);
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-[#191919] bg-[#FFFFFF] hover:bg-[#F7F7F7] border border-[#EAEAEA] text-[14px] font-medium rounded transition-colors"
          >
            Try a Real Example
          </button>
        </div>
      </section>

      {/* Visual Product Interface Preview */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="border border-[#EAEAEA] rounded-lg bg-[#FFFFFF] overflow-hidden shadow-card">
          {/* Mock Window Bar */}
          <div className="bg-[#F7F7F7] border-b border-[#EAEAEA] px-4 py-2.5 flex items-center justify-between text-[12px] text-[#737373]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAEAEA] border border-[#D4D4D4]"></span>
              <span className="font-medium text-[#191919]">scamshield.app</span>
              <span>/</span>
              <span>analysis</span>
            </div>
            <span className="text-[11px] font-mono">read-only preview</span>
          </div>

          {/* Preview Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Sample Message Block */}
            <div className="p-3.5 bg-[#F7F7F7] rounded border border-[#EAEAEA] text-[13px] text-[#191919] font-mono leading-relaxed">
              "URGENT: Your SBI account access will be terminated in 2 hours due to pending KYC verification. Click bit.ly/sbi-kyc-verify to avoid permanent debit lock."
            </div>

            {/* Analysis Result Preview */}
            <div className="p-4 rounded border border-status-scamBorder bg-status-scamBg">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-status-scamText" />
                  <span className="text-[13px] font-semibold text-status-scamText">
                    SCAM DETECTED
                  </span>
                  <span className="text-[12px] text-[#737373] hidden sm:inline">
                    • KYC Phishing
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-status-scamText">
                  Risk Score: 95 / 100
                </span>
              </div>

              <div className="space-y-1.5 text-[13px] text-[#191919]">
                <div className="flex items-start gap-2">
                  <span className="text-[#991B1B] font-bold">•</span>
                  <span><strong>Artificial Urgency:</strong> Demands action within 2 hours to provoke panic.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#991B1B] font-bold">•</span>
                  <span><strong>Spoofed Link:</strong> Uses a shortlink instead of an official bank domain.</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#FEE2E2] text-[12px] text-[#737373] flex items-center justify-between">
                <span>Immediate Step: Do not click the link or provide banking credentials.</span>
                <span className="text-[#2383E2] font-medium cursor-pointer" onClick={onStartDetection}>
                  Run your own check →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Concise & Purposeful) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 border-t border-[#EAEAEA]">
        <h2 className="text-lg font-semibold text-[#191919] mb-6">
          How ScamShield Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="text-[12px] font-semibold text-[#737373]">1. Submit Input</div>
            <h3 className="text-[14px] font-medium text-[#191919]">Paste Text or Upload</h3>
            <p className="text-[13px] text-[#737373] leading-relaxed">
              Enter any suspicious SMS, message, WhatsApp chat, or upload a screenshot or voice recording.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[12px] font-semibold text-[#737373]">2. Evaluation</div>
            <h3 className="text-[14px] font-medium text-[#191919]">Threat Inspection</h3>
            <p className="text-[13px] text-[#737373] leading-relaxed">
              Analyzes psychological coercion, fake authority claims, deceptive links, and payment handles.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[12px] font-semibold text-[#737373]">3. Action Plan</div>
            <h3 className="text-[14px] font-medium text-[#191919]">Clear Safety Steps</h3>
            <p className="text-[13px] text-[#737373] leading-relaxed">
              Receive a concrete verdict, identified red flags, safety steps, and official filing templates if money was lost.
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#EAEAEA] mt-12 py-8 text-[12px] text-[#737373]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#191919]">ScamShield</span>
            
          </div>
          <div>
            Data is evaluated on-demand without persistent marketing tracking.
          </div>
        </div>
      </footer>
    </div>
  );
}

