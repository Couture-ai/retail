import React from "react"; // Removed useState, useEffect as it's controlled now
import Editor, { Monaco } from "@monaco-editor/react";
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'; // Import types

type CodeEditorProps = {
  fileId: string;
  filename: string;
  content: string; // Content is now required and controlled by parent
  onChange: (value: string | undefined) => void; // Callback to update parent state
};

// Map file extensions to Monaco language identifiers
const getLanguageFromFilename = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js': return 'javascript';
    case 'jsx': return 'javascript'; // Monaco often uses 'javascript' for JSX too, or configure JSX support
    case 'ts': return 'typescript';
    case 'tsx': return 'typescript'; // Monaco often uses 'typescript' for TSX too, or configure TSX support
    case 'json': return 'json';
    case 'css': return 'css';
    case 'html': return 'html';
    case 'py': return 'python';
    case 'md': return 'markdown';
    // Add more mappings as needed
    default: return 'plaintext';
  }
};

// Simple placeholder content based on language
const getPlaceholderContent = (language: string, filename: string): string => {
  switch (language) {
    case 'javascript': return `// ${filename}\n\nconsole.log('Hello from ${filename}');\n`;
    case 'typescript': return `// ${filename}\n\nconst message: string = "Hello from ${filename}";\nconsole.log(message);\n`;
    case 'json': return `{}\n`;
    case 'css': return `/* ${filename} */\n\nbody {\n  margin: 0;\n}\n`;
    case 'html': return `<!-- ${filename} -->\n\n<!DOCTYPE html>\n<html>\n<head>\n  <title>${filename}</title>\n</head>\n<body>\n  <h1>${filename}</h1>\n</body>\n</html>\n`;
    default: return `// Content for ${filename}\n`;
  }
};

const CodeEditor = ({ fileId, filename, content, onChange }: CodeEditorProps) => {
  const language = getLanguageFromFilename(filename);

  // Use placeholder only if the provided content is truly empty/undefined
  // Note: If a file genuinely starts empty, this placeholder will appear.
  // We might want a different strategy if distinguishing between
  // 'not loaded yet' and 'intentionally empty' becomes important.
  const displayContent = content === undefined || content === null || content === '' 
                         ? getPlaceholderContent(language, filename)
                         : content;

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  const handleEditorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    console.log("Monaco editor mounted for file:", fileId);
    // editor.focus(); // Optionally focus editor on mount
  };

  return (
    <div className="flex-1 overflow-hidden w-full h-full"> 
      <Editor
        key={fileId} // Ensure editor remounts when fileId changes
        height="100%"
        width="100%" 
        language={language}
        theme="vs-dark"
        value={displayContent} // Use the potentially placeholder content
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
