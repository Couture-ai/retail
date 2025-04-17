import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useTheme
} from '@chakra-ui/react';

const Dialog = (props) => {
  const theme = useTheme();
  return (
    <Modal isOpen={props.open} onClose={props.onClose} size={props.size ? props.size : '6xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.header ? props.header : null}</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody w="100%">{props.children ? props.children : null}</ModalBody>
        <Divider />
        {props.isFooter === null || props.isFooter ? (
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={props.onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              style={{
                transition: 'background-color 0.3s',
                backgroundColor: `${theme.colors.primary.main}`,
                '&:hover': {
                  backgroundColor: `${theme.colors.primary.main}`
                }
              }}
              onClick={() => {
                props.handleSubmit();
                props.onClose();
              }}>
              Submit
            </Button>
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default Dialog;
