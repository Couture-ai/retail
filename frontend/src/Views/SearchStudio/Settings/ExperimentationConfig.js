import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Flex, useTheme } from '@chakra-ui/react';
import { SaveAltOutlined } from '@mui/icons-material';
import { ThemeContext } from '../../../Contexts/ThemeContext';
import { AppContext } from '../../../Contexts/AppContext';
import UserRepository from '../../../repositories/auth';

// Lazy-load AceEditor
const AceEditor = lazy(() => import('react-ace'));

const ExpConfig = () => {
  const userRepository = new UserRepository(import.meta.env.VITE_API_STUDIO_URL + '/retailstudio');
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const { appName } = useParams();
  const { _apps } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);
  const [value, setValue] = useState(
    JSON.stringify(
      _apps.find((a) => a.roleName == appName),
      null,
      2
    )
  );
  const [savedValue, setSavedValue] = useState(
    JSON.stringify(
      _apps.find((a) => a.roleName == appName),
      null,
      2
    )
  );
  useEffect(() => {
    const loadAceModules = async () => {
      const ace = await import('ace-builds/src-noconflict/ace');
      ace.config.set(
        'basePath',
        `${import.meta.env.VITE_ROUTE_PREFIX}/node_modules/ace-builds/src-noconflict`
      );

      await import('ace-builds/src-noconflict/mode-json');
      await import('ace-builds/src-noconflict/mode-text');
      await import('ace-builds/src-noconflict/theme-github');
      await import('ace-builds/src-noconflict/theme-github_dark');
      await import('ace-builds/src-noconflict/ext-searchbox'); // Required for search functionality
    };

    loadAceModules();
  }, []);

  const onSave = () => {
    userRepository
      .uploadFile({
        stateSetters: {
          setLoading,
          setError,
          setData: () => {}
        },
        data: {
          name: 'searchops-' + appName,
          resources: value
        }
      })
      .then(() => {
        setSavedValue(value);
      });
  };

  return (
    <Flex direction="column" gap="10px">
      <Flex gap="10px">
        <Button
          variant="outline"
          size="md"
          style={{
            height: '30px',
            borderRadius: '5px',
            border:
              savedValue === value
                ? `1px solid ${theme.colors.sleekButton.border}`
                : `1px solid ${theme.colors.button.successbg}`,
            color: savedValue === value ? theme.colors.sleekButton.text : 'white',
            backgroundColor:
              savedValue === value
                ? theme.colors.tertiary.background
                : theme.colors.button.successbg,
            fontSize: '13px',
            boxShadow: 'none',
            fontWeight: '600'
          }}
          leftIcon={
            <SaveAltOutlined
              style={{
                color: savedValue === value ? theme.colors.sleekButton.text : 'white',
                fontSize: '15px'
              }}
            />
          }
          onClick={onSave}
          aria-label="Options">
          {loading ? <CircularProgress isIndeterminate size="13px" /> : 'Commit'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setValue(savedValue)}
          size="md"
          style={{
            height: '30px',
            borderRadius: '5px',
            border: `1px solid ${theme.colors.sleekButton.border}`,
            color: theme.colors.sleekButton.text,
            backgroundColor: theme.colors.tertiary.background,
            fontSize: '13px',
            boxShadow: 'none',
            fontWeight: '600'
          }}
          aria-label="Options">
          Discard
        </Button>
      </Flex>
      <Suspense fallback={<div>Loading editor...</div>}>
        <AceEditor
          mode="json"
          theme={themeMode === 'light' ? 'github' : 'github_dark'}
          value={value}
          onChange={(v) => setValue(v)}
          name="json-editor"
          setOptions={{
            useWorker: false,
            showLineNumbers: true,
            tabSize: 2
          }}
          style={{ width: '100%', height: '80vh' }}
        />
      </Suspense>
    </Flex>
  );
};

export default ExpConfig;
