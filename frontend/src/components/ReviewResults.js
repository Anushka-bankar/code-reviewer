import React from 'react';
import { Zap, CheckCircle, Code2 } from 'lucide-react';

const ReviewResults = ({ review }) => {
  if (!review) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>
          <div className="relative">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-purple-500/30">
              <Zap className="w-8 sm:w-10 h-8 sm:h-10 text-purple-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Ready to Review</h3>
            <p className="text-gray-400 text-sm sm:text-base">Paste your code and get instant AI-powered improvements</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Helper to format language names nicely
  const formatLanguage = (lang) => {
    const languageMap = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'csharp': 'C#',
      'go': 'Go',
      'rust': 'Rust',
      'kotlin': 'Kotlin',
      'dart': 'Dart',
      'swift': 'Swift',
      'php': 'PHP',
      'ruby': 'Ruby',
      'sql': 'SQL',
      'html': 'HTML',
      'css': 'CSS',
      'xml': 'XML',
      'json': 'JSON'
    };
    return languageMap[lang?.toLowerCase()] || lang || 'Unknown';
  };

  // ✅ NEW: Build display text with framework
  const getLanguageDisplay = () => {
    const lang = formatLanguage(review.detectedLanguage);
    const framework = review.framework;
    
    // If framework exists and is not "None" or "Other"
    if (framework && framework !== 'None' && framework !== 'Other') {
      return `${framework} (${lang})`;
    }
    
    return lang;
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse"></div>
      <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>
        <div className="relative">
          <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-green-500/30">
            <CheckCircle className="w-10 sm:w-12 h-10 sm:h-12 text-green-400" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Review Complete!</h3>
          
          {/* ✅ NEW: Show detected language + framework */}
          {review.detectedLanguage && (
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">
                Detected: <span className="text-cyan-400 font-semibold">{getLanguageDisplay()}</span>
              </span>
            </div>
          )}
          
          <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-8">Your code has been analyzed successfully</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {/* Lines of Code */}
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {review.metrics?.linesOfCode || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-semibold">Lines</div>
            </div>
            
            {/* Complexity */}
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {review.metrics?.complexityScore || 0}/10
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-semibold">Complexity</div>
            </div>
            
            {/* Quality */}
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {review.metrics?.qualityRating || 'A'}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-semibold">Quality</div>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-8">Press ESC or click outside to close</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewResults;