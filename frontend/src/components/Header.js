import React from 'react';
import { Code, History, Terminal, Github, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // adjust path

const useAuth = () => React.useContext(AuthContext);

const Header = ({ activeTab, setActiveTab }) => {
  const { user, login, logout } = useAuth();

  return (
      <header className=" bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50 shadow-2xl">
   {/* Full-width gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5"></div>

     {/* Centered content only */}
     <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-20 gap-4 sm:gap-0 py-3 sm:py-0">
          
          {/* ---------- Left: Logo + Tabs ---------- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
            
            {/* Logo */}
            <div className="flex items-center gap-3 sm:gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Terminal className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                  CodeReview.ai
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">Powered by Gemini</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-wrap gap-2 sm:gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('review')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                  activeTab === 'review'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Review
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                History
              </button>
            </nav>
          </div>

          {/* ---------- Right: User Info / GitHub Login ---------- */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-0 w-full sm:w-auto">
            {user ? (
              <>
                <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/50 px-3 sm:px-4 py-2 rounded-xl border border-slate-800 w-full sm:w-auto">
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-cyan-400/50 shadow-lg"
                    />
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-gray-300 truncate">{user.login}</span>
                </div>

                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-900/50 flex-shrink-0"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all text-xs sm:text-sm font-semibold w-full sm:w-auto justify-center"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Connect GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;