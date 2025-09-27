import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, logoutUser, checkSession, clearError } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    async (username, password) => {
      const result = await dispatch(loginUser({ username, password }));
      return result.type === 'auth/loginUser/fulfilled';
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const initializeAuth = useCallback(async () => {
    // perform a single check session when called from a top-level gate
    await dispatch(checkSession());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearAuthError,
    initializeAuth,
  };
};