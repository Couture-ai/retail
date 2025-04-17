import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  HStack,
  Image,
  Flex,
  Menu,
  MenuButton,
  IconButton,
  // MenuItem,
  MenuList,
  ChakraProvider,
  Spacer,
  Divider,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  VStack,
  PopoverFooter,
  Button,
  InputLeftElement,
  MenuItem,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
  useDisclosure,
  Skeleton,
  useTheme
} from '@chakra-ui/react';
import Ascending from './ascending.png';
import Descending from './descending.png';
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  FilterAltOutlined,
  FilterList,
  StarBorderOutlined
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  HamburgerIcon,
  SearchIcon
} from '@chakra-ui/icons';
import {
  Checkbox,
  MenuItem as MenuItemMui,
  OutlinedInput,
  Select,
  //   Skeleton,
  ThemeProvider,
  createTheme
} from '@mui/material';

export const useXTableState = (config) => {
  console.log('STATE render X', config.columns.groups ? true : false);
  const [state, setState] = useState({
    data: null,
    fetchVariables: {
      loading: false,
      error: false,
      started: false,
      errorMessage: false
    },
    pagination: {
      scrolledToBottom: false,
      pageSize: config.pagination.defaultPageSize ? config.pagination.defaultPageSize : 10,
      pageNumber: 1,
      totalPages: 0,
      totalRecords: 0
    },
    sort: {
      name: '',
      order: ''
    },
    search: {
      globalSearchTerm: ''
    },
    columns: {
      groups: config.columns.groups
        ? {
            showGroups: true,
            groups: config.columns.groups.groups.reduce((acc, group) => {
              acc[group.name] = {
                collapsed: group.defaultCollapsed ? group.defaultCollapsed : false,
                hidden: false
              };
              return acc;
            }, {})
          }
        : null,
      hiddenColumns: config.columns.defaultHiddenColumns ? config.columns.defaultHiddenColumns : []
    },
    filters: config.columns.headers.reduce((acc, header) => {
      if (header.filters) {
        acc[header.filters.filterID] =
          header.filters.filterType == 'discrete'
            ? []
            : header.filters.filterType == 'search'
            ? ''
            : header.filters.filterType == 'range'
            ? { min: null, max: null }
            : null;
      }
      return acc;
    }, {}),
    rows: {
      selectionMode: false,
      selectedRows: []
    },

    external: {}
  });
  useEffect(() => {
    const _fetch = config.pagination.fetch;

    if (!_fetch) return;
    // check if datafor page is already fetched
    if (
      state.data &&
      state.data.length > state.pagination.pageSize * (state.pagination.pageNumber - 1)
    )
      return;
    const _pageSize = config.pagination.defaultPageSize ? config.pagination.defaultPageSize : 10;
    const _currentRecords = state.data?.length ?? 0;
    const _currentPage =
      _currentRecords /
      (config.pagination.defaultFetchSize ? config.pagination.defaultFetchSize : _pageSize);
    const _fetchPage = _currentPage + 1;
    if (state.fetchVariables.loading) return;

    setState({
      ...state,
      fetchVariables: {
        ...state.fetchVariables,
        loading: true,
        started: true
      }
    });
    _fetch(state, _fetchPage)
      .then((res) => {
        const { data, totalRecords } = res;
        setState({
          ...state,
          data: [...(state.data ? state.data : []), ...data],
          pagination: {
            ...state.pagination,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / state.pagination.pageSize)
          },
          fetchVariables: {
            ...state.fetchVariables,
            loading: false
          }
        });
      })
      .catch((err) => {
        setState({
          ...state,
          fetchVariables: {
            ...state.fetchVariables,
            loading: false,
            error: true,
            errorMessage: err
          }
        });
      });
  }, [state.pagination.pageNumber]);
  useEffect(() => {
    console.log('X external changed here', state.external);
  }, [state.external]);

  useEffect(() => {
    if (
      config.pagination &&
      config.pagination.allowPagination &&
      state.pagination.scrolledToBottom &&
      config.pagination.infiniteScroll &&
      config.pagination.fetch
    ) {
      const _fetch = config.pagination.fetch;
      const _pageSize = config.pagination.defaultPageSize ?? 10;
      const _currentRecords = state.data?.length ?? 0;
      const _currentPage = _currentRecords / (config.pagination.defaultFetchSize ?? _pageSize);
      const _fetchPage = _currentPage + 1;
      if (state.fetchVariables.loading) return;

      setState({
        ...state,
        fetchVariables: {
          ...state.fetchVariables,
          loading: true,
          started: true
        }
      });
      _fetch(state, _fetchPage)
        .then((res) => {
          const { data, totalRecords } = res;
          setState({
            ...state,
            data: [...(state.data ? state.data : []), ...data],
            pagination: {
              ...state.pagination,
              totalRecords: totalRecords,
              totalPages: Math.ceil(totalRecords / state.pagination.pageSize)
            },
            fetchVariables: {
              ...state.fetchVariables,
              loading: false
            }
          });
        })
        .catch((err) => {
          setState({
            ...state,
            fetchVariables: {
              ...state.fetchVariables,
              loading: false,
              error: true,
              errorMessage: err
            }
          });
        });
    }
  }, [state.pagination.scrolledToBottom]);

  useEffect(() => {
    console.log('x external FETCH CALLED DUE TO STATE CHANGE');
    const _fetch = config.pagination.fetch;

    if (!_fetch) return;
    // check if datafor page is already fetched

    const _fetchPage = 1;
    if (state.fetchVariables.loading) return;

    setState((_state) => ({
      ..._state,
      data: null,
      pagination: {
        ..._state.pagination,
        pageNumber: 1,
        totalPages: 0,
        totalRecords: 0
      },

      fetchVariables: {
        ..._state.fetchVariables,
        loading: true,
        started: true
      }
    }));
    console.log('X external Fetch initiating');

    _fetch(state, _fetchPage)
      .then((res) => {
        const { data, totalRecords } = res;
        console.log('X external Fetch resolved', res, data);
        // setState({
        //   ...state,
        //   data: [...data],
        //   pagination: {
        //     ...state.pagination,
        //     totalRecords: totalRecords,
        //     totalPages: Math.ceil(totalRecords / state.pagination.pageSize)
        //   },
        //   fetchVariables: {
        //     ...state.fetchVariables,
        //     loading: false
        //   }
        // });
        setState((_state) => {
          console.log('X external fetch resolved state', _state);
          return {
            ..._state,
            data: [...data],
            pagination: {
              ..._state.pagination,
              totalRecords: totalRecords,
              totalPages: Math.ceil(totalRecords / _state.pagination.pageSize)
            },
            fetchVariables: {
              ..._state.fetchVariables,
              loading: false
            }
          };
        });
        console.log('X external Fetch done');
      })
      .catch((err) => {
        console.log('x external fetch error', err);
        // error is token cancecl
        setState((_state) => {
          console.log('x external fetch error state', _state);
          return {
            ..._state,
            fetchVariables: {
              ..._state.fetchVariables,
              loading: false,
              error: true,
              errorMessage: err
            }
          };
        });
      });
    // setState({
    //   ...state,
    //   fetchVariables: {
    //     ...state.fetchVariables,
    //     loading: false
    //   }
    // });
  }, [state.filters, state.sort, state.external]);
  return { state, setState };
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150
    }
  }
};
const XTableRow = ({ row, headers, state, setState, index, groups, loading }) => {
  const actualIndex =
    (index ? index : 0) + state.pagination.pageSize * (state.pagination.pageNumber - 1);
  const [rowHovered, setRowHovered] = useState(false);
  const [_row, _setRow] = useState(row);

  useEffect(() => {
    _setRow(row);
  }, [row]);

  return (
    <Tr
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
      _hover={{
        backgroundColor: '#f7f7f7 !important'
      }}
      style={{
        padding: '20px 0px',
        borderBottom: `2px solid #f7f7f7`
      }}>
      {state.rows.selectionMode && (
        <Td>
          {!loading && (
            <Checkbox
              style={{
                zIndex: '0'
              }}
              checked={state.rows.selectedRows.includes(actualIndex)}
              onChange={() => {
                if (state.rows.selectedRows.includes(actualIndex)) {
                  setState({
                    ...state,
                    rows: {
                      ...state.rows,
                      selectedRows: [
                        ...state.rows.selectedRows.filter((row) => row !== actualIndex)
                      ]
                    }
                  });
                } else {
                  setState({
                    ...state,
                    rows: {
                      ...state.rows,
                      selectedRows: [...state.rows.selectedRows, actualIndex]
                    }
                  });
                }
              }}
              color="success"></Checkbox>
          )}
        </Td>
      )}
      {headers.map((header, i) => {
        if (state.columns.hiddenColumns.includes(header.title)) {
          return null;
        }
        const group =
          groups &&
          groups.allowGroups &&
          groups.groups.find((group) => group.columns.includes(header.title));

        if (group && state.columns.groups.groups[group.name].collapsed) {
          if (group.columns.indexOf(header.title) == 0)
            return (
              <Td
                borderLeft={'1px solid #dddddd'}
                borderRight={'1px solid #dddddd'}
                padding={!loading ? '20px 20px' : null}
                maxW={'300px'}
                colSpan={1}
                key={i}>
                {!loading ? (
                  group.collapsedTransformer ? (
                    group.collapsedTransformer({ row: _row, rowHovered: rowHovered })
                  ) : null
                ) : (
                  <Skeleton style={{ zIndex: '-10' }} height="40px" width="100%" />
                )}
              </Td>
            );
          // } else return null;
          return null;
        }

        return (
          <Td
            borderLeft={
              group && group.columns.indexOf(header.title) == 0 ? '1px solid #dddddd' : null
            }
            borderRight={
              group && group.columns.indexOf(header.title) == group.columns.length - 1
                ? '1px solid #dddddd'
                : null
            }
            padding={!loading ? '20px 20px' : null}
            bg={
              header.cellBackground && !loading
                ? header.cellBackground({ value: _row[header.dataIndex], row: _row })
                : null
            }
            colSpan={header.colSpan ? header.colSpan : 1}
            maxW={'300px'}
            key={i}>
            {!loading ? (
              header.transformer ? (
                header.transformer({
                  value: header.dataIndex ? _row[header.dataIndex] : undefined,
                  row: _row,
                  setRow: _setRow,
                  state: state,
                  setState: setState,
                  rowHovered: rowHovered
                })
              ) : (
                <Text
                  style={{
                    width: '100%',
                    wordBreak: 'break-word !important',
                    whiteSpace: 'normal'
                  }}>
                  {_row[header.dataIndex]}
                </Text>
              )
            ) : (
              <Skeleton style={{ zIndex: '-10' }} height="40px" width="100%" />
            )}
          </Td>
        );
      })}
    </Tr>
  );
};
const XFilter = ({ config, state, setState }) => {
  const [_filters, _setFilters] = useState(state.filters);
  const theme = useTheme();
  useEffect(() => {
    _setFilters(state.filters);
  }, [state.filters]);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [numberOfFiltersApplied, setNumberOfFiltersApplied] = useState(0);
  useEffect(() => {
    let count = 0;
    config.columns.headers.map((header) => {
      if (header.filters) {
        if (_filters[header.filters.filterID]) {
          if (header.filters.filterType == 'discrete') {
            if (_filters[header.filters.filterID].length > 0) {
              count++;
            }
          }
          if (header.filters.filterType == 'range') {
            if (_filters[header.filters.filterID].min || _filters[header.filters.filterID].max) {
              count++;
            }
          }
          if (header.filters.filterType == 'search') {
            if (_filters[header.filters.filterID]) {
              count++;
            }
          }
        }
      }
    });
    setNumberOfFiltersApplied(count);
  }, [state.filters]);
  return (
    <Popover placement="bottom-end" closeOnBlur={false} isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Flex position={'relative'}>
          <IconButton
            onClick={onToggle}
            icon={<FilterAltOutlined style={{ color: 'gray' }} />}
            variant="outline"
          />
          {numberOfFiltersApplied > 0 ? (
            <Flex
              position={'absolute'}
              right={'-5px'}
              top={'-5px'}
              bg="green"
              alignItems={'center'}
              justifyContent={'center'}
              color="white"
              fontWeight={'bold'}
              fontSize={'10px'}
              style={{ width: '15px', height: '15px', borderRadius: '10px' }}>
              {numberOfFiltersApplied}
            </Flex>
          ) : null}
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        width={'500px'}
        fontFamily="Hanken Grotesk"
        style={{
          boxShadow: '0 0 20px 0 #dddddd'
        }}>
        <PopoverCloseButton />
        <PopoverHeader fontWeight={'bold'}>
          <Flex gap="5px">
            <FilterAltOutlined style={{ color: '#999999' }} />
            Filters
          </Flex>
        </PopoverHeader>
        <PopoverBody maxH={config.maxHeight ? config.maxHeight : null} overflowX="scroll">
          <Flex direction="column" gap="20px">
            {' '}
            {state.data &&
              config.columns.headers.map((header, i) => {
                if (!header.filters) return;
                if (
                  _filters[header.filters.filterID] == undefined ||
                  _filters[header.filters.filterID] == null
                ) {
                  return;
                }
                return (
                  <VStack key={i} gap="2px" alignItems={'flex-start'}>
                    <Flex w="100%" alignItems={'center'}>
                      <Text color="#777777">{header.title}</Text>
                      <Spacer />
                      <Text
                        cursor={'pointer'}
                        color="#999999"
                        style={{
                          // textDecoration: 'underline',
                          fontSize: '12px'
                        }}
                        onClick={() => {
                          _setFilters({
                            ..._filters,
                            [header.filters.filterID]:
                              header.filters.filterType == 'discrete'
                                ? []
                                : header.filters.filterType == 'range'
                                ? {
                                    min: null,
                                    max: null
                                  }
                                : ''
                          });
                        }}>
                        clear
                      </Text>
                    </Flex>
                    {header.filters.filterType == 'search' ? (
                      <InputGroup>
                        <Input
                          value={_filters[header.filters.filterID]}
                          onChange={(e) => {
                            _setFilters({
                              ..._filters,
                              [header.filters.filterID]: e.target.value
                            });
                          }}
                          placeholder="Search"
                        />
                        <InputLeftElement>
                          <SearchIcon color={`1px solid ${theme.colors.secondary.colorGray}`} />
                        </InputLeftElement>
                      </InputGroup>
                    ) : null}
                    {header.filters.filterType == 'discrete' ? (
                      <ThemeProvider theme={createTheme()}>
                        <Select
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          // labelStyle={{ color: primaryColor }}
                          sx={{
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: '#f0f0f0'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#f0f0f0'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#f0f0f0'
                            }
                            // '& > .MuiSvgIcon-root ': {
                            //   fill: primaryColor
                            // }
                          }}
                          fullWidth
                          value={_filters[header.filters.filterID]}
                          onChange={(e) => {
                            const val = e.target.value;
                            _setFilters({
                              ..._filters,
                              [header.filters.filterID]: val
                            });
                          }}
                          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                          renderValue={(
                            selected // eslint-disable-next-line
                          ) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => {
                                return header.filters.discrete.optionTransformer
                                  ? header.filters.discrete.optionTransformer({ value })
                                  : value;
                              })}
                            </Box>
                          )}
                          MenuProps={MenuProps}>
                          {header.filters.discrete.options.map(({ label, value }) => {
                            return (
                              <MenuItemMui key={value} value={value}>
                                {label}
                              </MenuItemMui>
                            );
                          })}
                        </Select>
                      </ThemeProvider>
                    ) : null}
                    {header.filters.filterType == 'range' ? (
                      <HStack w="100%" gap="20px">
                        <Text color="#999999">
                          {_filters[header.filters.filterID].min
                            ? _filters[header.filters.filterID].min
                            : '0'}
                        </Text>
                        <RangeSlider
                          step={100}
                          onChange={(e) => {
                            // setState({
                            //   ...state,
                            //   filters: {
                            //     ...state.filters,
                            //     [header.filters.filterID]: {
                            //       min: e[0],
                            //       max: e[1]
                            //     }
                            //   }
                            // });
                            _setFilters({
                              ..._filters,
                              [header.filters.filterID]: {
                                min: e[0],
                                max: e[1]
                              }
                            });
                          }}
                          mt="5px"
                          aria-label={['min', 'max']}
                          min={header.filters.range.defaultMin}
                          max={header.filters.range.defaultMax}
                          value={[
                            _filters[header.filters.filterID].min
                              ? _filters[header.filters.filterID].min
                              : header.filters.range.defaultMin,

                            _filters[header.filters.filterID].max
                              ? _filters[header.filters.filterID].max
                              : header.filters.range.defaultMax
                          ]}
                          defaultValue={[
                            header.filters.range.defaultMin,
                            header.filters.range.defaultMax
                          ]}>
                          <RangeSliderTrack>
                            <RangeSliderFilledTrack />
                          </RangeSliderTrack>
                          <Tooltip
                            hasArrow
                            placement="top"
                            label={`${
                              _filters[header.filters.filterID].min
                                ? _filters[header.filters.filterID].min
                                : header.filters.range.defaultMin
                            }`}>
                            <RangeSliderThumb index={0} />
                          </Tooltip>
                          <Tooltip
                            hasArrow
                            placement="top"
                            label={`${
                              _filters[header.filters.filterID].max
                                ? _filters[header.filters.filterID].max
                                : header.filters.range.defaultMax
                            }`}>
                            <RangeSliderThumb index={1} />
                          </Tooltip>{' '}
                        </RangeSlider>
                        <Text color="#999999">
                          {_filters[header.filters.filterID].max
                            ? _filters[header.filters.filterID].max
                            : '∞'}
                        </Text>
                      </HStack>
                    ) : null}
                  </VStack>
                );
              })}
          </Flex>
        </PopoverBody>
        <PopoverFooter>
          <Flex w="100%">
            <Button
              variant={'outline'}
              onClick={() => {
                _setFilters(
                  config.columns.headers.reduce((acc, header) => {
                    if (header.filters) {
                      if (header.filters.filterType == 'discrete') {
                        acc[header.filters.filterID] = [];
                      }
                      if (header.filters.filterType == 'range') {
                        acc[header.filters.filterID] = {
                          min: null,
                          max: null
                        };
                      }
                      if (header.filters.filterType == 'search') {
                        acc[header.filters.filterID] = '';
                      }
                    }
                    return acc;
                  }, {})
                );
              }}>
              Reset
            </Button>

            <Spacer />
            <Button
              onClick={() => {
                setState({
                  ...state,
                  filters: _filters
                });
                onClose();
              }}>
              Apply
            </Button>
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
export const XTableRowGroup = ({
  rowGroups,
  group,
  headers,
  state,
  setState,
  groups,
  config,
  i
}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <>
      <Tr
        bg="#fefefe"
        style={{
          padding: '0px 0px',
          borderBottom: `2px solid #f7f7f7`
        }}>
        <Td
          colSpan={headers.length}
          style={{
            padding: '00px 00px',
            borderBottom: `2px solid #f7f7f7`,
            fontWeight: 'bold',
            color: '#999999'
          }}>
          {config.rows.rowGroups.groupTransformer
            ? config.rows.rowGroups.groupTransformer({
                value: group.key,
                data: group.data,
                expanded,
                setExpanded,
                state,
                setState
              })
            : group.key}
        </Td>
      </Tr>
      {expanded &&
        group.data.map((row, index) => {
          return (
            <XTableRow
              key={(i > 0 ? rowGroups[i - 1].length : 0) + index}
              row={row}
              headers={headers}
              state={state}
              setState={setState}
              index={index}
              groups={groups}
            />
          );
        })}
    </>
  );
};

