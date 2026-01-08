// src/services/api.js
const API_BASE = process.env.REACT_APP_API_BASE_URL;

/**
 * Get token from localStorage
 */
const getToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage?.getItem('github_token') || null;
  }
  return null;
};

/**
 * Common helper to handle all API responses
 */
const handleResponse = async (response) => {
  const data = await response.json();
  console.log('📡 API Response:', {
    status: response.status,
    ok: response.ok,
    data: data
  });

  if (!response.ok) {
    const errorMessage = data.error || data.message || 'Something went wrong';
    console.error('❌ API Error:', errorMessage);
    
    // ✅ If 401, clear token and redirect to login
    if (response.status === 401) {
      console.log('🔒 Unauthorized - clearing token');
      if (typeof window !== 'undefined') {
        window.localStorage?.removeItem('github_token');
      }
    }
    
    throw new Error(errorMessage);
  }

  return data;
};

/**
 * 🌐 Centralized API service
 */
const api = {
  /**
   * 🔹 GitHub Login
   */
  githubLogin: async () => {
    // Redirect to backend GitHub login
    window.location.href = `${API_BASE}/github/login`;
  },

  /**
   * 🔹 Get user info by GitHub username or ID
   * ✅ NOW SENDS AUTH TOKEN
   */
  getUserInfo: async (username) => {
    const token = getToken();
    
    console.log('🔍 getUserInfo called:', {
      username,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });

    // ✅ CRITICAL: Don't call API without token
    if (!token) {
      console.error('❌ No token available for getUserInfo');
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${API_BASE}/github?username=${username}`, {
      headers
    });
    
    return handleResponse(response);
  },

  /**
   * 🔹 Review code by sending it to backend
   */
  reviewCode: async (code, language, signal = null) => {
    const token = getToken();
    
    console.log('🚀 Sending review request:', {
      codeLength: code.length,
      language: language,
      hasToken: !!token,
      hasSignal: !!signal
    });

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ code, language }),
      };

      // ✅ Add abort signal if provided (and it's valid)
      if (signal && signal instanceof AbortSignal) {
        options.signal = signal;
      }

      // ✅ Add 45-second timeout if no signal provided
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      if (!options.signal) {
        options.signal = controller.signal;
      }

      const response = await fetch(`${API_BASE}/review`, options);
      clearTimeout(timeoutId);

      return handleResponse(response);
    } catch (error) {
      // ✅ Better error messages
      if (error.name === 'AbortError') {
        console.log('⏹️ Request cancelled');
        throw error;
      }

      if (error.message.includes('fetch')) {
        console.error('🌐 Network Error:', error);
        throw new Error('Network error - check if backend is running');
      }

      console.error('❌ Review Error:', error);
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  },

  /**
   * 🔹 Get all previous code reviews (history)
   */
  getReviewHistory: async () => {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_BASE}/review/history`, {
      headers
    });
    return handleResponse(response);
  },

  /**
   * 🔹 Delete a specific review
   */
  deleteReview: async (id) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/review/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  /**
   * 🔹 Get user's GitHub repositories
   */
  getRepositories: async () => {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/pr/repositories`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  /**
   * 🔹 Create a Pull Request
   */
  createPullRequest: async (data) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE}/pr/create-pr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
};

export default api;