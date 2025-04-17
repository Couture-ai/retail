/* eslint-disable no-unused-vars */
import {
  useTheme,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Flex,
  Button,
  Tabs,
  Tab,
  PopoverTrigger,
  TabList,
  Popover,
  PopoverContent,
  useToast,
  Spacer,
  Select,
  CircularProgress,
  useDisclosure
} from '@chakra-ui/react';
import {
  DataObjectOutlined,
  EditNoteOutlined,
  SyncOutlined,
  TabletOutlined,
  UploadOutlined,
  WarningOutlined
} from '@mui/icons-material';
import { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../../Contexts/ThemeContext';
// Lazy-load AceEditor
const AceEditor = lazy(() => import('react-ace'));
// import AceEditor from 'react-ace';

const BulkUploadModal = ({
  isBulkOpen,
  onBulkClose,
  handleFileSubmit,
  examples,
  isSubmitLoading,
  data,
  name
}) => {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitted, setSubmitted] = useState('update');
  useEffect(() => {
    const loadAceModules = async () => {
      const ace = await import('ace-builds/src-noconflict/ace');
      ace.config.set(
        'basePath',
        `${import.meta.env.VITE_ROUTE_PREFIX}/node_modules/ace-builds/src-noconflict`
      );

      await import('ace-builds/src-noconflict/mode-json');
      await import('ace-builds/src-noconflict/mode-text');
      await import('ace-builds/src-noconflict/theme-github');
      await import('ace-builds/src-noconflict/theme-github_dark');
      await import('ace-builds/src-noconflict/ext-searchbox'); // Required for search functionality
    };

    loadAceModules();
  }, []);

  const jsonExample = examples?.json
    ? JSON.stringify(examples.json, null, 2)
    : JSON.stringify(
        [
          {
            name: 'string',
            data_type: 'string',
            searchable: 'bool',
            retrievable: 'bool',
            filterable: 'bool',
            facetable: 'bool'
          }
        ],
        null,
        2
      );
  const csvExample =
    examples?.csv ??
    'name,data_type,searchable,retrievable,filterable,facetable\nattribute_name,string,true,true,true,true';
  const { themeMode } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const [file, setFile] = useState(null);
  const handleButtonClick = () => {
    // Trigger click on the hidden file input
    fileInputRef.current.click();
  };
  const showToast = (text) => {
    toast({
      title: text,
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
          {text}
        </Flex>
      )
    });
  };
  const [mode, setMode] = useState('json');
  const [fileContent, setFileContent] = useState('');
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['csv', 'json'].includes(fileExtension)) {
        showToast('Please Select Only CSV or JSON file');
      } else {
        console.log('Selected file:', files[0]);
        setFile(files[0]);
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target.result;

          if (fileExtension === 'json') {
            try {
              const parsedJson = JSON.parse(content);
              setFileContent(JSON.stringify(parsedJson, null, 2)); // Pretty-print JSON
              setCurrentRTab(1);
              setMode('json');
            } catch (error) {
              showToast('Invalid JSON file format.');
              setFileContent('');
            }
          } else if (fileExtension === 'csv') {
            // Papa.parse(content, {
            //   header: true,
            //   skipEmptyLines: true,
            //   complete: (results) => {
            //     setFileContent(JSON.stringify(results.data, null, 2)); // Convert CSV rows to JSON
            //   },
            //   error: () => {
            //     showToast('Error parsing the CSV file.');
            //     setFileContent('');
            //   }
            // });
            setFileContent(content);
            setCurrentRTab(1);
            setMode('csv');
          }
        };

        reader.onerror = () => {
          showToast('Error reading the file.');
          setFileContent('');
        };

        reader.readAsText(file);
      }
      // Perform any further actions with the selected file
    } else {
      console.log(files);
    }
  };
  const _tabs = [
    {
      name: 'JSON File Format',
      url: 'json',
      icon: DataObjectOutlined,
      locked: false,
      head: 'JSON File Format',
      popover: 'Check the key names necessary to upload file in json format',
      example: jsonExample
    },
    {
      name: 'CSV File Format',
      url: 'csv',
      icon: TabletOutlined,
      locked: false,
      head: 'CSV File Format',

      popover: 'Check the headers necessary to upload file in csv format',
      example: csvExample
    }
  ];
  const _rTabs = [
    {
      name: 'Upload File',
      icon: UploadOutlined,
      head: 'Upload a file to submit',
      popover: 'Only CSV and JSON files expected.'
    },
    {
      name: 'Manual Editor',
      icon: EditNoteOutlined,
      head: 'Edit the text',
      popover: 'Manually edit the texts'
    }
  ];
  const [currentTab, setCurrentTab] = useState(0);
  const [currentRTab, setCurrentRTab] = useState(0);
  return (
    <>
      <Modal
        onClose={onBulkClose}
        //   finalFocusRef={btnRef}
        isOpen={isBulkOpen}
        scrollBehavior={'inside'}
        isCentered>
        <ModalOverlay />
        <ModalContent
          bg={theme.colors.tertiary.background}
          color={theme.colors.tertiary.color}
          minW="1200px"
          maxW="1200px"
          w="1200px"
          minH="600px">
          <ModalHeader>
            <Text fontWeight={'bold'} fontSize={'18px'}>
              {name ?? 'Add Or Edit File'}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="1150px" gap="10px" maxW="1200px" direction={'row'} h="100%">
              <Flex h="100%" flex="1" direction="column" w="50%" gap="30px" minH="500px">
                <Tabs
                  variant={'unstyled'}
                  borderColor={'rgba(0,0,0,0)'}
                  index={currentTab}
                  w="100%">
                  <TabList p="0 0px">
                    {_tabs.map((tab, ind) => {
                      const IconComponent = tab.icon;
                      return (
                        <Popover key={tab.name} placement="bottom-start" trigger="hover">
                          {() => (
                            <>
                              <PopoverTrigger>
                                <Tab
                                  onClick={() => setCurrentTab(ind)}
                                  isDisabled={tab.locked}
                                  borderBottom={
                                    currentTab == ind
                                      ? `2px solid ${theme.colors.highlightBorder.main}`
                                      : null
                                  }
                                  _hover={{
                                    backgroundColor: tab.locked
                                      ? null
                                      : theme.colors.secondary.hover
                                  }}
                                  key={tab.name}
                                  value={ind}>
                                  <Flex gap="5px" alignItems={'center'}>
                                    <IconComponent
                                      style={{
                                        fontSize: '14px',
                                        color: theme.colors.secondary.colorGray
                                      }}
                                    />
                                    <Text
                                      fontSize={'14px'}
                                      color={theme.colors.tertiary.color}
                                      textOverflow={'none'}
                                      fontWeight={currentTab == ind ? 'bold' : null}
                                      wordBreak={'none'}>
                                      {tab.name}
                                    </Text>
                                  </Flex>
                                </Tab>
                              </PopoverTrigger>
                              <PopoverContent
                                bg="rgba(0,0,0,0.8)"
                                p="10px 10px"
                                color="white"
                                border="0px solid transparent"
                                maxW="150px"
                                borderRadius={'5px'}>
                                <Flex
                                  direction={'column'}
                                  gap="5px"
                                  w="100%"
                                  alignItems={'flex-start'}>
                                  <Text fontSize="12px" fontWeight="bold">
                                    {tab.head}
                                  </Text>
                                  <Text fontSize="12px" fontWeight="normal">
                                    {tab.popover}
                                  </Text>
                                </Flex>
                              </PopoverContent>
                            </>
                          )}
                        </Popover>
                      );
                    })}
                  </TabList>
                  {/* <TabIndicator mt="-1.5px" height="2px" bg="#E0846E" borderRadius="1px" /> */}
                </Tabs>
                <Suspense fallback={<div>Loading editor...</div>}>
                  <AceEditor
                    mode={'json'}
                    theme={themeMode == 'light' ? 'github' : 'github_dark'}
                    value={_tabs[currentTab].example}
                    name="json-editor"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      useWorker: false,
                      showLineNumbers: true,
                      tabSize: 2,
                      readOnly: true,
                      highlightActiveLine: false,
                      highlightGutterLine: false
                    }}
                    style={{ width: '100%', height: '50vh' }}
                  />
                </Suspense>
              </Flex>
              <Flex direction="column" w="50%" flex="1">
                <Flex w="100%" alignItems={'center'} gap="20px">
                  <Tabs
                    variant={'unstyled'}
                    borderColor={'rgba(0,0,0,0)'}
                    index={currentTab}
                    w="100%">
                    <TabList p="0 0px">
                      {_rTabs.map((tab, ind) => {
                        const IconComponent = tab.icon;
                        return (
                          <Popover key={tab.name} placement="bottom-start" trigger="hover">
                            {() => (
                              <>
                                <PopoverTrigger>
                                  <Tab
                                    onClick={() => setCurrentRTab(ind)}
                                    borderBottom={
                                      currentRTab == ind
                                        ? `2px solid ${theme.colors.highlightBorder.main}`
                                        : null
                                    }
                                    _hover={{
                                      backgroundColor: theme.colors.secondary.hover
                                    }}
                                    key={tab.name}
                                    value={ind}>
                                    <Flex gap="5px" alignItems={'center'}>
                                      <IconComponent
                                        style={{
                                          fontSize: '14px',
                                          color: theme.colors.secondary.colorGray
                                        }}
                                      />
                                      <Text
                                        fontSize={'14px'}
                                        color={theme.colors.tertiary.color}
                                        textOverflow={'none'}
                                        fontWeight={currentRTab == ind ? 'bold' : null}
                                        wordBreak={'none'}>
                                        {tab.name}
                                      </Text>
                                    </Flex>
                                  </Tab>
                                </PopoverTrigger>
                                <PopoverContent
                                  bg="rgba(0,0,0,0.8)"
                                  p="10px 10px"
                                  color="white"
                                  border="0px solid transparent"
                                  maxW="150px"
                                  borderRadius={'5px'}>
                                  <Flex
                                    direction={'column'}
                                    gap="5px"
                                    w="100%"
                                    alignItems={'flex-start'}>
                                    <Text fontSize="12px" fontWeight="bold">
                                      {tab.head}
                                    </Text>
                                    <Text fontSize="12px" fontWeight="normal">
                                      {tab.popover}
                                    </Text>
                                  </Flex>
                                </PopoverContent>
                              </>
                            )}
                          </Popover>
                        );
                      })}
                    </TabList>
                    {/* <TabIndicator mt="-1.5px" height="2px" bg="#E0846E" borderRadius="1px" /> */}
                  </Tabs>
                  <Spacer />
                  {currentRTab == 1 && data && (
                    <Button
                      width="240px"
                      variant="outline"
                      p="5px 10px"
                      style={{
                        height: '30px',
                        borderRadius: '5px',
                        border: `1px solid ${theme.colors.sleekButton.border}`,
                        color: theme.colors.sleekButton.text,
                        backgroundColor: theme.colors.tertiary.hover,
                        fontSize: '13px',

                        boxShadow: 'none',
                        fontWeight: '600'
                      }}
                      //   size="sm"

                      _hover={{
                        bg: theme.colors.tertiary.hover
                      }}
                      rightIcon={<SyncOutlined style={{ fontSize: '13px' }} />}
                      onClick={() => {
                        setMode('json');
                        setFileContent(data);
                      }}>
                      Load Current
                    </Button>
                  )}
                  {currentRTab == 1 && (
                    <Select
                      height={'30px'}
                      fontSize={'13px'}
                      w="150px"
                      value={mode}
                      onChange={(e) => {
                        setMode(e.target.value);
                      }}>
                      <option value="json">json</option>
                      <option value="csv">csv</option>
                    </Select>
                  )}
                </Flex>
                {currentRTab == 0 ? (
                  <Flex
                    mt="30px"
                    minH="50vh"
                    h="100%"
                    border="1px solid"
                    borderColor={theme.colors.tertiary.border}
                    borderRadius={'5px'}
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
                        <Text textAlign={'center'}>{file.name}</Text>
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
                              setFileContent('');
                            }}>
                            Delete File
                          </Button>
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                ) : null}
                {currentRTab == 1 ? (
                  <Flex w="100%" minH="50vh" mt="30px">
                    <Suspense fallback={<div>Loading editor...</div>}>
                      <AceEditor
                        mode={'json'}
                        theme={themeMode == 'light' ? 'github' : 'github_dark'}
                        value={fileContent}
                        onChange={(v) => setFileContent(v)}
                        name="json-editor"
                        setOptions={{
                          useWorker: false,
                          showLineNumbers: true,
                          tabSize: 2
                        }}
                        style={{ width: '100%', height: '50vh' }}
                      />
                    </Suspense>
                  </Flex>
                ) : null}
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              fontSize="14px"
              onClick={() => {
                onBulkClose();
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
              }}>
              Discard & Close
            </Button>
            <Button
              _hover={{}}
              onClick={async () => {
                onOpen();
                // await handleFileSubmit(file, fileContent, mode);
                // onBulkClose();
              }}
              fontSize="14px"
              bg={theme.colors.button.successbg}
              color="white">
              {isSubmitLoading ? (
                <CircularProgress
                  boxSize={'15px'}
                  size="15px"
                  w="15px"
                  h="15px"
                  color="gray"
                  isIndeterminate
                />
              ) : (
                'Commit Attributes To Database'
              )}
            </Button>
          </ModalFooter>
          {/* <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Or Overwrite?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Overwriting it would delete all the previous data.</ModalBody>
          <ModalFooter>
            <Flex gap="10px">
              {' '}
              <Button
                fontSize="14px"
                isDisabled={isSubmitLoading}
                bg={theme.colors.highlightBorder.main}
                color="white"
                _hover={{
                  bg: theme.colors.highlightBorder.main
                }}
                onClick={async () => {
                  setSubmitted('overwrite');
                  if (currentRTab == 0) await handleFileSubmit(file, fileContent, mode, true);
                  else await handleFileSubmit(null, fileContent, mode, true);
                  onClose();
                  onBulkClose();
                }}>
                {isSubmitLoading && submitted == 'overwrite' ? (
                  <CircularProgress
                    boxSize={'15px'}
                    size="15px"
                    w="15px"
                    h="15px"
                    color="gray"
                    isIndeterminate
                  />
                ) : (
                  'Overwrite'
                )}
              </Button>
              <Button
                fontSize="14px"
                isDisabled={isSubmitLoading}
                bg={theme.colors.button.successbg}
                _hover={{
                  bg: theme.colors.button.successbg
                }}
                color="white"
                onClick={async () => {
                  setSubmitted('update');

                  if (currentRTab == 0) await handleFileSubmit(file, fileContent, mode);
                  else await handleFileSubmit(null, fileContent, mode);
                  onClose();
                  onBulkClose();
                }}>
                {isSubmitLoading && submitted == 'update' ? (
                  <CircularProgress
                    boxSize={'15px'}
                    size="15px"
                    w="15px"
                    h="15px"
                    color="gray"
                    isIndeterminate
                  />
                ) : (
                  'Append'
                )}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default BulkUploadModal;
