import { useTranslation } from './useTranslation';

export const useFilterTypes = () => {
  const { t } = useTranslation(); 
  return {
    text: {
      type: "text",
      placeholder: t("search"),
    },

    select: {
      type: "select",
      options: [],
    },

    relationshipSelect: {
      type: "select",
      relationshipEndpoint: null,
      relationshipValueKey: "id",
      relationshipLabelKey: "name",
      relationshipLimit: 1000,
    },

    date: {
      type: "date",
    },

    dateRange: {
      type: "date",
      isRange: true,
    },

    number: {
      type: "number",
    },

    numberRange: {
      type: "number",
      isRange: true,
    },
  };
};