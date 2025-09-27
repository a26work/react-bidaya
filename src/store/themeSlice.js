import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUserLanguage } from '../services/api';

export const updateLanguage = createAsyncThunk(
  'theme/updateLanguage',
  async (language, { rejectWithValue }) => {
    try {
      await updateUserLanguage(language);
      window.location.reload();
      return language;
    } catch (error) {
      console.error('Failed to update language in backend:', error);
      return rejectWithValue(error.response?.data || 'Failed to update language');
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: localStorage.getItem('theme-mode') || 'light', // light, dark
    direction: localStorage.getItem('theme-direction') || 'ltr', // ltr, rtl
    language: localStorage.getItem('theme-language') || 'en_US', // en, ar
    primaryColor: localStorage.getItem('theme-primary') || 'blue',
    sidebarCollapsed: localStorage.getItem('sidebar-collapsed') === 'true' || true,
    languageUpdateLoading: false,
    languageUpdateError: null,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', state.mode);
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme-mode', state.mode);
    },
    toggleDirection: (state) => {
      state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr';
      localStorage.setItem('theme-direction', state.direction);
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
      localStorage.setItem('theme-direction', state.direction);
    },
    toggleLanguage: (state) => {
      const newLanguage = state.language === 'en_US' ? 'ar_001' : 'en_US';
      const newDirection = newLanguage === 'ar_001' ? 'rtl' : 'ltr';
      
      state.language = newLanguage;
      state.direction = newDirection;
      
      localStorage.setItem('theme-language', state.language);
      localStorage.setItem('theme-direction', state.direction);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      // Auto-set direction based on language
      state.direction = action.payload === 'ar_001' ? 'rtl' : 'ltr';
      
      localStorage.setItem('theme-language', state.language);
      localStorage.setItem('theme-direction', state.direction);
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      localStorage.setItem('theme-primary', state.primaryColor);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebar-collapsed', state.sidebarCollapsed.toString());
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebar-collapsed', state.sidebarCollapsed.toString());
    },
    clearLanguageError: (state) => {
      state.languageUpdateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLanguage.pending, (state) => {
        state.languageUpdateLoading = true;
        state.languageUpdateError = null;
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.languageUpdateLoading = false;
        state.language = action.payload;
        // Auto-set direction based on language
        state.direction = action.payload === 'ar_001' ? 'rtl' : 'ltr';
        
        // Update localStorage
        localStorage.setItem('theme-language', state.language);
        localStorage.setItem('theme-direction', state.direction);
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.languageUpdateLoading = false;
        state.languageUpdateError = action.payload || 'Failed to update language';
      });
  },
});

export const {
  toggleTheme,
  setThemeMode,
  toggleDirection,
  setDirection,
  toggleLanguage,
  setLanguage,
  setPrimaryColor,
  toggleSidebar,
  setSidebarCollapsed,
  clearLanguageError,
} = themeSlice.actions;

export default themeSlice.reducer;