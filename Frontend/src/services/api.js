const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  getAuthToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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

  // Dashboard - Paciente
  async getPatientHistory() {
    return this.request('/vaccination-records/my-history', {
      method: 'GET',
    });
  }

  async getUpcomingVaccines() {
    return this.request('/vaccination-records/vaccines/upcoming', {
      method: 'GET',
    });
  }

  // Dashboard - Profissional (métodos básicos, podem ser expandidos)
  async getVaccineLots() {
    return this.request('/lotes/list', {
      method: 'GET',
    });
  }

  async getVaccines() {
    return this.request('/vaccines', {
      method: 'GET',
    });
  }
}

export default new ApiService();
