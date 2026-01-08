import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 backdrop-blur-sm animate-fade-in overflow-hidden">
      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs sm:text-sm text-red-400 font-medium truncate">{message}</p>
    </div>
  );
};

export default ErrorAlert;