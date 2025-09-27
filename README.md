# react-bidaya

A reusable React component library built with React, Vite, and Tailwind CSS. It provides a collection of modular and performant UI components, hooks, and utilities designed for easy integration and maintainability in your React projects.

## Table of Contents

- [Installation](#installation)
- [Core Components](#core-components)
  - [Button](#button)
  - [Form Components](#form-components)
    - [Input](#input)
    - [Textarea](#textarea)
    - [Select](#select)
    - [Checkbox](#checkbox)
    - [Radio](#radio)
  - [Layout Components](#layout-components)
    - [Modal](#modal)
    - [Card](#card)
    - [Navbar](#navbar)
    - [Sidebar](#sidebar)
  - [Feedback Components](#feedback-components)
    - [Alert](#alert)
    - [Badge](#badge)
    - [Avatar](#avatar)
    - [ProgressBar](#progressbar)
    - [Loader](#loader)
    - [Tooltips](#tooltips)
- [Advanced Components](#advanced-components)
  - [Table](#table)
  - [ChartWidget](#chartwidget)
  - [KPICard](#kpicard)
  - [Pagination](#pagination)
  - [CrudComponent](#crudcomponent)
- [CRUD Configuration Guide](#crud-configuration-guide)
  - [Quick Start](#quick-start)
  - [Configuration Options](#configuration-options)
  - [Field Types](#field-types)
  - [Column Types](#column-types)
  - [Advanced Usage](#advanced-usage)

## Installation

### Install dependencies:
```bash
npm install clsx redux react-redux @reduxjs/toolkit axios chart.js react-chartjs-2 @heroicons/react @tanstack/react-query react-router-dom date-fns
npm install -D tailwindcss @tailwindcss/vite @types/chart.js @tanstack/react-query-devtools @types/node
```

To install `react-bidaya` in your project, use npm:
```bash
npm install react-bidaya
```

### CSS Configuration
- Ensure Tailwind scans react-bidaya in node_modules.
- Prefer scanning the ESM file(s) for better class detection.

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './node_modules/react-bidaya/dist/**/*.{js,jsx,ts,tsx}',
      ],
    }),
  ],
})
```

For Tailwind v3 users:
- Add react-bidaya path to tailwind.config.js content:
```javascript
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-bidaya/dist/**/*.{js,jsx,ts,tsx}',
  ]
```

## Core Components

### Button

A versatile button component with multiple variants and sizes.

```javascript
import { Button } from 'react-bidaya';

<Button
  variant="primary" // primary | success | secondary | outline | ghost | danger
  size="md" // xs | sm | md | lg | xl
  loading={false}
  disabled={false}
  fullWidth={false}
  icon={<Icon />}
  iconPosition="left" // left | right
  onClick={() => console.log('Clicked')}
>
  Click me
</Button>
```

## Form Components

### Input

Form input field with validation states and icon support.

```javascript
import { Input } from 'react-bidaya';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  helperText="Enter a valid email address"
  required={true}
  size="md" // sm | md | lg
  variant="default" // default | error | success
  icon={<MailIcon />}
  iconPosition="left" // left | right
/>
```

### Textarea

Multi-line text input with auto-resize capability.

```javascript
import { Textarea } from 'react-bidaya';

<Textarea
  label="Description"
  placeholder="Enter description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  autoResize={true}
  minRows={2}
  maxRows={10}
  resize="vertical" // none | vertical | horizontal | both
  error={errors.description}
/>
```

### Select

Dropdown select component with options support.

```javascript
import { Select } from 'react-bidaya';

<Select
  label="Country"
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
  placeholder="Select a country"
  required={true}
  size="md" // sm | md | lg
/>
```

### Checkbox

Checkbox input with indeterminate state support.

```javascript
import { Checkbox } from 'react-bidaya';

<Checkbox
  label="Accept terms and conditions"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
  indeterminate={partialSelection}
  color="blue" // blue | green | red | purple | yellow
  size="md" // sm | md | lg
/>
```

### Radio

Radio button component.

```javascript
import { Radio } from 'react-bidaya';

<Radio
  label="Option 1"
  name="options"
  value="option1"
  checked={selectedOption === 'option1'}
  onChange={(e) => setSelectedOption(e.target.value)}
  color="blue" // blue | green | red | purple | yellow
  size="md" // sm | md | lg
/>
```

## Layout Components

### Modal

Modal dialog component with overlay.

```javascript
import { Modal } from 'react-bidaya';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="md" // xs | sm | md | lg | xl | 2xl | 3xl | full
  closeOnOverlayClick={true}
  closeOnEscape={true}
  preventClose={false}
>
  <p>Modal content goes here</p>
  <footer>
    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
  </footer>
</Modal>
```

### Card

Container component for content with header and footer.

```javascript
import { Card } from 'react-bidaya';

<Card
  title="Card Title"
  subtitle="Card subtitle"
  padding="md" // none | sm | md | lg | xl
  shadow="sm" // none | sm | md | lg | xl | 2xl
  hover={true}
  border={true}
  loading={isLoading}
  actions={<Button>Action</Button>}
  footer={<div>Footer content</div>}
>
  <p>Card content goes here</p>
</Card>
```

### Navbar

Top navigation bar with user controls and theme toggles.

```javascript
import { Navbar } from 'react-bidaya';

// This component automatically integrates with your auth and theme hooks
<Navbar />
```

### Sidebar

Navigation sidebar with collapsible support and nested menu items.

```javascript
import { Sidebar } from 'react-bidaya';

const navigationItems = [
  {
    id: 'dashboard',
    nameKey: 'Dashboard',
    href: '/dashboard',
    icon: ChartBarIcon
  }
];

<Sidebar navigationItems={navigationItems} />
```

## Feedback Components

### Alert

Notification alert component with dismiss functionality.

```javascript
import { Alert } from 'react-bidaya';

<Alert
  variant="info" // info | success | warning | error
  size="md" // sm | md | lg
  dismissible={true}
  onDismiss={() => console.log('Dismissed')}
>
  This is an informational alert message.
</Alert>
```

### Badge

Small status indicator component.

```javascript
import { Badge } from 'react-bidaya';

<Badge
  variant="primary" // default | primary | success | warning | danger | info
  size="md" // sm | md | lg
>
  New
</Badge>
```

### Avatar

User profile image component with fallback support.

```javascript
import { Avatar } from 'react-bidaya';

<Avatar
  src="/path/to/image.jpg"
  alt="User Name"
  size="md" // xs | sm | md | lg | xl | 2xl
  fallback="UN" // Fallback text if image fails to load
/>
```

### ProgressBar

Progress indicator component.

```javascript
import { ProgressBar } from 'react-bidaya';

<ProgressBar
  value={75}
  max={100}
  size="md" // sm | md | lg | xl
  color="blue" // blue | green | red | yellow | purple | gray
  showLabel={true}
  label="Progress"
  animated={true}
  striped={true}
/>
```

### Loader

Loading spinner component with multiple variants.

```javascript
import { Loader } from 'react-bidaya';

<Loader
  size="md" // xs | sm | md | lg | xl | 2xl
  variant="spinner" // spinner | dots | pulse
  color="blue" // blue | green | red | purple | gray | yellow
  text="Loading..."
  overlay={true}
/>
```

### Tooltips

Tooltip component that appears on hover.

```javascript
import { Tooltips } from 'react-bidaya';

<Tooltips
  content="This is a tooltip"
  placement="top" // top | bottom | left | right
  className="custom-class"
>
  <Button>Hover me</Button>
</Tooltips>
```

## Advanced Components

### Table

Advanced data table component with sorting, filtering, pagination, and row selection.

```javascript
import { Table } from 'react-bidaya';

<Table
  data={users}
  columns={[
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px'
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      truncate: 30
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeVariant: (value) => value === 'active' ? 'success' : 'default',
      badgeLabel: (value) => value === 'active' ? 'Active' : 'Inactive'
    }
  ]}
  loading={isLoading}
  pagination={{
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
    totalItems: 100
  }}
  searchable={true}
  filterable={true}
  sortable={true}
  selectable={true}
  actions={['view', 'edit', 'delete']}
  filtersSchema={[
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]}
  onPageChange={(page) => setCurrentPage(page)}
  onSearch={(searchTerm) => handleSearch(searchTerm)}
  onFilter={(filters) => handleFilter(filters)}
  onSort={(column, direction) => handleSort(column, direction)}
  onAction={(action, row) => handleAction(action, row)}
  onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
  emptyStateMessage="No users found"
/>
```

### ChartWidget

A versatile chart component that supports multiple chart types and automatically handles data transformation.

```javascript
import { ChartWidget } from 'react-bidaya';

<ChartWidget
  data={salesData}
  config={{
    chartType: 'bar', // line | bar | pie | doughnut | radar | polarArea
    dataField: 'revenue', // Field containing numeric values
    labelField: 'month', // Field containing labels
    colors: ['#3b82f6', '#10b981', '#ef4444'], // Custom colors
    fill: true, // For line charts
    stepped: false, // For line charts
    borderRadius: 4 // For bar charts
  }}
  title="Revenue by Month"
  className="custom-chart-class"
/>
```

### KPICard

Key Performance Indicator card for displaying metrics.

```javascript
import { KPICard } from 'react-bidaya';

<KPICard
  title="Total Revenue"
  value="$45,231.89"
  subtitle="+20.1% from last month"
  trend="up" // up | down | neutral
  trendValue="+20.1%"
  icon={<DollarIcon />}
  color="green" // blue | green | red | yellow | purple
  loading={isLoading}
/>
```

### Pagination

Pagination component for navigating through pages.

```javascript
import { Pagination } from 'react-bidaya';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  showFirstLast={true}
  showPrevNext={true}
  maxVisiblePages={5}
  size="md" // sm | md | lg
/>
```

### CrudComponent

A complete CRUD (Create, Read, Update, Delete) interface component with built-in data management capabilities.

#### Features
- React Query integration for data fetching and caching
- Modal-based forms for CRUD operations
- Advanced table with pagination, search, filtering, and sorting
- Relationship field support (foreign key dropdowns)
- Form validation and error handling
- Configurable permissions and feature flags

#### Basic Usage

```javascript
import { CrudComponent } from 'react-bidaya';

<CrudComponent 
  config={yourConfig}
  onItemSelect={(item) => console.log('Selected:', item)}
  onItemCreate={(item) => console.log('Created:', item)}
  onItemUpdate={(item) => console.log('Updated:', item)}
  onItemDelete={(id) => console.log('Deleted:', id)}
/>
```

## CRUD Configuration Guide

### Quick Start

```javascript
// config/categories.js
import { configHelpers, createCrudConfig } from 'react-bidaya';

export const CategoriesConfig = createCrudConfig({
  title: 'Categories',
  entityName: 'Category',
  description: 'Manage categories for organizing performance indicators',
  queryKey: 'categories',
  
  endpoints: {
    list: '/api/categories',
    create: '/api/categories',
    update: '/api/categories',
    delete: '/api/categories'
  },
  
  columns: [
    configHelpers.createColumn('name', 'Name', 'text'),
    configHelpers.createRelationshipColumn('parent_id', 'Parent Category'),
    configHelpers.createColumn('active', 'Active', 'boolean')
  ],
  
  fields: [
    configHelpers.createField('name', 'Category Name', 'text', { 
      required: true 
    }),
    configHelpers.createRelationshipField('parent_id', 'Parent Category', '/api/categories', {
      relationshipValueKey: 'id',
      relationshipLabelKey: 'name',
      placeholder: 'Select parent category (optional)'
    })
  ],
  
  // Feature flags
  allowCreate: true,
  allowEdit: true,
  allowDelete: false,
  searchable: true,
  filterable: false,
  actions: ["view", "edit"]
});

// pages/Categories.jsx
import { CrudComponent } from 'react-bidaya';
import { CategoriesConfig } from '../config/categories';

export default function CategoriesPage() {
  return <CrudComponent config={CategoriesConfig} />;
}
```

### Configuration Options

#### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Page title displayed in the component header |
| `entityName` | `string` | Entity name (e.g., "User", "Product") |
| `queryKey` | `string` | React Query cache key |
| `endpoints.list` | `string` | API endpoint for fetching data |
| `columns` | `array` | Array of column definitions for the table |
| `fields` | `array` | Array of form field definitions |

#### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `description` | `string` | - | Page description shown below title |
| `endpoints.create` | `string` | `endpoints.list` | API endpoint for creating items |
| `endpoints.update` | `string` | `endpoints.list` | API endpoint for updating items |
| `endpoints.delete` | `string` | `endpoints.list` | API endpoint for deleting items |
| `filters` | `array` | `[]` | Filter definitions for the table |
| `actions` | `array` | `["view", "edit", "delete"]` | Available actions for each row |
| `allowCreate` | `boolean` | `true` | Show create button and allow creation |
| `allowEdit` | `boolean` | `true` | Allow editing items |
| `allowDelete` | `boolean` | `true` | Allow deleting items |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `filterable` | `boolean` | `true` | Enable filtering functionality |
| `sortable` | `boolean` | `true` | Enable sorting functionality |
| `customActions` | `object` | `{}` | Custom action handlers |
| `modalSize` | `string` | `"lg"` | Modal size ("sm", "md", "lg", "xl") |
| `pagination.defaultPageSize` | `number` | `50` | Default number of items per page |

### Field Types

#### Text Fields
- `text` - Basic text input
- `email` - Email input with validation
- `password` - Password input
- `url` - URL input with validation
- `tel` - Phone number input

#### Numeric Fields
- `number` - Number input
- `currency` - Currency input with decimal support

#### Date/Time Fields
- `date` - Date picker
- `datetime-local` - Date and time picker

#### Selection Fields
- `select` - Dropdown with predefined options
- `checkbox` - Boolean checkbox

#### Large Text Fields
- `textarea` - Multi-line text input

#### Relationship Fields
```javascript
configHelpers.createRelationshipField('user_id', 'User', '/api/users', {
  relationshipValueKey: 'id',
  relationshipLabelKey: 'name',
  required: true
})
```

### Column Types

#### Basic Columns
- `text` - Text display
- `email` - Email display
- `number` - Number display
- `currency` - Formatted currency display

#### Special Columns
- `date` - Formatted date display
- `datetime` - Formatted date and time display
- `boolean` - Boolean value display
- `badge` - Status badge display
- `relationship` - Related item name display
- `actions` - Action buttons column

### Advanced Usage

#### Custom Actions

```javascript
const config = createCrudConfig({
  // ... other config
  actions: ["view", "edit", "approve", "reject"],
  customActions: {
    approve: async (item, { refetch }) => {
      await fetch(`/api/items/${item.id}/approve`, { method: 'POST' });
      refetch();
      alert('Item approved successfully!');
    },
    reject: async (item, { refetch }) => {
      if (confirm('Are you sure you want to reject this item?')) {
        await fetch(`/api/items/${item.id}/reject`, { method: 'POST' });
        refetch();
        alert('Item rejected successfully!');
      }
    }
  }
});
```

#### Conditional Field Display

```javascript
const fields = [
  configHelpers.createField('name', 'Name', 'text', { required: true }),
  configHelpers.createField('advanced_setting', 'Advanced Setting', 'text', {
    condition: (formData) => formData.user_type === 'admin'
  })
];
```

#### Custom Validation

```javascript
const fields = [
  configHelpers.createField('password', 'Password', 'password', {
    required: true,
    validate: (value) => {
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
      if (!/[0-9]/.test(value)) return 'Password must contain a number';
      return null;
    }
  })
];
```

#### Read-Only Configuration

```javascript
const readOnlyConfig = createCrudConfig({
  // ... other config
  actions: ["view"], // Only view action
  allowCreate: false,
  allowEdit: false,
  allowDelete: false,
  searchable: true,
  filterable: true,
  sortable: true
});
```