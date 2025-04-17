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
  Thead,
  Th,
  Table,
  Tbody,
  Tr,
  Td,
  Checkbox,
  Input,
  IconButton
} from '@chakra-ui/react';

import {
  AddOutlined,
  ApiOutlined,
  ArrowDropDown,
  AvTimerOutlined,
  DeleteOutline,
  DoDisturbAltOutlined,
  FileUploadOutlined,
  FilterAltOutlined,
  FormatOverlineOutlined,
  NoteAddOutlined,
  Search,
  SearchOutlined,
  SubdirectoryArrowRightOutlined,
  SyncAltOutlined,
  TroubleshootOutlined,
  TuneOutlined
} from '@mui/icons-material';

import React, { useContext, useEffect, useRef, useState } from 'react';
import ConfigSearchBar from './SearchBar';
import { AuthContext } from '../../../Contexts/AuthContext';
import { useParams } from 'react-router-dom';
import AttributesRepository from '../../../repositories/attributes';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import EmptyBlockPrmopt from '../Components/EmptyBlockPrompt';
import LearnMoreButton from '../Components/LearnMore';
import BulkUploadModal from '../Components/BulkUploadModal';
import ExportButton from '../Components/ExportButton';
const STUDIO_URL = import.meta.env.VITE_API_STUDIO_URL + '/retailstudio';
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
const AttributesList = (props) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger click on the hidden file input
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Selected file:', files[0]);
      setFile(files[0]);
      // Perform any further actions with the selected file
    } else {
      console.log(files);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
  const btnRef = useRef();
  const [input, setInput] = useState('');
  const { appName } = useParams();
  const [attributesState, setAttributesState] = useState({
    attributes: {},
    loading: false,
    error: null
  });
  const [inputAttributes, setInputAttributes] = useState([
    {
      name: '',
      data_type: '',
      searchable: false,
      retrievable: false,
      facetable: false,
      filterable: false
    }
  ]);

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

  return (
    <>
      <Flex w="100%" direction="column" gap="20px">
        <Text fontSize="14px" color={`1px solid ${theme.colors.secondary.colorGray}`}>
          The Attributes section lets you configure product attributes for search, filtering, and
          facets, ensuring relevant results. Define searchable fields, refine filters, and tailor
          facets to optimize user experience and discoverability. <LearnMoreButton />
        </Text>
        <ConfigSearchBar input={input} setInput={setInput} placeholder={'Search Attributses'} />
        <Flex w="100%">
          <Menu closeOnSelect={false}>
            {({ onClose }) => {
              return (
                <>
                  {/* <Tooltip hasArrow placement="bottom" label="Change View"> */}
                  <MenuButton
                    variant="outline"
                    //   size="sm"
                    border="1px solid #bbb"
                    borderRadius={'50%'}
                    icon={<NoteAddOutlined style={{ color: '#7b7aa5', fontSize: '20px' }} />}
                    //   variant="outline"
                    as={Button}
                    size={'md'}
                    style={{
                      height: '30px',
                      borderRadius: '5px',
                      border: `1px solid ${theme.colors.sleekButton.border}`,
                      color: theme.colors.sleekButton.text,
                      backgroundColor: theme.colors.tertiary.background,
                      fontSize: '13px',

                      boxShadow: 'none',
                      fontWeight: '600'
                    }}
                    rightIcon={
                      <ArrowDropDown
                        style={{
                          color: '#5B646A',
                          fontSize: '20px'
                        }}
                      />
                    }
                    leftIcon={
                      <NoteAddOutlined
                        style={{
                          color: '#5B646A',
                          fontSize: '14px'
                        }}
                      />
                    }
                    aria-label="Options">
                    Add attribute
                  </MenuButton>
                  {/* </Tooltip> */}
                  <MenuList
                    gap="5px"
                    padding="5px 5px"
                    borderColor={theme.colors.tertiary.border}
                    bg={theme.colors.secondary.background}
                    color={theme.colors.secondary.color}
                    minWidth={'300px'}>
                    {/* <MenuItem
                      _hover={{
                        bg: theme.colors.tertiary.hover
                      }}
                      bg={theme.colors.secondary.background}
                      color={theme.colors.secondary.color}
                      padding="10px 10px"
                      borderRadius="5px"
                      onClick={() => {
                        onOpen();
                      }}
                      gap="10px">
                      <AddOutlined style={{ fontSize: '15px' }} />

                      <Text ml="10px" fontSize="13px">
                        Add Attributes Manually
                      </Text>
                      <Spacer />
                    </MenuItem> */}
                    <MenuItem
                      _hover={{
                        bg: theme.colors.tertiary.hover
                      }}
                      bg={theme.colors.secondary.background}
                      color={theme.colors.secondary.color}
                      padding="10px 10px"
                      borderRadius="5px"
                      onClick={() => {
                        // setView(key);
                        // onClose();
                        onBulkOpen();
                      }}
                      gap="10px">
                      <FileUploadOutlined style={{ fontSize: '15px' }} />
                      <Text ml="10px" fontSize="13px">
                        Upload File
                      </Text>
                      <Spacer />
                    </MenuItem>
                  </MenuList>
                </>
              );
            }}
          </Menu>
          <Spacer />
          <ExportButton
            data={Object.values(attributesState.attributes)}
            filename="attributes"
            loading={attributesState.loading}
          />
        </Flex>
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
            {Object.keys(attributesState.attributes).length == 0 ? (
              <EmptyBlockPrmopt
                mt="100px"
                headline={'No Attributes found'}
                description={'Add attributes to your dataset'}
                Icon={FormatOverlineOutlined}
              />
            ) : null}
            {Object.keys(attributesState.attributes)
              .filter((e) => e.toLowerCase().includes(input.toLowerCase()))
              .map((e, index) => {
                return (
                  <Flex
                    w="100%"
                    p="10px 10px"
                    borderLeft={`1px solid ${theme.colors.tertiary.border}`}
                    borderRight={`1px solid ${theme.colors.tertiary.border}`}
                    borderTop={`1px solid ${theme.colors.tertiary.border}`}
                    borderBottom={
                      index ==
                      Object.keys(attributesState.attributes).filter((e) =>
                        e.toLowerCase().includes(input.toLowerCase())
                      ).length -
                        1
                        ? theme.colors.tertiary.border
                        : '0px solid #D6DBDE'
                    }
                    _hover={{ backgroundColor: theme.colors.tertiary.background }}
                    fontSize={'14px'}
                    cursor="pointer"
                    alignItems={'center'}
                    borderRadius={'0px'}
                    color={theme.colors.tertiary.color}
                    key={index}>
                    {input != '' ? highlight(e, input, theme.colors.link.bg) : e}
                    <Spacer />
                    {/* {attributesState.attributes[e].searchable ? (
                      <Flex
                        color="#A7571A"
                        bg="#FFF0E3"
                        alignItems={'center'}
                        p="5px 10px"
                        fontWeight={'bold'}
                        gap="5px"
                        fontSize={'11px'}
                        borderRadius={'10px'}>
                        <Search style={{ color: '#A7571A', fontSize: '14px' }} />
                        Searchable
                      </Flex>
                    ) : null} */}
                  </Flex>
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
        <ModalContent
          bg={theme.colors.secondary.background}
          color={theme.colors.secondary.color}
          minW="1200px"
          maxW="1200px"
          w="1200px">
          <ModalHeader>
            <Text fontWeight={'bold'} fontSize={'18px'}>
              Add Attributes
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="1150px" gap="10px" maxW="1200px" direction={'column'}>
              <Text>
                Enter attribute names and Data types. Click on check/wrong cells to toggle the
                values.
              </Text>
              <Table
                // make fixed
                sx={{
                  '*': {
                    borderColor: `${theme.colors.tertiary.border} !important`,
                    color: `${theme.colors.tertiary.color} !important`
                  }
                }}
                style={{
                  tableLayout: 'fixed',
                  width: '100%'
                }}>
                <Thead>
                  <Tr>
                    <Th colSpan={2}>Attribute Name</Th>
                    <Th colSpan={2}>Data Type</Th>
                    <Th>Searchable</Th>
                    <Th>Retrievable</Th>
                    <Th>Facetable</Th>
                    <Th>Filterable</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inputAttributes.map((attribute, index) => {
                    return (
                      <Tr key={index}>
                        <Td colSpan={2}>
                          <Input
                            bg={theme.colors.tertiary.background}
                            _focus={{
                              backgroundColor: 'white !important'
                            }}
                            _hover={{
                              backgroundColor: `${theme.colors.tertiary.background} !important`
                            }}
                            border={`1px solid ${theme.colors.inputBorder.main}`}
                            borderRadius={'5px'}
                            h="30px"
                            fontSize={'13px'}
                            w="100%"
                            placeholder={'Attribute Name'}
                            value={attribute.name}
                            onChange={(e) => {
                              inputAttributes[index].name = e.target.value;
                              setInputAttributes([...inputAttributes]);
                            }}
                          />
                        </Td>
                        <Td colSpan={2}>
                          <Input
                            bg={theme.colors.tertiary.background}
                            _focus={{
                              backgroundColor: 'white !important'
                            }}
                            _hover={{
                              backgroundColor: `${theme.colors.tertiary.background} !important`
                            }}
                            border={`1px solid ${theme.colors.inputBorder.main}`}
                            borderRadius={'5px'}
                            h="30px"
                            fontSize={'13px'}
                            w="100%"
                            placeholder={'Attribute Type'}
                            value={attribute.data_type}
                            onChange={(e) => {
                              inputAttributes[index].data_type = e.target.value;
                              setInputAttributes([...inputAttributes]);
                            }}
                          />
                        </Td>
                        {['searchable', 'retrievable', 'facetable', 'filterable'].map(
                          (key, ind) => {
                            return (
                              <Td
                                cursor="pointer"
                                key={ind}
                                _hover={{
                                  backgroundColor: theme.colors.tertiary.hover
                                }}
                                alignItems={'center'}
                                onClick={() => {
                                  inputAttributes[index][key] = !inputAttributes[index][key];
                                  setInputAttributes([...inputAttributes]);
                                }}>
                                {inputAttributes[index][key] ? (
                                  <CheckIcon fontSize={'12px'} color="green" />
                                ) : (
                                  <CloseIcon fontSize={'12px'} color="red" />
                                )}
                              </Td>
                            );
                          }
                        )}
                        <Td>
                          <IconButton
                            boxShadow={'none'}
                            size="sm"
                            bg="white"
                            color="#ddd"
                            _hover={{
                              backgroundColor: 'white'
                            }}
                            border={`1px solid ${theme.colors.tertiary.border}`}
                            icon={<DeleteOutline style={{ fontSize: '13px' }} />}
                            onClick={() => {
                              setInputAttributes(
                                inputAttributes.filter((e, i) => {
                                  return i != index;
                                })
                              );
                            }}
                            fontSize="14px"></IconButton>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              <Button
                size="sm"
                style={{
                  height: '30px',
                  borderRadius: '5px',
                  border: `1px solid ${theme.colors.sleekButton.border}`,
                  color: theme.colors.sleekButton.text,
                  backgroundColor: theme.colors.tertiary.background,
                  fontSize: '13px',

                  boxShadow: 'none',
                  fontWeight: '600'
                }}
                onClick={() => {
                  setInputAttributes([...inputAttributes, { name: '', searchable: true }]);
                }}
                fontSize="14px">
                Add Row
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              fontSize="14px"
              onClick={() => {
                setInputAttributes({
                  name: '',
                  data_type: '',
                  searchable: false,
                  retrievable: false,
                  facetable: false,
                  filterable: false
                });
                onClose();
              }}
              _hover={{
                backgroundColor: `${theme.colors.tertiary.hover} !important`
              }}
              style={{
                backgroundColor: theme.colors.tertiary.background,
                border: `1px solid ${theme.colors.tertiary.border}`,

                color: theme.colors.tertiary.color,
                borderRadius: '5px',
                boxShadow: 'none',
                fontSize: '14px'
              }}
              variant="outline"
              border={`1px solid ${theme.colors.tertiary.border}`}>
              Discard & Close
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
      <Modal
        onClose={onBulkClose}
        finalFocusRef={btnRef}
        isOpen={isBulkOpen}
        scrollBehavior={'inside'}
        isCentered>
        <ModalOverlay />
        <ModalContent minW="1200px" maxW="1200px" w="1200px" minH="600px">
          <ModalHeader>
            <Text fontWeight={'bold'} fontSize={'18px'}>
              Add Attributes File
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="1150px" gap="10px" maxW="1200px" direction={'row'} h="100%">
              <Flex h="100%" flex="1" direction="column" w="50%" gap="30px" minH="500px">
                <Flex direction="column" gap="10px">
                  <Text>JSON File Format</Text>
                  <Text
                    bg="#FEFFE0"
                    p="5px"
                    style={{
                      wordBreak: 'break-all',
                      wordWrap: 'break-word'
                    }}>
                    {/* <pre> */}[
                    {JSON.stringify({
                      name: '',
                      data_type: '',
                      searchable: false,
                      retrievable: false,
                      facetable: false,
                      filterable: false
                    })}
                    , ... ]{/* </pre> */}
                  </Text>
                </Flex>
                <Flex direction="column" w="100%" gap="10px">
                  <Text>CSV File Format</Text>
                  <Text bg="#FEFFE0" p="5px">
                    <div>name,data_type,searchable,retrievable,facetable,filterable</div>
                    <div>attrubite_name,string,true,true,true,true</div>
                  </Text>
                </Flex>
              </Flex>
              <Flex
                minH="500px"
                h="100%"
                border="1px solid #eee"
                borderRadius={'20px'}
                flex="1"
                w="50%"
                alignItems={'center'}
                justifyContent={'center'}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {/* Custom button */}
                {file == null ? (
                  <Button
                    size="sm"
                    style={{
                      height: '30px',
                      borderRadius: '5px',
                      border: `1px solid ${theme.colors.sleekButton.border}`,
                      color: theme.colors.sleekButton.text,
                      backgroundColor: theme.colors.tertiary.background,
                      fontSize: '13px',

                      boxShadow: 'none',
                      fontWeight: '600'
                    }}
                    onClick={handleButtonClick}>
                    Upload File
                  </Button>
                ) : (
                  <Flex display={'column'} gap="10px" alignItems={'center'}>
                    <Text>{file.name}</Text>
                    <Flex gap="10px" justifyContent={'center'}>
                      <Button
                        size="sm"
                        style={{
                          height: '30px',
                          borderRadius: '5px',
                          border: `1px solid ${theme.colors.sleekButton.border}`,
                          color: theme.colors.sleekButton.text,
                          backgroundColor: theme.colors.tertiary.background,
                          fontSize: '13px',

                          boxShadow: 'none',
                          fontWeight: '600'
                        }}
                        onClick={() => {
                          setFile(null);
                          fileInputRef.current.value = null;
                        }}>
                        Delete File
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              fontSize="14px"
              onClick={() => {
                setInputAttributes([
                  {
                    name: '',
                    data_type: '',
                    searchable: false,
                    retrievable: false,
                    facetable: false,
                    filterable: false
                  }
                ]);
                onBulkClose();
              }}
              variant="outline"
              border={`1px solid ${theme.colors.tertiary.border}`}>
              Discard & Close
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
      <BulkUploadModal
        isBulkOpen={isBulkOpen}
        onBulkClose={onBulkClose}
        handleFileSubmit={() => {}}
      />
    </>
  );
};

export default AttributesList;
