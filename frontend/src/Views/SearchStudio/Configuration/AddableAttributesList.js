/* eslint-disable no-unused-vars */
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useTheme,
  Textarea,
  Skeleton,
  IconButton,
  CircularProgress,
  Tooltip
} from '@chakra-ui/react';
import {
  AddOutlined,
  ApiOutlined,
  ArrowDropDown,
  AvTimerOutlined,
  Check,
  DeleteOutline,
  DoDisturbAltOutlined,
  FileUploadOutlined,
  FilterAltOutlined,
  FormatOverlineOutlined,
  NoteAddOutlined,
  SearchOutlined,
  SubdirectoryArrowRightOutlined,
  SyncAltOutlined,
  TroubleshootOutlined,
  TuneOutlined
} from '@mui/icons-material';

import React, { useEffect, useRef, useState } from 'react';
import ConfigSearchBar from './SearchBar';
import AttributesRepository from '../../../repositories/attributes';
import { useParams } from 'react-router-dom';
import LearnMoreButton from '../Components/LearnMore';

const highlight = (text, highlight, color = '#E4EFFF') => {
  // split the text by the highlight text
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { backgroundColor: color, color: '#0C3DEC', fontWeight: 'bold' }
              : {}
          }>
          {part}
        </span>
      ))}
    </span>
  );
};
const DeletableAttributeRow = ({ attribute, pid, handleUpdate, last }) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  return (
    <Flex
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      w="100%"
      p="10px 10px"
      borderLeft={`1px solid ${theme.colors.tertiary.hover}`}
      borderRight={`1px solid ${theme.colors.tertiary.hover}`}
      borderTop={`1px solid ${theme.colors.tertiary.hover}`}
      borderBottom={last ? `1px solid ${theme.colors.tertiary.hover}` : null}
      _hover={{ backgroundColor: theme.colors.tertiary.background }}
      fontSize={'14px'}
      gap="5px"
      alignItems={'center'}
      borderRadius={'0px'}
      color={theme.colors.tertiary.color}>
      <Check style={{ color: 'green', fontSize: '14px' }} />
      {attribute.name}
      <Spacer />
      {hovered || loading ? (
        <IconButton
          p="0px"
          size="sm"
          boxSize={'10px'}
          boxShadow={'none'}
          color="#bbb"
          _hover={{
            color: 'red !important',
            backgroundColor: 'transparent'
          }}
          onClick={() =>
            handleUpdate({ ...attribute, [pid]: false }, attribute['id'], setLoading, setError)
          }
          border="none"
          bg="none"
          icon={
            !loading ? (
              <Tooltip
                fontSize="12px"
                placement="bottom"
                label="Remove attribute"
                borderRadius="5px">
                <DeleteOutline style={{ cursor: 'pointer', fontSize: '18px' }} />
              </Tooltip>
            ) : (
              <CircularProgress isIndeterminate size="18px" color="green" />
            )
          }>
          {' '}
        </IconButton>
      ) : null}
    </Flex>
  );
};
const AddableAttributeRow = ({ attribute, pid, handleUpdate, last }) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  return (
    <Flex
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      w="100%"
      p="10px 10px"
      borderLeft={`1px solid ${theme.colors.tertiary.hover}`}
      borderRight={`1px solid ${theme.colors.tertiary.hover}`}
      borderTop={`1px solid ${theme.colors.tertiary.hover}`}
      borderBottom={last ? `1px solid ${theme.colors.tertiary.hover}` : null}
      _hover={{ backgroundColor: theme.colors.tertiary.background }}
      fontSize={'14px'}
      gap="5px"
      alignItems={'center'}
      borderRadius={'0px'}
      color={theme.colors.tertiary.color}>
      <Check style={{ color: 'transparent', fontSize: '14px' }} />
      {attribute.name}
      {hovered || loading ? (
        <Button
          p="0px"
          size="sm"
          boxShadow={'none'}
          color="#bbb"
          _hover={{
            color: 'green !important',
            backgroundColor: 'transparent'
          }}
          onClick={() =>
            handleUpdate({ ...attribute, [pid]: true }, attribute['id'], setLoading, setError)
          }
          border={`1px solid ${theme.colors.tertiary.border}`}
          borderRadius={'5px'}
          fontSize={'12px'}
          padding="5px 10px"
          bg="none">
          {' '}
          {loading ? <CircularProgress isIndeterminate size="18px" color="green" /> : 'Add'}
        </Button>
      ) : null}
    </Flex>
  );
};
const AddableAttributesList = ({ name, pid, description }) => {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [hoveredSelected, setHoveredSelected] = useState(null);
  const [hoveredUnSelected, setHoveredUnSelected] = useState(null);
  const [input, setInput] = useState('');
  const [attributesState, setAttributesState] = useState({
    attributes: {},
    loading: false,
    error: null
  });
  const STUDIO_URL = import.meta.env.VITE_API_STUDIO_URL + '/retailstudio';
  const { appName } = useParams();

  const attributesRepository = new AttributesRepository(STUDIO_URL);

  useEffect(() => {
    attributesRepository
      .fetchAttributes({
        company_name: appName,
        stateSetters: {
          setData: (data) => setAttributesState({ ...attributesState, attributes: data }),
          setLoading: (loading) => setAttributesState({ ...attributesState, loading }),
          setError: (error) => setAttributesState({ ...attributesState, error })
        }
      })
      .then((attributes) => {
        if (attributes == null) {
          throw new Error('Attributes are null');
        }
        console.log(attributes);
        setAttributesState({ ...attributesState, attributes });
      })
      .catch(() => {});
  }, []);

  const handleUpdate = (attribute, attributeID, setLoading, setError) => {
    attributesRepository
      .updateAttribute({
        company_name: appName,
        stateSetters: {
          setData: () => {},
          setLoading: setLoading,
          setError: setError
        },
        attribute,
        attributeID
      })
      .then(() => {
        setAttributesState({
          ...attributesState,
          attributes: {
            ...attributesState.attributes,
            [attribute.name]: { ...attribute }
          }
        });
      });
  };
  return (
    <>
      <Flex w="100%" direction="column" gap="20px">
        <Text fontSize="14px" color={`1px solid ${theme.colors.secondary.colorGray}`}>
          {description}
          <LearnMoreButton url={'/documentation/configuration/attributes'} />
        </Text>
        <ConfigSearchBar input={input} setInput={setInput} placeholder={'Search Attributes'} />

        {attributesState.loading ? (
          <Flex w="100%" justifyContent="center" alignItems="center" gap="20px" direction="column">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                height="30px"
                w="100%"
                borderRadius={'5px'}
                colorScheme="orange"
              />
            ))}
          </Flex>
        ) : !attributesState.error ? (
          <Flex direction="column">
            {Object.keys(attributesState.attributes).filter(
              (e) => attributesState.attributes[e][pid]
            ).length == 0 ? (
              <Text fontSize="13px" color={`1px solid ${theme.colors.secondary.colorGray}`}>
                No {name} Found. Add {name} to get started.
              </Text>
            ) : (
              <Text color="grey" fontSize="13px" mb="20px">
                {
                  Object.keys(attributesState.attributes).filter(
                    (e) => attributesState.attributes[e][pid] == true
                  ).length
                }{' '}
                attributes are {pid}
              </Text>
            )}

            {Object.keys(attributesState.attributes)
              .filter((e) => attributesState.attributes[e][pid])
              .filter((e) => e.toLowerCase().includes(input.toLowerCase()))
              .map((e, index) => {
                return (
                  <DeletableAttributeRow
                    key={index}
                    last={
                      index ==
                      Object.keys(attributesState.attributes)
                        .filter((e) => attributesState.attributes[e][pid] == true)
                        .filter((e) => e.toLowerCase().includes(input.toLowerCase())).length -
                        1
                    }
                    attribute={attributesState.attributes[e]}
                    pid={pid}
                    handleUpdate={handleUpdate}
                  />
                );
              })}
          </Flex>
        ) : (
          <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Text>Error fetching attributes</Text>
          </Flex>
        )}
        <Text fontWeight={'bold'}>Available Attributes</Text>

        {attributesState.loading ? (
          <Flex w="100%" justifyContent="center" alignItems="center" gap="20px" direction="column">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                height="30px"
                w="100%"
                borderRadius={'5px'}
                colorScheme="orange"
              />
            ))}
          </Flex>
        ) : !attributesState.error ? (
          <Flex direction="column">
            {Object.keys(attributesState.attributes).filter(
              (e) => attributesState.attributes[e][pid] == false
            ).length == 0 ? (
              <Text fontSize="13px" color={`1px solid ${theme.colors.secondary.colorGray}`}>
                No Available attributes Found.
              </Text>
            ) : (
              <Text color="grey" fontSize="13px" mb="20px">
                {
                  Object.keys(attributesState.attributes).filter(
                    (e) => attributesState.attributes[e][pid] == false
                  ).length
                }{' '}
                Attributes Available
              </Text>
            )}
            {Object.keys(attributesState.attributes)
              .filter((e) => attributesState.attributes[e][pid] == false)
              .filter((e) => e.toLowerCase().includes(input.toLowerCase()))
              .map((e, index) => {
                return (
                  <AddableAttributeRow
                    key={index}
                    last={
                      index ==
                      Object.keys(attributesState.attributes)
                        .filter((e) => attributesState.attributes[e][pid] == false)
                        .filter((e) => e.toLowerCase().includes(input.toLowerCase())).length -
                        1
                    }
                    attribute={attributesState.attributes[e]}
                    pid={pid}
                    handleUpdate={handleUpdate}
                  />
                );
              })}
          </Flex>
        ) : (
          <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Text>Error fetching attributes</Text>
          </Flex>
        )}
      </Flex>
      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior={'inside'}
        isCentered>
        <ModalOverlay />
        <ModalContent minW="1000px" maxW="1000px" w="1000px">
          <ModalHeader>
            <Text fontWeight={'bold'} fontSize={'18px'}>
              Add Attributes
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="950px" gap="10px" maxW="1000px" direction={'column'}>
              <Text color="#999">
                Enter attribute names in comma separated format to add them to the list.
              </Text>
              <Textarea
                height={'400px'}
                noOfLines={10}
                placeholder="Type your stopwords here"
                w="100%"
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              fontSize="14px"
              onClick={onClose}
              variant="outline"
              border={`1px solid ${theme.colors.tertiary.border}`}>
              Close
            </Button>
            <Button _hover={{}} fontSize="14px" bg={theme.colors.button.successbg} color="white">
              Commit Attributes To Database
            </Button>
          </ModalFooter>
          {/* <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddableAttributesList;
