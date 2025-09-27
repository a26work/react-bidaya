import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { apiService } from '../services/api';

export const useRelationshipData = (fieldConfig) => {
  const {
    relationshipEndpoint,
    relationshipValueKey = "id",
    relationshipLabelKey = "name",
    relationshipLimit = 1000,
  } = fieldConfig || {};

  const { data, isLoading, isError } = useQuery({
    queryKey: ["relationship", relationshipEndpoint],
    queryFn: () =>
      apiService.fetchItems(relationshipEndpoint, { per_page: relationshipLimit }),
    enabled: !!relationshipEndpoint, // Only run query if endpoint is provided
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  const processedData = useMemo(() => {
    if (!data) return { options: [], dataMap: new Map() };

    let items = [];
    if (data?.data?.data) items = data.data.data;
    else if (Array.isArray(data?.data)) items = data.data;
    else if (Array.isArray(data)) items = data;

    const options = items.map((item) => ({
      value: item[relationshipValueKey],
      label: item[relationshipLabelKey] || `Item ${item[relationshipValueKey]}`,
    }));

    const dataMap = new Map(
      items.map((item) => [item[relationshipValueKey], item])
    );

    return { options, dataMap };
  }, [data, relationshipValueKey, relationshipLabelKey]);

  const getDisplayValue = useCallback(
    (value) => {
      if (value === null || value === undefined) return null;
      const relatedItem = processedData.dataMap.get(value);
      return relatedItem ? relatedItem[relationshipLabelKey] : value;
    },
    [processedData.dataMap, relationshipLabelKey]
  );

  return { ...processedData, isLoading, isError, getDisplayValue };
};