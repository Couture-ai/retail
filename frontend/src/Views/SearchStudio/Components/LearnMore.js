// import { Button } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { LaunchOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LearnMoreButton = ({ url, text }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <span
      onClick={() => {
        navigate(import.meta.env.VITE_ROUTE_PREFIX + url);
      }}
      style={{
        color: theme.colors.link.text,
        fontSize: '14px',
        marginLeft: '5px',
        fontWeight: '500',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer'
      }}>
      {text ?? 'Learn More'}
      <LaunchOutlined style={{ fontSize: '13px', marginLeft: '5px' }} />
    </span>
  );
};
export default LearnMoreButton;
