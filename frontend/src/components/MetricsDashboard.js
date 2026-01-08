
import React from 'react';
import { BarChart3, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const MetricsDashboard = ({ metrics }) => {
  if (!metrics) return null;

  const getRatingColor = (rating) => {
    if (rating.startsWith('A')) return 'from-green-500 to-emerald-500';
    if (rating.startsWith('B')) return 'from-blue-500 to-cyan-500';
    if (rating.startsWith('C')) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="relative group mb-6">
      {/* Outer gradient glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>

      {/* Main card */}
      <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Code Metrics</h3>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Lines of Code */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 sm:p-4 text-center hover:border-cyan-500/30 transition-colors">
            <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-400 mx-auto mb-2 sm:mb-3" />
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {metrics.linesOfCode}
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 font-semibold mt-1">
              Lines of Code
            </div>
          </div>

          {/* Complexity Score */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 sm:p-4 text-center hover:border-blue-500/30 transition-colors">
            <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 mx-auto mb-2 sm:mb-3" />
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {metrics.complexityScore}/10
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 font-semibold mt-1">
              Complexity
            </div>
          </div>

          {/* Quality Rating */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 sm:p-4 text-center hover:border-green-500/30 transition-colors">
            <div
              className={`text-2xl sm:text-4xl font-black mx-auto mb-2 sm:mb-3 bg-gradient-to-r ${getRatingColor(
                metrics.qualityRating
              )} bg-clip-text text-transparent`}
            >
              {metrics.qualityRating}
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 font-semibold mt-1">
              Quality Rating
            </div>
          </div>

          {/* Issues Found */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 sm:p-4 text-center hover:border-purple-500/30 transition-colors">
            <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400 mx-auto mb-2 sm:mb-3" />
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {metrics.issuesFound}
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 font-semibold mt-1">
              Issues Found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
