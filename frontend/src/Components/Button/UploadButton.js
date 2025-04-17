import UploadRounded from '@mui/icons-material/UploadRounded';
import React from 'react';
import { Button } from '@chakra-ui/react';

const UploadButton = (props) => {
  return (
    <Button
      leftIcon={<UploadRounded />}
      variant={props.variant ? props.variant : 'outline'}
      size={props.size ? props.size : 'sm'}
      {...props}>
      {props.text}
    </Button>
  );
};

export default UploadButton;
