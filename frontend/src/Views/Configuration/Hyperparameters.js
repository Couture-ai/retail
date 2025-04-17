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
import pins from '../../Static/images/pins.png';
import React, { useEffect, useState } from 'react';
import Container from '../../Components/Container/Container';
import _data from '../../Data/phase1-rules';
import fileList from '../../Data/fashions/__list__';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import {
  Add,
  AddCircle,
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  NoteAddOutlined,
  PushPin,
  Search,
  UnfoldLess,
  UploadFile
} from '@mui/icons-material';
import './configuration.css';
import hyperparameters from '../../Data/hyperparameters';
import { CodeBlock, dracula } from 'react-code-blocks';
function stringifyWithNewLines(obj, indent = 0) {
  if (typeof obj !== 'object' || obj === null) {
    // Return primitive types or null as a string
    return JSON.stringify(obj);
  }

  const space = ' '.repeat(indent);
  const newIndent = indent + 4; // Change from 2 to 4 for deeper indentation
  const newSpace = ' '.repeat(newIndent);

  if (Array.isArray(obj)) {
    // Format each element of the array with a newline
    const arrayContent = obj
      .map((item) => `${newSpace}${stringifyWithNewLines(item, newIndent)}`)
      .join(',\n');
    return `[\n${arrayContent}\n${space}]`;
  } else {
    // Process each property of the object
    const properties = Object.entries(obj)
      .map(([key, value], index, array) => {
        const endLine = index < array.length - 1 ? ',' : '';
        return `${newSpace}"${key}": ${stringifyWithNewLines(value, newIndent)}${endLine}`;
      })
      .join('\n');
    return `{\n${properties}\n${space}}`;
  }
}
const Hyperparameters = (props) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState(
    Object.keys(hyperparameters).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );
  const [itemHovered, setItemHovered] = useState(null);
  const [pinned, setPinned] = useState(
    Object.keys(hyperparameters).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );
  const [showPinned, setShowPinned] = useState(false);

  //take __list__.txt file and convert it to a list of strings, on the path '../../Data/fastions/__list__.txt'
  const [sort, setSort] = useState({
    type: null,
    order: null
  });
  const [appliedSort, setAppliedSort] = useState({
    type: null,
    order: null
  });
  const [data, setData] = useState(hyperparameters);
  return (
    <Container bg={'#fcfcfc'} isCollapsed={props.isCollapsed} w="100%">
      <Box w="100%" overflow={'auto'} pl={10} mb="50px">
        <Flex direction={'column'} mb="5">
          <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>Pipeline Hyperparameters</Text>
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
                    title="Group Name"
                    color={theme.colors.gray.semilight}
                    fontWeight={'normal'}>
                    <MenuItem
                      fontSize={'14px'}
                      onClick={() => {
                        if (sort.type == 'Group Name' && sort.order == 'A-Z')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Group Name', order: 'A-Z' });
                      }}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Group Name' && sort.order === 'A-Z'}
                        onClick={(e) => {
                          setSort({ type: 'Group Name', order: 'A-Z' });
                        }}
                      />{' '}
                      A-Z
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (sort.type == 'Group Name' && sort.order == 'Z-A')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Group Name', order: 'Z-A' });
                      }}
                      fontSize={'14px'}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Group Name' && sort.order === 'Z-A'}
                        onClick={(e) => {
                          setSort({ type: 'Group Name', order: 'Z-A' });
                        }}
                      />{' '}
                      Z-A
                    </MenuItem>
                  </MenuGroup>
                  <Divider w="100%" h="1px" mt="2px" mb="5px" />
                  <MenuGroup
                    title="Activity"
                    color={theme.colors.gray.semilight}
                    fontWeight={'normal'}>
                    <MenuItem
                      fontSize={'14px'}
                      onClick={() => {
                        if (sort.type == 'Activity' && sort.order == 'Most Active First')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Activity', order: 'Most Active First' });
                      }}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Activity' && sort.order === 'Most Active First'}
                        onClick={(e) => {
                          setSort({ type: 'Activity', order: 'Most Active First' });
                        }}
                      />{' '}
                      Most Active First
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (sort.type == 'Activity' && sort.order == 'Least Active First')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'Activity', order: 'Least Active First' });
                      }}
                      fontSize={'14px'}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'Activity' && sort.order === 'Least Active First'}
                        onClick={(e) => {
                          setSort({ type: 'Activity', order: 'Least Active First' });
                        }}
                      />{' '}
                      Least Active First
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
          <Tooltip text="Download Data">
            <IconButton
              h="40px"
              w="40px"
              //add row

              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                border: `1px solid ${theme.colors.gray.light}`,
                boxShadow: 'none'
              }}
              icon={<Image src={download} h="20px" w="20px" filter={theme.colors.gray.filter} />}
            />
          </Tooltip>
          <Tooltip text="Collapse All">
            <IconButton
              h="40px"
              w="40px"
              //add row
              onClick={() => {
                setExpanded(
                  Object.keys(expanded).reduce((acc, key) => {
                    acc[key] = false;
                    return acc;
                  }, {})
                );
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                border: `1px solid ${theme.colors.gray.light}`,
                boxShadow: 'none'
              }}
              icon={
                <UnfoldLess
                  style={{
                    transform: 'rotate(90deg)',
                    color: theme.colors.gray.light
                  }}
                />
              }
            />
          </Tooltip>
          <Tooltip text="Show pinned items on the top">
            <IconButton
              h="40px"
              w="40px"
              onClick={(e) => {
                e.stopPropagation();
                setShowPinned(!showPinned);
              }}
              //add row

              style={{
                backgroundColor: showPinned ? theme.colors.green.light : 'white',
                borderRadius: '5px',
                border: showPinned
                  ? `1px solid ${theme.colors.green.main}`
                  : `1px solid ${theme.colors.gray.light}`,
                boxShadow: 'none'
              }}
              icon={
                <Image
                  src={pins}
                  h="20px"
                  w="20px"
                  filter={showPinned ? theme.colors.green.filter : theme.colors.gray.filter}
                />
              }
            />
          </Tooltip>
        </Flex>
        <Flex w="100%" gap="20px" direction={'column'}>
          {Object.keys(data)
            .sort((a, b) => {
              if (showPinned) {
                if (pinned[a] && !pinned[b]) return -1;
                if (pinned[b] && !pinned[a]) return 1;
              }
              if (appliedSort.type === 'Group Name') {
                if (appliedSort.order === 'A-Z') return a.localeCompare(b);
                else return b.localeCompare(a);
              }
              return a.localeCompare(b);
            })
            .map((hyperparameter) => {
              if (
                search &&
                hyperparameter.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
                Object.keys(data[hyperparameter]).filter(
                  (key) => key.toLowerCase().indexOf(search.toLowerCase()) !== -1
                ).length === 0
              )
                return null;
              if (Object.keys(data[hyperparameter]).length === 0) return null;
              return (
                <Flex
                  onMouseEnter={() => {
                    setItemHovered(hyperparameter);
                  }}
                  onMouseLeave={() => {
                    setItemHovered(null);
                  }}
                  direction="column"
                  key={hyperparameter}
                  style={{
                    padding: '20px',
                    border: `1px solid ${theme.colors.gray.hover}`,
                    borderRadius: '5px'
                  }}>
                  <Flex
                    p="5px 10px"
                    cursor="pointer"
                    alignItems="center"
                    _hover={{
                      backgroundColor: theme.colors.gray.lighter
                    }}
                    gap="10px"
                    onClick={() => {
                      setExpanded({
                        ...expanded,
                        [hyperparameter]: !expanded[hyperparameter]
                      });
                    }}>
                    <Text fontWeight={'bold'}>
                      {hyperparameter} ({Object.keys(data[hyperparameter]).length})
                    </Text>
                    <IconButton
                      size="20px"
                      bg="transparent"
                      color="grey"
                      boxShadow={'none'}
                      style={{
                        backgroundColor: 'transparent'
                      }}
                      _hover={{
                        backgroundColor: `${'transparent'} !important`
                      }}
                      icon={
                        expanded[hyperparameter] ? (
                          <KeyboardArrowUpOutlined />
                        ) : (
                          <KeyboardArrowDownOutlined />
                        )
                      }
                    />
                    <Spacer />
                    <Tooltip text="Pin to the top">
                      <IconButton
                        h="30px"
                        w="30px"
                        visibility={
                          itemHovered === hyperparameter || pinned[hyperparameter]
                            ? 'visible'
                            : 'hidden'
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setPinned({
                            ...pinned,
                            [hyperparameter]: !pinned[hyperparameter]
                          });
                        }}
                        //add row

                        style={{
                          backgroundColor: pinned[hyperparameter]
                            ? theme.colors.green.light
                            : 'white',
                          borderRadius: '5px',
                          border: pinned[hyperparameter]
                            ? `1px solid ${theme.colors.green.main}`
                            : `1px solid ${theme.colors.gray.light}`,
                          boxShadow: 'none'
                        }}
                        icon={
                          <Image
                            src={pins}
                            h="15px"
                            w="15px"
                            filter={
                              pinned[hyperparameter]
                                ? theme.colors.green.filter
                                : theme.colors.gray.filter
                            }
                          />
                        }
                      />
                    </Tooltip>
                  </Flex>

                  <Flex display={expanded[hyperparameter] ? 'flex' : 'none'}>
                    {' '}
                    <Flex
                      flex="1"
                      direction="column"
                      p="10px 20px"
                      gap="10px"
                      backgroundColor={theme.colors.white}>
                      {Object.keys(data[hyperparameter]).map((key) => {
                        return (
                          <Flex key={key} gap="10px" alignItems={'center'}>
                            <Text>{key}</Text>
                            <Spacer />
                            <InputGroup w="300px">
                              <Input
                                sx={{
                                  backgroundColor: 'transparent',
                                  border: `1px solid ${theme.colors.gray.hover}`
                                }}
                                onChange={(e) => {
                                  setData({
                                    ...data,
                                    [hyperparameter]: {
                                      ...data[hyperparameter],
                                      [key]: e.target.value
                                    }
                                  });
                                }}
                                placeholder={key}
                                value={data[hyperparameter][key]}
                              />
                            </InputGroup>
                          </Flex>
                        );
                      })}
                    </Flex>
                    <Flex
                      flex="1"
                      sx={{
                        '& > span': {
                          width: '100%'
                        }
                      }}>
                      {' '}
                      <CodeBlock
                        wrapLongLines={true}
                        text={stringifyWithNewLines(data[hyperparameter])}
                        language={'json'}
                        showLineNumbers={true}
                        theme={dracula}
                        multiLine={true}
                        wrapLines
                      />
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
        </Flex>
      </Box>
    </Container>
  );
};
export default Hyperparameters;
