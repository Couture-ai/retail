/* eslint-disable no-unused-vars */
import { Flex, useTheme } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
// import nord from 'react-syntax-highlighter/dist/esm/styles/prism/nord';
// import duotoneLight from 'react-syntax-highlighter/dist/esm/styles/prism/duotone-light';

import { ThemeContext } from '../../../Contexts/ThemeContext';
// import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/github.css'; // Use any highlight.js theme
const MarkdownViewer = ({ path }) => {
  const [content, setContent] = useState('');
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);

  useEffect(() => {
    // Fetch the markdown file from the public folder
    fetch(path)
      .then(async (response) => {
        if (response.ok) {
          const text = await response.text();
          if (text.startsWith('<!')) {
            // return a future
            return Promise.resolve('Documentation for this section has not been added yet!');
          }
          return text;
        } else {
          console.log('DOES NOT EXIST');
        }
        throw new Error('Failed to fetch markdown file');
      })
      .then((text) => setContent(text))
      .catch((error) => console.error(error));
  }, []);

  const markdownStyles = {
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.6,
    backgroundColor: theme.colors?.secondary.background,
    borderRadius: '8px',
    '& h1, & h2, & h3': {
      color: theme.colors?.secondary.color,
      marginBottom: '5px'
    },
    '& h1': {
      fontSize: '20px',
      fontWeight: '600',
      margin: '20px 0 0 0'
    },
    '& h2': {
      fontSize: '18px',
      fontWeight: '600',
      margin: '15px 0 0 0',
      color: theme.colors?.secondary.colorH2
    },
    '& h3': {
      fontSize: '17px',
      fontWeight: '500',
      margin: '10px 0 0 0',
      color: theme.colors?.secondary.colorH3
    },

    '& p': {
      color: theme.colors?.secondary.colorP,
      marginBottom: '20px'
    },
    '& a': {
      color: '#3498db',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    '& code': {
      backgroundColor: theme.colors?.tertiary.background,
      color: '#e74c3c',
      padding: '2px 4px',
      borderRadius: '4px',
      fontFamily: 'Courier New, monospace'
    }
    // '& pre': {
    //   backgroundColor: theme.colors?.tertiary.hover,
    //   //   color: '#ecf0f1',
    //   padding: '10px',
    //   borderRadius: '6px',
    //   overflowX: 'auto'
    // }
  };

  return (
    <Flex w="100%" sx={markdownStyles} direction="column">
      {/* <ReactMarkdown
        urlTransform={(href) => {
          // console.log('href', href);
          if (href.startsWith('http')) {
            const url = new URL(href); // Parse the URL to modify its path
            const prefix = import.meta.env.VITE_PUBLIC_PREFIX;

            // Modify the path by adding the prefix
            url.pathname = `/${prefix}${url.pathname}`;
            return url.toString(); // Return the modified URL as a string
          }
          if (href.startsWith('/'))
            return `${window.location.origin}${
              import.meta.env.VITE_PUBLIC_PREFIX == ''
                ? ''
                : `/${import.meta.env.VITE_PUBLIC_PREFIX}`
            }${href}`;
          return `${window.location.origin}/${
            import.meta.env.VITE_PUBLIC_PREFIX == '' ? '' : `${import.meta.env.VITE_PUBLIC_PREFIX}/`
          }${href}`;
        }}
        components={
          {
            // code: ({ className, children, ...rest }) => {
            //   const match = /language-(\w+)/.exec(className || '');
            //   return match ? (
            //     <SyntaxHighlighter
            //       PreTag="div"
            //       language={match[1]}
            //       style={themeMode == 'dark' ? nord : duotoneLight}
            //       {...rest}>
            //       {children}
            //     </SyntaxHighlighter>
            //   ) : (
            //     <code {...rest} className={className}>
            //       {children}
            //     </code>
            //   );
            // }
          }
        }>
        {content}
      </ReactMarkdown> */}
      {content}
    </Flex>
  );
};

export default MarkdownViewer;
