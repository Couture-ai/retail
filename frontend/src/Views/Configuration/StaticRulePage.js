import { useLocation } from 'react-router-dom';
import Container from '../../Components/Container/Container';
import {
  Button,
  Divider,
  Flex,
  Image,
  Input,
  InputGroup,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import upload from '../../Static/images/upload.png';
import {
  Circle,
  Code,
  ContentCopy,
  DeleteOutlineOutlined,
  History,
  Warning
} from '@mui/icons-material';
import csv from '../../Static/images/csv.png';
import Tooltip from '../../Components/Misc/Tooltip';
import React, { useEffect, useState } from 'react';
import CSVViewer from './CSVViewer';
import axios from 'axios';
import papa from 'papaparse';
const StaticRulePage = (props) => {
  const location = useLocation();
  const theme = useTheme();
  const fileName = location.state.fileName;
  const id = location.state.id;
  const isNew = location.state.isNew;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileText, setUploadedFileText] = useState(null);
  const hiddenFileInput = React.useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure();
  const [history, setHistory] = useState([]);
  const [commit, setCommit] = useState('');
  const [description, setDescription] = useState('');
  const fetchHistory = async () => {
    const config = {
      method: 'get',
      url: `${import.meta.env.VITE_SEARCH_CONFIG_URL}/static-rule/${id}/history`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios(config);
      setHistory(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!isNew) {
      fetchHistory();
    }
  }, []);
  const [viewCommit, setViewCommit] = useState(false);
  const [viewFile, setViewFile] = useState(false);
  const fetchCommit = (id) => {
    const config = {
      method: 'get',
      url: `${import.meta.env.VITE_SEARCH_CONFIG_URL}/static-rule/${fileName}?record_id=${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setViewFile(response.data);
        onHistoryOpen();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const uploadFile = () => {
    const formData = new FormData();
    const parse_csv = papa.parse(uploadedFileText, {
      header: false
    });
    const data = {};
    parse_csv.data[0].forEach((item, index) => {
      data[item] = parse_csv.data.slice(1).map((row) => {
        return row[index];
      });
    });
    const parse_string = JSON.stringify(data);
    formData.append('rule', parse_string);
    formData.append('name', fileName);
    formData.append('commit', commit);
    formData.append('description', description);

    const config = {
      method: 'post',
      url: `${import.meta.env.VITE_SEARCH_CONFIG_URL}/static-rules`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        fetchHistory();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Container isCollapsed={props.isCollapsed} w="100%">
      {viewFile ? (
        <CSVViewer
          isOpen={isHistoryOpen}
          onOpen={onHistoryOpen}
          onClose={onHistoryClose}
          file={viewFile}
          name={fileName + ' - ' + viewCommit}
        />
      ) : null}
      <Flex direction="column">
        <Text color={theme.colors.gray.semilight}>
          fashions/
          <span
            style={{
              color: theme.colors.orange.main,
              fontWeight: 'bold'
            }}>
            {isNew && uploadedFile ? uploadedFile.name.split('.')[0] : fileName.split('.')[0]}
          </span>
          .csv
        </Text>
        <Flex
          direction={'column'}
          mt="40px"
          gap="10px"
          padding="10px"
          style={{
            borderRadius: '5px',
            border: `1px solid ${theme.colors.gray.hover}`
          }}>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = function () {
                setUploadedFile(file);
                setUploadedFileText(reader.result);
              };
              reader.readAsText(file);
            }}
            ref={hiddenFileInput}
            style={{ display: 'none' }} // Make the file input element invisible
          />
          {!uploadedFile ? (
            <Tooltip text="Upload file">
              <Button
                onClick={() => {
                  hiddenFileInput.current.click();
                }}
                // h="40px"
                // w="40px"
                //add row

                style={{
                  width: '200px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  backgroundColor: 'white',
                  color: theme.colors.secondary.colorGray,
                  borderRadius: '5px',
                  border: `1px solid ${theme.colors.gray.light}`,
                  boxShadow: 'none'
                }}
                leftIcon={
                  <Image src={upload} filter={theme.colors.gray.filter} w="20px" h="20px" />
                }>
                UPLOAD FILE
              </Button>
            </Tooltip>
          ) : null}
          {uploadedFile ? (
            <Flex gap="5px" w="100%">
              <Flex
                gap="10px"
                alignItems={'center'}
                h="40px"
                style={{
                  color: theme.colors.green.main,
                  fontWeight: 'bold',
                  fontSize: '14px',
                  wordBreak: 'break-all',
                  //   border: `1px solid ${theme.colors.green.main}`,
                  borderRadius: '5px',
                  padding: '5px 20px',
                  backgroundColor: theme.colors.green.light
                }}>
                <Image src={csv} w="20px" h="20px" />
                {uploadedFile.name}
              </Flex>
              <Spacer />
              <Tooltip text="View File in a CSV Viewer">
                <Button
                  onClick={() => {
                    onOpen();
                  }}
                  // h="40px"
                  // w="40px"
                  //add row

                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: 'white',
                    color: theme.colors.secondary.colorGray,
                    borderRadius: '5px',
                    border: `1px solid ${theme.colors.gray.light}`,
                    boxShadow: 'none'
                  }}
                  leftIcon={<Code />}>
                  VIEW FILE
                </Button>
              </Tooltip>
              <CSVViewer
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                file={uploadedFileText}
                name={uploadedFile.name}
              />

              <Tooltip text="Remove File">
                <Button
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: theme.colors.red.light,
                    color: theme.colors.red.main,
                    borderRadius: '5px',
                    border: `1px solid ${theme.colors.red.light}`,
                    boxShadow: 'none'
                  }}
                  onClick={() => {
                    setUploadedFile(null);
                  }}
                  leftIcon={<DeleteOutlineOutlined />}>
                  REMOVE FILE
                </Button>
              </Tooltip>
            </Flex>
          ) : null}
          {isNew ? (
            <InputGroup>
              <Input
                sx={{
                  backgroundColor: theme.colors.white,
                  border: `1px solid ${theme.colors.gray.hover}`
                }}
                value={fileName}
                placeholder="File Name"></Input>
            </InputGroup>
          ) : null}
          <InputGroup>
            <Input
              value={commit}
              onChange={(e) => {
                setCommit(e.target.value);
              }}
              sx={{
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.gray.hover}`
              }}
              placeholder="Write a Title For Commit"></Input>
          </InputGroup>
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            sx={{
              color: theme.colors.gray.light
            }}
            placeholder="Write a Description describing the commit"
            noOfLines={6}></Textarea>
          <Button
            w="200px"
            onClick={() => {
              if (!uploadFile || !commit) {
                alert('Please upload a file and write a commit title');
                return;
              }
              uploadFile();
            }}
            boxShadow={'none'}
            _hover={{
              backgroundColor: `${theme.colors.green.main} !important`
            }}
            bg={uploadedFile ? theme.colors.green.main : theme.colors.green.pastel}
            borderRadius={'5px'}
            leftIcon={<Warning />}
            fontSize={'12px'}>
            COMMIT TO DATABASE
          </Button>
        </Flex>
        <Flex
          display={isNew ? 'none' : null}
          ml="40px"
          direction="column"
          //   h="500px"
          gap="20px"
          pt="20px"
          borderLeft={`1px solid ${theme.colors.gray.hover}`}>
          {history.map((item, index) => {
            return (
              <Flex alignItems={'center'} key={index}>
                <Divider w="20px" h="1px" bg={theme.colors.gray.hover} />
                <Flex
                  alignItems={'center'}
                  w="100%"
                  style={{
                    padding: '10px',
                    border: `1px solid ${theme.colors.gray.hover}`,
                    borderRadius: '5px'
                  }}>
                  <Image src={csv} w="50px" h="50px" />
                  <Flex direction="column" ml="10px">
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        wordBreak: 'break-all',
                        color: theme.colors.blue.main,
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}>
                      {fileName}
                    </Text>
                    <Flex alignItems={'center'}>
                      <Text
                        mr="5px"
                        style={{
                          color: theme.colors.secondary.colorGray
                        }}>
                        {item?.data?.commit ? item.data.commit : 'No Title'}
                      </Text>
                      <Circle
                        style={{
                          transform: 'scale(0.5)',
                          color: theme.colors.green.main
                        }}
                      />
                      <Text color={theme.colors.green.main} fontWeight={'bold'}>
                        {item.action.toLowerCase()}
                      </Text>
                      <Text ml="2px" color={theme.colors.gray.semilight}>
                        {' '}
                        on {item?.timestamp.split('T')[0]}
                      </Text>
                    </Flex>
                  </Flex>
                  <Spacer />
                  <Flex gap="10px">
                    {' '}
                    <Tooltip text="Copy Commit ID">
                      <Button
                        onClick={() => {}}
                        style={{
                          padding: '5px 20px',
                          fontSize: '12px',
                          backgroundColor: theme.colors.blue.light,
                          color: theme.colors.blue.main,
                          borderRadius: '20px',
                          //   border: `1px solid ${theme.colors.gray.light}`,
                          boxShadow: 'none'
                        }}
                        leftIcon={<ContentCopy style={{ transform: 'scale(0.7)' }} />}>
                        {item.id}
                      </Button>
                    </Tooltip>
                    <Tooltip text="View File in a CSV Viewer">
                      <Button
                        onClick={() => {
                          setViewCommit(item.id);
                          fetchCommit(item.id);
                          //   onHistoryOpen();
                        }}
                        // h="40px"
                        // w="40px"
                        //add row

                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          backgroundColor: 'white',
                          color: theme.colors.secondary.colorGray,
                          borderRadius: '5px',
                          border: `1px solid ${theme.colors.gray.light}`,
                          boxShadow: 'none'
                        }}
                        leftIcon={<Code />}>
                        VIEW FILE
                      </Button>
                    </Tooltip>
                    <Tooltip text="Revert to this Version. It won't delete later versions, but add this on the top of latest.">
                      <Button
                        onClick={() => {}}
                        // h="40px"
                        // w="40px"
                        //add row

                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          backgroundColor: theme.colors.red.light,
                          color: theme.colors.red.main,
                          borderRadius: '5px',
                          border: `1px solid ${theme.colors.red.light}`,
                          boxShadow: 'none'
                        }}
                        leftIcon={<History />}>
                        REVERT
                      </Button>
                    </Tooltip>
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
          <Flex alignItems={'center'} ml="20px" color={theme.colors.gray.semilight}>
            <Code fontSize="13px" />{' '}
            <Text ml="5px" style={{ fontWeight: 'bold', fontSize: '13px' }}>
              Updates On March 23, 2024
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
export default StaticRulePage;
