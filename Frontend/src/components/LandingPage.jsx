import React from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

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
        <div className="border border-[#EAEAEA] rounded-xl bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Mock Window Bar */}
          <div className="bg-[#FBFBFA] border-b border-[#EAEAEA] px-4 py-2.5 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              {/* Subtle 3 dots */}
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] border border-[#D4D4D4]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] border border-[#D4D4D4]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] border border-[#D4D4D4]"></span>
              </div>
              {/* URL address pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FFFFFF] border border-[#EAEAEA] text-[11px] text-[#737373] shadow-subtle">
                <Lock className="w-3 h-3 text-[#2383E2]" />
                <span className="text-[#191919] font-medium">scamshield.app</span>
                <span className="text-[#D4D4D4]">/</span>
                <span>inspect</span>
                <span className="text-[#D4D4D4]">/</span>
                <span className="text-[#737373]">sbi-pan-phish</span>
              </div>
            </div>

            
          </div>

          {/* Preview Content */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Document Header & Metadata */}
            <div className="flex items-start justify-between gap-4 pb-1">
              <div>
                <div className="flex items-center gap-2 text-[12px] text-[#737373] mb-1 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-[#F7F7F7] border border-[#EAEAEA] font-mono text-[11px] text-[#191919]">
                    INSPECTION #4829
                  </span>
                  <span>•</span>
                  <span>Channel: SMS Gateway</span>
                  <span>•</span>
                  <span>Target: State Bank of India</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#191919] tracking-tight">
                  Suspicious Banking Alert: Urgent KYC Account Block
                </h3>
              </div>
            </div>

            {/* Sample Message Block */}
            <div className="rounded-lg border border-[#EAEAEA] bg-[#FBFBFA] p-3.5 sm:p-4 text-[13px]">
              <div className="flex items-center justify-between text-[11px] text-[#737373] font-medium mb-1.5">
                <span className="uppercase tracking-wider">Raw Message Payload</span>
                <span className="font-mono">146 characters</span>
              </div>
              <p className="font-mono text-[13px] text-[#191919] bg-[#FFFFFF] p-3 rounded border border-[#EAEAEA] leading-relaxed select-all">
                "URGENT: Your SBI account access will be terminated in 2 hours due to pending KYC verification. Click bit.ly/sbi-kyc-verify to avoid permanent debit lock."
              </p>
            </div>

            {/* Analysis Result Preview Card */}
            <div className="rounded-lg border border-[#FEE2E2] bg-[#FEF2F2]/60 p-4 sm:p-5 space-y-4">
              {/* Verdict & Score Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FEE2E2]">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#991B1B] text-white text-[11px] font-semibold tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    SCAM DETECTED
                  </span>
                  <span className="text-[13px] font-medium text-[#991B1B]">
                    KYC Phishing & Credential Harvest
                  </span>
                </div>

                {/* Risk Bar & Score */}
                <div className="flex items-center gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] uppercase tracking-wider text-[#991B1B] font-medium">Risk Score</div>
                    <div className="text-[14px] font-bold text-[#991B1B]">
                      95 <span className="text-[11px] font-normal opacity-75">/ 100 (Critical)</span>
                    </div>
                  </div>
                  <div className="w-20 sm:w-24 h-2 bg-[#FEE2E2] rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-[#991B1B] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Red Flags List */}
              <div>
                <div className="text-[12px] font-semibold text-[#191919] mb-2">
                  Identified Red Flags (3 Detected)
                </div>
                <ul className="space-y-2 text-[13px] text-[#191919]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-2 shrink-0"></span>
                    <span>
                      <strong>Artificial Urgency (2-Hour Deadline):</strong> Fabricates immediate panic to force action before the victim can consult bank staff.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-2 shrink-0"></span>
                    <span>
                      <strong>Deceptive URL Redirection:</strong> Uses an obfuscated shortlink (<code className="font-mono text-[11px] bg-[#FFFFFF] px-1 py-0.5 rounded border border-[#EAEAEA]">bit.ly/sbi-kyc-verify</code>) instead of the authentic SBI portal (<code className="font-mono text-[11px] bg-[#FFFFFF] px-1 py-0.5 rounded border border-[#EAEAEA]">sbi.co.in</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-2 shrink-0"></span>
                    <span>
                      <strong>Regulatory Impersonation:</strong> Legitimate banks and RBI regulations never terminate account access via SMS hyperlinks.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Immediate Safety Steps Callout */}
              <div className="p-3 bg-[#FFFFFF] border border-[#FEE2E2] rounded-md flex items-start gap-2.5 text-[12px] text-[#191919]">
                <ShieldCheck className="w-4 h-4 text-[#2383E2] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Recommended Immediate Action:</strong> Do not open the link or enter banking passwords. Block sender number and report to the National Cyber Crime Helpline (1930).
                </div>
              </div>

              {/* Bottom Interactive CTA */}
              <div className="pt-2 border-t border-[#FEE2E2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px]">
                
                <button
                  onClick={() => onLoadScenario(4)}
                  className="text-[#2383E2] hover:text-[#1B6EC2] font-medium flex items-center gap-1 group transition-colors"
                >
                  <span>Test this scenario live in Detect</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
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
            <span>—</span>
            <span>Minimal Scam Detection Utility</span>
          </div>
          <div>
            Data is evaluated on-demand without persistent marketing tracking.
          </div>
        </div>
      </footer>
    </div>
  );
}


