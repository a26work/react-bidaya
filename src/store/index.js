import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import themeSlice from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

