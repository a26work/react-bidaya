import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Table } from './Table';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Alert } from './Alert';
import { apiService } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import { useTransformedData } from '../hooks/useTransformedData';

export const Crud = ({
  config,
  onItemSelect,
  onItemCreate,
  onItemUpdate,
  onItemDelete,
  className = "",
  ...props
}) => {
  const queryClient = useQueryClient();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(config.pagination?.defaultPageSize || 50);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(config.defaultSort || {});
  const { t } = useTranslation();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("view"); // 'create', 'edit', 'view', 'delete'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Build query parameters
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      per_page: pageSize,
      search: searchTerm,
      ...filters,
      ...sortConfig,
    }),
    [currentPage, pageSize, searchTerm, filters, sortConfig]
  );

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [config.queryKey, queryParams],
    queryFn: () => apiService.fetchItems(config.endpoints.list, queryParams),
    keepPreviousData: true,
    staleTime: config.cacheTime || 5 * 60 * 1000, // 5 minutes default
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const useFormRelationships = (fields) => {
    const relationshipFields = fields.filter(
      (field) => field.type === "select" && field.relationshipEndpoint
    );

    const queries = useQueries({
      queries: relationshipFields.map((field) => ({
        queryKey: ["relationship", field.relationshipEndpoint],
        queryFn: () => apiService.fetchItems(field.relationshipEndpoint, { 
          per_page: field.relationshipLimit || 1000 
        }),
        staleTime: 10 * 60 * 1000,
        retry: 2,
        onError: (error) => {
          console.error(`Failed to load relationship data for ${field.key}:`, error);
        }
      })),
    });

    const data = useMemo(() => {
      const relationshipData = {};
      const allLoaded = queries.every(query => !query.isLoading);
      
      queries.forEach((query, index) => {
        const field = relationshipFields[index];
        relationshipData[field.key] = {
          options: [],
          isLoading: query.isLoading,
          isError: query.isError,
        };

        if (query.data && !query.isLoading) {
          let items = [];
          const responseData = query.data;
          
          // Handle different response structures
          if (responseData?.data?.data) items = responseData.data.data;
          else if (Array.isArray(responseData?.data)) items = responseData.data;
          else if (Array.isArray(responseData)) items = responseData;

          relationshipData[field.key].options = items.map((item) => ({
            value: item[field.relationshipValueKey || "id"],
            label: item[field.relationshipLabelKey || "name"] || `Item ${item[field.relationshipValueKey || "id"]}`,
          }));
        }
      });

      return { relationshipData, allLoaded };
    }, [queries, relationshipFields]);

    return data.relationshipData;
  };

  const formRelationshipData = useFormRelationships(config.fields);
  const transformedData = useTransformedData(response?.data.data, config.fields, formRelationshipData);


  const createMutation = useMutation({
    mutationFn: (data) => {
      return apiService.createItem(config.endpoints.create, data);
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      handleModalClose();
      onItemCreate?.(newItem);

      // Show success message if you have a toast system
      if (window.showToast) {
        window.showToast(
          `${config.entityName || "Item"} ${t("created_successfully")}`,
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Create error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("failed_to_create");
      const fieldErrors = error.response?.data?.errors || {};

      setFormErrors({
        general: errorMessage,
        ...fieldErrors,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return apiService.updateItem(config.endpoints.update, id, data);
    },
    onSuccess: (updatedItem) => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      handleModalClose();
      onItemUpdate?.(updatedItem);

      if (window.showToast) {
        window.showToast(
          `${config.entityName || "Item"} ${t("updated_successfully")}`,
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("failed_to_update");
      const fieldErrors = error.response?.data?.errors || {};

      setFormErrors({
        general: errorMessage,
        ...fieldErrors,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return apiService.deleteItem(config.endpoints.delete, id);
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      handleModalClose();
      onItemDelete?.(deletedId);

      if (window.showToast) {
        window.showToast(
          `${config.entityName || "Item"} ${t("deleted_successfully")}`,
          "success"
        );
      }
    },
    onError: (error) => {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("failed_to_delete");
      setFormErrors({ general: errorMessage });
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      setFormErrors({});

      if (currentItem && (modalType === "edit" || modalType === "view")) {
        // Use the original response data, not transformed data
        const originalData = response?.data.data.find(item => item.id === currentItem.id);
        const initialData = { ...originalData };
        
        config.fields.forEach((field) => {
          if (initialData[field.key] === undefined || initialData[field.key] === null) {
            initialData[field.key] = field.defaultValue || "";
          }
        });
        
        setFormData(initialData);
      } else if (modalType === "create") {
        const initialData = {};
        config.fields.forEach((field) => {
          initialData[field.key] = field.defaultValue ?? "";
        });
        setFormData(initialData);
      }
    }
  }, [isModalOpen, currentItem, modalType, config.fields, response?.data.data]);

  // Event handlers
  const handleModalOpen = useCallback((type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setFormErrors({});
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setCurrentItem(null);
    setFormData({});
    setFormErrors({});
  }, []);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [formErrors]
  );

  const validateForm = useCallback(() => {
    const errors = {};

    config.fields.forEach((field) => {
      const value = formData[field.key];

      // Required validation
      if (
        field.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        errors[field.key] = `${field.label} is required`;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value && !field.required) return;

      // Custom validation function
      if (field.validate && typeof field.validate === "function") {
        const validationError = field.validate(value, formData);
        if (validationError) {
          errors[field.key] = validationError;
        }
      }

      // Built-in type validations
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.key] = t("invalid_email");
        }
      }

      if (field.type === "url" && value) {
        try {
          new URL(value);
        } catch {
          errors[field.key] = t("invalid_url");
        }
      }

      // Length validations
      if (field.minLength && value && value.length < field.minLength) {
        errors[
          field.key
        ] = t("min_length", { min: field.minLength });
      }

      if (field.maxLength && value && value.length > field.maxLength) {
        errors[
          field.key
        ] = t("max_length", { max: field.maxLength });
      }
    });

    return errors;
  }, [config.fields, formData]);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setFormErrors({});

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      try {
        const submitData = { ...formData };

        config.fields.forEach((field) => {
          const value = submitData[field.key];

          if (field.relationshipEndpoint || field.type === "select") {
            if (Array.isArray(value)) {
              submitData[field.key] = value.length > 0 ? value[0] : null;
            } else if (value === "" || value === undefined) {
              submitData[field.key] = null;
            }
          }

          if (field.type === "number" || field.type === "integer") {
            if (Array.isArray(value)) {
              submitData[field.key] = value.length > 0 ? Number(value[0]) : null;
            } else if (value !== "" && value !== null && value !== undefined) {
              submitData[field.key] = Number(value);
            } else {
              submitData[field.key] = null;
            }
          }

          if (field.processValue && typeof field.processValue === "function") {
            submitData[field.key] = field.processValue(submitData[field.key]);
          }

          if (
            submitData[field.key] === "" &&
            ["number", "date", "datetime-local", "select"].includes(field.type)
          ) {
            submitData[field.key] = null;
          }
        });

        if (modalType === "create") {
          await createMutation.mutateAsync(submitData);
        } else if (modalType === "edit" && currentItem?.id) {
          await updateMutation.mutateAsync({
            id: currentItem.id,
            data: submitData,
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [
      modalType,
      formData,
      currentItem,
      validateForm,
      createMutation,
      updateMutation,
      config.fields,
    ]
  );

  const handleDelete = useCallback(async () => {
    if (!currentItem?.id) {
      setFormErrors({ general: "No item selected for deletion" });
      return;
    }

    try {
      await deleteMutation.mutateAsync(currentItem.id);
    } catch (error) {
      console.error("Delete error:", error);
      // Error handling is done in the mutation onError callback
    }
  }, [currentItem, deleteMutation]);

  const handleAction = useCallback(
    (action, item) => {
      switch (action) {
        case "view":
          handleModalOpen("view", item);
          onItemSelect?.(item);
          break;
        case "edit":
          if (!config.allowEdit) {
            console.warn("Edit action is disabled");
            return;
          }
          handleModalOpen("edit", item);
          break;
        case "delete":
          if (!config.allowDelete) {
            console.warn("Delete action is disabled");
            return;
          }
          handleModalOpen("delete", item);
          break;
        default:
          // Handle custom actions
          if (config.customActions?.[action]) {
            config.customActions[action](item, { refetch, queryClient });
          }
      }
    },
    [handleModalOpen, onItemSelect, config.customActions, refetch, queryClient, config.allowEdit, config.allowDelete]
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleSort = useCallback((column, direction) => {
    setSortConfig({ order: `${column} ${direction}` });
  }, []);

  const availableActions = useMemo(() => {
    const baseActions = config.actions || ["view", "edit", "delete"];
    
    return baseActions.filter(action => {
      switch (action) {
        case "edit":
          return config.allowEdit;
        case "delete":
          return config.allowDelete;
        case "view":
          return true; // View is always allowed
        default:
          return true; // Custom actions are always allowed if defined
      }
    });
  }, [config.actions, config.allowEdit, config.allowDelete]);

  const renderFormField = useCallback(
    (field) => {
      const commonProps = {
        label: field.label,
        value: formData[field.key] ?? "",
        onChange: (e) => handleInputChange(field.key, e.target.value),
        disabled: modalType === "view" || field.disabled,
        required: field.required,
        error: formErrors[field.key],
        helperText: field.helperText,
        placeholder: field.placeholder || `${t("enter")} ${field.label.toLowerCase()}`,
      };

      switch (field.type) {
        case "textarea":
          return (
            <Textarea
              key={field.key}
              {...commonProps}
              rows={field.rows || 3}
              maxRows={field.maxRows}
              autoResize={field.autoResize}
            />
          );

        case "select":
          const relationshipInfo = formRelationshipData[field.key];
          const isLoading = relationshipInfo?.isLoading || false;
          const options = relationshipInfo?.options || field.options || [];
          
          const selectValue = Array.isArray(commonProps.value) 
            ? (commonProps.value.length > 0 ? commonProps.value[0] : "")
            : commonProps.value;

          return (
            <Select
              key={field.key}
              {...commonProps}
              value={selectValue} // Use the corrected value
              onChange={(e) => {
                const newValue = e.target.value;
                handleInputChange(field.key, newValue === "" ? null : newValue);
              }}
              disabled={commonProps.disabled || isLoading}
              options={[
                ...options,
              ]}
            />
          );
        case "checkbox":
          return (
            <div key={field.key} className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={field.key}
                  checked={!!formData[field.key]}
                  onChange={(e) =>
                    handleInputChange(field.key, e.target.checked)
                  }
                  disabled={modalType === "view" || field.disabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor={field.key}
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {field.helperText && (
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {field.helperText}
                  </p>
                )}
                {formErrors[field.key] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors[field.key]}
                  </p>
                )}
              </div>
            </div>
          );

        case "number":
          return (
            <Input
              key={field.key}
              {...commonProps}
              type="number"
              step={field.step}
              min={field.min}
              max={field.max}
            />
          );

        case "date":
          return <Input key={field.key} {...commonProps} type="date" />;

        case "datetime-local":
          return (
            <Input key={field.key} {...commonProps} type="datetime-local" />
          );

        default:
          return (
            <Input
              key={field.key}
              {...commonProps}
              type={field.type || "text"}
            />
          );
      }
    },
    [formData, formErrors, modalType, handleInputChange, formRelationshipData]
  );

  const renderModalContent = () => {
    if (modalType === "delete") {
      if (!config.allowDelete) {
        return (
          <div className="space-y-6">
            <Alert variant="error">
              {t("delete_not_allowed")}
            </Alert>
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button variant="outline" onClick={handleModalClose}>
                {t("close")}
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-red-600">
            <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0" />
            <h3 className="text-lg font-semibold">{t("confirm_deletion")}</h3>
          </div>

          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              {t("are_you_sure_delete")}{" "}
              {config.entityName?.toLowerCase() || t("item")}? {t("action_cannot_be_undone")}
            </p>

            {currentItem && config.deleteConfirmationField && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border">
                <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
                  {config.deleteConfirmationField}:
                </span>
                <div className="font-semibold text-gray-900 dark:text-gray-100 mt-1">
                  {currentItem[config.deleteConfirmationField]}
                </div>
              </div>
            )}
          </div>

          {formErrors.general && (
            <Alert
              variant="error"
              dismissible
              onDismiss={() => setFormErrors({})}
            >
              {formErrors.general}
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button
              variant="outline"
              onClick={handleModalClose}
              disabled={deleteMutation.isPending}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </div>
        </div>
      );
    }


    const isViewMode = modalType === "view";
    const isEditMode = modalType === "edit";
    const isCreateMode = modalType === "create";
    const isLoading = createMutation.isPending || updateMutation.isPending;

    if (isEditMode && !config.allowEdit) {
      return (
        <div className="space-y-6">
          <Alert variant="error">
            {t("edit_not_allowed")}
          </Alert>
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button variant="outline" onClick={handleModalClose}>
              {t("close")}
            </Button>
          </div>
        </div>
      );
    }

    if (isCreateMode && !config.allowCreate) {
      return (
        <div className="space-y-6">
          <Alert variant="error">
            {t("create_not_allowed")}
          </Alert>
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button variant="outline" onClick={handleModalClose}>
              {t("close")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {formErrors.general && (
          <Alert
            variant="error"
            dismissible
            onDismiss={() =>
              setFormErrors((prev) => ({ ...prev, general: undefined }))
            }
          >
            {formErrors.general}
          </Alert>
        )}

        <div className="space-y-6">{config.fields.map(renderFormField)}</div>

        {!isViewMode && (
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              {modalType === "create"
                ? isLoading
                  ? t("creating")
                  : t("create")
                : isLoading
                ? t("updating")
                : t("update")}
            </Button>
          </div>
        )}

        {isViewMode && (
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button variant="outline" onClick={handleModalClose}>
              {t("close")}
            </Button>
          </div>
        )}
      </form>
    );
  };

  const getModalTitle = () => {
    const entityName = config.entityName || "Item";
    switch (modalType) {
      case "create":
        return `${t("create")} ${entityName}`;
      case "edit":
        return `${t("edit")} ${entityName}`;
      case "view":
        return `${t("view")} ${entityName}`;
      case "delete":
        return `${t("delete")} ${entityName}`;
      default:
        return entityName;
    }
  };

  if (error) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${className}`}
      >
        <Alert variant="error">
          <div className="space-y-2">
            <div className="font-semibold">{t("failed_to_load_data")}</div>
            <div className="text-sm">{error.message}</div>
            <div className="pt-2">
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t("try_again")}
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  const pagination = response?.data.pagination || {
    page: currentPage,
    total_pages: 1,
    total_count: 0,
    per_page: pageSize,
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {config.title}
          </h1>
          {config.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {config.description}
            </p>
          )}
        </div>

        {config.allowCreate ? (
          <Button
            onClick={() => handleModalOpen("create")}
            variant="primary"
            icon={<PlusIcon className="w-5 h-5" />}
            disabled={isLoading}
          >
            {t("create")} {config.entityName || "Item"}
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={true}
            icon={<PlusIcon className="w-5 h-5" />}
            title={t("create_disabled")}
          >
            {t("create")} {config.entityName || "Item"}
          </Button>
        )}
      </div>

      <Table
        data={transformedData || []} 
        columns={config.columns}
        loading={isLoading}
        pagination={{
          currentPage: pagination.page || currentPage,
          totalPages: pagination.total_pages || 0,
          totalItems: pagination.total_count || 0,
          pageSize: pagination.per_page || pageSize,
        }}
        searchable={config.searchable}
        filterable={config.filterable} 
        sortable={config.sortable}
        actions={availableActions}
        filtersSchema={config.filterable ? (config.filters || []) : []}
        onPageChange={handlePageChange}
        onSearch={config.searchable ? handleSearch : undefined}
        onFilter={config.filterable ? handleFilter : undefined}
        onSort={config.sortable ? handleSort : undefined}
        onAction={handleAction}
        emptyStateMessage={
          config.emptyStateMessage ||
          `No ${config.entityName?.toLowerCase() || "items"} found`
        }
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={getModalTitle()}
        size={modalType === "delete" ? "md" : config.modalSize || "lg"}
        closeOnOverlayClick={
          modalType !== "delete" &&
          !createMutation.isPending &&
          !updateMutation.isPending &&
          !deleteMutation.isPending
        }
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};
