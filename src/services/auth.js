import axios from 'axios';

class AuthService {
  constructor() {
    this._initialized = false;
    this._config = {};
  }

  _initialize() {
    if (this._initialized) return;
    const globalConfig = window['__REACT_BIDAYA_CONFIG__'] || {};
    const config = { ...this._config, ...globalConfig };

    this.AuthType = config.AuthType || 'auto';
    this.BaseURL = config.BaseURL || 'http://localhost11';
    this.database = config.database || 'db_name';
    this.LoginEndpoint = config.LoginEndpoint || '/api/auth/login';
    this.LogoutEndpoint = config.LogoutEndpoint || '/api/auth/logout';
    this.SessionInfoEndpoint = config.SessionInfoEndpoint || '/api/auth/session_info';
    this.storageKey = config.storageKey || 'auth_session';


    this.uid = null;
    this.context = {};
    this.userInfo = null;
    this.authType = this.AuthType; // 'web' or 'jwt' or 'auto'
    this.token = null;

    this.webClient = axios.create({
      baseURL: this.BaseURL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.jwtClient = axios.create({
      baseURL: this.BaseURL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
    this._initialized = true;
  }

  setupInterceptors() {
    this.webClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearSession();
        }
        return Promise.reject(error);
      }
    );

    this.jwtClient.interceptors.request.use(
      (config) => {
        if (this.token && this.authType === 'jwt') {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.jwtClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearSession();
        }
        return Promise.reject(error);
      }
    );
  }

  async webAuthenticate(username, password) {
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: { db: this.database, login: username, password },
        id: Math.floor(Math.random() * 1000000),
      };

      const response = await this.webClient.post(this.LoginEndpoint, payload);

      if (response.data?.result?.uid) {
        const sessionInfo = await this.getWebSessionInfo();
        
        this.uid = sessionInfo.uid || response.data.result.uid;
        this.context = sessionInfo.user_context || response.data.result.user_context || {};
        this.userInfo = this.extractWebUserInfo(sessionInfo);
        this.token = null;

        this.saveSession();
        return { success: true, user: this.userInfo, type: this.authType };
      }

      throw new Error('Web authentication failed');
    } catch (error) {
      console.error('Web authentication error:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error) || 'Web authentication failed',
      };
    }
  }

  async JWTAuthenticate(username, password, extraData = {}) {
    try {
      const response = await this.jwtClient.post(this.LoginEndpoint, {
        username,
        password,
        ...extraData,
      });

      const data = response.data;
      if (!data || (!data.token && !data.accessToken)) {
        throw new Error('JWT authentication failed (no token)');
      }

      this.token = data.token || data.accessToken;
      this.userInfo = data.user || { username, name: username };
      this.uid = null;
      this.context = {};

      this.saveSession();
      return { success: true, user: this.userInfo, type: this.authType };
    } catch (error) {
      console.error('JWT authentication error:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error) || 'JWT authentication failed',
      };
    }
  }

  async login(username, password, type = this.authType || 'auto', extraData = {}) {
    this._initialize();
    type = this.authType;
    if (type === 'web') {
      return this.webAuthenticate(username, password);
    } else if (type === 'jwt') {
      return this.JWTAuthenticate(username, password, extraData);
    } else {
      const jwtResult = await this.JWTAuthenticate(username, password, extraData);
      if (jwtResult.success) {
        return jwtResult;
      }
      return this.webAuthenticate(username, password);
    }
  }

  async getWebSessionInfo() {
    this._initialize();
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {},
      id: Math.floor(Math.random() * 1000000),
    };
    
    const response = await this.webClient.post(this.SessionInfoEndpoint, payload);
    
    if (response.data?.result) {
      return response.data.result;
    }
    
    if (response.data?.error) {
      throw new Error(response.data.error.message || 'Failed to get session info');
    }
    
    throw new Error('Invalid session info response');
  }

  async tryRestoreSession() {
    this._initialize();
    try {
      const stored = this.loadSession();
      if (!stored) return false;

      this.uid = stored.uid;
      this.context = stored.context || {};
      this.userInfo = stored.userInfo;
      this.authType = stored.authType;
      this.token = stored.token;

      if (this.authType === 'web') {
        const sessionInfo = await this.getWebSessionInfo();
        if (sessionInfo?.uid) {
          this.uid = sessionInfo.uid;
          this.context = sessionInfo.user_context || {};
          this.userInfo = this.extractWebUserInfo(sessionInfo);
          this.saveSession();
          return true;
        }
      } else if (this.authType === 'jwt') {
        if (stored.expiresAt && Date.now() >= stored.expiresAt) {
          this.clearSession();
          return false;
        }
        return true;
      }

      this.clearSession();
      return false;
    } catch (error) {
      console.error('Session restore error:', error);
      this.clearSession();
      return false;
    }
  }

  async logout() {
    this._initialize();
    try {
      if (this.authType === 'web') {
        await this.webClient.post(this.LogoutEndpoint, {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
          id: Math.floor(Math.random() * 1000000),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  isAuthenticated() {
    this._initialize();
    if (!this.userInfo) return false;
    
    if (this.authType === 'jwt') {
      const stored = this.loadSession();
      if (stored?.expiresAt && Date.now() >= stored.expiresAt) {
        return false;
      }
    }
    
    return true;
  }

  extractWebUserInfo(sessionInfo) {
    this._initialize();
    if (!sessionInfo) return null;
    
    return {
      uid: sessionInfo.uid || null,
      login: sessionInfo.login || sessionInfo.username || null,
      username: sessionInfo.username || sessionInfo.login || null,
      name: sessionInfo.name || sessionInfo.username || null,
      partner_id: Array.isArray(sessionInfo.partner_id) 
        ? sessionInfo.partner_id[0] 
        : sessionInfo.partner_id || null,
      company_id: Array.isArray(sessionInfo.company_id) 
        ? sessionInfo.company_id[0] 
        : sessionInfo.company_id || null,
      lang: sessionInfo.user_context?.lang || sessionInfo.lang || null,
      tz: sessionInfo.user_context?.tz || sessionInfo.tz || null,
      is_admin: sessionInfo.is_admin || false,
    };
  }

  extractErrorMessage(error) {
    return (
      error.response?.data?.error?.data?.message ||
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message
    );
  }

  saveSession() {
    if (typeof localStorage === 'undefined') return;
    
    const sessionData = {
      uid: this.uid,
      context: this.context,
      userInfo: this.userInfo,
      authType: this.authType,
      token: this.token,
      savedAt: Date.now(),
    };

    if (this.authType === 'jwt' && this.userInfo?.expiresIn) {
      sessionData.expiresAt = Date.now() + (this.userInfo.expiresIn * 1000);
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error);
    }
  }

  loadSession() {
    if (typeof localStorage === 'undefined') return null;
    
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Failed to load session from localStorage:', error);
      return null;
    }
  }

  clearSession() {
    this.uid = null;
    this.context = {};
    this.userInfo = null;
    this.authType = null;
    this.token = null;

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  getCurrentUser() {
    return this.userInfo;
  }

  getAuthType() {
    return this.authType;
  }

  getContext() {
    return this.context;
  }
}

export const authService = new AuthService();
export default AuthService;
