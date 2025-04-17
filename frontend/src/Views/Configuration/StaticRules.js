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
import React, { useEffect, useState } from 'react';
import Container from '../../Components/Container/Container';
import _data from '../../Data/phase1-rules';
import fileList from '../../Data/fashions/__list__';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { Add, AddCircle, NoteAddOutlined, Search, UploadFile } from '@mui/icons-material';
import './configuration.css';
import axios from 'axios';
const StaticRules = (props) => {
  const theme = useTheme();
  async function fetchCsv() {
    const response = await fetch('/fashions/bacr_31082023.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    console.log('csv', csv);
    return csv;
  }
  const [fileNames, setFileNames] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const config = {
      method: 'get',
      url: `${import.meta.env.VITE_SEARCH_CONFIG_URL}/static-rules`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // setFileNames(fileList);
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        const _fileNames = data.map((item) => item.name + '.csv');
        // setFileNames(response.data);
        const _fileData = data.map((item) => {
          const created_at = item.created_at.split('T')[0] + ' ' + item.created_at.split('T')[1];
          const updated_at = item.updated_at.split('T')[0] + ' ' + item.updated_at.split('T')[1];
          return {
            id: item.id,
            name: item.name,
            created_at: created_at.split(' ')[0],
            updated_at: updated_at.split(' ')[0],
            text: created_at === updated_at ? 'created' : 'updated'
          };
        });
        console.log(_fileData);
        setFileData(_fileData);
        setFileNames(_fileNames);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const navigate = useNavigate();

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
    <Container bg="#fcfcfc" isCollapsed={props.isCollapsed} w="100%">
      <Box w="100%" overflow={'auto'} pl={10} mb="50px">
        <Flex direction={'column'} mb="5">
          <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>Static Properties</Text>
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
                    title="File Name"
                    color={theme.colors.gray.semilight}
                    fontWeight={'normal'}>
                    <MenuItem
                      fontSize={'14px'}
                      onClick={() => {
                        if (sort.type == 'File Name' && sort.order == 'A-Z')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'File Name', order: 'A-Z' });
                      }}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'File Name' && sort.order === 'A-Z'}
                        onClick={(e) => {
                          setSort({ type: 'File Name', order: 'A-Z' });
                        }}
                      />{' '}
                      A-Z
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        if (sort.type == 'File Name' && sort.order == 'Z-A')
                          setSort({ type: null, order: null });
                        else setSort({ type: 'File Name', order: 'Z-A' });
                      }}
                      fontSize={'14px'}>
                      <Radio
                        mr="10px"
                        isChecked={sort.type === 'File Name' && sort.order === 'Z-A'}
                        onClick={(e) => {
                          setSort({ type: 'File Name', order: 'Z-A' });
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

        <Flex width="100%" direction="column">
          <Flex gap="10px" wrap="wrap">
            {/* add new */}
            <Flex
              _hover={{
                backgroundColor: `${theme.colors.gray.bg} !important`
              }}
              onClick={() => {
                navigate(
                  `${
                    import.meta.env.VITE_ROUTE_PREFIX
                  }/configure/static-properties/${'untitled.csv'}`,
                  {
                    state: {
                      fileName: 'untitled.csv',
                      isNew: true
                    }
                  }
                );
              }}
              cursor={'pointer'}
              w="230px"
              //   alignItems={'center'}
              //   justifyContent={'center'}
              direction={'column'}
              border={`1px solid ${theme.colors.gray.light}`}
              borderRadius="10px">
              <Flex direction="column" w="100%">
                <Flex
                  borderTopLeftRadius={'10px'}
                  borderTopRightRadius={'10px'}
                  h="150px"
                  w="100%"
                  bg={theme.colors.gray.lighter}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  {' '}
                  <NoteAddOutlined
                    style={{
                      color: theme.colors.green.main,
                      transform: 'scale(4)'
                    }}
                  />
                </Flex>
                <Text
                  textAlign={'center'}
                  padding="10px 10px"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: theme.colors.secondary.colorGray,
                    fontFamily: 'Jost'
                  }}>
                  New File
                </Text>
              </Flex>
            </Flex>

            {fileData
              .sort((a, b) => {
                if (appliedSort.type === 'File Name' && appliedSort.order === 'A-Z') {
                  return a['name'].localeCompare(b['name']);
                }
                if (appliedSort.type === 'File Name' && appliedSort.order === 'Z-A') {
                  return b['name'].localeCompare(a['name']);
                }
                return 0;
              })
              .map((data, index) => {
                const fileName = data.name;
                // const data = fileData.find((item) => item.name === fileName);
                // console.log(fileName, data);
                if (!fileName.toLowerCase().includes(search.toLowerCase())) return null;
                return (
                  <Flex
                    _hover={{
                      backgroundColor: theme.colors.gray.lighter,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      navigate(
                        `${
                          import.meta.env.VITE_ROUTE_PREFIX
                        }/configure/static-properties/${fileName}`,
                        {
                          state: {
                            fileName: fileName,
                            id: data.id
                          }
                        }
                      );
                    }}
                    key={index}
                    alignItems={'center'}
                    direction={'column'}
                    w="230px"
                    //   h="200px"
                    borderRadius="10px"
                    border={`1px solid ${theme.colors.gray.light}`}
                    //   p="20px"
                    position="relative">
                    <Box
                      h="150px"
                      borderTopLeftRadius={'10px'}
                      borderTopRightRadius={'10px'}
                      bg={theme.colors.gray.lighter}
                      w="100%"></Box>
                    {/* <Image src={fileName.includes('.csv') ? csv : tsv} w="100px" h="100px" /> */}
                    {/* <Spacer /> */}
                    <Flex alignSelf={'flex-start'} w="100%" p="10px 10px">
                      <Tooltip text={fileName}>
                        <Flex direction="column" alignSelf={'flex-start'}>
                          <Flex>
                            <Image src={fileName.includes('.tsv') ? tsv : csv} w="20px" h="20px" />
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: '14px',
                                wordBreak: 'break-all'
                              }}>
                              {fileName.length > 17 ? fileName.slice(0, 14) + '...' : fileName}
                            </Text>
                          </Flex>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: '12px',
                              color: theme.colors.gray.semilight
                            }}>
                            {data?.text === 'created'
                              ? 'Created on ' + data.created_at
                              : 'Updated on ' + data.updated_at}
                          </Text>
                        </Flex>
                      </Tooltip>
                      <Spacer />
                      <Tooltip text="Download Data">
                        <IconButton
                          h="40px"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          w="40px"
                          //add row

                          style={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            border: `1px solid ${theme.colors.gray.light}`,
                            boxShadow: 'none'
                          }}
                          icon={
                            <Image
                              src={download}
                              h="20px"
                              w="20px"
                              filter={theme.colors.gray.filter}
                            />
                          }
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};
export default StaticRules;
