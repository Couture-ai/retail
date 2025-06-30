import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type FileEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

const FileEditor = ({ content, onChange }: FileEditorProps) => {
  const [editableContent, setEditableContent] = useState(content);
  const [isPreview, setIsPreview] = useState(false);
  
  useEffect(() => {
    setEditableContent(content);
  }, [content]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditableContent(value);
    onChange(value);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center bg-gray-800 border-b border-gray-700 px-4 py-2">
        <button
          onClick={() => setIsPreview(false)}
          className={`mr-4 px-3 py-1 text-sm rounded ${!isPreview ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          Edit
        </button>
        <button
          onClick={() => setIsPreview(true)}
          className={`px-3 py-1 text-sm rounded ${isPreview ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          Preview
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isPreview ? (
          <div className="p-8 prose prose-invert max-w-none">
            <ReactMarkdown>
              {editableContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="p-4 h-full">
            <textarea
              value={editableContent}
              onChange={handleContentChange}
              className="w-full h-full bg-gray-900 text-gray-100 p-4 resize-none border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              style={{
                fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileEditor;
