import { Button, useTheme } from '@chakra-ui/react';
import React from 'react';
import { CloudDownload } from '@mui/icons-material';

const DownloadButton = (props) => {
  const theme = useTheme();
  return (
    <Button
      leftIcon={<CloudDownload />}
      sx={{
        backgroundColor: `${theme.colors.primary.main}`,
        '&:hover': {
          backgroundColor: `${theme.colors.primary.main}`
        }
      }}
      variant={props.variant ? props.variant : 'primary'}
      size={props.size ? props.size : 'sm'}
      {...props}>
      {props.text ? props.text : 'Download All'}
    </Button>
  );
};

export default DownloadButton;
