import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, History, Clock, Trash2, LogIn, Sparkles, Download, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import anonymousReviewService from '../services/anonymousReviewService';
import CategoryBadge from './CategoryBadge';
import ExportButton from './ExportButton';
import PRModal from './PRModal';

const HistoryTab = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewForPR, setSelectedReviewForPR] = useState(null);
  const { token, user, login } = useAuth();
  
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const data = await api.getReviewHistory(token);
        setHistory(data.data || []);
      } else {
        const anonymousReviews = anonymousReviewService.getReviews();
        setHistory(anonymousReviews);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      if (token) {
        await api.deleteReview(id, token);
        setHistory(prev => prev.filter(item => item._id !== id));
      } else {
        anonymousReviewService.deleteReview(id);
        setHistory(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleExport = (review) => {
    const content = `
AI CODE REVIEW REPORT
=====================
Language: ${review.language || review.detectedLanguage || 'N/A'}
Category: ${review.category}
Severity: ${review.severity || 'N/A'}
Date: ${new Date(review.createdAt).toLocaleDateString()}

ORIGINAL CODE:
${review.originalCode}

IMPROVED CODE:
${review.improvedCode}

EXPLANATION:
${review.explanation}

${review.improvements && review.improvements.length > 0 ? `IMPROVEMENTS:\n${review.improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}\n` : ''}

METRICS:
- Lines of Code: ${review.metrics?.linesOfCode || 'N/A'}
- Complexity Score: ${review.metrics?.complexityScore || 'N/A'}/10
- Quality Rating: ${review.metrics?.qualityRating || 'N/A'}
- Issues Found: ${review.metrics?.issuesFound || 'N/A'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-review-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 sm:p-12 text-center">
          <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Review History</h3>
          <p className="text-gray-400 text-sm">
            {token 
              ? 'Your code reviews will appear here' 
              : 'Submit a code review to see it here (session only)'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Review History {!token && <span className="text-sm text-gray-500">(Session Only)</span>}
        </h2>
        
        {!token && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-slate-900 border border-cyan-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div className="text-sm">
                <p className="text-white font-semibold">Want to save your reviews?</p>
                <p className="text-gray-400 text-xs">Sign in to keep your history forever</p>
              </div>
              <button onClick={login} className="ml-2">
                <LogIn className="w-5 h-5 text-cyan-400 hover:text-cyan-300 transition-colors" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review list */}
      {history.map((item) => {
        return (
          <div key={item._id} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sm:p-6 hover:border-cyan-500/30 transition-all">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <CategoryBadge category={item.category} />
                  <span className="text-sm font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30">
                    {item.language}
                  </span>
                  {item.isAnonymous && (
                    <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/30">
                      Session Only
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 flex-wrap">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  
                  {/* Export button */}
                  <button 
                    onClick={() => handleExport(item)}
                    className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-500/10 rounded-lg transition-all"
                    title="Export review"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Create PR button (only for logged-in users) */}
                  {token && (
                    <button 
                      onClick={() => setSelectedReviewForPR(item)}
                      className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-lg transition-all"
                      title="Create pull request"
                    >
                      <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}

                  {/* Delete button */}
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Code Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Original
                  </div>
                  <pre className="bg-slate-900 border border-slate-800 text-gray-400 p-3 sm:p-4 rounded-xl overflow-x-auto text-xs font-mono h-32">
                    <code>{item.originalCode}</code>
                  </pre>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Improved
                  </div>
                  <pre className="bg-slate-900 border border-slate-800 text-green-400 p-3 sm:p-4 rounded-xl overflow-x-auto text-xs font-mono h-32">
                    <code>{item.improvedCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* PR Modal */}
      {selectedReviewForPR && (
        <PRModal 
          review={selectedReviewForPR}
          onClose={() => setSelectedReviewForPR(null)}
          token={token}
        />
      )}
    </div>
  );
};

export default HistoryTab;