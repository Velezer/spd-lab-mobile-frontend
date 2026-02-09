import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import api, { setLogoutCallback } from '../api/axiosInstance';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOADED':
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('userToken');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Register logout callback for axios interceptor
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  // Check token on app mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          dispatch({ type: 'LOADED' });
          return;
        }
        const response = await api.get('/api/auth/me');
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data,
            token,
          },
        });
      } catch {
        await SecureStore.deleteItemAsync('userToken');
        dispatch({ type: 'LOADED' });
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
      return true;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Tidak dapat terhubung ke server';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return false;
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
      return true;
    } catch (error) {
      const message =
        error.response?.data?.error || 'Tidak dapat terhubung ke server';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return false;
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isLoading: state.isLoading,
        isAuthenticated: !!state.token,
        error: state.error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
