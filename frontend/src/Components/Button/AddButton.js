import { Button } from '@chakra-ui/react';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const AddButton = (props) => {
  return (
    <Button
      leftIcon={<AddIcon />}
      variant={props.variant ? props.variant : 'primary'}
      size={props.size ? props.size : 'sm'}
      {...props}>
      {props.text}
    </Button>
  );
};

export default AddButton;
