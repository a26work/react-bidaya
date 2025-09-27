import { useValidators } from '../hooks/useValidators';
import { useFilterTypes } from '../hooks/useFilterTypes';
import { transformers } from '../utils/transformers';

export const fieldTypes = {
  text: {
    type: "text",
    validate: useValidators.required,
    processValue: transformers.trim,
  },

  email: {
    type: "email",
    validate: (value) => useValidators.email(value) || useValidators.required(value),
    processValue: transformers.trim,
  },

  password: {
    type: "password",
    validate: (value) =>
      useValidators.minLength(8)(value) || useValidators.required(value),
  },

  number: {
    type: "number",
    validate: useValidators.number,
    processValue: transformers.parseNumber,
  },

  integer: {
    type: "number",
    validate: useValidators.number,
    processValue: transformers.parseInteger,
  },

  currency: {
    type: "number",
    step: "0.01",
    validate: useValidators.positiveNumber,
    processValue: transformers.parseNumber,
  },

  url: {
    type: "url",
    validate: useValidators.url,
    processValue: transformers.trim,
  },

  phone: {
    type: "tel",
    validate: useValidators.phone,
    processValue: transformers.trim,
  },

  date: {
    type: "date",
  },

  datetime: {
    type: "datetime-local",
  },

  textarea: {
    type: "textarea",
    rows: 3,
    processValue: transformers.trim,
  },

  select: {
    type: "select",
    options: [],
  },

  relationshipSelect: {
    type: "select",
    relationshipEndpoint: null, // Must be provided
    relationshipValueKey: "id",
    relationshipLabelKey: "name",
    relationshipLimit: 1000,
    processValue: (value) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? Number(value[0]) : null;
      }
      if (value === "" || value === undefined) {
        return null;
      }
      return Number(value);
    },
  },

  checkbox: {
    type: "checkbox",
    processValue: transformers.parseBoolean,
  },
};

export const columnTypes = {
  id: {
    key: "id",
    label: "ID",
    width: "80px",
    sortable: true,
  },

  name: {
    key: "name",
    label: "Name",
    sortable: true,
    truncate: 50,
  },

  email: {
    key: "email",
    label: "Email",
    sortable: true,
    truncate: 40,
  },

  date: {
    type: "date",
    sortable: true,
    width: "120px",
  },

  datetime: {
    type: "datetime",
    sortable: true,
    width: "150px",
  },

  boolean: {
    type: "boolean",
    sortable: true,
    width: "100px",
  },

  currency: {
    type: "currency",
    sortable: true,
    width: "120px",
  },

  badge: {
    type: "badge",
    sortable: true,
    width: "100px",
  },

  // Relationship column - displays the related item's name instead of ID
  relationship: {
    type: "custom",
    sortable: true,
    width: "150px",
  },

  actions: {
    key: "actions",
    label: "Actions",
    width: "120px",
    sortable: false,
  },
};

export const createCrudConfig = ({
  title,
  entityName,
  description,
  queryKey,
  endpoints,
  columns,
  fields,
  filters = [],
  actions = ["view", "edit", "delete"],
  ...options
}) => ({
  // Basic info
  title,
  entityName,
  description,
  queryKey,

  // API endpoints
  endpoints: {
    list: endpoints.list,
    create: endpoints.create || endpoints.list,
    update: endpoints.update || endpoints.list,
    delete: endpoints.delete || endpoints.list,
    ...endpoints,
  },

  // Table configuration
  columns,
  actions,

  // Form configuration
  fields,

  // Filter configuration
  filters,

  // Feature flags
  allowCreate: options.allowCreate !== false,
  allowEdit: options.allowEdit !== false,
  allowDelete: options.allowDelete !== false,
  searchable: options.searchable !== false,
  filterable: options.filterable !== false,
  sortable: options.sortable !== false,

  // UI configuration
  modalSize: options.modalSize || "lg",
  emptyStateMessage:
    options.emptyStateMessage ||
    `No ${entityName?.toLowerCase() || "items"} found`,
  deleteConfirmationField: options.deleteConfirmationField || "name",

  // Pagination
  pagination: {
    defaultPageSize: 50,
    pageSizeOptions: [10, 25, 50, 100],
    ...options.pagination,
  },

  // Caching
  cacheTime: options.cacheTime || 5 * 60 * 1000, // 5 minutes

  // Custom actions and behaviors
  customActions: options.customActions || {},
  defaultSort: options.defaultSort || {},

  // Data processing
  requestTransformers: options.requestTransformers || {},
  responseTransformers: options.responseTransformers || {},
});

