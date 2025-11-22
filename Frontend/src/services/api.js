const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(identifier, password) {
    return this.request('/users/login', {
      method: 'POST',
      body: { identifier, password },
    });
  }

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: userData,
    });
  }
}

export default new ApiService();
