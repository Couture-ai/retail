/* eslint-disable no-unused-vars */
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  SearchIcon,
  SmallCloseIcon
} from '@chakra-ui/icons';
import { Divider, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/layout';
import {
  Button,
  ChakraProvider,
  Checkbox,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  Select,
  Skeleton,
  Switch,
  Tag,
  TagLabel,
  TagRightIcon,
  theme,
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import {
  ClearAll,
  CloseOutlined,
  Done,
  SubdirectoryArrowRight,
  Warning
} from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
const flattenNestedSelect = (level) => {
  if (!level) return {};
  if (!level.children) return { [level.name]: '' };
  let names = flattenNestedSelect(level.children);
  names[level.name] = '';
  return names;
};
const highlight = (text, highlight, color) => {
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
const flattenNestedSelectToList = (level) => {
  if (!level) return [];
  if (!level.children) return [level.name];
  let names = flattenNestedSelectToList(level.children);
  return [level.name, ...names];
};
export const useXFiltersState = (config) => {
  const [state, setState] = useState({
    filters: config.filters.reduce((acc, filter) => {
      acc[filter.id] = {
        options: [],
        fetchVariables: {
          loading: false,
          started: false,
          error: false,
          errorMessage: ''
        },
        selected:
          filter.type == 'search'
            ? ''
            : filter.type == 'select'
            ? []
            : filter.type == 'checkbox' && filter.checkbox.multiple
            ? []
            : filter.type == 'checkbox' && !filter.checkbox.multiple
            ? ''
            : filter.type == 'range'
            ? { min: '', max: '' }
            : filter.type == 'boolean'
            ? false
            : filter.type == 'nested_select'
            ? flattenNestedSelect(filter.nested_select)
            : null
      };
      return acc;
    }, {}),
    appliedFilters: config.filters.reduce((acc, filter) => {
      acc[filter.id] = {
        options: [],
        fetchVariables: {
          loading: false,
          started: false,
          error: false,
          errorMessage: ''
        },
        selected:
          filter.type == 'search'
            ? ''
            : filter.type == 'select'
            ? []
            : filter.type == 'checkbox' && filter.checkbox.multiple
            ? []
            : filter.type == 'checkbox' && !filter.checkbox.multiple
            ? ''
            : filter.type == 'range'
            ? { min: '', max: '' }
            : filter.type == 'boolean'
            ? false
            : filter.type == 'nested_select'
            ? flattenNestedSelect(filter.nested_select)
            : null
      };
      return acc;
    }, {}),
    dynamicFiltersConfig: [],
    groups: {
      ...config.groups.reduce((acc, group) => {
        acc[group.id] = {
          expanded: true
        };
        return acc;
      }, {}),
      extraFilters: { expanded: true }
    }
  });

  return { state, setState };
};
const XSearch = ({ state, filter, setState, ref }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [searchedTerm, setSearchedTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(filter.search.options);
  const initialFocusRef = useRef();
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setState({
      ...state,
      filters: {
        ...state.filters,
        [filter.id]: {
          ...state.filters[filter.id],
          selected: searchedTerm
        }
      }
    });
  }, [searchedTerm]);

  return (
    <VStack alignItems={'start'} w="100%" spacing="5px" position={'relative'}>
      <Flex w="100%">
        <Text mb={0} fontSize="13px" textAlign="left">
          {filter.name}
        </Text>
        <Spacer />
        <Text fontSize="10px" color="#aaaaaa" cursor="pointer">
          Clear
        </Text>
      </Flex>
      <Popover
        offset={[null, 30]}
        initialFocusRef={initialFocusRef}
        placement="right"
        isOpen={isOpen}
        onClose={onClose}>
        <PopoverTrigger>
          <Input
            ref={initialFocusRef}
            w="100%"
            h="40px"
            fontSize={'14px'}
            placeholder={'Search ' + filter.name}
            value={searchedTerm}
            onClick={() => {
              setFilteredOptions(
                filter.search.options.filter((option) =>
                  option.toLowerCase().includes(searchedTerm.toLowerCase())
                )
              );
              onOpen();
            }}
            // onFocus={onOpen}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                const _newIndex =
                  highlightedIndex < filteredOptions.length - 1
                    ? highlightedIndex + 1
                    : highlightedIndex;
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev < filteredOptions.length - 1 ? prev + 1 : prev
                );

                const el = document.querySelectorAll('.search-option');
                if (el) {
                  el[_newIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest', // Align the nearest edge of the element with the nearest edge of the scrollable container
                    inline: 'nearest'
                  });
                }
              }
              if (e.key === 'ArrowUp') {
                const _newIndex = highlightedIndex > 0 ? highlightedIndex - 1 : 0;
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                const el = document.querySelectorAll('.search-option');
                if (el) {
                  el[_newIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest', // Align the nearest edge of the element with the nearest edge of the scrollable container
                    inline: 'nearest'
                  });
                }
              }
              if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                  setSearchedTerm(filteredOptions[highlightedIndex]);
                  onClose();
                }
              }
            }}
            onBlur={(e) => {
              // check if target is popover
              console.log('relatedTarget', e.relatedTarget);
              console.log('relatedTarget', e);
              console.log('relatedTarget', e.relatedTarget?.id);
              if (e.relatedTarget && e.relatedTarget.closest('#popover-content')) {
                e.preventDefault();
                return;
              }
              onClose();
            }}
            onChange={(e) => {
              const term = e.target.value;
              const _filteredOptions = filter.search.options.filter((option) =>
                option.toLowerCase().includes(term.toLowerCase())
              );
              setFilteredOptions(_filteredOptions);
              if (_filteredOptions.length > 0) {
                onOpen();
                setHighlightedIndex(0);
              } else onClose();
              setSearchedTerm(e.target.value);
            }}
          />
        </PopoverTrigger>
        <Portal containerRef={ref}>
          <PopoverContent
            id="popover-content"
            width={'300px'}
            fontFamily="Hanken Grotesk"
            style={{
              boxShadow: '0 0 20px 0 #dddddd'
            }}>
            <PopoverArrow />

            <PopoverBody maxHeight="700px" overflowY={'scroll'} p="0">
              {filteredOptions
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((option, k) => {
                  return (
                    <Flex
                      key={k}
                      onClick={() => {
                        setSearchedTerm(option);
                        onClose();
                      }}
                      _hover={{
                        cursor: 'pointer',
                        backgroundColor: highlightedIndex != k ? '#f7f7f7 !important' : null
                      }}
                      w="100%"
                      gap="5px"
                      p="5px 10px"
                      minHeight={'40px'}
                      alignItems={'center'}
                      style={{
                        //   border: '1px solid #EEEEEE',
                        //   borderRadius: '5px',
                        color: highlightedIndex == k ? '#1776F5' : '#000',
                        backgroundColor: highlightedIndex == k ? '#E7F5FB' : '#fff'
                      }}>
                      {/* highlight option searchterm */}
                      <Text flexDirection={'row'} className="search-option">
                        {option}
                      </Text>
                    </Flex>
                  );
                })}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </VStack>
  );
};
const XSelect = ({ state, filter, setState, ref, searchTerm, chakratheme }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [searchedTerm, setSearchedTerm] = useState('');
  const [hovered, setHovered] = useState(false);
  const [searchedHovered, setSearchedHovered] = useState(false);
  const [searchType, setSearchType] = useState('contains');
  const initialFocusRef = useRef();
  const strip = (str) => {
    return str.split('(')[0].trim();
  };
  //   const ref = useRef();
  const fetchOptions = () => {
    if (filter.select.fetchOptions) {
      setState({
        ...state,
        filters: {
          ...state.filters,
          [filter.id]: {
            ...state.filters[filter.id],
            options: [],
            fetchVariables: {
              ...state.filters[filter.id].fetchVariables,
              loading: true,
              started: true,
              error: false,
              errorMessage: ''
            }
          }
        }
      });
      filter.select.fetchOptions(state).then(
        (res) => {
          setState({
            ...state,
            filters: {
              ...state.filters,
              [filter.id]: {
                ...state.filters[filter.id],
                options: res,
                fetchVariables: {
                  ...state.filters[filter.id].fetchVariables,
                  loading: false
                }
              }
            }
          });
        },
        (err) => {
          setState({
            ...state,
            filters: {
              ...state.filters,
              [filter.id]: {
                ...state.filters[filter.id],
                fetchVariables: {
                  ...state.filters[filter.id].fetchVariables,
                  loading: false,
                  error: true,
                  errorMessage: err.message
                }
              }
            }
          });
        }
      );
    }
  };
  return (
    <VStack alignItems={'start'} w="100%" spacing="5px" position={'relative'} ref={ref}>
      <Flex w="100%">
        <Text mb={0} fontSize="13px" textAlign="left">
          {searchTerm
            ? highlight(filter.name, searchTerm, chakratheme.colors.link.bg)
            : filter.name}
        </Text>
        <Spacer />
        {/* <Text
          fontSize="10px"
          color="#aaaaaa"
          cursor="pointer"
          onClick={() => {
            setState({
              ...state,
              filters: {
                ...state.filters,
                [filter.id]: {
                  ...state.filters[filter.id],
                  selected: []
                }
              }
            });
          }}>
          Clear
        </Text> */}
      </Flex>
      <Popover
        offset={[null, 30]}
        initialFocusRef={initialFocusRef}
        placement="right"
        isOpen={isOpen}
        onClose={onClose}>
        <PopoverTrigger>
          <Flex
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
            onClick={() => {
              if (!isOpen) {
                if (filter.select.options) {
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      [filter.id]: {
                        ...state.filters[filter.id],
                        options: filter.select.options
                      }
                    }
                  });
                } else if (filter.select.fetchOptions) {
                  fetchOptions();
                }
              }
              onToggle();
            }}
            _hover={{
              cursor: 'pointer',
              backgroundColor: `${chakratheme.colors.tertiary.hover} !important`
            }}
            w="100%"
            gap="5px"
            minHeight={'40px'}
            alignItems={'center'}
            style={{
              border: `1px solid ${chakratheme.colors.tertiary.border}`,
              borderRadius: '5px',
              backgroundColor: isOpen ? chakratheme.colors.secondary.background : null
              // backgroundColor: isOpen ? '#fefefe' : '#fff'
            }}>
            <Flex wrap="wrap" gap="5px" padding="5px">
              {state.filters[filter.id].selected
                .slice(0, !isOpen ? 3 : undefined)
                .map((option, k) => {
                  return (
                    <Tag
                      key={k}
                      size="md"
                      style={{
                        borderRadius: '2px',
                        border: '1px solid',
                        borderColor: chakratheme.colors.tertiary.border,
                        backgroundColor: chakratheme.colors.tertiary.background,
                        color: chakratheme.colors.tertiary.color
                      }}>
                      <TagLabel>{strip(option)}</TagLabel>
                      {isOpen ? (
                        <TagRightIcon
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setState({
                              ...state,
                              filters: {
                                ...state.filters,
                                [filter.id]: {
                                  ...state.filters[filter.id],
                                  selected: state.filters[filter.id].selected.filter(
                                    (item) => item != option
                                  )
                                }
                              }
                            });
                          }}>
                          <CloseOutlined
                            style={{
                              color: '#AFB0B3'
                            }}
                          />
                        </TagRightIcon>
                      ) : null}
                    </Tag>
                  );
                })}
              {!isOpen && state.filters[filter.id].selected.length > 3 ? (
                <Tag
                  size="md"
                  style={{
                    borderRadius: '0px',
                    backgroundColor: chakratheme.colors.tertiary.hover,
                    color: chakratheme.colors.tertiary.color,
                    border: '1px solid',
                    borderColor: chakratheme.colors.tertiary.border
                  }}>
                  +{state.filters[filter.id].selected.length - 3}
                </Tag>
              ) : null}
            </Flex>
            <Spacer />
            <IconButton
              size="sm"
              color="#999"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  ...state,
                  filters: {
                    ...state.filters,
                    [filter.id]: {
                      ...state.filters[filter.id],
                      selected: []
                    }
                  }
                });
              }}
              variant="ghost"
              visibility={
                hovered && state.filters[filter.id].selected.length ? 'visible' : 'hidden'
              }
              icon={<SmallCloseIcon />}></IconButton>
            <IconButton size="sm" variant="ghost" icon={<ChevronRightIcon />}></IconButton>
          </Flex>
        </PopoverTrigger>
        <Portal
          containerRef={ref}
          sx={{
            '*': {
              borderColor: `${chakratheme.colors.tertiary.border} !important`
            }
          }}>
          <PopoverContent
            borderColor={chakratheme.colors.tertiary.border}
            _focus={{
              borderColor: chakratheme.colors.tertiary.border
            }}
            width={'350px'}
            bg={chakratheme.colors.secondary.background}
            color={chakratheme.colors.secondary.color}
            fontFamily="Hanken Grotesk">
            <PopoverCloseButton />
            <PopoverArrow />
            <PopoverHeader>
              <VStack alignItems={'start'} spacing="5px">
                <Text>{filter.name}</Text>
                <HStack>
                  <InputGroup
                    flex={2}
                    onMouseLeave={() => {
                      setSearchedHovered(false);
                    }}
                    onMouseEnter={() => {
                      setSearchedHovered(true);
                    }}>
                    <Input
                      borderColor={chakratheme.colors.tertiary.border}
                      ref={initialFocusRef}
                      placeholder={'Search ' + filter.name}
                      value={searchedTerm}
                      onChange={(e) => {
                        setSearchedTerm(e.target.value);
                      }}
                    />
                    <InputRightElement
                      visibility={searchedHovered && searchedTerm ? 'visible' : 'hidden'}
                      cursor="pointer">
                      <SmallCloseIcon
                        color="#aaa"
                        onClick={() => {
                          setSearchedTerm('');
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Select
                    flex={1}
                    borderColor={chakratheme.colors.tertiary.border}
                    value={searchType}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                    }}>
                    <option value="contains">Contains</option>
                    <option value="is">Is</option>
                    <option value="startsWith">Starts With</option>
                    <option value="endsWith">Ends With</option>
                  </Select>
                </HStack>
              </VStack>
            </PopoverHeader>
            <PopoverBody maxHeight="700px" overflowY={'scroll'}>
              {state.filters[filter.id].options
                // .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .map((option, k) => {
                  let allowed;
                  if (searchType == 'contains') {
                    allowed = strip(option).toLowerCase().includes(searchedTerm.toLowerCase());
                  } else if (searchType == 'is') {
                    allowed = strip(option).toLowerCase() == searchedTerm.toLowerCase();
                  } else if (searchType == 'startsWith') {
                    allowed = strip(option).toLowerCase().startsWith(searchedTerm.toLowerCase());
                  } else if (searchType == 'endsWith') {
                    allowed = strip(option).toLowerCase().endsWith(searchedTerm.toLowerCase());
                  }
                  if (allowed) {
                    const included = state.filters[filter.id].selected
                      .map((e) => strip(e))
                      .includes(strip(option));
                    return (
                      <Flex
                        key={k}
                        onClick={() => {
                          if (included) {
                            setState({
                              ...state,
                              filters: {
                                ...state.filters,
                                [filter.id]: {
                                  ...state.filters[filter.id],
                                  selected: !filter.select.multiple
                                    ? []
                                    : state.filters[filter.id].selected.filter(
                                        (item) => strip(item) != strip(option)
                                      )
                                }
                              }
                            });
                          } else {
                            setState({
                              ...state,
                              filters: {
                                ...state.filters,
                                [filter.id]: {
                                  ...state.filters[filter.id],
                                  selected: !filter.select.multiple
                                    ? [option]
                                    : [...state.filters[filter.id].selected, option]
                                }
                              }
                            });
                          }
                        }}
                        _hover={{
                          cursor: 'pointer',
                          backgroundColor: !included
                            ? `${chakratheme.colors.tertiary.background} !important`
                            : `${chakratheme.colors.tertiary.hover} !important`
                        }}
                        w="100%"
                        gap="5px"
                        p="5px 10px"
                        minHeight={'40px'}
                        alignItems={'center'}
                        style={{
                          //   border: '1px solid #EEEEEE',
                          //   borderRadius: '5px',
                          backgroundColor: !included
                            ? `${chakratheme.colors.secondary.background} !important`
                            : `${chakratheme.colors.tertiary.background} !important`
                        }}>
                        <Done
                          style={{
                            fontSize: '15px',
                            visibility: included ? 'visible' : 'hidden',
                            color: '#1776F5'
                          }}
                        />
                        {option}
                        <Spacer />
                      </Flex>
                    );
                  }
                })}
            </PopoverBody>
            {state.filters[filter.id].fetchVariables.loading ? (
              <PopoverFooter justifyContent="center" gap="10px">
                <Flex direction="column" gap="5px">
                  <Skeleton w="100%" height="20px" />
                </Flex>
              </PopoverFooter>
            ) : state.filters[filter.id].fetchVariables.error ? (
              <Flex padding="5px 10px" alignItems={'center'}>
                <Flex gap="5px" alignItems={'center'}>
                  <Warning
                    style={{
                      fontSize: '14px',
                      color: '#fccbc7'
                    }}
                  />
                  <Text fontSize={'14px'} color="#666666">
                    Something Went Wrong!
                  </Text>
                </Flex>
                <Spacer />
                <Button
                  onClick={() => {
                    fetchOptions();
                  }}
                  fontSize={'15px'}
                  padding="5px 10px">
                  Try Again
                </Button>
              </Flex>
            ) : (
              <Flex w="100%" p="5px 20px" color="#999999" alignItems={'center'}>
                {
                  state.filters[filter.id].options.filter((option) => {
                    let allowed;
                    if (searchType == 'contains') {
                      allowed = option.toLowerCase().includes(searchedTerm.toLowerCase());
                    } else if (searchType == 'is') {
                      allowed = option.toLowerCase() == searchedTerm.toLowerCase();
                    } else if (searchType == 'startsWith') {
                      allowed = option.toLowerCase().startsWith(searchedTerm.toLowerCase());
                    } else if (searchType == 'endsWith') {
                      allowed = option.toLowerCase().endsWith(searchedTerm.toLowerCase());
                    }
                    return allowed;
                  }).length
                }{' '}
                items
              </Flex>
            )}
          </PopoverContent>
        </Portal>
      </Popover>
    </VStack>
  );
};
const XNestedSelect = ({ state, setState, filter, ref }) => {
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const [searchedTerm, setSearchedTerm] = useState('');
  const initialFocusRef = useRef();
  //   const ref = useRef();
  const childrenNames = (level) => {
    if (!level) return [];
    if (!level.children) return [level.name];
    let names = childrenNames(level.children);
    names.push(level.name);
    return names;
  };

  const populatePopovers = (level, _searchedTerm) => {
    if (level?.children) {
      return level.options
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((option, k) => {
          if (option.toLowerCase().includes(_searchedTerm.toLowerCase()))
            return (
              <XPopoverButton
                state={state}
                setState={setState}
                filterID={filter.id}
                key={k}
                firstPopoverOpen={isOpen}
                filter={{
                  name: level.children.name,
                  child: level.children.children,
                  next: level.children,
                  prev: level.name,
                  options: level.options
                }}
                filterList={flattenNestedSelectToList(level.children)}
                label={option}
                ref={ref}>
                {(_searched) => populatePopovers(level.children, _searched)}
              </XPopoverButton>
            );
        });
    } else
      return level.options
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((option, k) => {
          if (option.toLowerCase().includes(_searchedTerm.toLowerCase()))
            return (
              <Flex
                _hover={{
                  cursor: 'pointer',
                  backgroundColor: '#f7f7f7 !important'
                }}
                onClick={() => {
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      [filter.id]: {
                        ...state.filters[filter.id],
                        selected: {
                          ...state.filters[filter.id].selected,
                          [level.name]: option
                          // set all the others next to current one to empty
                        }
                      }
                    }
                  });
                }}
                key={k}
                w="100%"
                gap="5px"
                minHeight={'40px'}
                alignItems={'center'}
                style={{
                  // border: '1px solid #EEEEEE',
                  borderRadius: '5px',
                  backgroundColor: isOpen ? '#fefefe' : '#fff'
                }}>
                {option} <Spacer />
                {/* <IconButton variant="ghost" icon={<ChevronRightIcon />}></IconButton> */}
              </Flex>
            );
        });
  };
  const populateWindows = (level, parent = null) => {
    if (level?.children) {
      return (
        <XPopoverWindow
          state={state}
          parent={parent}
          setState={setState}
          options={level.options}
          filter={level}
          ref={ref}
          filterID={filter.id}
          filterList={flattenNestedSelectToList(level)}>
          {populateWindows(level.children, level.name)}
        </XPopoverWindow>
      );
    } else
      return (
        <XNormalWindow
          options={level.options}
          parent={parent}
          filter={level}
          state={state}
          setState={setState}
          ref={ref}
          filterID={filter.id}
          filterList={flattenNestedSelectToList(level)}
        />
      );
  };
  const stateAndConfigToString = (state, filter) => {
    const selectedDict = state.filters[filter.id].selected;
    const configList = flattenNestedSelectToList(filter.nested_select);
    return configList
      .map((item) => {
        return selectedDict[item] ? (
          <span
            // style={{
            //   padding: '2px 5px',
            //   borderRadius: '2px',
            //   backgroundColor: '#E7F5FB'
            // }}
            style={{
              padding: '2px 5px',

              borderRadius: '2px',
              border: '1px solid #E7E7E7',
              backgroundColor: '#F1F1F1',
              color: '#2E2F32'
            }}
            key={item}>
            {selectedDict[item]}{' '}
            <span
              style={{
                color: '#999',
                // marginLeft: '2px',
                textDecoration: 'italic'
              }}>
              in {item}
            </span>
          </span>
        ) : null;
      })
      .filter((item) => item)
      .reduce((acc, item, i) => {
        if (i == 0) return [...acc, item];
        else
          return [
            ...acc,
            <SubdirectoryArrowRight key={item} style={{ color: '#bbb', fontSize: '18px' }} />,
            item
          ];
      }, []);
  };

  return (
    <VStack alignItems={'start'} w="100%" spacing="5px" position={'relative'} ref={ref}>
      <Flex w="100%">
        <Text mb={0} fontSize="13px" textAlign="left">
          {filter.name}
        </Text>
        <Spacer />
        <Text
          fontSize="10px"
          color="#aaaaaa"
          cursor="pointer"
          onClick={() => {
            setState({
              ...state,
              filters: {
                ...state.filters,
                [filter.id]: {
                  ...state.filters[filter.id],
                  selected: flattenNestedSelect(filter.nested_select)
                }
              }
            });
          }}>
          Clear
        </Text>
      </Flex>
      <Popover
        isLazy
        lazyBehavior="unmount"
        offset={[null, 30]}
        initialFocusRef={initialFocusRef}
        placement="right"
        isOpen={isOpen}
        closeOnBlur={false}
        onClose={onClose}>
        <PopoverTrigger>
          <Flex
            onClick={() => {
              onToggle();
              //   onOpen();
            }}
            _hover={{
              cursor: 'pointer',
              backgroundColor: '#f7f7f7 !important'
            }}
            w="100%"
            gap="5px"
            minHeight={'40px'}
            alignItems={'center'}
            p="5px"
            fontSize={'14px'}
            style={{
              border: '1px solid #EEEEEE',
              borderRadius: '5px',
              backgroundColor: isOpen ? '#fefefe' : '#fff'
            }}>
            <Flex wrap="wrap" gap="2px" alignItems={'center'}>
              {stateAndConfigToString(state, filter)}{' '}
            </Flex>
            <Spacer />
            <IconButton variant="ghost" icon={<ChevronRightIcon />}></IconButton>
          </Flex>
        </PopoverTrigger>
        <Portal containerRef={ref}>
          <PopoverContent
            onBlur={(e) => {
              const className = e.relatedTarget?.className;
              console.log(
                'relatedTarget',
                e.relatedTarget?.className,
                `popover-content-${filter.nested_select.name}`
              );

              if (
                childrenNames(filter.nested_select.children).some((name) =>
                  className?.includes(`popover-content-${name}`)
                )
              ) {
                e.preventDefault();
                return;
              }
              if (
                e.relatedTarget?.className?.includes(`popover-content-${filter.nested_select.name}`)
              ) {
                e.preventDefault();
                return;
              }
              //   onClose();
            }}
            className={`popover-content-${filter.nested_select.name}`}
            width={'300px'}
            fontFamily="Hanken Grotesk"
            style={{
              boxShadow: '0 0 20px 0 #dddddd'
            }}>
            <PopoverCloseButton className={`popover-content-${filter.nested_select.name}`} />
            <PopoverArrow />

            <PopoverBody maxHeight="700px">{populateWindows(filter.nested_select)}</PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </VStack>
  );
};
const XNormalWindow = ({
  state,
  setState,
  options,
  filter,
  ref,
  filterID,
  label,
  filterList,
  parent
}) => {
  const [searchedTerm, setSearchedTerm] = useState('');
  return (
    <Flex direction="column" w="100%">
      <VStack alignItems={'start'} spacing="5px">
        <Text>
          {filter.name}{' '}
          <span style={{ color: '#bbb' }}>
            in {state.filters[filterID].selected[parent]} {parent}
          </span>
        </Text>
        <Input
          className={`popover-content-${filter.name}`}
          // ref={initialFocusRef}
          placeholder={'Search ' + filter.name}
          value={searchedTerm}
          onChange={(e) => {
            setSearchedTerm(e.target.value);
          }}
        />
      </VStack>
      <Flex mt="10px" direction="column" height="600px" overflowY={'scroll'}>
        {' '}
        {options
          .filter((option) => option.toLowerCase().includes(searchedTerm.toLowerCase()))
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
          .map((option, k) => {
            return (
              <Flex
                key={k}
                onClick={() => {
                  setState({
                    ...state,
                    filters: {
                      ...state.filters,
                      [filterID]: {
                        ...state.filters[filterID],
                        selected: {
                          ...state.filters[filterID].selected,
                          [filter.name]: option,
                          // set all the others next to current one to empty
                          ...filterList.reduce((acc, item) => {
                            if (item == filter.name) return acc;
                            acc[item] = '';
                            return acc;
                          }, {})
                        }
                      }
                    }
                  });
                }}
                _hover={{
                  cursor: 'pointer',
                  backgroundColor: '#f7f7f7 !important'
                }}
                w="100%"
                gap="5px"
                minHeight={'40px'}
                alignItems={'center'}
                style={{
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  // border: '1px solid #EEEEEE',
                  borderRadius: '5px',
                  color: null,
                  backgroundColor: '#fff'
                }}>
                {option} <Spacer />
              </Flex>
            );
          })}
      </Flex>
    </Flex>
  );
};
const XPopoverWindow = ({
  state,
  setState,
  options,
  filter,
  ref,
  filterID,
  label,
  filterList,
  children,
  parent
}) => {
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const _onClose = () => {
    console.log('closing', filter);
    onClose();
  };
  const [searchedTerm, setSearchedTerm] = useState('');
  const childrenNames = (level) => {
    if (!level) return [];
    if (!level.children) return [level.name];
    let names = childrenNames(level.children);
    names.push(level.name);
    return names;
  };
  return (
    <Popover
      isLazy
      lazyBehavior="unmount"
      offset={[0, 20]}
      //   initialFocusRef={initialFocusRef}
      placement="right"
      isOpen={isOpen}
      //   onOpen={onOpen}
      closeOnBlur={false}
      onClose={_onClose}>
      <PopoverAnchor>
        <Flex direction="column" w="100%">
          <VStack alignItems={'start'} spacing="5px">
            <Text pr="20px">
              {filter.name}{' '}
              <span style={{ color: '#bbb' }}>
                in {state.filters[filterID].selected[parent] ?? 'Global'} {parent}
              </span>
            </Text>
            <Input
              className={`popover-content-${filter.name}`}
              // ref={initialFocusRef}
              placeholder={'Search ' + filter.name}
              value={searchedTerm}
              onChange={(e) => {
                setSearchedTerm(e.target.value);
              }}
            />
          </VStack>
          <Flex mt="10px" direction="column" height="600px" overflowY={'scroll'}>
            {' '}
            {options
              .filter((option) => option.toLowerCase().includes(searchedTerm.toLowerCase()))
              .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
              .map((option, k) => {
                return (
                  <Flex
                    className={`popover-content-${filter.name}`}
                    key={k}
                    onClick={() => {
                      // onToggle();
                      onOpen();

                      setState({
                        ...state,
                        filters: {
                          ...state.filters,
                          [filterID]: {
                            ...state.filters[filterID],
                            selected: {
                              ...state.filters[filterID].selected,
                              [filter.name]: option,
                              // set all the others next to current one to empty
                              ...filterList.reduce((acc, item) => {
                                if (item == filter.name) return acc;
                                acc[item] = '';
                                return acc;
                              }, {})
                            }
                          }
                        }
                      });
                    }}
                    _hover={{
                      cursor: 'pointer',
                      backgroundColor: '#f7f7f7 !important'
                    }}
                    w="100%"
                    gap="5px"
                    // minHeight={'40px'}
                    alignItems={'center'}
                    style={{
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      // border: '1px solid #EEEEEE',
                      borderRadius: '5px',
                      color:
                        state.filters[filterID].selected[filter.name] == option ? '#1776F5' : null,
                      backgroundColor:
                        state.filters[filterID].selected[filter.name] == option ? '#E7F5FB' : '#fff'
                    }}>
                    {option} <Spacer />
                    <IconButton variant="ghost" icon={<ChevronRightIcon />}></IconButton>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
      </PopoverAnchor>
      <Portal containerRef={ref}>
        <PopoverContent
          tabIndex={0}
          className={`popover-content-${filter.name}`}
          onBlur={(e) => {
            // check if target is popover

            const className = e.relatedTarget?.className;
            console.log(
              'relatedTarget',
              e,
              e.relatedTarget,
              e.relatedTarget?.className,
              `popover-content-${filter.name}`,
              [...childrenNames(filter.children), filter.name]
            );
            if (
              [...childrenNames(filter.children), filter.name].some((name) =>
                className?.includes(`popover-content-${name}`)
              )
            ) {
              e.preventDefault();
              console.log('relatedTarget returning');
              return;
            }
            if (e.relatedTarget?.className?.includes(`popover-content-${filter.name}`)) {
              e.preventDefault();
              console.log('relatedTarget returning');
              return;
            }
            onClose();
          }}
          width={'300px'}
          fontFamily="Hanken Grotesk"
          style={{
            boxShadow: '0 0 20px 0 #dddddd'
          }}>
          <PopoverCloseButton className={`popover-content-${filter.name}`} />
          <PopoverArrow />
          {/* <PopoverHeader>
            <VStack alignItems={'start'} spacing="5px">
              <Text>{filter.name}</Text>
              <Input
                className={`popover-content-${filter.name}`}
                // ref={initialFocusRef}
                placeholder={'Search ' + filter.name}
                value={searchedTerm}
                onChange={(e) => {
                  setSearchedTerm(e.target.value);
                }}
              />
            </VStack>
          </PopoverHeader> */}
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
const XPopoverButton = ({
  state,
  setState,
  filterID,
  firstPopoverOpen,
  children,
  filter,
  label,
  filterList,
  ref
}) => {
  //   const initialFocusRef = useRef();
  console.log('Filter List', filterList, filter.prev);
  const _selected = state.filters[filterID].selected;
  const { isOpen, onToggle, onClose } = useDisclosure();
  useEffect(() => {
    if (firstPopoverOpen && !isOpen && _selected[filter.prev] == label) {
      onToggle();
    }
  }, [firstPopoverOpen]);
  const [searchedTerm, setSearchedTerm] = useState('');

  const childrenNames = (level) => {
    if (!level) return [];
    if (!level.children) return [level.name];
    let names = childrenNames(level.children);
    names.push(level.name);
    return names;
  };
  console.log('filter relatedTarget', filter.name, childrenNames(filter.child));
  return (
    <Popover
      isLazy
      lazyBehavior="unmount"
      offset={[null, 5]}
      //   initialFocusRef={initialFocusRef}
      placement="right"
      isOpen={isOpen}
      closeOnBlur={false}
      onClose={onClose}>
      <PopoverTrigger>
        <Flex
          onClick={() => {
            onToggle();
            console.log('relatedTarget error', state, filterID);

            setState({
              ...state,
              filters: {
                ...state.filters,
                [filterID]: {
                  ...state.filters[filterID],
                  selected: {
                    ...state.filters[filterID].selected,
                    [filter.prev]: label,
                    // set all the others next to current one to empty
                    ...filterList.reduce((acc, item) => {
                      if (item == filter.prev) return acc;
                      acc[item] = '';
                      return acc;
                    }, {})
                  }
                }
              }
            });
          }}
          _hover={{
            cursor: 'pointer',
            backgroundColor: '#f7f7f7 !important'
          }}
          w="100%"
          gap="5px"
          minHeight={'40px'}
          alignItems={'center'}
          style={{
            paddingLeft: '15px',
            paddingRight: '15px',
            // border: '1px solid #EEEEEE',
            borderRadius: '5px',
            color: isOpen ? '#1776F5' : null,
            backgroundColor: isOpen ? '#E7F5FB' : '#fff'
          }}>
          {label} <Spacer />
          <IconButton variant="ghost" icon={<ChevronRightIcon />}></IconButton>
        </Flex>
      </PopoverTrigger>
      <Portal containerRef={ref}>
        <PopoverContent
          tabIndex={0}
          className={`popover-content-${filter.name}`}
          onBlur={(e) => {
            // check if target is popover

            const className = e.relatedTarget?.className;
            if (
              childrenNames(filter.children).some((name) =>
                className?.includes(`popover-content-${name}`)
              )
            ) {
              e.preventDefault();
              console.log('relatedTarget returning');
              return;
            }
            if (e.relatedTarget?.className?.includes(`popover-content-${filter.name}`)) {
              e.preventDefault();
              console.log('relatedTarget returning');
              return;
            }
            onClose();
          }}
          width={'300px'}
          fontFamily="Hanken Grotesk"
          style={{
            boxShadow: '0 0 20px 0 #dddddd'
          }}>
          <PopoverCloseButton className={`popover-content-${filter.name}`} />
          <PopoverArrow />
          <PopoverHeader>
            <VStack alignItems={'start'} spacing="5px">
              <Text>{filter.name}</Text>
              <Input
                className={`popover-content-${filter.name}`}
                // ref={initialFocusRef}
                placeholder={'Search ' + filter.name}
                value={searchedTerm}
                onChange={(e) => {
                  setSearchedTerm(e.target.value);
                }}
              />
            </VStack>
          </PopoverHeader>
          <PopoverBody maxHeight="700px" overflowY={'scroll'}>
            {children(searchedTerm)}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
const XFilters = ({ config, state, setState }) => {
  const chakratheme = useTheme();
  const ref = useRef();
  const [searchBarQuery, setSearchBarQuery] = useState('');
  const isNotFiltersApplied = Object.keys(state.filters).some((filter) => {
    // check if state.filter and state.appliedFilter are same
    const _selected = state.filters[filter].selected;
    const _appliedSelected = state.appliedFilters[filter].selected;
    // check if type is array
    if (Array.isArray(_selected) && Array.isArray(_appliedSelected)) {
      if (_selected.length != _appliedSelected.length) return true;
      for (let i = 0; i < _selected.length; i++) {
        if (_selected[i] != _appliedSelected[i]) return true;
      }
    } else if (typeof _selected == 'object' && typeof _appliedSelected == 'object') {
      if (Object.keys(_selected).length != Object.keys(_appliedSelected).length) return true;
      for (let key in _selected) {
        if (_selected[key] != _appliedSelected[key]) return true;
      }
    }
    return _selected != _appliedSelected;
  });
  return (
    <ChakraProvider>
      <Flex
        ref={ref}
        style={{
          //   boxShadow: `${chakratheme.colors.shadow} 0px 0px 20px 0px`,
          backgroundColor: chakratheme.colors.tertiary.background,
          borderRadius: '5px'
        }}
        minWidth={config.maxWidth}
        maxWidth={config.maxWidth}
        p="10px"
        pt="10px"
        flexDir={'column'}>
        <Flex pt="10px" gap="10px" alignItems={'center'} pl="10px" pr="10px" pb="10px">
          <Text fontFamily={'Poppins'} mb={0} fontWeight={'bold'} fontSize="15px" textAlign="left">
            Filters
          </Text>
          <Spacer />
          {/* <Button variant="outline">Discard</Button> */}
          {/* <Button>Apply</Button> */}
          <Flex
            cursor={'pointer'}
            fontSize="13px"
            color="#999"
            fontWeight={'regular'}
            onClick={() => {
              const _filters = Object.keys(state.filters).reduce((acc, _filter) => {
                const _filterID = _filter;
                const filter =
                  config.filters.find((filter) => filter.id == _filterID) ??
                  state.dynamicFiltersConfig.find((filter) => filter.id == _filterID);
                acc[filter.id] = {
                  ...state.filters[filter.id],
                  fetchVariables: {
                    loading: false,
                    started: false,
                    error: false,
                    errorMessage: ''
                  },
                  selected:
                    filter.type == 'search'
                      ? ''
                      : filter.type == 'select'
                      ? []
                      : filter.type == 'checkbox' && filter.checkbox.multiple
                      ? []
                      : filter.type == 'checkbox' && !filter.checkbox.multiple
                      ? ''
                      : filter.type == 'range'
                      ? { min: '', max: '' }
                      : filter.type == 'boolean'
                      ? false
                      : filter.type == 'nested_select'
                      ? flattenNestedSelect(filter.nested_select)
                      : null
                };
                return acc;
              }, {});
              setState({
                ...state,
                filters: _filters
              });
              // setTimeout(() => {
              //   config.submitButton.callback(_filters);
              // }, 200);
            }}>
            Clear All Filters
          </Flex>
        </Flex>
        {config.searchBar && !config.searchBar.display ? null : (
          <Flex pl="10px" pr="10px" mt="5px">
            <InputGroup>
              <Input
                borderColor={chakratheme.colors.tertiary.border}
                value={searchBarQuery}
                onChange={(e) => {
                  setSearchBarQuery(e.target.value);
                }}
                placeholder="Search in Filters"
                fontSize="14px"
              />
              <InputLeftElement>
                <SearchIcon />
              </InputLeftElement>
              <InputRightElement cursor="pointer">
                <SmallCloseIcon
                  color="#999"
                  onClick={() => {
                    setSearchBarQuery('');
                  }}
                  style={{
                    visibility: searchBarQuery ? 'visible' : 'hidden'
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </Flex>
        )}
        <Flex direction={'column'} w="100%" maxH={'900px'} overflowY="scroll" pl="10px" pr="10px">
          {config.groups.map((group, i) => {
            return (
              <Flex flexDir={'column'} key={i} mt="10px">
                <Flex
                  alignItems={'center'}
                  W="100%"
                  _hover={{
                    cursor: 'pointer',
                    backgroundColor: `${chakratheme.colors.tertiary.hover} !important`
                  }}
                  onClick={() => {
                    setState({
                      ...state,
                      groups: {
                        ...state.groups,
                        [group.id]: {
                          expanded: !state.groups[group.id].expanded
                        }
                      }
                    });
                  }}>
                  <Text
                    mb={0}
                    fontWeight={'bold'}
                    fontSize="14px"
                    textAlign="left"
                    color={chakratheme.colors.secondary.colorGray}>
                    {group.name}
                  </Text>
                  <Spacer />
                  <IconButton
                    variant="ghost"
                    icon={
                      state.groups[group.id].expanded ? <ChevronUpIcon /> : <ChevronDownIcon />
                    }></IconButton>
                </Flex>
                {state.groups[group.id].expanded && (
                  <Flex flexDir={'column'} gap="20px">
                    {group.children.map((child, j) => {
                      const _filter = config.filters.find((filter) => filter.id == child);
                      const allowed = _filter.name
                        .toLowerCase()
                        .includes(searchBarQuery.toLowerCase());
                      if (!allowed) return null;
                      return (
                        <VStack alignItems={'start'} key={j}>
                          {_filter.type == 'select' ? (
                            <XSelect
                              ref={ref}
                              config={config}
                              state={state}
                              setState={setState}
                              filter={_filter}
                              searchTerm={searchBarQuery}
                              chakratheme={chakratheme}
                            />
                          ) : null}
                          {_filter.type == 'boolean' ? (
                            <Flex
                              pl="20px"
                              pr="20px"
                              onClick={() => {
                                setState({
                                  ...state,
                                  filters: {
                                    ...state.filters,
                                    [_filter.id]: {
                                      ...state.filters[_filter.id],
                                      selected: !state.filters[_filter.id].selected
                                    }
                                  }
                                });

                                // onToggle();
                              }}
                              _hover={{
                                cursor: 'pointer',
                                backgroundColor: '#f7f7f7 !important'
                              }}
                              w="100%"
                              gap="5px"
                              minHeight={'40px'}
                              alignItems={'center'}
                              style={{
                                border: '1px solid #EEEEEE',
                                borderRadius: '5px',
                                backgroundColor: '#fff'
                              }}>
                              <Text>{_filter.name}</Text>
                              <Spacer />
                              <Switch
                                isChecked={state.filters[_filter.id].selected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setState({
                                    ...state,
                                    filters: {
                                      ...state.filters,
                                      [_filter.id]: {
                                        ...state.filters[_filter.id],
                                        selected: e.target.checked
                                      }
                                    }
                                  });
                                }}
                              />
                            </Flex>
                          ) : null}
                          {_filter.type == 'search' && _filter.search.autoComplete ? (
                            <XSearch
                              ref={ref}
                              config={config}
                              state={state}
                              setState={setState}
                              filter={_filter}
                            />
                          ) : null}
                          {_filter.type == 'range' && _filter.range.type == 'number' ? (
                            <VStack alignItems="start">
                              <Text mb={0} fontSize="13px" textAlign="left">
                                {_filter.name}
                              </Text>
                              <Flex
                                w="100%"
                                padding="5px 20px"
                                gap="5px"
                                minHeight={'40px'}
                                alignItems={'center'}
                                style={{
                                  border: '1px solid #EEEEEE',
                                  borderRadius: '5px',
                                  backgroundColor: '#fff'
                                }}>
                                <Input
                                  border="0"
                                  backgroundColor={'#f5f5f5'}
                                  borderRadius={'5px'}
                                  type="number"
                                  placeholder="Min"
                                  value={state.filters[_filter.id].selected.min}
                                  onChange={(e) => {
                                    setState({
                                      ...state,
                                      filters: {
                                        ...state.filters,
                                        [_filter.id]: {
                                          ...state.filters[_filter.id],
                                          selected: {
                                            ...state.filters[_filter.id].selected,
                                            min: e.target.value
                                          }
                                        }
                                      }
                                    });
                                  }}
                                />
                                <Text>-</Text>
                                <Input
                                  border="0"
                                  backgroundColor={'#f5f5f5'}
                                  borderRadius={'5px'}
                                  type="number"
                                  placeholder="Max"
                                  value={state.filters[_filter.id].selected.max}
                                  onChange={(e) => {
                                    setState({
                                      ...state,
                                      filters: {
                                        ...state.filters,
                                        [_filter.id]: {
                                          ...state.filters[_filter.id],
                                          selected: {
                                            ...state.filters[_filter.id].selected,
                                            max: e.target.value
                                          }
                                        }
                                      }
                                    });
                                  }}
                                />
                              </Flex>
                            </VStack>
                          ) : null}
                          {_filter.type == 'checkbox' ? (
                            <VStack alignItems="start" w="100%">
                              <Flex w="100%">
                                <Text mb={0} fontSize="13px" textAlign="left">
                                  {_filter.name}
                                </Text>
                                <Spacer />
                                <Text
                                  fontSize="10px"
                                  color="#aaaaaa"
                                  cursor="pointer"
                                  onClick={() => {
                                    setState({
                                      ...state,
                                      filters: {
                                        ...state.filters,
                                        [_filter.id]: {
                                          ...state.filters[_filter.id],
                                          selected: []
                                        }
                                      }
                                    });
                                  }}>
                                  Clear {_filter.name}
                                </Text>
                              </Flex>
                              <Flex
                                w="100%"
                                direction={'column'}
                                wrap="wrap"
                                padding="5px 0px"
                                gap="5px"
                                minHeight={'40px'}
                                alignItems={'flex-start'}
                                style={{
                                  //   border: '1px solid #EEEEEE',
                                  //   borderRadius: '5px',
                                  backgroundColor: '#fff'
                                }}>
                                {_filter.checkbox.options.map((option, k) => {
                                  if (_filter.checkbox.multiple)
                                    return (
                                      <Checkbox
                                        style={{ fontSize: '14px' }}
                                        key={k}
                                        isChecked={state.filters[_filter.id].selected.includes(
                                          option
                                        )}
                                        onChange={() => {
                                          if (state.filters[_filter.id].selected.includes(option)) {
                                            setState({
                                              ...state,
                                              filters: {
                                                ...state.filters,
                                                [_filter.id]: {
                                                  ...state.filters[_filter.id],
                                                  selected: state.filters[
                                                    _filter.id
                                                  ].selected.filter((item) => item != option)
                                                }
                                              }
                                            });
                                          } else {
                                            setState({
                                              ...state,
                                              filters: {
                                                ...state.filters,
                                                [_filter.id]: {
                                                  ...state.filters[_filter.id],
                                                  selected: [
                                                    ...state.filters[_filter.id].selected,
                                                    option
                                                  ]
                                                }
                                              }
                                            });
                                          }
                                        }}>
                                        <Text fontSize={'12px'}>{option}</Text>
                                      </Checkbox>
                                    );
                                  else
                                    return (
                                      <Radio
                                        key={k}
                                        value={option}
                                        isChecked={state.filters[_filter.id].selected == option}
                                        onChange={() => {
                                          if (state.filters[_filter.id].selected == option) {
                                            setState({
                                              ...state,
                                              filters: {
                                                ...state.filters,
                                                [_filter.id]: {
                                                  ...state.filters[_filter.id],
                                                  selected: ''
                                                }
                                              }
                                            });
                                          } else {
                                            setState({
                                              ...state,
                                              filters: {
                                                ...state.filters,
                                                [_filter.id]: {
                                                  ...state.filters[_filter.id],
                                                  selected: option
                                                }
                                              }
                                            });
                                          }
                                        }}>
                                        <Text fontSize={'14px'}>{option}</Text>
                                      </Radio>
                                    );
                                })}
                              </Flex>
                            </VStack>
                          ) : null}
                          {_filter.type == 'nested_select' ? (
                            <XNestedSelect
                              state={state}
                              setState={setState}
                              config={config}
                              filter={_filter}
                              ref={ref}
                            />
                          ) : null}
                        </VStack>
                      );
                    })}
                  </Flex>
                )}
              </Flex>
            );
          })}
          <Flex flexDir={'column'} mt="10px">
            <Flex
              alignItems={'center'}
              W="100%"
              _hover={{
                cursor: 'pointer',
                backgroundColor: `${chakratheme.colors.tertiary.hover} !important`
              }}
              onClick={() => {
                setState({
                  ...state,
                  groups: {
                    ...state.groups,
                    extraFilters: {
                      expanded: !state.groups['extraFilters'].expanded
                    }
                  }
                });
              }}>
              <Text
                mb={0}
                fontWeight={'bold'}
                fontSize="14px"
                textAlign="left"
                color={chakratheme.colors.secondary.colorGray}>
                {'Extra Facets'}
              </Text>
              <Spacer />
              <IconButton
                variant="ghost"
                icon={
                  state.groups['extraFilters'].expanded ? <ChevronUpIcon /> : <ChevronDownIcon />
                }></IconButton>
            </Flex>
            {state.groups['extraFilters'].expanded && (
              <Flex flexDir={'column'} gap="20px">
                {state.dynamicFiltersConfig.map((child, j) => {
                  const _filter = child;
                  const allowed = _filter.name.toLowerCase().includes(searchBarQuery.toLowerCase());
                  if (!allowed) return null;
                  return (
                    <VStack alignItems={'start'} key={j}>
                      {_filter.type == 'select' ? (
                        <XSelect
                          ref={ref}
                          config={config}
                          state={state}
                          setState={setState}
                          filter={_filter}
                          searchTerm={searchBarQuery}
                          chakratheme={chakratheme}
                        />
                      ) : null}
                      {_filter.type == 'boolean' ? (
                        <Flex
                          pl="20px"
                          pr="20px"
                          onClick={() => {
                            setState({
                              ...state,
                              filters: {
                                ...state.filters,
                                [_filter.id]: {
                                  ...state.filters[_filter.id],
                                  selected: !state.filters[_filter.id].selected
                                }
                              }
                            });

                            // onToggle();
                          }}
                          _hover={{
                            cursor: 'pointer',
                            backgroundColor: '#f7f7f7 !important'
                          }}
                          w="100%"
                          gap="5px"
                          minHeight={'40px'}
                          alignItems={'center'}
                          style={{
                            border: '1px solid #EEEEEE',
                            borderRadius: '5px',
                            backgroundColor: '#fff'
                          }}>
                          <Text>{_filter.name}</Text>
                          <Spacer />
                          <Switch
                            isChecked={state.filters[_filter.id].selected}
                            onChange={(e) => {
                              e.stopPropagation();
                              setState({
                                ...state,
                                filters: {
                                  ...state.filters,
                                  [_filter.id]: {
                                    ...state.filters[_filter.id],
                                    selected: e.target.checked
                                  }
                                }
                              });
                            }}
                          />
                        </Flex>
                      ) : null}
                      {_filter.type == 'search' && _filter.search.autoComplete ? (
                        <XSearch
                          ref={ref}
                          config={config}
                          state={state}
                          setState={setState}
                          filter={_filter}
                        />
                      ) : null}
                      {_filter.type == 'range' && _filter.range.type == 'number' ? (
                        <VStack alignItems="start">
                          <Text mb={0} fontSize="13px" textAlign="left">
                            {_filter.name}
                          </Text>
                          <Flex
                            w="100%"
                            padding="5px 20px"
                            gap="5px"
                            minHeight={'40px'}
                            alignItems={'center'}
                            style={{
                              border: '1px solid #EEEEEE',
                              borderRadius: '5px',
                              backgroundColor: '#fff'
                            }}>
                            <Input
                              border="0"
                              backgroundColor={'#f5f5f5'}
                              borderRadius={'5px'}
                              type="number"
                              placeholder="Min"
                              value={state.filters[_filter.id].selected.min}
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  filters: {
                                    ...state.filters,
                                    [_filter.id]: {
                                      ...state.filters[_filter.id],
                                      selected: {
                                        ...state.filters[_filter.id].selected,
                                        min: e.target.value
                                      }
                                    }
                                  }
                                });
                              }}
                            />
                            <Text>-</Text>
                            <Input
                              border="0"
                              backgroundColor={'#f5f5f5'}
                              borderRadius={'5px'}
                              type="number"
                              placeholder="Max"
                              value={state.filters[_filter.id].selected.max}
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  filters: {
                                    ...state.filters,
                                    [_filter.id]: {
                                      ...state.filters[_filter.id],
                                      selected: {
                                        ...state.filters[_filter.id].selected,
                                        max: e.target.value
                                      }
                                    }
                                  }
                                });
                              }}
                            />
                          </Flex>
                        </VStack>
                      ) : null}
                      {_filter.type == 'checkbox' ? (
                        <VStack alignItems="start" w="100%">
                          <Flex w="100%">
                            <Text mb={0} fontSize="13px" textAlign="left">
                              {_filter.name}
                            </Text>
                            <Spacer />
                            <Text
                              fontSize="10px"
                              color="#aaaaaa"
                              cursor="pointer"
                              onClick={() => {
                                setState({
                                  ...state,
                                  filters: {
                                    ...state.filters,
                                    [_filter.id]: {
                                      ...state.filters[_filter.id],
                                      selected: []
                                    }
                                  }
                                });
                              }}>
                              Clear {_filter.name}
                            </Text>
                          </Flex>
                          <Flex
                            w="100%"
                            direction={'column'}
                            wrap="wrap"
                            padding="5px 0px"
                            gap="5px"
                            minHeight={'40px'}
                            alignItems={'flex-start'}
                            style={{
                              //   border: '1px solid #EEEEEE',
                              //   borderRadius: '5px',
                              backgroundColor: '#fff'
                            }}>
                            {_filter.checkbox.options.map((option, k) => {
                              if (_filter.checkbox.multiple)
                                return (
                                  <Checkbox
                                    style={{ fontSize: '14px' }}
                                    key={k}
                                    isChecked={state.filters[_filter.id].selected.includes(option)}
                                    onChange={() => {
                                      if (state.filters[_filter.id].selected.includes(option)) {
                                        setState({
                                          ...state,
                                          filters: {
                                            ...state.filters,
                                            [_filter.id]: {
                                              ...state.filters[_filter.id],
                                              selected: state.filters[_filter.id].selected.filter(
                                                (item) => item != option
                                              )
                                            }
                                          }
                                        });
                                      } else {
                                        setState({
                                          ...state,
                                          filters: {
                                            ...state.filters,
                                            [_filter.id]: {
                                              ...state.filters[_filter.id],
                                              selected: [
                                                ...state.filters[_filter.id].selected,
                                                option
                                              ]
                                            }
                                          }
                                        });
                                      }
                                    }}>
                                    <Text fontSize={'12px'}>{option}</Text>
                                  </Checkbox>
                                );
                              else
                                return (
                                  <Radio
                                    key={k}
                                    value={option}
                                    isChecked={state.filters[_filter.id].selected == option}
                                    onChange={() => {
                                      if (state.filters[_filter.id].selected == option) {
                                        setState({
                                          ...state,
                                          filters: {
                                            ...state.filters,
                                            [_filter.id]: {
                                              ...state.filters[_filter.id],
                                              selected: ''
                                            }
                                          }
                                        });
                                      } else {
                                        setState({
                                          ...state,
                                          filters: {
                                            ...state.filters,
                                            [_filter.id]: {
                                              ...state.filters[_filter.id],
                                              selected: option
                                            }
                                          }
                                        });
                                      }
                                    }}>
                                    <Text fontSize={'14px'}>{option}</Text>
                                  </Radio>
                                );
                            })}
                          </Flex>
                        </VStack>
                      ) : null}
                      {_filter.type == 'nested_select' ? (
                        <XNestedSelect
                          state={state}
                          setState={setState}
                          config={config}
                          filter={_filter}
                          ref={ref}
                        />
                      ) : null}
                    </VStack>
                  );
                })}
              </Flex>
            )}
          </Flex>
        </Flex>
        {config.submitButton ? (
          <Button
            variant={'outline'}
            style={{
              border: `1px solid ${chakratheme.colors.tertiary.border}`
            }}
            _hover={{
              backgroundColor: chakratheme.colors.tertiary.hover
            }}
            mt="10px"
            mr="10px"
            ml="10px"
            onClick={config.submitButton.callback}>
            {config.submitButton.text}
          </Button>
        ) : null}
      </Flex>
    </ChakraProvider>
  );
};
export default XFilters;
