import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useMemo } from 'react';

export const AuthProvider = ({ role, setRole, children }) => {
  //   const expiry = user?.profile?.exp || 0;

  const token = localStorage.getItem('access_token');
  console.log('current token', token);
  let roles;
  try {
    roles = JSON.parse(localStorage.getItem('roles'));
  } catch (e) {
    roles = [];
  }

  axios.interceptors.request.use((config) => {
    if (config.headers.Authorization === null || config.headers.Authorization === undefined) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('role');
        localStorage.removeItem('roles');
        localStorage.removeItem('resources');
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        window.location.href = `${import.meta.env.VITE_ROUTE_PREFIX}/login`;
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  const value = useMemo(() => ({ role, setRole, roles }), [role, setRole, roles]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
