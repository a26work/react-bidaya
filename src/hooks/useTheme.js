import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  toggleTheme,
  setThemeMode,
  toggleDirection,
  setDirection,
  toggleLanguage,
  setLanguage,
  setPrimaryColor,
  toggleSidebar,
  setSidebarCollapsed,
  updateLanguage,
  clearLanguageError,
} from '../store/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleSetThemeMode = useCallback((mode) => {
    dispatch(setThemeMode(mode));
  }, [dispatch]);

  const handleToggleDirection = useCallback(() => {
    dispatch(toggleDirection());
  }, [dispatch]);

  const handleSetDirection = useCallback((direction) => {
    dispatch(setDirection(direction));
  }, [dispatch]);

  const handleToggleLanguage = useCallback(async () => {
    const newLanguage = theme.language === 'en_US' ? 'ar_001' : 'en_US';
    try {
      await dispatch(updateLanguage(newLanguage)).unwrap();
    } catch (error) {
      console.error('Failed to toggle language:', error);
      dispatch(toggleLanguage());
    }
  }, [dispatch, theme.language]);

  const handleSetLanguage = useCallback(async (language) => {
    try {
      await dispatch(updateLanguage(language)).unwrap();
    } catch (error) {
      console.error('Failed to set language:', error);
      dispatch(setLanguage(language));
    }
  }, [dispatch]);

  const handleClearLanguageError = useCallback(() => {
    dispatch(clearLanguageError());
  }, [dispatch]);

  const handleSetPrimaryColor = useCallback((color) => {
    dispatch(setPrimaryColor(color));
  }, [dispatch]);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleSetSidebarCollapsed = useCallback((collapsed) => {
    dispatch(setSidebarCollapsed(collapsed));
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Apply theme mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }

    // Apply direction
    root.setAttribute('dir', theme.direction);
    body.setAttribute('dir', theme.direction);
    
    // Apply language attribute
    root.setAttribute('lang', theme.language);
    body.setAttribute('lang', theme.language);
    
    // Apply primary color using CSS custom properties
    root.style.setProperty('--primary-50', theme.primaryColor === 'blue' ? '#eff6ff' : '#f0f9ff');
    root.style.setProperty('--primary-100', theme.primaryColor === 'blue' ? '#dbeafe' : '#e0f2fe');
    root.style.setProperty('--primary-500', theme.primaryColor === 'blue' ? '#3b82f6' : '#0ea5e9');
    root.style.setProperty('--primary-600', theme.primaryColor === 'blue' ? '#2563eb' : '#0284c7');
    root.style.setProperty('--primary-700', theme.primaryColor === 'blue' ? '#1d4ed8' : '#0369a1');

  }, [theme.mode, theme.direction, theme.language, theme.primaryColor]);

  return {
    ...theme,
    toggleTheme: handleToggleTheme,
    setThemeMode: handleSetThemeMode,
    toggleDirection: handleToggleDirection,
    setDirection: handleSetDirection,
    toggleLanguage: handleToggleLanguage,
    setLanguage: handleSetLanguage,
    setPrimaryColor: handleSetPrimaryColor,
    toggleSidebar: handleToggleSidebar,
    setSidebarCollapsed: handleSetSidebarCollapsed,
    clearLanguageError: handleClearLanguageError,
    updateLanguageAsync: (language) => dispatch(updateLanguage(language)),
  };
};