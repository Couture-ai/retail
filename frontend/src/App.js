import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Views/Home/Home';
import Login from './Views/Login/Login';
import { Box, ChakraProvider } from '@chakra-ui/react';
import themeLight from './theme';
import themeDark from './themeDark';
import { ThemeProvider, createTheme } from '@mui/material';
import SearchStudio from './Views/SearchStudio/Main';
import Documentation from './Views/Documentation/Documentation';
// import { AuthContext } from './Contexts/AuthContext';
import ProtectedRoute from './Views/ProtectedRoute';
import { ThemeContext } from './Contexts/ThemeContext';
// import ApiDocs from './Views/Documentation/redoc/data_ingestion/Redoc';
import MarkdownViewer from './Views/Documentation/content/Markdown';
import { AuthProvider } from './Contexts/AuthProvider';
const VITE_ROUTE_PREFIX = import.meta.env.VITE_ROUTE_PREFIX;
const App = () => {
  console.log(import.meta.env);
  const [loading, setLoading] = useState(true);
  const [isCollapsed] = useState(true);
  const [role, setRole] = useState(null);
  const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setRole(role);
    }
    localStorage.setItem('theme', themeMode);
    setLoading(false);
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FF0000'
      },
      secondary: {
        main: '#675cfd'
      }
    }
  });
  useEffect(() => {
    const preventOverscroll = (event) => {
      if (event.target === document.body) {
        event.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', preventOverscroll, { passive: false });

    return () => {
      document.body.removeEventListener('touchmove', preventOverscroll);
    };
  }, []);
  useEffect(() => {
    document.body.style.backgroundColor = themeMode == 'light' ? 'white' : 'black';
  }, [themeMode]);

  const currentRoute = window.location.pathname;
  return (
    <ChakraProvider theme={themeMode == 'light' ? themeLight : themeDark}>
      {/* {window.location.pathname !== `${VITE_ROUTE_PREFIX}/login` ? ( */}
      {loading ? null : (
        <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
          <AuthProvider role={role} setRole={setRole}>
            <Box component="main" bg="white">
              <Routes>
                <Route
                  path={`${VITE_ROUTE_PREFIX}/login`}
                  element={<Login rerouteURL={currentRoute} />}
                />
                <Route
                  exact
                  path={`${VITE_ROUTE_PREFIX}/home`}
                  element={
                    <ThemeProvider theme={theme}>
                      <Home isCollapsed={isCollapsed} role={localStorage.getItem('role')} />
                    </ThemeProvider>
                  }
                />
                {/* <Route exact path={`${VITE_ROUTE_PREFIX}/data-ingestion`} element={<ApiDocs />} /> */}
                <Route exact path={`${VITE_ROUTE_PREFIX}/markdown`} element={<MarkdownViewer />} />
                <Route
                  exact
                  path={`${VITE_ROUTE_PREFIX}`}
                  element={
                    <ThemeProvider theme={theme}>
                      <Home isCollapsed={isCollapsed} role={localStorage.getItem('role')} />
                    </ThemeProvider>
                  }
                />
              </Routes>

              <Routes>
                <Route
                  path={`${VITE_ROUTE_PREFIX}/retail-studio/:appName/*`}
                  element={
                    <ProtectedRoute>
                      <SearchStudio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`${VITE_ROUTE_PREFIX}/retail-studio/`}
                  element={
                    <ProtectedRoute>
                      <SearchStudio />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={`${VITE_ROUTE_PREFIX}/documentation/:headingName/:sectionName`}
                  element={<Documentation />}
                />
                <Route path={`${VITE_ROUTE_PREFIX}/documentation/*`} element={<Documentation />} />
              </Routes>
            </Box>
          </AuthProvider>
        </ThemeContext.Provider>
      )}
    </ChakraProvider>
  );
};

export default App;
