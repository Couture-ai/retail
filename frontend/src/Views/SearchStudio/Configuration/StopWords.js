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
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverTrigger,
  Progress,
  useToast,
  CircularProgress,
  IconButton
} from '@chakra-ui/react';
import {
  AddOutlined,
  ApiOutlined,
  ArrowDropDown,
  AvTimerOutlined,
  Check,
  CloseOutlined,
  DoDisturbAltOutlined,
  DoNotDisturbAltOutlined,
  Edit,
  FileUploadOutlined,
  FilterAltOutlined,
  FormatOverlineOutlined,
  NoteAddOutlined,
  SaveAltOutlined,
  SearchOutlined,
  StopCircleOutlined,
  SubdirectoryArrowRightOutlined,
  SyncAltOutlined,
  TroubleshootOutlined,
  TuneOutlined,
  WarningOutlined
} from '@mui/icons-material';

import React, { useEffect, useRef, useState } from 'react';
import ConfigSearchBar from './SearchBar';
import LearnMoreButton from '../Components/LearnMore';
import BulkUploadModal from '../Components/BulkUploadModal';
import WordsRepository from '../../../repositories/words';
import { useParams } from 'react-router-dom';
import EmptyBlockPrmopt from '../Components/EmptyBlockPrompt';
import ExportButton from '../Components/ExportButton';

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
const StopWords = ({ name, description }) => {
  const theme = useTheme();
  const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { appName } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [words, setWords] = useState([]);
  const [editingWords, setEditingWords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState('');
  const wordRepository = new WordsRepository(import.meta.env.VITE_API_STUDIO_URL + '/retailstudio');
  const [upload, setUpload] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const _onClose = () => {
    setManualInput('');
    onClose();
  };
  const toast = useToast();
  useEffect(() => {
    wordRepository
      .fetchWords({
        company_name: appName,
        stateSetters: {
          setLoading: setLoading,
          setError: setError,
          setData: () => {}
        },
        data: {
          word: name
        }
      })
      .then((res) => {
        setWords(res);
        setEditingWords(res);
      });
  }, [name, upload]);
  const [uploading, setUploading] = useState(false);
  const [uploadingError, setUploadingError] = useState(null);
  const isEditingDifferent = words.join(',') !== editingWords.join(',');
  const uploadFile = async (file, content, mode, overwrite) => {
    try {
      await wordRepository.uploadFile({
        company_name: appName,
        stateSetters: {
          setLoading: setUploading,
          setError: setUploadingError,
          setData: () => {}
        },
        data: {
          word: name,
          file: file,
          content: content,
          mode: mode,
          overwrite: overwrite
        }
      });
      setUpload(upload + 1);
      toast({
        status: 'success',
        duration: 2000,
        position: 'top',
        render: () => (
          <Flex
            gap="10px"
            alignItems={'center'}
            fontSize={'14px'}
            fontWeight={'bold'}
            bg={'green'}
            color="white"
            borderRadius={'5px'}
            p="10px 20px"
            fontFamily={'Inter'}>
            <Check />
            Upload Successful
          </Flex>
        )
      });
    } catch (e) {
      toast({
        title: e.toString(),
        status: 'error',
        duration: 2000,
        position: 'top',
        render: () => (
          <Flex
            gap="10px"
            alignItems={'center'}
            fontSize={'14px'}
            fontWeight={'bold'}
            bg={'#FA5959'}
            color="white"
            borderRadius={'5px'}
            p="10px 20px"
            fontFamily={'Inter'}>
            <WarningOutlined />
            {e.toString()}
          </Flex>
        )
      });
    }
  };
  return (
    <>
      <Flex w="100%" direction="column" gap="20px">
        <Text fontSize="14px" color={`1px solid ${theme.colors.secondary.colorGray}`}>
          {description}
          <LearnMoreButton url={'/documentation/configuration/stop-optional-words'} />
        </Text>
        <Flex
          w="100%"
          gap="10px"
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: `1px solid ${theme.colors.tertiary.border}`,
            backgroundColor: theme.colors.tertiary.background,
            color: theme.colors.tertiary.color
          }}>
          <WarningOutlined style={{ color: theme.colors.highlightBorder.main, fontSize: '20px' }} />
          <Flex direction="column" gap="5px">
            <Text fontSize="14px" color={theme.colors.secondary.colorGray}>
              Changes to the {name} words configuration will take effect after the next indexing
              cycle, which is typically 7 days.
            </Text>
          </Flex>
        </Flex>
        <ConfigSearchBar input={input} setInput={setInput} placeholder={`Search ${name} Words`} />
        <Flex w="100%" gap="10px">
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
                    Add {name} Words
                  </MenuButton>
                  {/* </Tooltip> */}
                  <MenuList
                    gap="5px"
                    padding="5px 5px"
                    border={`1px solid ${theme.colors.tertiary.border}`}
                    bg={theme.colors.secondary.background}
                    color={theme.colors.secondary.color}
                    minWidth={'300px'}>
                    <MenuItem
                      padding="10px 10px"
                      _hover={{
                        bg: theme.colors.tertiary.hover
                      }}
                      bg={theme.colors.secondary.background}
                      color={theme.colors.secondary.color}
                      borderRadius="5px"
                      onClick={() => {
                        onOpen();
                      }}
                      gap="10px">
                      <AddOutlined style={{ fontSize: '15px' }} />

                      <Text ml="10px" fontSize="13px">
                        Add {name} Words Manually
                      </Text>
                      <Spacer />
                    </MenuItem>
                    <MenuItem
                      padding="10px 10px"
                      _hover={{
                        bg: theme.colors.tertiary.hover
                      }}
                      bg={theme.colors.secondary.background}
                      color={theme.colors.secondary.color}
                      borderRadius="5px"
                      onClick={() => {
                        onBulkOpen();
                        // setView(key);
                        // onClose();
                      }}
                      gap="10px">
                      <FileUploadOutlined style={{ fontSize: '15px' }} />
                      <Text ml="10px" fontSize="13px">
                        Upload or Edit File
                      </Text>
                      <Spacer />
                    </MenuItem>
                  </MenuList>
                </>
              );
            }}
          </Menu>
          <Spacer />
          {/* edit button */}
          {editMode == false ? (
            <Button
              onClick={() => setEditMode(true)}
              variant="outline"
              border={`1px solid ${theme.colors.sleekButton.border}`}
              borderRadius={'50%'}
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
              leftIcon={
                <Edit
                  style={{
                    color: '#5B646A',
                    fontSize: '14px'
                  }}
                />
              }
              aria-label="Options">
              Edit Mode
            </Button>
          ) : null}
          {editMode == true ? (
            <Flex gap="10px">
              <Button
                variant="outline"
                size="md"
                style={{
                  height: '30px',
                  borderRadius: '5px',
                  border: !isEditingDifferent
                    ? `1px solid ${theme.colors.sleekButton.border}`
                    : `1px solid ${theme.colors.button.successbg}`,
                  color: !isEditingDifferent ? theme.colors.sleekButton.text : 'white',
                  backgroundColor: !isEditingDifferent
                    ? theme.colors.tertiary.background
                    : theme.colors.button.successbg,
                  fontSize: '13px',
                  boxShadow: 'none',
                  fontWeight: '600'
                }}
                leftIcon={
                  <SaveAltOutlined
                    style={{
                      color: !isEditingDifferent ? theme.colors.sleekButton.text : 'white',
                      fontSize: '15px'
                    }}
                  />
                }
                onClick={() => {
                  uploadFile(null, `${name} words\n` + editingWords.join('\n'), 'csv', true);
                  setEditMode(false);
                }}
                aria-label="Options">
                {loading ? <CircularProgress isIndeterminate size="13px" /> : 'Commit'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingWords(words);
                  setEditMode(false);
                }}
                size="md"
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
                aria-label="Options">
                Discard
              </Button>
            </Flex>
          ) : null}

          <ExportButton
            filename={`${name}words`}
            data={words.map((e) => ({ [`${name} word`]: e }))}
          />
        </Flex>
        {loading ? (
          <Flex direction={'column'} gap="10px">
            <Progress isIndeterminate w="100%" h="5px" />
          </Flex>
        ) : words.length > 0 ? (
          <Flex wrap="wrap" gap="5px" rowGap={'5px'}>
            {(editMode ? editingWords : words)
              .filter((e) => e.toLowerCase().includes(input.toLowerCase()))
              .map((e, index) => {
                return (
                  <Text
                    key={index}
                    p="2px 10px"
                    gap="10px"
                    bg={theme.colors.tertiary.background}
                    fontSize={'12px'}
                    border={`1px solid ${theme.colors.tertiary.border}`}
                    borderRadius={'5px'}
                    color={theme.colors.tertiary.color}>
                    {input != '' ? highlight(e, input) : e}
                    {editMode ? (
                      <IconButton
                        aria-label="Delete"
                        backgroundColor={theme.colors.tertiary.background}
                        color={theme.colors.tertiary.color}
                        boxShadow={'none'}
                        _hover={{
                          backgroundColor: theme.colors.tertiary.hover
                        }}
                        icon={
                          <CloseOutlined
                            style={{
                              fontSize: '12px'
                            }}
                          />
                        }
                        size="xs"
                        onClick={() => {
                          setEditingWords(editingWords.filter((word) => word !== e));
                        }}
                      />
                    ) : null}
                  </Text>
                );
              })}
          </Flex>
        ) : (
          <EmptyBlockPrmopt
            headline={`No ${name.at(0).toUpperCase() + name.slice(1)} Words Found`}
            Icon={DoNotDisturbAltOutlined}
            description={`All the configured ${name} words will be shown here. Currently no such words have been configured.`}
          />
        )}
      </Flex>
      <Modal
        onClose={_onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior={'inside'}
        isCentered>
        <ModalOverlay />
        <ModalContent
          bg={theme.colors.tertiary.background}
          color={theme.colors.tertiary.color}
          minW="1000px"
          maxW="1000px"
          w="1000px">
          <ModalHeader>
            <Text fontWeight={'bold'} fontSize={'18px'}>
              Add {name} Words
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="950px" gap="10px" maxW="1000px" direction={'column'}>
              <Text color="#999">
                Enter {name} words in comma saperated format to add them to the list.
              </Text>
              <Flex w="100%" gap="5px" wrap="wrap">
                {manualInput.split(',').map((e, index) => {
                  if (e.trim() === '') return null;
                  return (
                    <Text
                      key={index}
                      p="2px 10px"
                      bg={theme.colors.tertiary.hover}
                      fontSize={'12px'}
                      border={`1px solid ${theme.colors.tertiary.border}`}
                      borderRadius={'2px'}
                      color={theme.colors.tertiary.color}>
                      {e}
                    </Text>
                  );
                })}
              </Flex>
              <Textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                _focus={{
                  border: `1px solid ${theme.colors.tertiary.border}`
                }}
                _hover={{
                  border: `1px solid ${theme.colors.tertiary.border}`
                }}
                border={`1px solid ${theme.colors.tertiary.border}`}
                height={'200px'}
                noOfLines={10}
                placeholder={`Type your ${name} words here`}
                w="100%"
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              fontSize="14px"
              onClick={_onClose}
              variant="outline"
              border={`1px solid ${theme.colors.tertiary.border}`}>
              Close
            </Button>
            <Button
              onClick={() => {
                uploadFile(
                  null,
                  `${name} words\n` +
                    manualInput
                      .split(',')
                      .map((e) => e.trim())
                      .filter((e) => e !== '')
                      .join('\n'),
                  'csv',
                  false
                );
                _onClose();
              }}
              _hover={{}}
              fontSize="14px"
              bg={theme.colors.button.successbg}
              color="white">
              {uploading ? <CircularProgress isIndeterminate size="13px" /> : 'Add Words'}
            </Button>
          </ModalFooter>
          {/* <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>{' '}
      <BulkUploadModal
        isBulkOpen={isBulkOpen}
        data={JSON.stringify({ [`${name} words`]: words }, null, 2)}
        onBulkClose={onBulkClose}
        isSubmitLoading={uploading}
        handleFileSubmit={async (f, c, m, o = false) => {
          await uploadFile(f, c, m, o);
        }}
        examples={{
          json: {
            [`${name} words`]: ['word1', 'word2', 'word3']
          },
          csv: `${name} words\nword1\nword2\nword3`
        }}
      />
    </>
  );
};

export default StopWords;
