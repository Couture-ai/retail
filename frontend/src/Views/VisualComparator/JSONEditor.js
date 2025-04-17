import React, { lazy, Suspense, useContext, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useTheme
} from '@chakra-ui/react';
import { ThemeContext } from '../../Contexts/ThemeContext';

const AceEditor = lazy(() => import('react-ace'));

const JSONEditor = ({ value, setValue, savedValue, setSavedValue, isOpen, onClose, title }) => {
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent color={theme.colors.secondary.color} bg={theme.colors.secondary.background}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Suspense fallback={<div>Loading editor...</div>}>
            <AceEditor
              mode="json"
              theme={themeMode === 'light' ? 'github' : 'github_dark'}
              value={value}
              onChange={(v) => setValue(v)}
              name="json-editor"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2
              }}
              style={{ width: '100%', height: '60vh' }}
            />
          </Suspense>
        </ModalBody>
        <ModalFooter gap="10px">
          <Button
            onClick={() => {
              setValue(savedValue);
              onClose();
            }}
            style={{
              height: '30px',
              borderRadius: '5px',
              border: `1px solid ${theme.colors.sleekButton.border}`,
              color: theme.colors.sleekButton.text,
              backgroundColor: theme.colors.tertiary.background,
              fontSize: '13px',
              boxShadow: 'none',
              fontWeight: '600'
            }}>
            Discard
          </Button>
          <Button
            onClick={() => {
              setSavedValue(value);
              onClose();
            }}
            style={{
              height: '30px',
              borderRadius: '5px',
              border: `1px solid ${theme.colors.sleekButton.border}`,
              color: theme.colors.sleekButton.text,
              backgroundColor: theme.colors.tertiary.background,
              fontSize: '13px',
              boxShadow: 'none',
              fontWeight: '600'
            }}>
            <span style={{ color: 'green', marginRight: '5px' }}>Save</span> Dev Parameters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JSONEditor;
