/* eslint-disable no-unused-vars */
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import papa from 'papaparse';
const CSVViewer = ({ isOpen, onOpen, onClose, file, name }) => {
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  var data = file == null ? { data: {} } : papa.parse(file);
  const theme = useTheme();
  return (
    <Modal scrollBehavior={'inside'} onClose={onClose} size={'xl'} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent maxW="1000px">
        <ModalHeader position={'sticky'} fontSize={'15px'}>
          {name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {file == null ? (
            'No file selected'
          ) : (
            <TableContainer maxHeight={'600px'} overflowY={'scroll'}>
              <Table size="sm">
                <Thead position={'sticky'}>
                  <Tr>
                    {data.data[0].map((header) => {
                      return (
                        <Th colSpan={1} key={header}>
                          {header}
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.data.slice(1).map((row, id) => {
                    return (
                      <Tr key={id}>
                        {row.map((cell) => {
                          return (
                            <Td
                              colSpan={1}
                              style={{
                                wordWrap: 'break-word'
                              }}
                              key={cell}>
                              {cell}
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            style={{
              borderRadius: '5px',
              backgroundColor: 'white',
              border: `1px solid ${theme.colors.secondary.colorGray}`,
              color: theme.colors.secondary.colorGray,
              boxShadow: 'none'
            }}
            onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default CSVViewer;
