import axios from 'axios';

export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateUserLanguage = async (lang) => {
  try {
    const globalConfig = window['__REACT_BIDAYA_CONFIG__'] || {};
    const languageEndpoint = globalConfig.LanguageEndpoint || '/api/user/set_language';
    const response = await apiClient.post(languageEndpoint, { lang });
    return response.data || response;
  } catch (error) {
    console.error("Failed to update user Language:", error);
    throw error;
  }
};

export const apiService = {
  fetchItems: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
        };
      }
      
      return response;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw error;
    }
  },

  fetchItem: async (endpoint, id) => {
    try {
      const response = await apiClient.get(`${endpoint}/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Failed to fetch item ${id}:`, error);
      throw error;
    }
  },

  createItem: async (endpoint, data) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data || response;
    } catch (error) {
      console.error("Failed to create item:", error);
      throw error;
    }
  },

  updateItem: async (endpoint, id, data) => {
    try {
      const response = await apiClient.put(`${endpoint}/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error(`Failed to create item ${id}:`, error);
      throw error;
    }
  },

  deleteItem: async (endpoint, id) => {
    try {
      const response = await apiClient.delete(`${endpoint}/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Failed to delete item ${id}:`, error);
      throw error;
    }
  },

  bulkCreate: async (endpoint, items) => {
    try {
      const response = await apiClient.post(`${endpoint}/bulk`, { items });
      return response.data || response;
    } catch (error) {
      console.error('Failed to bulk create items:', error);
      throw error;
    }
  },

  bulkUpdate: async (endpoint, items) => {
    try {
      const response = await apiClient.put(`${endpoint}/bulk`, { items });
      return response.data || response;
    } catch (error) {
      console.error('Failed to bulk update items:', error);
      throw error;
    }
  },

  bulkDelete: async (endpoint, ids) => {
    try {
      const response = await apiClient.delete(`${endpoint}/bulk`, { data: { ids } });
      return response.data || response;
    } catch (error) {
      console.error('Failed to bulk delete items:', error);
      throw error;
    }
  }
};

export const createService = (baseEndpoint) => {
  return {
    list: (params) => apiService.fetchItems(baseEndpoint, params),
    get: (id) => apiService.fetchItem(baseEndpoint, id),
    create: (data) => apiService.createItem(baseEndpoint, data),
    update: (id, data) => apiService.updateItem(baseEndpoint, id, data),
    delete: (id) => apiService.deleteItem(baseEndpoint, id),
    bulkCreate: (items) => apiService.bulkCreate(baseEndpoint, items),
    bulkUpdate: (items) => apiService.bulkUpdate(baseEndpoint, items),
    bulkDelete: (ids) => apiService.bulkDelete(baseEndpoint, ids)
  };
};