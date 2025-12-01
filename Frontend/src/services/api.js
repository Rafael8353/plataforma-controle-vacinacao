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
      
      if (response.status === 204) {
        return null;
      }

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

  async getCertificate() {
    return this.request('/vaccination-records/certificate', {
      method: 'GET',
    });
  }

  async getVaccineLots(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/lotes/?${queryParams}`, { 
      method: 'GET',
    });
  }

  async getVaccines() {
    return this.request('/vaccines', {
      method: 'GET',
    });
  }

  async getCurrentUser() {
    return this.request('/users/me', {
      method: 'GET',
    });
  }

  async getProfessionalStats() {
    return this.request('/vaccination-records/professional/stats', {
      method: 'GET',
    });
  }

  async getUserByCpf(cpf) {
    const data = await this.request(`/users?cpf=${cpf}`, {
      method: 'GET',
    });
    
    if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
    }
    return data;
  }

  async registerVaccination(data) {
    return this.request('/vaccination-records', {
      method: 'POST',
      body: data,
    });
  }
}

export default new ApiService();