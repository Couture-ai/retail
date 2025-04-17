import React, { lazy, Suspense, useContext, useEffect, useRef } from 'react';
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

const JSONViewer = ({ value, isOpen, onClose, title }) => {
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const editorRef = useRef(null);

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
      await import('ace-builds/src-noconflict/ext-language_tools'); // For better code folding support
    };

    loadAceModules();
  }, []);

  // Apply folding when the editor is loaded and whenever value changes
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;

      // Wait for the content to be properly rendered
      setTimeout(() => {
        // Expand the first level
        editor.getSession().foldAll(1); // Start folding from depth 1

        // Make sure the top level is unfolded
        const session = editor.getSession();
        const foldWidgets = session.getFoldWidgets(0, session.getLength());

        // Unfold the first row if it's foldable
        if (foldWidgets[0] === 'start') {
          const range = session.getFoldWidgetRange(0);
          if (range) {
            session.expandFold(range);
          }
        }
      }, 100);
    }
  }, [value, isOpen]);

  const onEditorLoad = (editor) => {
    // Store the editor instance for later use
    if (editor) {
      editorRef.current = { editor };
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" minW="900px">
      <ModalOverlay />
      <ModalContent
        minW="900px"
        color={theme.colors.secondary.color}
        bg={theme.colors.secondary.background}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody w="100%">
          <Suspense fallback={<div>Loading editor...</div>}>
            <AceEditor
              mode="json"
              theme={themeMode === 'light' ? 'github' : 'github_dark'}
              value={value}
              name="json-editor"
              onLoad={onEditorLoad}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                useWorker: false,
                showLineNumbers: true,
                tabSize: 2,
                readOnly: true,
                showFoldWidgets: true, // Ensure fold widgets are visible
                fadeFoldWidgets: false
              }}
              style={{ width: '100%', height: '80vh' }}
            />
          </Suspense>
        </ModalBody>
        <ModalFooter gap="10px">
          <Button
            onClick={() => {
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
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JSONViewer;
