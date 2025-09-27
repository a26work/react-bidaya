import { createCrudConfig, configHelpers } from './crud';

export const CategoriesConfig = createCrudConfig({
  title: 'Categories',
  entityName: 'Category',
  description: 'Manage categories for organizing performance indicators',
  queryKey: 'categories',
  allowDelete: false,
  allowCreate: true,
  allowEdit: true,
  filterable: false,
  actions: ["view", "edit"],
  endpoints: {
    list: '/api/categories',
    create: '/api/categories',
    update: '/api/categories',
    delete: '/api/categories'
  },
  columns: [
    configHelpers.createColumn('name', 'Name', 'name'),
    configHelpers.createRelationshipColumn('parent_id', 'Parent Category'),
    configHelpers.createColumn('active', 'Active', 'boolean')
  ],
  fields: [
    configHelpers.createField('name', 'Category Name', 'text', { required: true }),
    configHelpers.createRelationshipField('parent_id', 'Parent Category', '/api/categories', {
      relationshipValueKey: 'id',
      relationshipLabelKey: 'name',
      placeholder: 'Select parent category (optional)'
    }),
  ],
});

export const ItemsConfig = createCrudConfig({
  title: 'Items',
  entityName: 'Items',
  description: 'Manage Key Performance Indicators',
  queryKey: 'items',
  allowDelete: false,
  allowCreate: true,
  allowEdit: true,
  filterable: false,
  endpoints: {
    list: '/api/items',
    create: '/api/items',
    update: '/api/items',
    delete: '/api/items'
  },
  columns: [
    configHelpers.createColumn('name', 'Name', 'name'),
    configHelpers.createRelationshipColumn('category_id', 'Category'),
  ],
  fields: [
    configHelpers.createField('name', 'Name', 'text', { required: true }),
    configHelpers.createRelationshipField('category_id', 'Category', '/api/categories', {
      relationshipValueKey: 'id',
      relationshipLabelKey: 'name',
      placeholder: 'Select Category (optional)',
      required: true
    }),
  ],
});

export const PeriodsConfig = createCrudConfig({
  title: 'Periods',
  entityName: 'Period',
  description: 'Manage time periods for measurement',
  queryKey: 'periods',
  allowDelete: false,
  allowCreate: false,
  allowEdit: false,
  filterable: false,
  endpoints: {
    list: '/api/periods',
    create: '/api/periods',
    update: '/api/periods',
    delete: '/api/periods'
  },
  columns: [
    configHelpers.createColumn('name', 'Name', 'name'),
    configHelpers.createColumn('date_start', 'Start Date', 'date'),
    configHelpers.createColumn('date_end', 'End Date', 'date'),
    configHelpers.createColumn('state', 'State', 'badge')
  ],
  fields: [
    configHelpers.createField('name', 'Period Name', 'text', { required: true }),
    configHelpers.createField('date_start', 'Start Date', 'date', { required: true }),
    configHelpers.createField('date_end', 'End Date', 'date', { required: true }),
  ],
  filters: [
    configHelpers.createFilter('name', 'Search by name', 'text'),
  ]
});

export const TagsConfig = createCrudConfig({
  title: 'Tags',
  entityName: 'Tag',
  description: 'Manage tags for classifying items',
  queryKey: 'tags',
  allowDelete: true,
  allowCreate: true,
  allowEdit: true,
  filterable: false,
  endpoints: {
    list: '/api/tags',
    create: '/api/tags',
    update: '/api/tags',
    delete: '/api/tags'
  },
  columns: [
    configHelpers.createColumn('name', 'Name', 'name'),
  ],
  fields: [
    configHelpers.createField('name', 'Tag Name', 'text', { required: true }),
  ],
  filters: [
    configHelpers.createFilter('name', 'Search by name', 'text')
  ]
});
