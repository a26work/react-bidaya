import { useTranslation } from './useTranslation';

export const useValidators = () => {
  const { t } = useTranslation(); 
  
  return useMemo(() => ({
    required: (value) => {
      if (!value || value === "") return t("field_required");
      return null;
    },

    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value))
        return t("invalid_email");
      return null;
    },

    minLength: (min) => (value) => {
      if (value && value.length < min)
        return t("min_length", { min: min });
      return null;
    },

    maxLength: (max) => (value) => {
      if (value && value.length > max)
        return t("max_length", { max: max });
      return null;
    },

    number: (value) => {
      if (value && isNaN(value)) return t("invalid_number");
      return null;
    },

    positiveNumber: (value) => {
      if (value && (isNaN(value) || parseFloat(value) <= 0))
        return t("positive_number_required");
      return null;
    },

    url: (value) => {
      try {
        if (value) new URL(value);
        return null;
      } catch {
        return t("invalid_url");
      }
    },

    phone: (value) => {
      const phoneRegex = /^[\d\s\-()]+$/;
      if (value && !phoneRegex.test(value))
        return t("invalid_phone");
      return null;
    },

    custom: (validatorFn) => validatorFn,
  }), [t]);
};