import React, { useState } from 'react';
import { Layers, MessageSquare, Github, Zap, AlertCircle } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import ExportButton from './ExportButton';
import MetricsDashboard from './MetricsDashboard';
import PRModal from './PRModal';

const FullScreenReviewModal = ({ review, onClose, token }) => {
  const [showPRModal, setShowPRModal] = useState(false);

  if (!review) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'major':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'moderate':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'minor':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-auto bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-transparent gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap">
              <CategoryBadge category={review.category} />
              <span className="text-xs sm:text-sm font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30 truncate">
                {review.language || review.detectedLanguage}
              </span>
              {review.severity && (
                <span className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg border ${getSeverityColor(review.severity)}`}>
                  {review.severity.charAt(0).toUpperCase() + review.severity.slice(1)} Issue
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
              <ExportButton review={review} />
              <button
                onClick={() => setShowPRModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all text-xs sm:text-sm font-semibold flex-shrink-0"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">Create PR</span>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center transition-all text-gray-400 hover:text-white flex-shrink-0"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 space-y-6">
            {/* Metrics */}
            <MetricsDashboard metrics={review.metrics} />

            {/* Improvements List */}
            {review.improvements && review.improvements.length > 0 && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Key Improvements</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {review.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex gap-3 text-sm sm:text-base text-gray-300">
                        <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Code Comparison */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Side-by-Side Comparison</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Original Code */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-400">Original Code</span>
                    </div>
                    <pre className="bg-slate-900 border border-slate-800 text-gray-300 p-3 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed" style={{ minHeight: '300px', maxHeight: '500px' }}>
                      <code>{review.originalCode}</code>
                    </pre>
                  </div>
                  
                  {/* Improved Code */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-400">Improved Code</span>
                    </div>
                    <pre className="bg-slate-900 border border-slate-800 text-green-400 p-3 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed" style={{ minHeight: '300px', maxHeight: '500px' }}>
                      <code>{review.improvedCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">AI Explanation</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{review.explanation}</p>
              </div>
            </div>

            {/* Tips */}
            {review.tips && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Pro Tips</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{review.tips}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PR Modal */}
      {showPRModal && (
        <PRModal 
          review={review} 
          onClose={() => setShowPRModal(false)} 
          token={token}
        />
      )}
    </>
  );
};

export default FullScreenReviewModal;