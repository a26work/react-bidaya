import { useMemo } from 'react';

export const useTransformedData = (data, fields, formRelationshipData) => {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map(item => {
      const displayItem = { ...item };
      
      fields.forEach(field => {
        if (field.relationshipEndpoint && item[field.key] !== undefined) {
          const relationshipInfo = formRelationshipData[field.key];
          
          if (relationshipInfo && relationshipInfo.options) {
            const matchingOption = relationshipInfo.options.find(
              option => option.value == item[field.key]
            );
            
            if (matchingOption) {
              displayItem[field.key] = matchingOption.label;
            }
          }
        }
      });
      
      return displayItem;
    });
  }, [data, fields, formRelationshipData]);
};