export const XTable = ({ config, state, setState, ...props }) => {
  // config
  const headers = config.columns.headers;
  const tableRef = useRef();
  const theme = useTheme();
  const [paginatedData, setPaginatedData] = useState(state.data);
  const [rowGroups, setRowGroups] = useState(null);
  useEffect(() => {
    if (state.data) {
      let _data;
      if (config.pagination && config.pagination.infiniteScroll) {
        _data = state.data;
        setPaginatedData(_data);
      } else {
        _data = state.data.slice(
          state.pagination.pageSize * (state.pagination.pageNumber - 1),
          state.pagination.pageSize * state.pagination.pageNumber
        );
        setPaginatedData(_data);
      }
      if (config.rows.rowGroups && config.rows.rowGroups.allowRowGroup) {
        const _groupKey = config.rows.rowGroups.groupKey;

        // group only consecutive rows
        const _groups = _data.reduce((acc, row, i) => {
          if (i == 0) {
            acc.push({
              key: row[_groupKey],
              data: [row]
            });
          } else {
            if (row[_groupKey] == _data[i - 1][_groupKey]) {
              acc[acc.length - 1].data.push(row);
            }
            if (row[_groupKey] != _data[i - 1][_groupKey]) {
              acc.push({
                key: row[_groupKey],
                data: [row]
              });
            }
          }
          return acc;
        }, []);

        setRowGroups(_groups);
      }
    } else {
      setPaginatedData(null);
    }
  }, [state.data, state.pagination.pageNumber, state.pagination.pageSize]);
  const [groups, setGroups] = useState(config.columns.groups);
  useEffect(() => {
    if (groups && groups.allowGroups && groups.groups) {
      const _groups = {
        ...groups,
        groups: [
          ...groups.groups.map((group, index) => {
            return {
              ...group,
              columns: config.columns.groups.groups[index].columns.filter(
                (col) => !state.columns.hiddenColumns.includes(col)
              )
            };
          })
        ]
      };
      setGroups(_groups);
    }
  }, [state.columns.hiddenColumns]);
  const onScroll = () => {
    const tableEl = tableRef.current;
    if (tableEl.scrollTop === tableEl.scrollHeight - tableEl.offsetHeight) {
      setState({
        ...state,
        pagination: {
          ...state.pagination,
          scrolledToBottom: true
        }
      });
    } else {
      setState({
        ...state,
        pagination: {
          ...state.pagination,
          scrolledToBottom: false
        }
      });
    }
  };
  return (
    <Flex direction="column" gap="5px">
      <ChakraProvider>
        {!config.topMenu ? null : config.topMenu?.hideMenu ? null : (
          <Flex gap="10px" position="relative" zIndex="dropdown">
            <Spacer />
            {config.topMenu?.hideFilters ? null : (
              <XFilter config={config} state={state} setState={setState} />
            )}
            {config.topMenu?.hideSearch ? null : (
              <InputGroup maxW="300px">
                {' '}
                <Input
                  maxW="300px"
                  placeholder="Search"
                  value={state.search.globalSearchTerm}
                  onChange={(e) => {
                    setState({
                      ...state,
                      search: {
                        ...state.search,
                        globalSearchTerm: e.target.value
                      }
                    });
                  }}
                />
                <InputRightElement>
                  <SearchIcon color={`1px solid ${theme.colors.secondary.colorGray}`} />
                </InputRightElement>
              </InputGroup>
            )}
            <Menu closeOnSelect={false} direction="rtl">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList fontFamily="Hanken Grotesk">
                <Menu
                  direction="rtl"
                  zIndex="1000"
                  strategy="absolute"
                  closeOnSelect={false}
                  placement="right-start">
                  <MenuButton
                    padding="0"
                    as={Button}
                    sx={{
                      backgroundColor: 'transparent !important',
                      '& :focus': {
                        backgroundColor: 'transparent !important'
                      },
                      '& :hover': {
                        // backgroundColor: 'transparent !important'
                      }
                    }}>
                    <MenuItem icon={<ChevronLeftIcon />}>Hide Columns</MenuItem>
                  </MenuButton>
                  <MenuList>
                    {config.columns.headers.map((header, i) => (
                      <MenuItem
                        style={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          color: config.columns.unhideableColumns?.includes(header.title)
                            ? '#999999'
                            : null
                        }}
                        onClick={() => {
                          if (config.columns.unhideableColumns?.includes(header.title)) return;
                          if (state.columns.hiddenColumns.includes(header.title)) {
                            setState({
                              ...state,
                              columns: {
                                ...state.columns,
                                hiddenColumns: state.columns.hiddenColumns.filter(
                                  (col) => col !== header.title
                                )
                              }
                            });
                          } else {
                            setState({
                              ...state,
                              columns: {
                                ...state.columns,
                                hiddenColumns: [...state.columns.hiddenColumns, header.title]
                              }
                            });
                          }
                        }}
                        key={i}
                        icon={
                          <CheckIcon
                            color={
                              config.columns.unhideableColumns?.includes(header.title)
                                ? '#999999'
                                : '#5A9808'
                            }
                            fontFamily={'Hanken Grotesk'}
                            style={{
                              visibility: state.columns.hiddenColumns?.includes(header.title)
                                ? 'hidden'
                                : 'visible'
                            }}
                          />
                        }>
                        {header.title}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                {/* Select Columns */}
                <MenuItem icon={<DownloadIcon />}>Download Table</MenuItem>
                <MenuItem
                  onClick={() => {
                    setState({
                      ...state,
                      rows: {
                        ...state.rows,
                        selectionMode: !state.rows.selectionMode
                      }
                    });
                  }}
                  icon={
                    <CheckIcon
                      color="green"
                      style={{
                        visibility: state.rows.selectionMode ? 'visible' : 'hidden'
                      }}
                    />
                  }>
                  Selection Mode
                </MenuItem>
                {state.rows.selectionMode && (
                  <Menu
                    direction="rtl"
                    zIndex="1000"
                    strategy="absolute"
                    closeOnSelect={false}
                    placement="right-start">
                    <MenuButton
                      padding="0"
                      as={Button}
                      sx={{
                        backgroundColor: 'transparent !important',
                        '& :focus': {
                          backgroundColor: 'transparent !important'
                        },
                        '& :hover': {
                          // backgroundColor: 'transparent !important'
                        }
                      }}>
                      <MenuItem icon={<ChevronLeftIcon />}>Process Selected Rows</MenuItem>
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<DownloadIcon />}>Download Rows</MenuItem>
                      <MenuItem
                        icon={
                          <StarBorderOutlined style={{ color: '#aaaaaa', fontSize: '15px' }} />
                        }>
                        Mark As Favourite
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </MenuList>
            </Menu>
          </Flex>
        )}
      </ChakraProvider>

      <TableContainer
        {...props}
        maxHeight={config.maxHeight ? config.maxHeight : null}
        onScroll={onScroll}
        height={config.maxHeight ? config.maxHeight : null}
        ref={tableRef}
        overflowY="auto">
        <Table
          style={{ borderSpacing: '0 1em' }}
          __css={{ width: 'full', borderCollapse: 'collapse' }}
          fontSize="14px"
          variant={props.variant || 'simple'}>
          <Thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1
              // opacity: 1
            }}>
            {groups && groups.allowGroups ? (
              <Tr bg="#f6f6f6">
                {state.rows.selectionMode && <Th></Th>}
                {headers &&
                  headers.map((header, i) => {
                    if (state.columns.hiddenColumns.includes(header.title)) {
                      return null;
                    }
                    // check if the header is in a group
                    const group =
                      groups && groups.groups.find((group) => group.columns.includes(header.title));
                    if (group && group.columns.indexOf(header.title) == 0) {
                      return (
                        <Th
                          onClick={() => {
                            console.log('STATE render', state);
                            if (group.collapsible)
                              setState({
                                ...state,
                                columns: {
                                  ...state.columns,
                                  groups: {
                                    ...state.columns.groups,
                                    groups: {
                                      ...state.columns.groups.groups,
                                      [group.name]: {
                                        ...state.columns.groups.groups[group.name],
                                        collapsed:
                                          !state.columns.groups.groups[group.name].collapsed
                                      }
                                    }
                                  }
                                }
                              });
                          }}
                          alignItems={'center'}
                          borderLeft={'1px solid #dddddd'}
                          borderRight={'1px solid #dddddd'}
                          // colSpan={group.columns.length}
                          // sum the colpsans of individual columns in the group
                          colSpan={
                            // check if collapsed
                            state?.columns?.groups?.groups[group.name].collapsed
                              ? 1
                              : group.columns.reduce((acc, col) => {
                                  acc =
                                    acc +
                                    (config.columns.headers.find((header) => header.title == col)
                                      .colSpan
                                      ? config.columns.headers.find((header) => header.title == col)
                                          .colSpan
                                      : 1);
                                  return acc;
                                }, 0)
                          }
                          style={{
                            width: '100%',
                            wordBreak: 'break-word !important',
                            whiteSpace: 'normal'
                          }}
                          _hover={{
                            backgroundColor: '#f0f0f0 !important'
                          }}
                          p="5px 20px"
                          fontWeight={'bold'}
                          maxW={'300px'}
                          position={'relative'}
                          color={'#666666'}
                          cursor={group.collapsible ? 'pointer' : 'default'}
                          key={i}>
                          <Text>{group.name}</Text>
                          <IconButton
                            border={'none'}
                            alignItems={'normal'}
                            _hover={{ background: 'none' }}
                            visibility={group.collapsible ? 'visible' : 'hidden'}
                            icon={
                              state.columns.groups.groups[group.name].collapsed ? (
                                <ChevronRightIcon />
                              ) : (
                                <ChevronLeftIcon />
                              )
                            }
                            variant="outline"
                            size="sm"
                            position={'absolute'}
                            right={'5px'}
                            top={'30%'}
                          />
                        </Th>
                      );
                    } else if (group) return null;
                    else return <Th colSpan={1} maxW={'300px'} key={i}></Th>;
                  })}
              </Tr>
            ) : null}
            <Tr bg="#fafafa">
              {state.rows.selectionMode && (
                // checkbox
                <Th>
                  <Checkbox
                    indeterminate={
                      !paginatedData.every((_, i) =>
                        state.rows.selectedRows.includes(
                          i + state.pagination.pageSize * (state.pagination.pageNumber - 1)
                        )
                      ) &&
                      !Array.from({ length: paginatedData.length }).every(
                        (_, i) =>
                          !state.rows.selectedRows.includes(
                            i + state.pagination.pageSize * (state.pagination.pageNumber - 1)
                          )
                      )
                    }
                    checked={paginatedData.every((_, i) =>
                      state.rows.selectedRows.includes(
                        i + state.pagination.pageSize * (state.pagination.pageNumber - 1)
                      )
                    )}
                    onChange={() => {
                      const ac = (index) =>
                        index + state.pagination.pageSize * (state.pagination.pageNumber - 1);
                      const allArray = Array.from({ length: paginatedData.length }, (_, i) =>
                        ac(i)
                      );
                      if (paginatedData.every((_, i) => state.rows.selectedRows.includes(ac(i)))) {
                        setState({
                          ...state,
                          rows: {
                            ...state.rows,
                            selectedRows: state.rows.selectedRows.filter(
                              (i) => !allArray.includes(i)
                            )
                          }
                        });
                      } else {
                        setState({
                          ...state,
                          rows: {
                            ...state.rows,
                            selectedRows: [
                              ...state.rows.selectedRows,
                              ...paginatedData.map((_, i) => ac(i))
                            ]
                          }
                        });
                      }
                    }}
                    color="success"></Checkbox>
                </Th>
              )}
              {headers &&
                headers.map((header, i) => {
                  const group =
                    groups &&
                    groups.allowGroups &&
                    groups.groups.find((group) => group.columns.includes(header.title));
                  if (state.columns.hiddenColumns.includes(header.title)) {
                    return null;
                  }

                  if (
                    group &&
                    state.columns.groups.groups[group.name].collapsed &&
                    group.columns.indexOf(header.title) == 0
                  ) {
                    return (
                      <Th
                        color="#999999"
                        key={i}
                        borderLeft={'1px solid #dddddd'}
                        p="20px 20px"
                        fontWeight={'bold'}
                        textAlign={'left'}
                        maxW={'300px'}
                        colSpan={header.colSpan ? header.colSpan : 1}
                        borderRight={'1px solid #dddddd'}>
                        {group.collapsedName}
                      </Th>
                    );
                  }

                  if (group && state.columns.groups.groups[group.name].collapsed) {
                    return null;
                  }

                  return (
                    <Th
                      borderLeft={
                        group && group.columns.indexOf(header.title) == 0
                          ? '1px solid #dddddd'
                          : null
                      }
                      borderRight={
                        group && group.columns.indexOf(header.title) == group.columns.length - 1
                          ? '1px solid #dddddd'
                          : null
                      }
                      style={{
                        width: '100%',
                        wordBreak: 'break-word !important',
                        whiteSpace: 'normal'
                      }}
                      _hover={{
                        backgroundColor: '#f0f0f0 !important'
                      }}
                      onClick={() => {
                        if (header.sort) {
                          // check if the current name is title
                          let currentSortOrder;
                          if (header.title == state.sort.name) {
                            currentSortOrder =
                              state.sort.order == 'asc'
                                ? 'desc'
                                : state.sort.order == 'desc'
                                ? ''
                                : 'asc';
                          } else {
                            currentSortOrder = 'asc';
                          }
                          setState({
                            ...state,
                            sort: {
                              name: header.title,
                              dataIndex: header.dataIndex,
                              order: currentSortOrder
                            }
                          });
                        }
                      }}
                      p="20px 20px"
                      fontWeight={'bold'}
                      textAlign={'left'}
                      maxW={'300px'}
                      colSpan={header.colSpan ? header.colSpan : 1}
                      color={'black'}
                      key={i}>
                      <HStack>
                        <Text>{header.title}</Text>
                        {header.sort ? (
                          state.sort.name == header.title ? (
                            state.sort.order == 'asc' ? (
                              <Image w="20px" h="20px" m="2px" src={Ascending} />
                            ) : // <KeyboardDoubleArrowUp style={{ color: 'black' }} />
                            state.sort.order == 'desc' ? (
                              <Image w="20px" h="20px" m="2px" src={Descending} />
                            ) : (
                              <FilterList style={{ color: null }} />
                            )
                          ) : (
                            <FilterList style={{ color: null }} />
                          )
                        ) : null}
                      </HStack>
                    </Th>
                  );
                })}
            </Tr>
          </Thead>
          <Tbody>
            {!state.fetchVariables.loading &&
            config.rows &&
            config.rows.rowGroups &&
            config.rows.rowGroups.allowRowGroup &&
            rowGroups
              ? rowGroups.map((group, i) => {
                  return (
                    <XTableRowGroup
                      key={i}
                      rowGroups={rowGroups}
                      group={group}
                      headers={headers}
                      state={state}
                      setState={setState}
                      groups={groups}
                      config={config}
                      i={i}
                    />
                  );
                })
              : paginatedData &&
                paginatedData.map((row, index) => {
                  return (
                    <XTableRow
                      key={index}
                      row={row}
                      headers={headers}
                      state={state}
                      setState={setState}
                      index={index}
                      groups={groups}
                    />
                  );
                })}
            {state.fetchVariables.loading && (!config.pagination || config.pagination)
              ? Array.from({ length: state.pagination.pageSize }).map((_, i) => (
                  <XTableRow
                    key={i}
                    loading={true}
                    headers={headers}
                    state={state}
                    setState={setState}
                    index={i}
                    groups={groups}
                  />
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
      <Divider w="100%" />

      {state.data &&
        state.data.length > 0 &&
        config.pagination &&
        !config.pagination.infiniteScroll && (
          <>
            <Divider />
            <Flex
              style={{
                bottom: '0',
                width: '90%'
              }}
              justifyContent="space-between"
              alignItems="center"
              ml={5}>
              <Text fontSize="14px">
                {`Showing  ${
                  (state.pagination.pageNumber - 1) * state.pagination.pageSize + 1
                } to  ${Math.min(
                  state.pagination.pageNumber * state.pagination.pageSize,
                  state.pagination.totalRecords
                )} of ${state.pagination.totalRecords} records`}
              </Text>
              <Spacer />
              <Flex justifyContent="flex-end" alignItems="center" mr={10}>
                <Box h="40px" mx={4}>
                  <Divider orientation="vertical" />
                </Box>
                <IconButton
                  onClick={() => {
                    setState({
                      ...state,
                      pagination: {
                        ...state.pagination,
                        pageNumber: state.pagination.pageNumber - 1
                      }
                    });
                  }}
                  isDisabled={state.pagination.pageNumber <= 1}
                  size="sm"
                  variant="iconOutline">
                  <ChevronLeftRounded />
                </IconButton>
                <Text fontSize="14px" size="sm" p={5}>
                  Page {state.pagination.pageNumber} of{' '}
                  {Math.ceil(state.pagination.totalRecords / state.pagination.pageSize)}
                </Text>
                <IconButton
                  variant="iconOutline"
                  onClick={() => {
                    if (state.pagination.pageNumber !== state.pagination.totalPages) {
                      setState({
                        ...state,
                        pagination: {
                          ...state.pagination,
                          pageNumber: state.pagination.pageNumber + 1
                        }
                      });
                    }
                  }}
                  isDisabled={state.pagination.pageNumber >= state.pagination.totalPages}
                  size="sm">
                  <ChevronRightRounded />
                </IconButton>
              </Flex>
            </Flex>
          </>
        )}
      {state.data &&
        state.data.length > 0 &&
        config.pagination &&
        config.pagination.infiniteScroll && (
          <>
            <Divider />
            <Flex
              style={{
                bottom: '0',
                width: '90%'
              }}
              justifyContent="space-between"
              alignItems="center"
              ml={5}>
              <Text fontSize="14px">{`${state.pagination.totalRecords} records`}</Text>
              <Spacer />
            </Flex>
          </>
        )}
    </Flex>
  );
};

// interface ITableConfiguration {
//     title: string;
//     columns: {
//       headers: Array<{
//         title: string;
//         dataIndex: string;
//         dataType: Array<any> | string | number | object | any;
//         key: string;
//         tooltip?: string;
//         colSpan: number;
//         transformer: (value: any, data: any, index: number) => object;
//         sort?: {
//           sortable: boolean;c
//           defaultOrder: "asc" | "desc";
//           sortID: string;
//         };
//         filters?: {
//           filterType: "range" | "discrete" | "search";
//           filterID: string;
//           discrete?: {
//             multiple?: boolean;
//             options?: any[];
//           };
//           range?: {
//             defaultMin?: any;
//             defaultMax?: any;
//           };
//           search?: {
//             defaultSearch: "";
//           };
//         };
//         search?: {
//           searchID: string;
//         };
//       }>;
//       allowHeadersSelection: boolean | false;
//       allowHeadersRearrangement: boolean | false;
//     };
//     rows: {
//       allowMultipleRowsSelection: boolean | false;
//     };
//     pagination?: {
//       showPaginationBar?: boolean;
//       defaultPageSize?: number;
//       position?: "top" | "bottom";
//       allowCustomPageSize?: boolean;
//     };
//     menu?: {
//       filters?: {
//         allowedHeaders: "*" | string[];
//       };
//       search?: {
//         collapsible: boolean;
//         allowedHeaders: "*" | string[];
//       };
//       sort?: {
//         allowedHeaders: string[];
//       };
//       download?: {
//         position: "bar" | "dropdown";
//       };
//       upload?: {
//         position: "bar" | "dropdown";
//       };
//     };
//   }

//   interface ITableState {
//     data?: object[];
//     fetchVariables?: {
//       loading?: boolean;
//       error?: boolean;
//       started?: boolean;
//       errorMessage?: boolean;
//     };
//     pagination?: {
//       pageSize?: number;
//       pageNumber?: number;
//     };
//     filters?: Array<{
//       filterName?: string;
//       discrete?: {
//         values: any[] | any;
//       };
//       range?: {
//         min?: any;
//         max?: any;
//       };
//       search?: {
//         searchTerm?: string;
//       };
//     }>;
//     rows?: {
//       selectedRows?: number[];
//     };
//     columns?: {
//       visibibleColumns?: string[];
//     };
//   }
