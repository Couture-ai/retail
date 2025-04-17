/* eslint-disable no-unused-vars */
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex
} from '@chakra-ui/react';

function LeftDrawer({ isOpen, onOpen, onClose, btnRef }) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerCloseButton /> */}
          <DrawerHeader alignItems={'center'}>
            <Flex w="100%" alignItems="center"></Flex>
          </DrawerHeader>

          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default LeftDrawer;
