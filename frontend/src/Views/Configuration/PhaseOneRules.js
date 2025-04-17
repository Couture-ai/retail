/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import papa from 'papaparse';
import './configuration.css';
import Tooltip from '../../Components/Misc/Tooltip';
import enter from '../../Static/images/enter.png';
import React, { useRef, useState } from 'react';
import { CodeBlock, dracula } from 'react-code-blocks';
import Container from '../../Components/Container/Container';
import _data from '../../Data/phase1-rules';
import upload from '../../Static/images/upload.png';
import download from '../../Static/images/download.png';
import save from '../../Static/images/save.png';
import row from '../../Static/images/row.png';
import discard from '../../Static/images/discard.png';
import post_add from '../../Static/images/add-post.png';
import select from '../../Static/images/select.png';
import {
  Add,
  AttachFile,
  Attachment,
  AutoAwesome,
  DataObject,
  DataObjectOutlined,
  Delete,
  DeleteOutline,
  Download,
  Edit,
  Launch,
  LaunchOutlined,
  Notes,
  PlaylistAdd,
  Remove,
  RemoveCircleOutline,
  Repeat,
  Save,
  Search,
  Upload,
  UploadFile,
  Warning
} from '@mui/icons-material';
import CSVViewer from './CSVViewer';
function deepEqual(obj1, obj2) {
  // Check the object types are the same
  if (typeof obj1 !== typeof obj2) return false;

  // If values are strictly equal, return true
  if (obj1 === obj2) return true;

  // If one of them is null or not an object, they are not the same
  if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) return false;

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check the number of properties
  if (keys1.length !== keys2.length) return false;

  // Sort keys to ensure they are in the same order
  keys1.sort();
  keys2.sort();

  // Check keys array equality
  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) return false;
  }

  // Recursively check all properties
  for (let key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
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

const PhaseOneRules = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const hiddenFileInput = useRef(null);

  const theme = useTheme();
  const [format, setFormat] = React.useState('visual');
  const [data, setData] = useState(_data);
  const [savedData, setSavedData] = useState(_data);
  const [focusedKeyRowCol, setFocusedKeyRowCol] = useState({});
  const [expanded, setExpanded] = React.useState(
    Object.keys(data).reduce((acc, key, id) => {
      acc[key] = id == 0 ? true : false;
      return acc;
    }, {})
  );
  const [diffs, setDiffs] = useState(
    Object.keys(data).reduce((acc, key) => {
      acc[key] = {
        view: false,
        added: [],
        deleted: [],
        modified: []
      };
      return acc;
    }, {})
  );

  const [uploadedCSV, setUploadedCSV] = useState({
    key: null,
    file: null
  });
  const [searchQueries, setSearchQueries] = useState(
    Object.keys(data).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {})
  );
  const [selectedRows, setSelectedRows] = React.useState({
    key: null,
    rows: []
  });
  const [selectMode, setSelectMode] = React.useState(null);
  const [search, setSearch] = useState(false);
  return (
    <Container isCollapsed={props.isCollapsed} w="100%">
      <Box w="100%" overflow={'auto'} pl={10} mb="50px">
        <Flex direction={'column'} mb="5">
          <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>Corpus Rules</Text>
          <Box w="80px" h="4px" borderRadius={'2px'} backgroundColor={theme.colors.orange.main} />
        </Flex>
        <Flex mb="2" gap="5px" fontFamily={'Hanken Grotesk'}>
          <Flex
            gap="5px"
            padding="5px 10px"
            style={{
              borderRadius: '5px',
              backgroundColor: theme.colors.gray.lighter
            }}>
            <Button
              // leftIcon={<DataObjectOutlined fontSize="14px" />}
              fontSize={'14px'}
              style={{
                backgroundColor: format === 'json' ? 'white' : 'transparent',
                color: format === 'json' ? 'black' : theme.colors.gray.dark,
                boxShadow: format == 'json' ? '0 0 10px 0 #dddddd' : 'none',
                border: format === 'json' ? `1px solid ${theme.colors.gray.lighter}` : 'none',
                borderRadius: '5px'
              }}
              onClick={() => {
                setFormat('json');
              }}>
              JSON
            </Button>
            <Button
              fontSize={'14px'}
              // leftIcon={<AutoAwesome fontSize="14px" />}
              style={{
                backgroundColor: format === 'visual' ? 'white' : 'transparent',
                color: format === 'visual' ? 'black' : theme.colors.gray.dark,
                boxShadow: format == 'visual' ? '0 0 10px 0 #dddddd' : 'none',
                border: format === 'visual' ? `1px solid ${theme.colors.gray.lighter}` : 'none',
                borderRadius: '5px'
              }}
              onClick={() => {
                setFormat('visual');
              }}>
              Visual Editor
            </Button>
          </Flex>
        </Flex>

        <Flex width="100%" direction="column">
          {format == 'json' ? (
            <CodeBlock
              text={stringifyWithNewLines(savedData, 0)}
              language={'json'}
              showLineNumbers={true}
              theme={dracula}
              multiLine={true}
              wrapLines
            />
          ) : null}
          {format == 'visual' ? (
            <Flex
              direction="column"
              gap="40px"
              mt="20px"
              borderRadius={'5px'}
              padding="20px"
              bg="#fbfbfb">
              {Object.keys(data).map((key) => {
                return (
                  <Flex key={key} direction="column" gap="10px">
                    <Flex alignItems={'center'} gap="10px">
                      <Text>{key}</Text>
                      {
                        // unsaved changes
                        !deepEqual(data[key], savedData[key]) ? (
                          <span
                            style={{
                              fontSize: '14px',
                              color: theme.colors.red.main
                            }}>
                            [Unsaved Changes]
                          </span>
                        ) : null
                      }

                      <IconButton
                        bg={theme.colors.white}
                        color={theme.colors.gray.light}
                        boxShadow={'none'}
                        size={'6px'}
                        _hover={{
                          backgroundColor: theme.colors.gray.bg
                        }}
                        border={`1px solid ${theme.colors.gray.light}`}
                        borderRadius={'5px'}
                        icon={!expanded[key] ? <Add /> : <Remove />}
                        onClick={() => {
                          setExpanded({ ...expanded, [key]: !expanded[key] });
                        }}></IconButton>
                    </Flex>

                    <Text
                      style={{
                        fontSize: '14px',
                        color: '#777777'
                      }}>
                      {data[key]['description']}
                    </Text>
                    {expanded[key] ? (
                      <Flex direction="column" gap="20px">
                        {' '}
                        <CodeBlock
                          text={stringifyWithNewLines(data[key]['data'], 0)}
                          language={'json'}
                          showLineNumbers={true}
                          theme={dracula}
                          multiLine={true}
                          wrapLines
                        />
                        <Flex gap="10px">
                          <Spacer />
                          <Box className={search ? 'wrap active' : 'wrap'}>
                            <input
                              value={searchQueries[key]}
                              onChange={(e) => {
                                setSearchQueries({ ...searchQueries, [key]: e.target.value });
                              }}
                              type="text"
                              className={
                                search
                                  ? `${key.split(' ').join('')}-input input active`
                                  : `${key.split(' ').join('')}-input input`
                              }
                              placeholder="Search"
                            />
                            <Search
                              className="fa fa-search"
                              aria-hidden="true"
                              onClick={() => {
                                setSearch(!search);
                                // set focus to input
                                // if (search)
                                document.querySelector(`.${key.split(' ').join('')}-input`).focus();
                              }}
                            />
                          </Box>

                          {selectMode == key ? (
                            <Tooltip text="Delete">
                              <IconButton
                                h="40px"
                                w="40px"
                                //add row
                                onClick={() => {
                                  setDiffs({
                                    ...diffs,
                                    [key]: {
                                      ...diffs[key],
                                      deleted: [
                                        ...diffs[key].deleted,
                                        ...selectedRows.rows.map((i) => data[key]['data'][i])
                                      ]
                                    }
                                  });
                                  setData({
                                    ...data,
                                    [key]: {
                                      ...data[key],
                                      data: data[key]['data'].filter(
                                        (_, i) => !selectedRows.rows.includes(i)
                                      )
                                    }
                                  });
                                  setSelectedRows({
                                    key: key,
                                    rows: []
                                  });
                                }}
                                style={{
                                  backgroundColor:
                                    selectedRows.rows.length == 0
                                      ? theme.colors.red.light
                                      : theme.colors.red.main,
                                  borderRadius: '5px',
                                  border:
                                    selectedRows.rows.length == 0
                                      ? `1px solid ${theme.colors.red.main}`
                                      : `1px solid ${theme.colors.red.main}`,
                                  boxShadow: 'none'
                                }}
                                icon={
                                  <DeleteOutline
                                    style={{
                                      color:
                                        selectedRows.rows.length == 0
                                          ? theme.colors.red.main
                                          : theme.colors.white
                                    }}
                                  />
                                }
                              />
                            </Tooltip>
                          ) : null}
                          <Tooltip text="Selection Mode">
                            <IconButton
                              h="40px"
                              w="40px"
                              //add row
                              onClick={() => {
                                if (selectMode == key) {
                                  setSelectMode(null);
                                  setSelectedRows({
                                    key: null,
                                    rows: []
                                  });
                                } else {
                                  setSelectMode(key);
                                  setSelectedRows({
                                    key: key,
                                    rows: []
                                  });
                                }
                              }}
                              style={{
                                backgroundColor:
                                  selectMode == key ? theme.colors.blue.light : theme.colors.white,
                                borderRadius: '5px',
                                border:
                                  selectMode == key
                                    ? `1px solid ${theme.colors.blue.main}`
                                    : `1px solid ${theme.colors.gray.light}`,
                                boxShadow: 'none'
                              }}
                              icon={
                                <Image
                                  src={select}
                                  h="20px"
                                  w="20px"
                                  filter={
                                    selectMode == key
                                      ? theme.colors.blue.filter
                                      : theme.colors.gray.filter
                                  }
                                />
                              }
                            />
                          </Tooltip>

                          <Tooltip text="Add Row">
                            <IconButton
                              //add row
                              h="40px"
                              w="40px"
                              style={{
                                backgroundColor: theme.colors.primary.main,
                                borderRadius: '5px',
                                boxShadow: 'none',
                                color: theme.colors.white
                              }}
                              onClick={() => {
                                const newRow = Object.keys(data[key]['columns']).reduce(
                                  (acc, column) => {
                                    const type = data[key]['columns'][column]['type'];
                                    acc[column] = [
                                      'string',
                                      'number',
                                      'float',
                                      'int',
                                      'string|float'
                                    ].includes(type)
                                      ? ''
                                      : [];
                                    return acc;
                                  },
                                  {}
                                );
                                setData({
                                  ...data,
                                  [key]: {
                                    ...data[key],
                                    data: [...data[key]['data'], newRow]
                                  }
                                });
                              }}
                              icon={<PlaylistAdd />}
                            />
                          </Tooltip>
                          <Tooltip text="Save">
                            <IconButton
                              h="40px"
                              w="40px"
                              //add row
                              onClick={() => {
                                setSavedData({
                                  ...savedData,
                                  [key]: data[key]
                                });
                              }}
                              style={{
                                backgroundColor: deepEqual(data[key], savedData[key])
                                  ? 'white'
                                  : theme.colors.green.light,
                                borderRadius: '5px',
                                border: `1px solid ${
                                  deepEqual(data[key], savedData[key])
                                    ? theme.colors.gray.light
                                    : theme.colors.green.main
                                }`,
                                boxShadow: 'none'
                              }}
                              icon={
                                <Image
                                  src={save}
                                  h="20px"
                                  w="20px"
                                  filter={
                                    deepEqual(data[key], savedData[key])
                                      ? theme.colors.gray.filter
                                      : theme.colors.green.filter
                                  }
                                />
                              }
                            />
                          </Tooltip>
                          <Tooltip text="Discard Changes">
                            <IconButton
                              h="40px"
                              w="40px"
                              //add row
                              onClick={() => {
                                setData({
                                  ...data,
                                  [key]: savedData[key]
                                });
                              }}
                              style={{
                                backgroundColor: deepEqual(data[key], savedData[key])
                                  ? 'white'
                                  : theme.colors.red.light,
                                borderRadius: '5px',
                                border: `1px solid ${
                                  deepEqual(data[key], savedData[key])
                                    ? theme.colors.gray.light
                                    : theme.colors.red.main
                                }`,
                                boxShadow: 'none'
                              }}
                              icon={
                                <Image
                                  src={discard}
                                  h="20px"
                                  w="20px"
                                  filter={
                                    deepEqual(data[key], savedData[key])
                                      ? theme.colors.gray.filter
                                      : theme.colors.red.filter
                                  }
                                />
                              }
                            />
                          </Tooltip>
                          <Tooltip text="Download Data">
                            <IconButton
                              h="40px"
                              w="40px"
                              //add row
                              onClick={() => {
                                // setSavedData(data);
                                // const downloadData = new Blob([JSON.stringify(data[key]['data'])], {
                                //   type: 'text/plain'
                                // });
                                // convert dict to csv
                                const downloadData = new Blob(
                                  [
                                    Object.keys(data[key]['columns']).join('\t') +
                                      '\n' +
                                      data[key]['data']
                                        .map((row) =>
                                          Object.values(row)
                                            .map((v) => JSON.stringify(v))
                                            .join('\t')
                                        )
                                        .join('\n')
                                  ],
                                  {
                                    type: 'text/plain'
                                  }
                                );
                                const url = window.URL.createObjectURL(downloadData);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${key}.tsv`;
                                a.click();
                              }}
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
                          <Menu closeOnSelect={false}>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<Image src={upload} w="15px" h="15px" />}
                              variant="outline"
                            />
                            <MenuList>
                              <input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = function (e) {
                                    //check validity
                                    const parsed = papa.parse(reader.result);
                                    let valid = true;
                                    if (parsed.data.length < 2) {
                                      valid = false;
                                    }
                                    if (
                                      !Object.keys(data[key]['columns']).every((column) =>
                                        parsed.data[0].includes(column)
                                      )
                                    ) {
                                      valid = false;
                                    }
                                    // if column type is string, check if all values are strings. If column type is not string, then check if all the values are json parsable

                                    // Use reader.result
                                    console.log('result', reader.result);
                                    setUploadedCSV({
                                      key: key,
                                      file: reader.result,
                                      name: file.name,
                                      valid: valid
                                    });
                                  };
                                  reader.readAsText(file);
                                }}
                                ref={hiddenFileInput}
                                style={{ display: 'none' }} // Make the file input element invisible
                              />
                              {uploadedCSV.key != key || uploadedCSV.file == null ? (
                                <MenuItem
                                  fontSize={'14px'}
                                  onClick={(e) => {
                                    hiddenFileInput.current.click();
                                  }}
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
                                </MenuItem>
                              ) : (
                                <>
                                  <MenuItem
                                    fontSize="14px"
                                    m="0px 5px"
                                    pl="10px"
                                    w="95%"
                                    style={{
                                      backgroundColor: uploadedCSV.valid
                                        ? theme.colors.green.light
                                        : theme.colors.red.light,
                                      color: uploadedCSV.valid
                                        ? theme.colors.green.main
                                        : theme.colors.red.main,
                                      border: uploadedCSV.valid
                                        ? `1px solid ${theme.colors.green.main}`
                                        : `1px solid ${theme.colors.red.main}`,
                                      borderRadius: '2px',
                                      wordWrap: 'break-all'
                                    }}>
                                    {uploadedCSV.valid ? (
                                      <Attachment
                                        style={{ marginRight: '5px', transform: 'scale(0.9)' }}
                                      />
                                    ) : (
                                      <Warning
                                        style={{ marginRight: '5px', transform: 'scale(0.9)' }}
                                      />
                                    )}
                                    {uploadedCSV.name} {uploadedCSV.valid ? '' : '[Wrong Format]'}
                                  </MenuItem>
                                  <CSVViewer
                                    isOpen={isOpen}
                                    onOpen={onOpen}
                                    onClose={onClose}
                                    file={uploadedCSV.file}
                                    name={uploadedCSV.name}
                                  />
                                  <MenuItem
                                    fontSize="14px"
                                    icon={
                                      <LaunchOutlined
                                        style={{
                                          transform: 'scale(0.7)',
                                          color: theme.colors.gray.semilight
                                        }}
                                      />
                                    }
                                    onClick={() => {
                                      onOpen();
                                    }}
                                    command="⌘T">
                                    View Uploaded Data
                                  </MenuItem>{' '}
                                  <MenuItem
                                    fontSize="14px"
                                    onClick={() => {
                                      setUploadedCSV({
                                        key: null,
                                        file: null
                                      });
                                    }}
                                    icon={
                                      <RemoveCircleOutline
                                        style={{
                                          transform: 'scale(0.7)',
                                          color: theme.colors.gray.semilight
                                        }}
                                      />
                                    }
                                    command="⌘T">
                                    Remove Uploaded File
                                  </MenuItem>
                                  {uploadedCSV.valid ? (
                                    <>
                                      <MenuItem
                                        fontSize="14px"
                                        icon={
                                          <Add
                                            style={{
                                              transform: 'scale(0.7)',
                                              color: theme.colors.gray.semilight
                                            }}
                                          />
                                        }
                                        onClick={() => {
                                          const parsed = papa.parse(uploadedCSV.file);
                                          setData({
                                            ...data,
                                            [key]: {
                                              ...data[key],
                                              data: [
                                                ...data[key]['data'],
                                                ...parsed.data.slice(1).map((row) => {
                                                  return Object.keys(data[key]['columns']).reduce(
                                                    (acc, column, i) => {
                                                      const type =
                                                        data[key]['columns'][column]['type'];
                                                      if (
                                                        type == 'string' ||
                                                        type == 'boolean' ||
                                                        type == 'float'
                                                      )
                                                        acc[column] = row[i];
                                                      else {
                                                        try {
                                                          acc[column] = JSON.parse(row[i]);
                                                        } catch (e) {
                                                          acc[column] = row[i];
                                                        }
                                                      }
                                                      return acc;
                                                    },
                                                    {}
                                                  );
                                                })
                                              ]
                                            }
                                          });
                                        }}
                                        command="⌘T">
                                        Append data to table
                                      </MenuItem>
                                      <MenuItem
                                        fontSize="14px"
                                        icon={
                                          <Warning
                                            style={{
                                              transform: 'scale(0.7)',
                                              color: theme.colors.red.main
                                            }}
                                          />
                                        }
                                        color={theme.colors.red.main}
                                        onClick={() => {
                                          const parsed = papa.parse(uploadedCSV.file);
                                          setData({
                                            ...data,
                                            [key]: {
                                              ...data[key],
                                              data: parsed.data.slice(1).map((row) => {
                                                return Object.keys(data[key]['columns']).reduce(
                                                  (acc, column, i) => {
                                                    // check column type
                                                    const type =
                                                      data[key]['columns'][column]['type'];
                                                    if (
                                                      type == 'string' ||
                                                      type == 'boolean' ||
                                                      type == 'float'
                                                    )
                                                      acc[column] = row[i];
                                                    else {
                                                      try {
                                                        acc[column] = JSON.parse(row[i]);
                                                      } catch (e) {
                                                        acc[column] = row[i];
                                                      }
                                                    }
                                                    return acc;
                                                  },
                                                  {}
                                                );
                                              })
                                            }
                                          });
                                        }}
                                        command="⌘N">
                                        Replace table with data
                                      </MenuItem>
                                    </>
                                  ) : null}
                                </>
                              )}
                            </MenuList>
                          </Menu>
                          <Tooltip text="View changes and Diffs">
                            <Button
                              onClick={() => {
                                setDiffs({
                                  ...diffs,
                                  [key]: {
                                    ...diffs[key],
                                    view: !diffs[key].view
                                  }
                                });
                              }}
                              // h="40px"
                              // w="40px"
                              //add row

                              style={{
                                padding: '5px 10px',
                                fontSize: '12px',
                                backgroundColor: diffs[key].view
                                  ? theme.colors.blue.light
                                  : 'white',
                                color: diffs[key].view
                                  ? theme.colors.blue.main
                                  : theme.colors.secondary.colorGray,
                                borderRadius: '5px',
                                border: `1px solid ${theme.colors.gray.light}`,
                                boxShadow: 'none'
                              }}
                              leftIconm={<DataObject />}>
                              VIEW DIFF
                            </Button>
                          </Tooltip>
                        </Flex>
                        <TableContainer>
                          <Table border="1px solid #dddddd" borderRadius={'5px'}>
                            <Thead>
                              <Tr>
                                {selectMode == key ? (
                                  <Th w="40px">
                                    <Checkbox
                                      isChecked={
                                        selectedRows.rows.length === data[key]['data'].length
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedRows({
                                            key: key,
                                            rows: data[key]['data'].map((_, i) => i)
                                          });
                                        } else {
                                          setSelectedRows({
                                            key: key,
                                            rows: []
                                          });
                                        }
                                      }}
                                      size={'lg'}
                                    />{' '}
                                  </Th>
                                ) : null}
                                {Object.keys(data[key]['columns']).map((column) => {
                                  return <Th key={column}>{column}</Th>;
                                })}
                              </Tr>
                            </Thead>
                            <Tbody>
                              {data[key]['data'].map((row, row_id) => {
                                // check if search query is present in any of the columns
                                const searchQuery = searchQueries[key].toLowerCase();
                                const present = Object.values(row).some((value) =>
                                  JSON.stringify(value).toLowerCase().includes(searchQuery)
                                );
                                if (!present && searchQuery) return null;
                                return (
                                  <Tr key={JSON.stringify(row)}>
                                    {selectMode == key ? (
                                      <Td width={'40px'}>
                                        <Checkbox
                                          isChecked={selectedRows.rows.includes(row_id)}
                                          onChange={(e) => {
                                            console.log('checked', e.target);
                                            if (e.target.checked) {
                                              setSelectedRows({
                                                key: key,
                                                rows: [...selectedRows.rows, row_id]
                                              });
                                            } else {
                                              setSelectedRows({
                                                key: key,
                                                rows: selectedRows.rows.filter((r) => r !== row_id)
                                              });
                                            }
                                          }}
                                          size="lg"
                                        />
                                      </Td>
                                    ) : null}
                                    {Object.keys(data[key]['columns']).map((column) => {
                                      return (
                                        <Td key={column}>
                                          {typeof row[column] === 'object' ? (
                                            // <CodeBlock
                                            //   text={stringifyWithNewLines(row[column], 0)}
                                            //   language={'json'}
                                            //   showLineNumbers={true}
                                            //   theme={dracula}
                                            //   multiLine={true}
                                            //   wrapLines
                                            // />
                                            <Textarea
                                              defaultValue={JSON.stringify(
                                                data[key]['data'][row_id][column]
                                              )}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  setFocusedKeyRowCol({});
                                                  try {
                                                    const jsonable = JSON.parse(e.target.value);

                                                    setData({
                                                      ...data,
                                                      [key]: {
                                                        ...data[key],
                                                        data: data[key]['data'].map((r) => {
                                                          if (r === row) {
                                                            return {
                                                              ...r,
                                                              [column]: JSON.parse(e.target.value)
                                                            };
                                                          }
                                                          return r;
                                                        })
                                                      }
                                                    });
                                                  } catch (e) {
                                                    alert('Invalid JSON');
                                                  }
                                                }
                                              }}
                                              // onChange={(e) => {
                                              //   setData({
                                              //     ...data,
                                              //     [key]: {
                                              //       ...data[key],
                                              //       data: data[key]['data'].map((r) => {
                                              //         if (r === row) {
                                              //           return {
                                              //             ...r,
                                              //             [column]: JSON.parse(e.target.value)
                                              //           };
                                              //         }
                                              //         return r;
                                              //       })
                                              //     }
                                              //   });
                                              // }}
                                            />
                                          ) : (
                                            // row[column]
                                            <InputGroup>
                                              <Input
                                                onFocus={() => {
                                                  setFocusedKeyRowCol({
                                                    key: key,
                                                    row: row_id,
                                                    column: column
                                                  });
                                                }}
                                                defaultValue={data[key]['data'][row_id][column]}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setFocusedKeyRowCol({});

                                                    setData({
                                                      ...data,
                                                      [key]: {
                                                        ...data[key],
                                                        data: data[key]['data'].map((r) => {
                                                          if (r === row) {
                                                            return {
                                                              ...r,
                                                              [column]: e.target.value
                                                            };
                                                          }
                                                          return r;
                                                        })
                                                      }
                                                    });
                                                  }
                                                }}
                                              />
                                              {focusedKeyRowCol.key === key &&
                                              focusedKeyRowCol.row === row_id &&
                                              focusedKeyRowCol.column === column ? (
                                                <InputRightElement width="4.5rem">
                                                  <Button
                                                    mr="8px"
                                                    leftIcon={
                                                      <Image
                                                        src={enter}
                                                        filter={theme.colors.gray.filter}
                                                        h="15px"
                                                        w="15px"
                                                      />
                                                    }
                                                    h="1.75rem"
                                                    size="sm"
                                                    bg="#eeeeee"
                                                    borderRadius={'5px'}
                                                    fontSize={'12px'}
                                                    boxShadow={'none'}
                                                    color="#aaaaaa">
                                                    ENTER
                                                  </Button>
                                                </InputRightElement>
                                              ) : null}
                                            </InputGroup>
                                          )}
                                        </Td>
                                      );
                                    })}
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Flex>
                    ) : null}
                  </Flex>
                );
              })}
            </Flex>
          ) : null}
        </Flex>
      </Box>
    </Container>
  );
};
export default PhaseOneRules;
