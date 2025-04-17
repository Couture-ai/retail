import { Box, Tooltip } from '@chakra-ui/react';
import { ContentCopyOutlined } from '@mui/icons-material';
import { useState } from 'react';

const CopyText = ({ text, ...styles }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopy = async (text) => {
    try {
      // Fallback using a temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Prevent scrolling to the bottom
      textarea.style.opacity = '0'; // Hide textarea
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const success = document.execCommand('copy');
      if (!success) {
        throw new Error('Fallback copy failed');
      }
      document.body.removeChild(textarea);

      // Show tooltip
      setCopied(true);
      setTooltipOpen(true);

      // Automatically close tooltip after 2 seconds
      setTimeout(() => {
        setTooltipOpen(false);
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy failed: ', error);
      alert('Failed to copy text. Please try again.');
    }
  };

  return (
    <Tooltip
      isOpen={tooltipOpen}
      fontSize={'12px'}
      label={!copied ? 'Copy' : 'Copied ✓'}
      borderRadius={'4px'}>
      <Box
        style={{ ...styles }}
        onMouseEnter={() => setTooltipOpen(true)} // Show tooltip on hover
        onMouseLeave={() => !copied && setTooltipOpen(false)} // Hide only if not copied
        onClick={() => {
          handleCopy(text);
        }}>
        <ContentCopyOutlined style={{ color: '#999', cursor: 'pointer', fontSize: '13px' }} />
      </Box>
    </Tooltip>
  );
};
export default CopyText;
