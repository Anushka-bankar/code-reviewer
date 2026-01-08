import React, { useState, useEffect, useCallback } from 'react';
import { X, Github, Loader2 } from 'lucide-react';
import api from '../services/api';

const PRModal = ({ review, onClose, token }) => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  // ✅ FIX: wrapped in useCallback so dependency is stable
  const loadRepositories = useCallback(async () => {
    try {
      const data = await api.getRepositories(token);
      setRepos(data.data || []);
    } catch {
      setError('Failed to load repositories');
    }
  }, [token]);

  // ✅ FIX: added loadRepositories to dependency array
  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  const handleCreatePR = async () => {
    if (!selectedRepo || !filePath.trim()) {
      setError('Please select a repository and enter file path');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.createPullRequest(
        {
          reviewId: review._id || review.id,
          owner: selectedRepo.owner.login,
          repo: selectedRepo.name,
          filePath: filePath.trim(),
        },
        token
      );

      setSuccess({
        message: 'PR created successfully!',
        url: response.data.prUrl,
        prNumber: response.data.prNumber,
      });
    } catch (err) {
      setError(err.message || 'Failed to create PR');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <Github className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            PR Created!
          </h3>
          <p className="text-gray-400 mb-4 sm:mb-6">
            Pull Request #{success.prNumber} has been created successfully
          </p>
          <a
            href={success.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all inline-block"
          >
            View on GitHub
          </a>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
            Create Pull Request
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Repository Select */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-1 sm:mb-2">
              Select Repository
            </label>
            <select
              value={selectedRepo?.name || ''}
              onChange={(e) => {
                const repo = repos.find(r => r.name === e.target.value);
                setSelectedRepo(repo);
              }}
              className="w-full px-3 sm:px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Choose a repository...</option>
              {repos.map(repo => (
                <option key={repo.id} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Path Input */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-300 mb-1 sm:mb-2">
              File Path
            </label>
            <input
              type="text"
              placeholder="e.g., src/utils/helpers.js"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-600"
            />
          </div>

          {/* Create PR Button */}
          <button
            onClick={handleCreatePR}
            disabled={loading || !selectedRepo}
            className="w-full px-4 sm:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                Create PR
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PRModal;
