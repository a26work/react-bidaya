export const transformers = {
  trim: (value) => (typeof value === "string" ? value.trim() : value),

  toLowerCase: (value) =>
    typeof value === "string" ? value.toLowerCase() : value,

  toUpperCase: (value) =>
    typeof value === "string" ? value.toUpperCase() : value,

  parseNumber: (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  },

  parseInteger: (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  },

  parseBoolean: (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1";
    }
    return Boolean(value);
  },

  formatCurrency: (value, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  },

  formatDate: (value, options = {}) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-US", options);
  },

  formatDateTime: (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString("en-US");
  },

  parseRelationshipValue: (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? Number(value[0]) : null;
    }
    if (value === "" || value === undefined || value === null) {
      return null;
    }
    return Number(value);
  },

  parseNumberArray: (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? Number(value[0]) : null;
    }
    if (value === "" || value === undefined || value === null) {
      return null;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  },

  ensureSingleValue: (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : null;
    }
    return value;
  },
};