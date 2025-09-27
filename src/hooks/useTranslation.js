import { useSelector } from 'react-redux';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const currentLang = useSelector((state) => state.theme.language || 'en_US');
  
  const t = (key) => {
    return translations[currentLang]?.[key] || translations.en[key] || key;
  };
  
  return { t, currentLang };
};