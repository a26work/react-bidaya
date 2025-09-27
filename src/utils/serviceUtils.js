import { apiClient } from '../services/api';

export const serviceUtils = {
  // Build query string from parameters
  buildQueryString: (params) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return query.toString();
  },

  // Transform data before sending to API
  transformRequest: (data, transformers = {}) => {
    const transformed = { ...data };
    Object.keys(transformers).forEach(key => {
      if (transformed[key] !== undefined) {
        transformed[key] = transformers[key](transformed[key]);
      }
    });
    return transformed;
  },

  // Transform data received from API
  transformResponse: (data, transformers = {}) => {
    if (Array.isArray(data)) {
      return data.map(item => serviceUtils.transformResponse(item, transformers));
    }
    
    const transformed = { ...data };
    Object.keys(transformers).forEach(key => {
      if (transformed[key] !== undefined) {
        transformed[key] = transformers[key](transformed[key]);
      }
    });
    return transformed;
  },

  // Format dates for API
  formatDatesForAPI: (data) => {
    const formatted = { ...data };
    Object.keys(formatted).forEach(key => {
      if (formatted[key] instanceof Date) {
        formatted[key] = formatted[key].toISOString();
      }
    });
    return formatted;
  },

  // Parse dates from API
  parseDatesFromAPI: (data, dateFields = []) => {
    const parsed = { ...data };
    dateFields.forEach(field => {
      if (parsed[field]) {
        parsed[field] = new Date(parsed[field]);
      }
    });
    return parsed;
  },

  // Handle file uploads
  uploadFile: async (endpoint, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress
      });
      return response.data || response;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  },

  // Export data
  exportData: async (endpoint, format = 'csv', params = {}) => {
    try {
      const response = await apiClient.get(`${endpoint}/export`, {
        params: { ...params, format },
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response], { type: response.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }
};