export const configHelpers = {
  createField: (key, label, type = "text", options = {}) => ({
    key,
    label,
    ...fieldTypes[type],
    ...options,
  }),

  createRelationshipField: (key, label, endpoint, options = {}) => ({
    key,
    label,
    ...fieldTypes.relationshipSelect,
    relationshipEndpoint: endpoint,
    relationshipValueKey: options.valueKey || "id",
    relationshipLabelKey: options.labelKey || "name",
    relationshipLimit: options.per_page || 100,
    ...options,
  }),

  createColumn: (key, label, type = "text", options = {}) => ({
    key,
    label,
    ...columnTypes[type],
    ...options,
  }),

  createRelationshipColumn: (key, label, options = {}) => ({
    key,
    label,
    ...columnTypes.relationship,
    ...options,
  }),

  createFilter: (key, label, type = "text", options = {}) => ({
    key,
    label,
    ...useFilterTypes[type],
    ...options,
  }),

  createRelationshipFilter: (key, label, endpoint, options = {}) => ({
    key,
    label,
    ...useFilterTypes.relationshipSelect,
    relationshipEndpoint: endpoint,
    relationshipValueKey: options.valueKey || "id",
    relationshipLabelKey: options.labelKey || "name",
    relationshipLimit: options.per_page || 100,
    ...options,
  }),

  mergeConfigs: (baseConfig, overrides) => ({
    ...baseConfig,
    ...overrides,
    columns: [...(baseConfig.columns || []), ...(overrides.columns || [])],
    fields: [...(baseConfig.fields || []), ...(overrides.fields || [])],
    filters: [...(baseConfig.filters || []), ...(overrides.filters || [])],
  }),

  generateFromSchema: (schema) => {
    const {
      entity,
      endpoints,
      properties,
      relationships = {},
      ui = {},
    } = schema;

    const fields = Object.entries(properties).map(([key, prop]) => {
      if (relationships[key]) {
        return configHelpers.createRelationshipField(
          key,
          prop.label || key,
          relationships[key].endpoint,
          {
            required: prop.required,
            ...relationships[key],
          }
        );
      }

      return configHelpers.createField(
        key,
        prop.label || key,
        prop.type || "text",
        {
          required: prop.required,
          ...prop,
        }
      );
    });

    const columns = Object.entries(properties).map(([key, prop]) => {
      if (relationships[key]) {
        return configHelpers.createRelationshipColumn(key, prop.label || key, {
          sortable: prop.sortable !== false,
          ...prop,
        });
      }

      return configHelpers.createColumn(
        key,
        prop.label || key,
        prop.columnType || prop.type || "text",
        {
          sortable: prop.sortable !== false,
          ...prop,
        }
      );
    });

    const filters = Object.entries(properties)
      .filter(([, prop]) => prop.filterable !== false)
      .map(([key, prop]) => {
        if (relationships[key]) {
          return configHelpers.createRelationshipFilter(
            key,
            prop.label || key,
            relationships[key].endpoint,
            relationships[key]
          );
        }

        return configHelpers.createFilter(
          key,
          prop.label || key,
          prop.filterType || "text",
          prop
        );
      });

    return createCrudConfig({
      title: entity.title || `${entity.name} Management`,
      entityName: entity.name,
      description: entity.description,
      queryKey: entity.queryKey || entity.name.toLowerCase(),
      endpoints,
      columns,
      fields,
      filters,
      ...ui,
    });
  },
};