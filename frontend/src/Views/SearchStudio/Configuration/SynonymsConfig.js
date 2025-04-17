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
  Input,
  Select,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Progress,
  useToast,
  RadioGroup,
  Radio,
  CircularProgress
} from '@chakra-ui/react';
import {
  AddOutlined,
  ArrowDropDown,
  Check,
  FileUploadOutlined,
  NoteAddOutlined,
  WarningOutlined
} from '@mui/icons-material';

import React, { useEffect, useRef, useState } from 'react';
import ConfigSearchBar from './SearchBar';
import synonyms from './synonyms';
import LearnMoreButton from '../Components/LearnMore';
import BulkUploadModal from '../Components/BulkUploadModal';
import Pagination from '../../../Components/Misc/Pagination';
import SynonymsRepository from '../../../repositories/synonyms';
import { useParams } from 'react-router-dom';
import ExportButton from '../Components/ExportButton';
const highlight = (text, highlight, color = '#E4EFFF') => {
  // split the text by the highlight text
  if (!text.split) return text;
  const parts = text?.split(new RegExp(`(${highlight})`, 'gi'));
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
const Synonyms = (props) => {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
  const btnRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [input, setInput] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(null);
  const { appName } = useParams();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [upload, setUpload] = useState(0);

  const synonymsRepository = new SynonymsRepository(
    import.meta.env.VITE_API_STUDIO_URL + '/retailstudio'
  );
  const toast = useToast();
  const [direction, setDirection] = useState('any');
  const [directionChoices, setDirectionChoices] = useState([]);
  const [variant, setVariant] = useState('any');
  const [variantChoices, setVariantChoices] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingError, setUploadingError] = useState(null);

  const uploadFile = async (file, content, mode, overwrite) => {
    try {
      await synonymsRepository.uploadFile({
        company_name: appName,
        stateSetters: {
          setLoading: setUploading,
          setError: setUploadingError,
          setData: () => {}
        },
        data: {
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
        duration: 10000,
        isClosable: true,
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
  const [inputSynonymType, setInputSynonymType] = useState('Two Way Synonym');
  const [inputKeyword, setInputKeyword] = useState('');
  const [inputSynonyms, setInputSynonyms] = useState('');
  const [inputVariant, setInputVariant] = useState(null);
  const _onClose = () => {
    setInputSynonymType('Two Way Synonym');
    setInputKeyword('');
    setInputSynonyms('');
    setInputVariant(null);
    onClose();
  };
  const variants = [
    'Others',
    'SPELL VARIANT',
    'SYNONYMS',
    'NUMERICAL',
    'SUBSTITUTE',
    'SYMBOL',
    'EXPANSION',
    'HINGLISH',
    'STEM VARIANT',
    'BRAND ACRONYM',
    'BRAND EXPANSION',
    'DEVNAGRI',
    'UK TO US',
    'HINGLISH SYNONYMS'
  ];

  useEffect(() => {
    synonymsRepository
      .fetchSynonyms({
        company_name: appName,
        stateSetters: {
          setLoading: setLoading,
          setError: setError,
          setData: () => {}
        },
        data: {
          page: page,
          limit: 20,
          search: input,
          direction: direction,
          variant: variant
        }
      })
      .then((res) => {
        setData(res.data);
        setCount(res.count);
        setVariantChoices(res.variants);
        setDirectionChoices(res.types);
      });
  }, [page, input, direction, variant]);
  useEffect(() => {
    synonymsRepository
      .fetchSynonyms({
        company_name: appName,
        stateSetters: {
          setLoading: () => {},
          setError: () => {},
          setData: () => {}
        },
        data: {
          page: 1,
          limit: 10000,
          direction: direction,
          variant: variant
        }
      })
      .then((res) => {
        setAllData(res.data);
      });
  }, []);

  return (
    <>
      <Flex w="100%" direction="column" gap="20px">
        <Text fontSize="14px" color={`1px solid ${theme.colors.secondary.colorGray}`}>
          Synonyms bridge vocabulary gaps by linking related terms. This ensures searches for
          alternate words or phrases yield accurate results, improving discoverability and aligning
          with user expectations across diverse terminology.
          <LearnMoreButton />
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
              Changes to the synonyms configuration will take effect after the next indexing cycle,
              which is typically 7 days.
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%">
          <ConfigSearchBar
            input={input}
            setInput={(e) => {
              setInput(e);
              setPage(1);
            }}
            placeholder={'Search Synonyms'}
          />
          <Spacer />
        </Flex>
        <Flex w="100%" gap="10px" alignItems={'center'}>
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
                    Add Synonym
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
                      borderRadius="5px"
                      _hover={{
                        bg: theme.colors.tertiary.hover
                      }}
                      bg={theme.colors.secondary.background}
                      color={theme.colors.secondary.color}
                      onClick={() => {
                        onOpen();
                      }}
                      gap="10px">
                      <AddOutlined style={{ fontSize: '15px' }} />

                      <Text ml="10px" fontSize="13px">
                        Add Synonym Manually
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
                        // setView(key);
                        // onClose();
                        onBulkOpen();
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
          <Pagination
            page={page}
            setPage={setPage}
            totalProductsCount={count}
            pageSize={20}
            fetch={(_page) => {
              // fetchRules(_page, input).then(() => {});
            }}
          />
          <ExportButton filename={'synonyms'} data={allData} />
        </Flex>
        <Flex wrap="wrap" gap="5px" direction="column">
          {loading ? (
            <Progress isIndeterminate h="5px" />
          ) : (
            <Table
              sx={{
                '*': {
                  borderColor: `${theme.colors.tertiary.border} !important`,
                  color: theme.colors.tertiary.color
                }
              }}>
              <Thead>
                <Th>Keyword</Th>
                <Th>Synonyms</Th>
                <Th flexDirection={'row'} gap="10px" alignItems={'center'} pr="0px">
                  Direction{' '}
                  <Select
                    onChange={(e) => {
                      setDirection(e.target.value);
                    }}
                    value={direction}
                    width="100%"
                    mt="5px"
                    style={{
                      border: `1px solid ${theme.colors.tertiary.border}`,
                      backgroundColor: theme.colors.tertiary.hover,
                      padding: '5px 10px',

                      height: '30px',
                      fontSize: '14px'
                    }}>
                    <option value={'any'}>All</option>
                    {directionChoices.map((e, i) => {
                      return (
                        <option key={i} value={e}>
                          {e == '' ? '(Empty String)' : e == null ? '(None)' : e}
                        </option>
                      );
                    })}
                  </Select>
                </Th>
                <Th flexDirection={'row'} gap="10px" alignItems={'center'} pr="0px">
                  Variants{' '}
                  <Select
                    onChange={(e) => {
                      setVariant(e.target.value);
                    }}
                    value={variant}
                    width="100%"
                    mt="5px"
                    style={{
                      border: `1px solid ${theme.colors.tertiary.border}`,
                      backgroundColor: theme.colors.tertiary.hover,
                      padding: '5px 10px',

                      height: '30px',
                      fontSize: '14px'
                    }}>
                    <option value={'any'}>All</option>
                    {variantChoices.map((e, i) => {
                      return (
                        <option key={i} value={e}>
                          {e == '' ? '(Empty String)' : e == null ? '(None)' : e}
                        </option>
                      );
                    })}
                  </Select>
                </Th>
              </Thead>
              <Tbody>
                {data
                  .slice(0, 20)
                  .filter((e) =>
                    JSON.stringify(e).toString().toLowerCase().includes(input.toLowerCase())
                  )
                  .map((e, index) => {
                    return (
                      <Tr
                        p="2px 10px"
                        border={`1px solid ${theme.colors.tertiary.border}`}
                        bg={theme.colors.tertiary.background}
                        fontSize={'12px'}
                        borderRadius={'5px'}
                        color="#323337"
                        key={index}>
                        <Td>
                          {input && e['keyword'] ? highlight(e['keyword'], input) : e['keyword']}
                        </Td>
                        <Td>
                          <Flex wrap="wrap" gap="5px">
                            {e?.synonyms?.split('|').map((item) => {
                              return (
                                <Text
                                  borderRadius={'5px'}
                                  p="2px 5px"
                                  border={`1px solid ${theme.colors.tertiary.border}`}
                                  key={item}>
                                  {input && item ? highlight(item, input) : item}
                                </Text>
                              );
                            })}
                          </Flex>

                          {/* {input ? highlight(e['synonyms'], input) : e['synonyms']} */}
                        </Td>
                        <Td>{input && e['type'] ? highlight(e['type'], input) : e['type']}</Td>
                        <Td>
                          {input && e['variant'] ? highlight(e['variant'], input) : e['variant']}
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          )}
        </Flex>
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
              Add Synonyms
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="950px" gap="10px" maxW="1000px" direction={'column'}>
              <Text fontSize={'14px'} color={theme.colors.secondary.colorGray}>
                Choose the direction for the synonyms
              </Text>
              <Flex>
                <RadioGroup
                  value={inputSynonymType}
                  onChange={(e) => {
                    setInputSynonymType(e);
                  }}>
                  <Flex direction="row" gap="10px">
                    <Flex
                      _hover={{
                        bg: `${theme.colors.tertiary.hover}`
                      }}
                      style={{
                        border: `1px solid ${theme.colors.tertiary.border}`,
                        backgroundColor: theme.colors.tertiary.background,
                        padding: '20px 20px',
                        borderRadius: '5px',
                        height: '30px',
                        fontSize: '15px'
                      }}>
                      <Radio value="Two Way Synonym">Two Way Synonym</Radio>
                    </Flex>
                    <Flex
                      _hover={{
                        bg: `${theme.colors.tertiary.hover}`
                      }}
                      style={{
                        border: `1px solid ${theme.colors.tertiary.border}`,
                        backgroundColor: theme.colors.tertiary.background,
                        padding: '20px 20px',
                        borderRadius: '5px',
                        height: '30px',
                        fontSize: '15px'
                      }}>
                      <Radio value="One Way Synonym">One Way Synonym</Radio>
                    </Flex>
                  </Flex>
                </RadioGroup>
              </Flex>

              {inputSynonymType === 'Two Way Synonym' ? null : (
                <Text mt="5px" fontSize={'14px'} color={theme.colors.secondary.colorGray}>
                  Enter the keyword.
                </Text>
              )}
              {inputSynonymType === 'Two Way Synonym' ? null : (
                <Input
                  value={inputKeyword}
                  onChange={(e) => setInputKeyword(e.target.value)}
                  placeholder="Type your keyword here"
                  w="100%"
                  border={`1px solid ${theme.colors.tertiary.border}`}
                  bg={`${theme.colors.tertiary.hover}`}
                  _focus={{
                    bg: `${theme.colors.tertiary.hover}`
                  }}
                  _hover={{
                    bg: `${theme.colors.tertiary.hover}`
                  }}
                />
              )}
              <Flex direction="column" gap="5px">
                <Text fontSize={'14px'} color={theme.colors.secondary.colorGray}>
                  Enter Synonyms in comma saperated format to add them to the list.
                </Text>
                <Flex
                  w="100%"
                  gap="5px"
                  wrap="wrap"
                  display={inputSynonyms.split(',').length > 0 ? 'flex' : 'none'}>
                  {inputSynonyms.split(',').map((e, index) => {
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

                <Input
                  value={inputSynonyms}
                  onChange={(e) => setInputSynonyms(e.target.value)}
                  placeholder="Type your synonyms here, saperated by commas"
                  w="100%"
                  border={`1px solid ${theme.colors.tertiary.border}`}
                  bg={`${theme.colors.tertiary.hover}`}
                  _focus={{
                    bg: `${theme.colors.tertiary.hover}`
                  }}
                  _hover={{
                    bg: `${theme.colors.tertiary.hover}`
                  }}
                />
              </Flex>

              <Text mt="5px" fontSize={'14px'} color={theme.colors.secondary.colorGray}>
                Choose the variant for the synonyms
              </Text>
              <Select
                value={inputVariant}
                onChange={(e) => setInputVariant(e.target.value)}
                variant="outline"
                border={`1px solid ${theme.colors.tertiary.border}`}
                bg={`${theme.colors.tertiary.hover}`}>
                {variants.map((e, i) => {
                  return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                  );
                })}
              </Select>
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
                  JSON.stringify(
                    [
                      {
                        keyword: inputKeyword,
                        synonyms: inputSynonyms
                          .split(',')
                          .map((e) => e.trim())
                          .filter((e) => e != '')
                          .join('|'),
                        type: inputSynonymType,
                        variant: inputVariant == 'Others' ? null : inputVariant
                      }
                    ],
                    null,
                    2
                  ),
                  'json',
                  false
                );
                _onClose();
              }}
              _hover={{}}
              fontSize="14px"
              bg={theme.colors.button.successbg}
              color="white">
              {uploading ? (
                <CircularProgress isIndeterminate h="13px" />
              ) : (
                'Commit synonym(s) To database'
              )}
            </Button>
          </ModalFooter>
          {/* <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <BulkUploadModal
        isBulkOpen={isBulkOpen}
        data={JSON.stringify(allData, null, 2)}
        onBulkClose={onBulkClose}
        isSubmitLoading={uploading}
        handleFileSubmit={async (f, c, m, o = false) => {
          await uploadFile(f, c, m, o);
        }}
        examples={{
          json: [
            {
              keyword: 'word1',
              synonyms: 'word2|word3',
              type: 'Two Way Synonym'
            },
            {
              keyword: 'word4',
              synonyms: 'word5|word6',
              type: 'One Way Synonym'
            }
          ],

          csv: `keyword,synonyms,type\nword1,word2|word3,Two Way Synonym\nword4,word5|word6,One Way Synonym`
        }}
      />{' '}
    </>
  );
};

export default Synonyms;
