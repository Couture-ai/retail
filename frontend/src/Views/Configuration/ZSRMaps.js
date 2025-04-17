/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Radio,
  Spacer,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useTheme
} from '@chakra-ui/react';
import './configuration.css';
import Tooltip from '../../Components/Misc/Tooltip';
import csv from '../../Static/images/csv.png';
import tsv from '../../Static/images/tsv.png';
import sortIcon from '../../Static/images/sort.png';
import download from '../../Static/images/download.png';
import React, { useEffect, useState } from 'react';
import Container from '../../Components/Container/Container';
import _data from '../../Data/phase1-rules';
import fileList from '../../Data/fashions/__list__';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import {
  Add,
  AddCircle,
  Check,
  Circle,
  NoteAddOutlined,
  Search,
  UploadFile
} from '@mui/icons-material';
import './configuration.css';
import axios from 'axios';
const ZSRMaps = (props) => {
  const theme = useTheme();

  const [fileNames, setFileNames] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const data = {
    'Zara Turquoise Tshirt': {
      querySuggestions: [
        {
          query: 'Zara Blue Tshirt',
          sr: 3245
        },
        {
          query: 'Zara Green Tshirt',
          sr: 2348
        }
      ],
      didYouMean: [
        {
          query: 'Zara Turtle Tshirt',
          sr: 32
        }
      ],
      brandSubstitution: [
        {
          query: 'H&M Turquoise Tshirt',
          sr: 524
        }
      ]
    },
    'Zara Blue Tshirt': {
      querySuggestions: [
        {
          query: 'Zara Turquoise Tshirt',
          sr: 3245
        },
        {
          query: 'Zara Green Tshirt',
          sr: 2348
        }
      ],
      didYouMean: [
        {
          query: 'Zara Turtle Tshirt',
          sr: 32
        }
      ],
      brandSubstitution: [
        {
          query: 'H&M Turquoise Tshirt',
          sr: 524
        }
      ]
    },
    'Puma NExt Gen Shoe': {
      querySuggestions: [
        {
          query: 'Puma Next Gen Shoe',
          sr: 3245
        },
        {
          query: 'Puma Next Generation Shoe',
          sr: 2348
        }
      ],
      didYouMean: [
        {
          query: 'Puma Next Gen Shoes',
          sr: 32
        }
      ],
      brandSubstitution: [
        {
          query: 'Nike Next Gen Shoe',
          sr: 524
        }
      ]
    },
    'Nike Next Gen Shoe': {
      querySuggestions: [
        {
          query: 'Nike Next Gen Shoes',
          sr: 3245
        },
        {
          query: 'Nike Next Generation Shoe',
          sr: 2348
        },
        {
          query: 'Nike Next Gen Shoe II',
          sr: 2348
        },
        {
          query: 'Nike Next Gen Shoe Lace Plus',
          sr: 7348
        }
      ],
      didYouMean: [
        {
          query: 'Nike Next Gen Shoe',
          sr: 32
        }
      ],
      brandSubstitution: [
        {
          query: 'Puma Next Gen Shoe',
          sr: 524
        }
      ]
    }
  };
  const [zsrs, setZsrs] = useState(
    Object.keys(data).reduce((acc, key) => {
      acc[key] = {
        querySuggestions: data[key].querySuggestions,
        didYouMean: data[key].didYouMean,
        brandSubstitution: data[key].brandSubstitution,
        recommended: [
          [
            ...data[key].querySuggestions,
            ...data[key].didYouMean,
            ...data[key].brandSubstitution
          ].sort((a, b) => {
            return b.sr - a.sr;
          })[0]
        ]
      };
      return acc;
    }, {})
  );

  //take __list__.txt file and convert it to a list of strings, on the path '../../Data/fastions/__list__.txt'
  const [sort, setSort] = useState({
    type: null,
    order: null
  });
  const [appliedSort, setAppliedSort] = useState({
    type: null,
    order: null
  });
  return (
    <Container isCollapsed={props.isCollapsed} w="100%">
      <Box w="100%" overflow={'auto'} pl={10} mb="50px">
        <Flex direction={'column'} mb="5">
          <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>ZSR Maps</Text>
          <Box w="80px" h="4px" borderRadius={'2px'} backgroundColor={theme.colors.orange.main} />
        </Flex>
        <Flex w="100%" gap="10px">
          {/* <Spacer /> */}
          <Box mb="10px" className={searchOpen ? 'wrap active' : 'wrap'}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="text"
              className={searchOpen ? `input active` : `input`}
              placeholder="Search"
            />
            <Search
              className="fa fa-search"
              aria-hidden="true"
              onClick={() => {
                setSearchOpen(!searchOpen);
                // set focus to input
                // if (search)
                document.querySelector(`.input`).focus();
              }}
            />
          </Box>
          <Menu closeOnSelect={false}>
            {({ isOpen, onClose }) => (
              <>
                {appliedSort.type == null ? (
                  <MenuButton
                    as={IconButton}
                    border={`1px solid ${theme.colors.gray.light}`}
                    aria-label="Options"
                    icon={
                      <Image src={sortIcon} w="20px" h="20px" filter={theme.colors.gray.filter} />
                    }
                    variant="outline"
                  />
                ) : (
                  <MenuButton
                    as={Button}
                    style={{
                      borderRadius: '5px',
                      color: theme.colors.secondary.colorGray,
                      backgroundColor: theme.colors.white,
                      // border: `1px solid ${theme.colors.gray.light}`,
                      fontSize: '14px',
                      boxShadow: 'none',
                      fontWeight: 'normal'
                    }}
                    leftIcon={
                      <Image src={sortIcon} w="20px" h="20px" filter={theme.colors.gray.filter} />
                    }
                    border={`1px solid ${theme.colors.gray.light}`}
                    aria-label="Options">
                    {appliedSort.order}
                  </MenuButton>
                )}
                <MenuList
                  boxShadow={'0px 0px 40px 0px #dddddd'}
                  minWidth={'300px'}
                  fontFamily={'Hanken Grotesk'}>
                  {/* <MenuItem
                fontSize={'14px'}
                // onClick={(e) => {
                //   hiddenFileInput.current.click();
                // }}
                icon={
                  <UploadFile
                    style={{
                      transform: 'scale(0.7)',
                      color: theme.colors.gray.semilight
                    }}
                  />
                }
                command="⌘⇧N">
                Upload File
              </MenuItem> */}
                  <Flex alignItems={'center'} pl="15px">
                    <Image mr="10px" src={sortIcon} w="20px" h="20px" />
                    <Text fontSize={'15px'} fontWeight={'bold'}>
                      Sort
                    </Text>
                  </Flex>
                  <Divider w="100%" h="1px" mt="2px" mb="5px" />
                  <MenuGroup
                    title="Query"
                    color={theme.colors.gray.semilight}
                    fontWeight={'normal'}>
                    <MenuItem
                      fontSize={'14px'}
                      onClick={() => {
                        if (sort.type == 'Query' && sort.order == 'A-Z')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Query', order: 'A-Z' });
                      }}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Query' && sort.order === 'A-Z'}
                        onClick={(e) => {
                          setSort({ type: 'Query', order: 'A-Z' });
                        }}
                      />{' '}
                      A-Z
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (sort.type == 'Query' && sort.order == 'Z-A')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Query', order: 'Z-A' });
                      }}
                      fontSize={'14px'}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Query' && sort.order === 'Z-A'}
                        onClick={(e) => {
                          setSort({ type: 'Query', order: 'Z-A' });
                        }}
                      />{' '}
                      Z-A
                    </MenuItem>
                  </MenuGroup>
                  <Divider w="100%" h="1px" mt="2px" mb="5px" />
                  <MenuGroup
                    title="Date Modified"
                    color={theme.colors.gray.semilight}
                    fontWeight={'normal'}>
                    <MenuItem
                      fontSize={'14px'}
                      onClick={() => {
                        if (sort.type == 'Date Modified' && sort.order == 'Latest First')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Date Modified', order: 'Latest First' });
                      }}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Date Modified' && sort.order === 'Latest First'}
                        onClick={(e) => {
                          setSort({ type: 'Date Modified', order: 'Latest First' });
                        }}
                      />{' '}
                      Latest First
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (sort.type == 'Date Modified' && sort.order == 'Oldest First')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Date Modified', order: 'Oldest First' });
                      }}
                      fontSize={'14px'}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Date Modified' && sort.order === 'Oldest First'}
                        onClick={(e) => {
                          setSort({ type: 'Date Modified', order: 'Oldest First' });
                        }}
                      />{' '}
                      Oldest First
                    </MenuItem>
                  </MenuGroup>
                  <Divider w="100%" h="1px" mt="2px" mb="5px" />
                  <Flex alignItems={'center'} pl="15px" w="100%" pr="15px">
                    <Button
                      onClick={() => {
                        setSort({ type: null, order: null });
                        onClose();
                      }}
                      style={{
                        borderRadius: '5px',
                        color: theme.colors.secondary.colorGray,
                        backgroundColor: theme.colors.gray.lighter,
                        // border: `1px solid ${theme.colors.gray.light}`,
                        fontSize: '14px',
                        boxShadow: 'none',
                        fontWeight: 'normal'
                      }}>
                      Cancel
                    </Button>
                    <Spacer />
                    <Button
                      onClick={() => {
                        setAppliedSort(sort);
                        onClose();
                      }}
                      style={{
                        borderRadius: '5px',
                        color: theme.colors.white,
                        backgroundColor: theme.colors.orange.main,
                        // border: `1px solid ${theme.colors.gray.light}`,
                        fontSize: '14px',
                        boxShadow: 'none',
                        fontWeight: 'normal'
                      }}>
                      Apply Now
                    </Button>
                  </Flex>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>

        <Flex width="100%" direction="column" mb="100px">
          <TableContainer borderRadius={'5px'}>
            <Table
              __css={{
                width: 'full',
                //fixed layout
                tableLayout: 'fixed'
              }}
              style={{
                border: `1px solid ${theme.colors.gray.hover}`,
                borderRadius: '5px'
              }}>
              <Thead>
                <Tr>
                  <Th>Query</Th>
                  <Th>Recommended</Th>
                  <Th>Query Suggestions</Th>
                  <Th>Did You Mean</Th>
                  <Th>Brand Substitution</Th>
                </Tr>
              </Thead>
              <Tbody>
                {' '}
                {Object.keys(zsrs)
                  .sort((a, b) => {
                    if (appliedSort.type == 'Query' && appliedSort.order == 'A-Z')
                      return a.localeCompare(b);
                    if (appliedSort.type == 'Query' && appliedSort.order == 'Z-A')
                      return b.localeCompare(a);
                    return 0;
                  })
                  .map((key) => {
                    if (search.length > 0 && !key.toLowerCase().includes(search.toLowerCase()))
                      return null;
                    return (
                      <Tr key={key} w="100%" mt="20px">
                        <Td>
                          <Flex direction="column">
                            <Text wordBreak={'break-word'} fontWeight={'bold'}>
                              {key}
                            </Text>
                            <Text
                              wordBreak={'break-word'}
                              display={zsrs[key].zsrMap?.query ? 'block' : 'none'}
                              style={{
                                color: theme.colors.secondary.colorGray,
                                fontSize: '13px',
                                // make italic
                                fontStyle: 'italic'
                              }}>
                              Mapped to{' '}
                              <span style={{ color: theme.colors.green.main, fontWeight: 'bold' }}>
                                {zsrs[key].zsrMap?.query}
                              </span>
                            </Text>
                            <Text
                              display={zsrs[key].zsrMap?.query ? 'none' : 'block'}
                              style={{
                                color: theme.colors.secondary.colorGray,
                                fontSize: '13px',
                                // make italic
                                fontStyle: 'italic'
                              }}>
                              Unmapped
                            </Text>
                          </Flex>
                        </Td>
                        {['recommended', 'querySuggestions', 'didYouMean', 'brandSubstitution'].map(
                          (type) => {
                            return (
                              <Td key={type}>
                                <Flex wrap="wrap" gap="5px">
                                  {zsrs[key][type].map((qs) => {
                                    return (
                                      <Tag
                                        key={qs}
                                        cursor={'pointer'}
                                        onClick={() => {
                                          if (
                                            zsrs[key].zsrMap?.type == type &&
                                            zsrs[key].zsrMap?.query == qs.query
                                          ) {
                                            const _zsrs = {
                                              ...zsrs,
                                              [key]: {
                                                ...zsrs[key],
                                                zsrMap: null
                                              }
                                            };
                                            setZsrs(_zsrs);
                                            return;
                                          }

                                          const zsrMap = {
                                            type: type,
                                            query: qs.query
                                          };
                                          const _zsrs = {
                                            ...zsrs,
                                            [key]: {
                                              ...zsrs[key],
                                              zsrMap: zsrMap
                                            }
                                          };
                                          setZsrs(_zsrs);
                                        }}
                                        _hover={
                                          zsrs[key].zsrMap?.type == type &&
                                          zsrs[key].zsrMap?.query == qs.query
                                            ? {
                                                backgroundColor: `${theme.colors.green.main_hover} !important`
                                              }
                                            : {
                                                backgroundColor: `${theme.colors.gray.hover} !important`
                                              }
                                        }
                                        style={
                                          zsrs[key].zsrMap?.type == type &&
                                          zsrs[key].zsrMap?.query == qs.query
                                            ? {
                                                backgroundColor: theme.colors.green.main,
                                                color: theme.colors.white
                                              }
                                            : {
                                                color: theme.colors.secondary.colorGray
                                              }
                                        }>
                                        <TagLeftIcon>
                                          {zsrs[key].zsrMap?.type == type &&
                                          zsrs[key].zsrMap?.query == qs.query ? (
                                            <Check />
                                          ) : (
                                            <Circle style={{ color: theme.colors.gray.light }} />
                                          )}
                                        </TagLeftIcon>
                                        <TagLabel>
                                          {qs.query} ({qs.sr})
                                        </TagLabel>
                                      </Tag>
                                    );
                                  })}
                                </Flex>
                              </Td>
                            );
                          }
                        )}
                        {/* <Td>
                          <Flex wrap="wrap" gap="5px">
                            {zsrs[key].querySuggestions.map((qs) => {
                              return (
                                <Tag
                                  key={qs}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    if (
                                      zsrs[key].zsrMap?.type == 'querySuggestions' &&
                                      zsrs[key].zsrMap?.query == qs.query
                                    ) {
                                      const _zsrs = {
                                        ...zsrs,
                                        [key]: {
                                          ...zsrs[key],
                                          zsrMap: null
                                        }
                                      };
                                      setZsrs(_zsrs);
                                      return;
                                    }

                                    const zsrMap = {
                                      type: 'querySuggestions',
                                      query: qs.query
                                    };
                                    const _zsrs = {
                                      ...zsrs,
                                      [key]: {
                                        ...zsrs[key],
                                        zsrMap: zsrMap
                                      }
                                    };
                                    setZsrs(_zsrs);
                                  }}
                                  style={
                                    zsrs[key].zsrMap?.type == 'querySuggestions' &&
                                    zsrs[key].zsrMap?.query == qs.query
                                      ? {
                                          backgroundColor: theme.colors.green.main,
                                          color: theme.colors.white
                                        }
                                      : {}
                                  }>
                                  <TagLeftIcon>
                                    <Check />
                                  </TagLeftIcon>
                                  <TagLabel>
                                    {qs.query} ({qs.sr})
                                  </TagLabel>
                                  {/* <TagRightIcon>
                                    <Circle
                                      style={{
                                        color: 'grey'
                                      }}
                                    />
                                  </TagRightIcon> */}
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Box>
    </Container>
  );
};
export default ZSRMaps;
