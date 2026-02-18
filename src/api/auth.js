import axios from 'axios';

// Configure axios defaults
// const API_BASE_URL = 'http://localhost:8000/api'; # for local run
const API_BASE_URL = '/api';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple authentication (for demo - replace with JWT in production)
const authAPI = {
  login: async (username, password) => {
    // Default credentials for demo
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      return { success: true, username };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  },

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  getCurrentUser: () => {
    return localStorage.getItem('username') || 'Admin';
  }
};

export { authAPI, axiosInstance };






// simple log in suystem don't show in ui


// Secret credentials (NOT shown in UI)
// Only someone who already knows these can log in
// const SECRET_USERNAME = 'lincoln_admin';
// const SECRET_PASSWORD = 'L!nC0ln@2026';

// const SECRET_USERNAME = 'jahid';
// const SECRET_PASSWORD = 'jahid2026';

// const authAPI = {
//   login: async (username, password) => {
//     // small delay (feels like real auth)
//     await new Promise(r => setTimeout(r, 400));

//     if (username === SECRET_USERNAME && password === SECRET_PASSWORD) {
//       localStorage.setItem('isAuthenticated', 'true');
//       localStorage.setItem('username', username);
//       return { success: true, username };
//     }

//     return { success: false };
//   },

//   logout: () => {
//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('username');
//   },

//   isAuthenticated: () => {
//     return localStorage.getItem('isAuthenticated') === 'true';
//   },

//   getCurrentUser: () => {
//     return localStorage.getItem('username');
//   }
// };

// export { authAPI };
