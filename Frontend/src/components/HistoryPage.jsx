import React, { useState } from 'react';
import { History, Trash2, ArrowUpRight, AlertTriangle, ShieldCheck, HelpCircle, X } from 'lucide-react';
import ResultsView from './ResultsView';

export default function HistoryPage({ history = [], onClearHistory, onSelectScan, onGoToDetect }) {
  const [selectedScan, setSelectedScan] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const filteredHistory = history.filter((item) => {
    if (filter === 'ALL') return true;
    return item?.result?.verdict === filter;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#191919]">
            Detection History
          </h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Previous scans performed in your current browser session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all local detection history?')) {
                onClearHistory();
                setSelectedScan(null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[#737373] hover:text-[#991B1B] hover:bg-[#F7F7F7] rounded border border-[#EAEAEA] transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="border border-[#EAEAEA] rounded-lg p-10 bg-[#FFFFFF] text-center shadow-card">
          <div className="w-10 h-10 rounded-full bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center mx-auto mb-3 text-[#737373]">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#191919]">
            No detection history yet
          </h3>
          <p className="text-[13px] text-[#737373] max-w-sm mx-auto mt-1 mb-5">
            Messages and files you analyze will be kept here locally for your review during your session.
          </p>
          <button
            onClick={onGoToDetect}
            className="px-4 py-2 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors"
          >
            Analyze a Message
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[12px]">
            {['ALL', 'SCAM', 'SUSPICIOUS', 'SAFE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter === f
                    ? 'bg-[#191919] text-white font-medium'
                    : 'bg-[#F7F7F7] text-[#737373] hover:text-[#191919] border border-[#EAEAEA]'
                }`}
              >
                {f === 'ALL' ? 'All Scans' : f}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-[#737373]">
              {filteredHistory.length} {filteredHistory.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {/* History List */}
          <div className="border border-[#EAEAEA] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAEAEA] overflow-hidden shadow-card">
            {filteredHistory.map((item) => {
              const verdict = item.result?.verdict || 'UNKNOWN';
              const isScam = verdict === 'SCAM';
              const isSuspicious = verdict === 'SUSPICIOUS';
              const isSafe = verdict === 'SAFE';

              const badgeColor = isScam
                ? 'bg-status-scamBg text-status-scamText border-status-scamBorder'
                : isSuspicious
                ? 'bg-status-suspiciousBg text-status-suspiciousText border-status-suspiciousBorder'
                : isSafe
                ? 'bg-status-safeBg text-status-safeText border-status-safeBorder'
                : 'bg-[#F7F7F7] text-[#737373] border-[#EAEAEA]';

              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-[#F7F7F7]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColor}`}>
                        {verdict}
                      </span>
                      {item.result?.risk_score != null && (
                        <span className="text-[12px] font-medium text-[#191919]">
                          Risk: {item.result.risk_score}/100
                        </span>
                      )}
                      <span className="text-[11px] text-[#737373]">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#191919] truncate">
                      {item.messageSnippet || '(Screenshot / Audio analysis)'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedScan(item)}
                    className="flex items-center gap-1 text-[13px] text-[#2383E2] hover:text-[#1B6EC2] font-medium shrink-0 self-start sm:self-center"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Scan Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-lg max-w-2xl w-full my-8 p-6 shadow-card relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 p-1 text-[#737373] hover:text-[#191919] rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-[#191919] mb-1">
              Historical Scan Details
            </h2>
            <div className="text-[12px] text-[#737373] mb-4">
              Scanned on {new Date(selectedScan.timestamp).toLocaleString()}
            </div>

            {selectedScan.fullMessage && (
              <div className="mb-4">
                <div className="text-[11px] font-medium text-[#737373] mb-1">Original Text:</div>
                <div className="p-3 bg-[#F7F7F7] border border-[#EAEAEA] rounded text-[13px] text-[#191919] font-mono whitespace-pre-wrap leading-relaxed">
                  {selectedScan.fullMessage}
                </div>
              </div>
            )}

            <ResultsView result={selectedScan.result} />

            <div className="mt-6 pt-4 border-t border-[#EAEAEA] flex justify-end">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-1.5 bg-[#191919] text-white text-[13px] font-medium rounded hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

