import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverFooter,
  PopoverCloseButton,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useTheme,
  Tooltip,
  Badge,
  Spacer,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { 
  ArrowDropDown, 
  FilterAltOutlined, 
  SearchOutlined, 
  SortOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  DownloadOutlined,
  RefreshOutlined,
  DataUsageOutlined,
  CategoryOutlined,
  DateRangeOutlined,
  CloseOutlined,
  StorefrontOutlined,
  LocalMallOutlined
} from '@mui/icons-material';
import { getForecastData, getForecastFilterOptions, getForecastStats } from '../../repositories/forecast';
import { ThemeContext } from '../../Contexts/ThemeContext';
import { CSVLink } from 'react-csv';
import _ from 'lodash';
import { useSearchParams } from 'react-router-dom';

const Forecast = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [filterSearchQueries, setFilterSearchQueries] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortInfo, setSortInfo] = useState({ field: null, direction: 'asc' });
  const { themeMode } = useContext(ThemeContext);
  
  // State for pagination
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for filtering and sorting
  const [stats, setStats] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Memoize filter options to prevent unnecessary re-renders
  const memoizedFilterOptions = React.useMemo(() => filterOptions, [filterOptions]);
  
  // Handle filter search query change
  const handleFilterSearchChange = (field, value) => {
    setFilterSearchQueries((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Filter items based on search query
  const getFilteredItems = (items, field) => {
    if (!items) return [];
    
    // Filter items based on search query
    const searchTerm = filterSearchQueries[field]?.toLowerCase() || '';
    if (!searchTerm) return items;
    
    return items.filter(item => 
      (typeof item.value === 'string' && item.value.toLowerCase().includes(searchTerm))
    );
  };
  
  // Get items to display (limited or all based on expanded state)
  const getDisplayItems = (items, field) => {
    const filtered = getFilteredItems(items, field);
    return filtered; // Return all filtered items without limitation
  };
  
  // Fetch forecast data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Prepare search query if search text is entered
      const searchObj = searchQuery ? { [searchField]: searchQuery } : null;
      
      // Get data from backend
      const response = await getForecastData(limit, offset, searchObj, filters, sortInfo);
      
      setData(response);
      setTotalRecords(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      setError('Failed to load forecast data. Please try again.');
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [limit, offset, searchQuery, searchField, filters, sortInfo]);
  
  // Fetch filter options - now with current filters
  const fetchFilterOptions = async (currentFilters = filters) => {
    try {
      setFiltersLoading(true);
      setFiltersError(null);
      const options = await getForecastFilterOptions(currentFilters);
      
      // Process options with new format (with counts)
      const formattedOptions = {};
      
      Object.keys(options || {}).forEach(key => {
        if (Array.isArray(options[key])) {
          // Handle arrays with value/count objects
          formattedOptions[key] = options[key];
        } else if (typeof options[key] === 'object' && options[key] !== null) {
          // Keep range objects (min/max) as they are
          formattedOptions[key] = options[key];
        } else {
          // Handle any unexpected format
          formattedOptions[key] = [];
        }
      });
      
      setFilterOptions(formattedOptions);
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setFiltersError('Failed to load filter options. Please try again.');
      setFilterOptions({});
    } finally {
      setFiltersLoading(false);
    }
  };
  
  // Fetch statistics
  const fetchStats = async () => {
    try {
      const statsData = await getForecastStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchData();
    // No longer loading filter options on initial load - will load when popover opens
    fetchStats();
  }, [fetchData]); // Add fetchData as a dependency
  
  // Reload data when pagination, search, filters or sort changes
  useEffect(() => {
    // Add a small delay to ensure state updates are processed
    const timer = setTimeout(() => {
    fetchData();
    }, 10);
    
    return () => clearTimeout(timer);
  }, [limit, offset, filters, sortInfo, searchQuery]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    
    const maxPage = Math.ceil(totalRecords / limit);
    if (newPage > maxPage) return;
    
    setCurrentPage(newPage);
    setOffset((newPage - 1) * limit);
  };
  
  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setOffset(0);
    // fetchData will be called by the useEffect when searchQuery changes
  };
  
  // Handle filter change
  const applyFilter = (field, value, isRange = false) => {
    let newFilters = { ...(filters || {}) };
    
    if (isRange) {
      // Handle min/max range filters - debounce the range filters to prevent excess API calls
      if (newFilters[field] && newFilters[field].type === 'range') {
        // Update existing range filter
        newFilters[field] = {
          ...newFilters[field],
          min: value.min,
          max: value.max
        };
      } else {
        // Create new range filter
        newFilters[field] = {
          type: 'range',
          min: value.min,
          max: value.max
        };
      }
    } else {
      // Handle discrete filters
      if (newFilters[field] && newFilters[field].type === 'discrete') {
        // Check if the value is already in the array
        const valueIndex = newFilters[field].values.findIndex(v => 
          typeof v === 'string' && typeof value === 'string' 
            ? v.toLowerCase() === value.toLowerCase() 
            : v === value
        );
        
        if (valueIndex >= 0) {
          // If value exists, remove it (toggle behavior)
          const newValues = [...newFilters[field].values];
          newValues.splice(valueIndex, 1);
          
          // If no values left, remove the whole filter
          if (newValues.length === 0) {
            delete newFilters[field];
          } else {
            newFilters[field].values = newValues;
          }
        } else {
          // If value doesn't exist, add it
          newFilters[field].values = [...newFilters[field].values, value];
        }
      } else {
        // If filter doesn't exist, create it with the value
        newFilters[field] = {
          type: 'discrete',
          values: [value]
        };
      }
    }
    
    // If all filters are removed, set to null instead of empty object
    if (Object.keys(newFilters).length === 0) {
      newFilters = null;
    }
    
    // Update filters state
    setFilters(newFilters);
    
    // Reset pagination
    setCurrentPage(1);
    setOffset(0);
    
    // Reload filter options with the new filters
    fetchFilterOptions(newFilters);
  };
  
  // Check if a discrete filter value is selected
  const isFilterValueSelected = (field, value) => {
    if (!filters || !filters[field] || filters[field].type !== 'discrete') {
      return false;
    }
    
    return filters[field].values.some(v => 
      typeof v === 'string' && typeof value === 'string' 
        ? v.toLowerCase() === value.toLowerCase() 
        : v === value
    );
  };
  
  // Dedicated function to remove a filter
  const removeFilter = (field) => {
    if (!filters || !filters[field]) return;
    
    const newFilters = { ...filters };
    delete newFilters[field];
    
    // If all filters are removed, set to null
    if (Object.keys(newFilters).length === 0) {
      setFilters(null);
      // Reload filter options with null filters
      fetchFilterOptions(null);
    } else {
      setFilters(newFilters);
      // Reload filter options with new filters
      fetchFilterOptions(newFilters);
    }
    
    // Reset pagination
    setCurrentPage(1);
    setOffset(0);
  };
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortInfo.field === field) {
      // Toggle direction if same field
      setSortInfo({
        field,
        direction: sortInfo.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Default to desc for new field
      setSortInfo({
        field,
        direction: 'desc'
      });
    }
    setCurrentPage(1);
    setOffset(0);
  };
  
  // Prepare CSV data for export
  const csvData = React.useMemo(() => {
    if (!data || !data.items.length) return [];
    
    try {
      // Header row
      const headers = Object.keys(data.items[0] || {}).filter(key => key !== 'id');
      
      // Data rows
      const rows = data.items.map(item => {
        if (!item) return [];
        const row = { ...item };
        delete row.id; // Remove id from export
        return Object.values(row);
      });
      
      return [headers, ...rows];
    } catch (error) {
      console.error('Error preparing CSV data:', error);
      return [];
    }
  }, [data]);
  
  // Debounced filter application for range filters
  const debouncedApplyFilter = React.useCallback(
    _.debounce((field, value) => {
      setFilters(prev => {
        const newFilters = { ...(prev || {}) };
        newFilters[field] = {
          type: 'range',
          min: value.min,
          max: value.max
        };
        
        // Reload filter options with the new filters
        fetchFilterOptions(newFilters);
        
        return newFilters;
      });
      
      setCurrentPage(1);
      setOffset(0);
      // Explicitly call fetchData to ensure it happens after state updates
      setTimeout(() => fetchData(), 0);
    }, 500),
    [fetchData, fetchFilterOptions] // Add fetchFilterOptions to the dependency array
  );
  
  // Handle range slider change with debouncing
  const handleRangeChange = (field, [min, max]) => {
    // Update UI immediately
    setFilters(prev => {
      const newFilters = { ...(prev || {}) };
      newFilters[field] = {
        ...(newFilters[field] || { type: 'range' }),
        type: 'range',
        min,
        max
      };
      return newFilters;
    });
    
    // Debounce actual API call
    debouncedApplyFilter(field, { min, max });
  };
  
  // Create memoized filter panel components to prevent unnecessary re-renders
  const ProductFilterTab = useMemo(() => {
    if (!memoizedFilterOptions) return null;
    
    return (
      <Box>
        <Text fontWeight="bold" mt={2} mb={2}>Channel</Text>
        <Flex direction="column" ml={2} mb={4}>
          {memoizedFilterOptions.store_type && getDisplayItems(memoizedFilterOptions.store_type, 'store_type').map(item => (
            <Flex key={item.value} align="center" mb={1}>
              <Checkbox 
                isChecked={isFilterValueSelected('store_type', item.value)}
                onChange={() => applyFilter('store_type', item.value)}
                size="sm"
                colorScheme="blue"
              >
                <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
              </Checkbox>
            </Flex>
          ))}
          {/* Remove Show more/less buttons */}
        </Flex>
        
        <Text fontWeight="bold" mt={2} mb={2}>Category</Text>
        <Flex direction="column" ml={2} mb={4}>
          <Input 
            placeholder="Search categories..."
            size="sm"
            mb={2}
            value={filterSearchQueries.super_category || ''}
            onChange={(e) => handleFilterSearchChange('super_category', e.target.value)}
          />
          {memoizedFilterOptions.super_category && getDisplayItems(memoizedFilterOptions.super_category, 'super_category').map(item => (
            <Flex key={item.value} align="center" mb={1}>
              <Checkbox 
                isChecked={isFilterValueSelected('super_category', item.value)}
                onChange={() => applyFilter('super_category', item.value)}
                size="sm"
                colorScheme="blue"
              >
                <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
              </Checkbox>
            </Flex>
          ))}
          {/* Remove Show more/less buttons */}
        </Flex>
        
        <Text fontWeight="bold" mt={2} mb={2}>Format</Text>
        <Flex direction="column" ml={2} mb={4}>
          <Input 
            placeholder="Search formats..."
            size="sm"
            mb={2}
            value={filterSearchQueries.format || ''}
            onChange={(e) => handleFilterSearchChange('format', e.target.value)}
          />
          {memoizedFilterOptions.format && getDisplayItems(memoizedFilterOptions.format, 'format').map(item => (
            <Flex key={item.value} align="center" mb={1}>
              <Checkbox 
                isChecked={isFilterValueSelected('format', item.value)}
                onChange={() => applyFilter('format', item.value)}
                size="sm"
                colorScheme="blue"
              >
                <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
              </Checkbox>
            </Flex>
          ))}
          {/* Remove Show more/less buttons */}
        </Flex>
        
        <Text fontWeight="bold" mt={2} mb={2}>Segment</Text>
        <Flex direction="column" ml={2}>
          <Input 
            placeholder="Search segments..."
            size="sm"
            mb={2}
            value={filterSearchQueries.segment || ''}
            onChange={(e) => handleFilterSearchChange('segment', e.target.value)}
          />
          {memoizedFilterOptions.segment && getDisplayItems(memoizedFilterOptions.segment, 'segment').map(item => (
            <Flex key={item.value} align="center" mb={1}>
              <Checkbox 
                isChecked={isFilterValueSelected('segment', item.value)}
                onChange={() => applyFilter('segment', item.value)}
                size="sm"
                colorScheme="blue"
              >
                <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
              </Checkbox>
            </Flex>
          ))}
          {/* Remove Show more/less buttons */}
        </Flex>
      </Box>
    );
  }, [memoizedFilterOptions, filterSearchQueries, filters, theme]);
  
  // Update LocationFilterTab to remove Show more/less buttons
  const LocationFilterTab = (
    <Box>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">City</Text>
      </Flex>
      <Flex direction="column" ml={2} mb={4}>
        <Input 
          placeholder="Search cities..."
          size="sm"
          mb={2}
          value={filterSearchQueries.city || ''}
          onChange={(e) => handleFilterSearchChange('city', e.target.value)}
        />
        {filterOptions.city && getDisplayItems(filterOptions.city, 'city').map(item => (
          <Flex key={item.value} align="center" mb={1}>
            <Checkbox 
              isChecked={isFilterValueSelected('city', item.value)}
              onChange={() => applyFilter('city', item.value)}
              size="sm"
              colorScheme="blue"
            >
              <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
            </Checkbox>
          </Flex>
        ))}
        {/* Remove Show more/less buttons */}
      </Flex>
      
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Region</Text>
      </Flex>
      <Flex direction="column" ml={2} mb={4}>
        <Input 
          placeholder="Search regions..."
          size="sm"
          mb={2}
          value={filterSearchQueries.region || ''}
          onChange={(e) => handleFilterSearchChange('region', e.target.value)}
        />
        {filterOptions.region && getDisplayItems(filterOptions.region, 'region').map(item => (
          <Flex key={item.value} align="center" mb={1}>
            <Checkbox 
              isChecked={isFilterValueSelected('region', item.value)}
              onChange={() => applyFilter('region', item.value)}
              size="sm"
              colorScheme="blue"
            >
              <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
            </Checkbox>
          </Flex>
        ))}
        {/* Remove Show more/less buttons */}
      </Flex>
      
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">State</Text>
      </Flex>
      <Flex direction="column" ml={2} mb={4}>
        <Input 
          placeholder="Search states..."
          size="sm"
          mb={2}
          value={filterSearchQueries.state || ''}
          onChange={(e) => handleFilterSearchChange('state', e.target.value)}
        />
        {filterOptions.state && getDisplayItems(filterOptions.state, 'state').map(item => (
          <Flex key={item.value} align="center" mb={1}>
            <Checkbox 
              isChecked={isFilterValueSelected('state', item.value)}
              onChange={() => applyFilter('state', item.value)}
              size="sm"
              colorScheme="blue"
            >
              <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
            </Checkbox>
          </Flex>
        ))}
        {/* Remove Show more/less buttons */}
      </Flex>
      
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Distribution Center</Text>
      </Flex>
      <Flex direction="column" ml={2}>
        <Input 
          placeholder="Search distribution centers..."
          size="sm"
          mb={2}
          value={filterSearchQueries.p1_dc || ''}
          onChange={(e) => handleFilterSearchChange('p1_dc', e.target.value)}
        />
        {filterOptions.p1_dc && getDisplayItems(filterOptions.p1_dc, 'p1_dc').map(item => (
          <Flex key={item.value} align="center" mb={1}>
            <Checkbox 
              isChecked={isFilterValueSelected('p1_dc', item.value)}
              onChange={() => applyFilter('p1_dc', item.value)}
              size="sm"
              colorScheme="blue"
            >
              <Text fontSize="13px">{item.value} <Text as="span" color="gray.500" fontSize="12px">({item.count})</Text></Text>
            </Checkbox>
          </Flex>
        ))}
        {/* Remove Show more/less buttons */}
      </Flex>
    </Box>
  );
  
  // Render loading state
  if (loading && !data.items.length) {
    return (
      <Box
        p={6}
        w="100%"
        bg={theme.colors.secondary.background}
        color={theme.colors.secondary.color}>
        
        {/* Skeleton Search Bar */}
        <Box 
          mb={4} 
          p={4} 
          borderRadius="8px" 
          bg={theme.colors.tertiary.background} 
          boxShadow="0 1px 3px rgba(0,0,0,0.08)"
          border={`1px solid ${theme.colors.tertiary.border}`}>
          <Flex gap={3} flexWrap="wrap">
            <Box 
              flex="1" 
              minW="300px" 
              h="40px" 
              bg={`${theme.colors.tertiary.border}50`}
              borderRadius="md"
              animation="pulse 1.5s infinite"
            />
            <Flex gap={2} flexWrap="wrap">
              {Array(4).fill(0).map((_, i) => (
                <Box 
                  key={i}
                  w="100px" 
                  h="40px" 
                  bg={`${theme.colors.tertiary.border}50`}
                  borderRadius="md"
                  animation="pulse 1.5s infinite"
                  animationDelay={`${i * 0.2}s`}
                />
              ))}
            </Flex>
          </Flex>
        </Box>
        
        {/* Skeleton Applied Filters */}
        <Box 
          mb={4} 
          p={2} 
          borderRadius="6px"
          bg={theme.colors.tertiary.background} 
          border={`1px solid ${theme.colors.tertiary.border}`}
        >
          <Flex gap={2} flexWrap="wrap">
            {Array(3).fill(0).map((_, i) => (
              <Box 
                key={i}
                w={`${80 + Math.random() * 40}px`} 
                h="22px" 
                bg={`${theme.colors.tertiary.border}50`}
                borderRadius="full"
                animation="pulse 1.5s infinite"
                animationDelay={`${i * 0.1}s`}
              />
            ))}
          </Flex>
        </Box>
        
        {/* Skeleton Table */}
        <Box
          borderWidth="1px"
          borderColor={theme.colors.tertiary.border}
          borderRadius="12px"
          overflow="hidden"
          mb={4}
          boxShadow="0 4px 12px rgba(0,0,0,0.05)">
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead bg={`${theme.colors.tertiary.background}`}>
                <Tr>
                  {Array(6).fill(0).map((_, i) => (
                    <Th key={i} py={4}>
                      <Box 
                        h="16px" 
                        w={`${Math.floor(Math.random() * 40) + 60}px`}
                        bg={`${theme.colors.tertiary.border}`}
                        borderRadius="full"
                        animation="pulse 1.5s infinite"
                        animationDelay={`${i * 0.1}s`}
                      />
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Array(5).fill(0).map((_, rowIndex) => (
                  <Tr key={rowIndex}>
                    {Array(6).fill(0).map((_, colIndex) => (
                      <Td key={colIndex} py={4}>
                        <Box 
                          h="20px" 
                          w={`${Math.floor(Math.random() * 50) + 50}%`}
                          bg={`${theme.colors.tertiary.border}50`}
                          borderRadius="full"
                          animation="pulse 1.5s infinite"
                          animationDelay={`${rowIndex * 0.1 + colIndex * 0.05}s`}
                        />
                        {colIndex < 3 && Math.random() > 0.5 && (
                          <Box 
                            h="12px" 
                            w={`${Math.floor(Math.random() * 30) + 20}%`}
                            bg={`${theme.colors.tertiary.border}30`}
                            mt={2}
                            borderRadius="full"
                            animation="pulse 1.5s infinite"
                            animationDelay={`${rowIndex * 0.1 + colIndex * 0.05 + 0.1}s`}
                          />
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
        
        {/* Skeleton Pagination */}
        <Flex 
          justifyContent="space-between" 
          alignItems="center" 
          mt={4}
          p={4}
          borderRadius="12px"
          bg={theme.colors.tertiary.background}
          border={`1px solid ${theme.colors.tertiary.border}`}
          boxShadow="0 2px 8px rgba(0,0,0,0.05)">
          <Box 
            w="150px" 
            h="16px" 
            bg={`${theme.colors.tertiary.border}50`}
            borderRadius="full"
            animation="pulse 1.5s infinite"
          />
          <Flex gap={3}>
            <Box 
              w="80px" 
              h="32px" 
              bg={`${theme.colors.tertiary.border}50`}
              borderRadius="md"
              animation="pulse 1.5s infinite"
            />
            <Box 
              w="120px" 
              h="32px" 
              bg={`${theme.colors.tertiary.border}50`}
              borderRadius="md"
              animation="pulse 1.5s infinite"
              animationDelay="0.2s"
            />
          </Flex>
        </Flex>
      </Box>
    );
  }
  
  // Render error state
  if (error && !data.items.length) {
    return (
      <Flex
        direction="column"
        width="100%"
        height="80vh" 
        alignItems="center"
        justifyContent="center">
        <Text color="red.500" fontSize="xl">{error}</Text>
        <Button 
          mt={4} 
          onClick={fetchData} 
          leftIcon={<RefreshOutlined />}
          bg={theme.colors.sleekButton.background}
          color={theme.colors.sleekButton.text}
          _hover={{ bg: theme.colors.sleekButton.hover }}>
          Retry
        </Button>
      </Flex>
    );
  }
  
  return (
    <Box
      p={6}
      w="100%"
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}>
      
      {/* Search and filters bar */}
      <Box 
        mb={4} 
        p={4} 
        borderRadius="8px" 
        bg={theme.colors.tertiary.background} 
        boxShadow="0 1px 3px rgba(0,0,0,0.08)"
        border={`1px solid ${theme.colors.tertiary.border}`}>
        <Flex gap={3} flexWrap="wrap">
          <Flex flex="1" minW="300px">
            <Select 
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              w="150px"
              borderRadius="md 0 0 md"
              style={{
                height: '40px',
                border: `1px solid ${theme.colors.tertiary.border}`,
                color: theme.colors.tertiary.color,
                backgroundColor: theme.colors.tertiary.background,
                fontSize: '13px',
                boxShadow: 'none',
                borderRight: 'none'
              }}
              _hover={{ borderColor: theme.colors.tertiary.hover }}>
              <option value="article_description">Article</option>
              <option value="brand">Brand</option>
              <option value="segment_code">Segment Code</option>
              <option value="segment">Segment</option>
              <option value="city">City</option>
              <option value="region">Region</option>
              <option value="state">State</option>
              <option value="p1_dc">Distribution Center</option>
              <option value="format">Format</option>
            </Select>
            <Input
              placeholder="Search forecast data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="0"
              style={{
                height: '40px',
                border: `1px solid ${theme.colors.tertiary.border}`,
                color: theme.colors.tertiary.color,
                backgroundColor: theme.colors.tertiary.background,
                fontSize: '13px',
                boxShadow: 'none',
                borderLeft: 'none',
                borderRight: 'none'
              }}
              _focus={{
                borderColor: theme.colors.tertiary.border,
                boxShadow: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              borderRadius="0 md md 0"
              bg={theme.colors.tertiary.background}
              style={{
                height: '40px',
                border: `1px solid ${theme.colors.tertiary.border}`,
                color: theme.colors.sleekButton.text,
                backgroundColor: theme.colors.tertiary.background,
                fontSize: '13px',
                boxShadow: 'none',
                fontWeight: '600',
                borderLeft: 'none'
              }}
              _hover={{ bg: theme.colors.tertiary.hover }}>
              <SearchOutlined style={{ fontSize: '16px' }} />
            </Button>
          </Flex>
          
          <Flex gap={2} flexWrap="wrap">
            {/* Filter dropdown */}
            <Popover 
              placement="bottom-start" 
              closeOnBlur={false} 
              isLazy 
              isOpen={popoverOpen}
              onOpen={() => {
                setPopoverOpen(true);
                fetchFilterOptions(); // Only fetch options when popover opens
              }}
              onClose={() => setPopoverOpen(false)}
            >
              <PopoverTrigger>
                <Button
                  leftIcon={
                    filtersLoading && popoverOpen ? 
                    <Spinner size="xs" color={theme.colors.sleekButton.text} /> : 
                    <FilterAltOutlined style={{ fontSize: '16px' }} />
                  }
                  rightIcon={filters && Object.keys(filters).length > 0 ? 
                    <Badge 
                      fontSize="10px" 
                      borderRadius="full" 
                      colorScheme="blue" 
                      ml={1}
                    >
                      {Object.keys(filters).length}
                    </Badge> : 
                    <ArrowDropDown style={{ fontSize: '20px' }} />
                  }
                  size={'md'}
                  style={{
                    height: '40px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.colors.tertiary.border}`,
                    color: theme.colors.sleekButton.text,
                    backgroundColor: theme.colors.tertiary.background,
                    fontSize: '13px',
                    boxShadow: 'none',
                    fontWeight: '600'
                  }}
                  _hover={{ bg: theme.colors.tertiary.hover }}>
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent
                width="550px"
                maxWidth="90vw"
                boxShadow="0 8px 24px rgba(0,0,0,0.1)"
                border={`1px solid ${theme.colors.tertiary.border}`}
                borderRadius="12px"
                overflow="hidden"
                bg={theme.colors.secondary.background}
                color={theme.colors.secondary.color}>
                <PopoverHeader borderBottom={`1px solid ${theme.colors.tertiary.border}`} py={3} px={4}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontWeight="600" fontSize="15px">Filters</Text>
                    <Flex gap={2}>
                      {filtersLoading ? (
                        <Spinner size="sm" color={theme.colors.sleekButton.text} />
                      ) : (
                        <IconButton
                          size="sm"
                          icon={<RefreshOutlined style={{ fontSize: '14px' }} />}
                          aria-label="Refresh filter options"
                          onClick={fetchFilterOptions}
                          variant="outline"
                          color={theme.colors.tertiary.color}
                          borderRadius="full"
                          w="28px"
                          h="28px"
                          minW="28px"
                          border={`1px solid ${theme.colors.tertiary.border}`}
                          _hover={{ 
                            bg: theme.colors.tertiary.hover,
                            color: theme.colors.sleekButton.text,
                            transform: 'rotate(30deg)',
                            transition: 'all 0.2s ease'
                          }}
                          transition="all 0.2s ease"
                        />
                      )}
                      <PopoverCloseButton position="static" size="sm" />
                    </Flex>
                  </Flex>
                </PopoverHeader>
                <PopoverBody p={0} maxH="65vh" overflowY="auto">
                  {filtersLoading ? (
                    <Flex direction="column" alignItems="center" justifyContent="center" py={8} px={4}>
                      <Spinner
                        thickness="2px"
                        speed="0.8s"
                        size="md"
                        color={theme.colors.sleekButton.text}
                        mb={3}
                      />
                      <Text fontSize="14px" fontWeight="medium" color={theme.colors.secondary.color}>
                        Loading filters...
                      </Text>
                    </Flex>
                  ) : filtersError ? (
                    <Flex direction="column" alignItems="center" justifyContent="center" py={8} px={4}>
                      <CloseOutlined style={{ fontSize: '20px', color: 'rgb(229, 62, 62)', marginBottom: '12px' }} />
                      <Text color="red.500" fontSize="14px" fontWeight="medium" mb={2}>{filtersError}</Text>
                      <Button 
                        size="sm"
                        onClick={fetchFilterOptions} 
                        leftIcon={<RefreshOutlined style={{ fontSize: '14px' }} />}
                        colorScheme="blue"
                        variant="ghost"
                      >
                        Retry
                      </Button>
                    </Flex>
                  ) : (
                    <Tabs variant="line" colorScheme="blue">
                      <TabList px={3} pt={2} borderBottom={`1px solid ${theme.colors.tertiary.border}`}>
                        {['Categories', 'Metrics', 'Dates', 'Location'].map((tabName, idx) => (
                          <Tab 
                            key={idx}
                            fontWeight="500" 
                            fontSize="13px"
                            py={2}
                            px={3}
                            color={theme.colors.tertiary.color}
                            _selected={{ 
                              color: theme.colors.sleekButton.text, 
                              borderColor: theme.colors.highlightBorder.main,
                              fontWeight: "600"
                            }}
                            _hover={{
                              color: theme.colors.sleekButton.text
                            }}
                          >
                            {tabName}
                          </Tab>
                        ))}
                      </TabList>
                      <TabPanels>
                        {/* Categories Tab */}
                        <TabPanel p={0}>
                          {ProductFilterTab}
                        </TabPanel>
                        
                        {/* Metrics Tab */}
                        <TabPanel p={5}>
                          <Box>
                            {/* Forecast Quantity Range */}
                            {filterOptions?.forecast_qty && (
                              <Box mb={6}>
                                <Flex mb={3} alignItems="center">
                                  <DataUsageOutlined style={{ fontSize: '18px', marginRight: '8px', color: theme.colors.sleekButton.text }} />
                                  <Text fontWeight="600" fontSize="15px">Forecast Quantity</Text>
                                </Flex>
                                
                                <Flex direction="column" bg={theme.colors.tertiary.background} p={4} borderRadius="md">
                                  <Flex mb={4} align="center" justify="space-between">
                                    <Box>
                                      <Text fontSize="13px" color={theme.colors.tertiary.color} mb={1}>Min Value</Text>
                                      <NumberInput 
                                        size="sm" 
                                        maxW="100px" 
                                        defaultValue={filterOptions.forecast_qty.min || 0}
                                        min={filterOptions.forecast_qty.min || 0}
                                        max={filterOptions.forecast_qty.max || 10000}
                                        value={filters?.forecast_qty?.min !== undefined ? filters.forecast_qty.min : (filterOptions.forecast_qty.min || 0)}
                                        onChange={(valueString) => {
                                          const min = parseFloat(valueString);
                                          const max = filters?.forecast_qty?.max !== undefined ? 
                                            filters.forecast_qty.max : 
                                            (filterOptions.forecast_qty.max || 10000);
                                          handleRangeChange('forecast_qty', [min, max]);
                                        }}
                                        borderRadius="md"
                                        _focus={{
                                          borderColor: theme.colors.sleekButton.text,
                                          boxShadow: `0 0 0 1px ${theme.colors.sleekButton.text}`
                                        }}
                                      >
                                        <NumberInputField bg="white" />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Box>
                                    
                                    <Box textAlign="center" mx={3}>
                                      <Text fontSize="12px" color={theme.colors.tertiary.color} fontWeight="bold">to</Text>
                                    </Box>
                                    
                                    <Box>
                                      <Text fontSize="13px" color={theme.colors.tertiary.color} mb={1}>Max Value</Text>
                                      <NumberInput 
                                        size="sm" 
                                        maxW="100px"
                                        defaultValue={filterOptions.forecast_qty.max || 10000}
                                        min={filterOptions.forecast_qty.min || 0}
                                        max={filterOptions.forecast_qty.max || 10000}
                                        value={filters?.forecast_qty?.max !== undefined ? filters.forecast_qty.max : (filterOptions.forecast_qty.max || 10000)}
                                        onChange={(valueString) => {
                                          const max = parseFloat(valueString);
                                          const min = filters?.forecast_qty?.min !== undefined ? 
                                            filters.forecast_qty.min : 
                                            (filterOptions.forecast_qty.min || 0);
                                          handleRangeChange('forecast_qty', [min, max]);
                                        }}
                                        borderRadius="md"
                                        _focus={{
                                          borderColor: theme.colors.sleekButton.text,
                                          boxShadow: `0 0 0 1px ${theme.colors.sleekButton.text}`
                                        }}
                                      >
                                        <NumberInputField bg="white" />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Box>
                                  </Flex>
                                  
                                  <Box px={2} py={4}>
                                    <RangeSlider
                                      aria-label={['min', 'max']}
                                      min={filterOptions.forecast_qty.min || 0}
                                      max={filterOptions.forecast_qty.max || 10000}
                                      defaultValue={[
                                        filterOptions.forecast_qty.min || 0, 
                                        filterOptions.forecast_qty.max || 10000
                                      ]}
                                      value={[
                                        filters?.forecast_qty?.min !== undefined ? filters.forecast_qty.min : (filterOptions.forecast_qty.min || 0),
                                        filters?.forecast_qty?.max !== undefined ? filters.forecast_qty.max : (filterOptions.forecast_qty.max || 10000)
                                      ]}
                                      onChange={([min, max]) => {
                                        handleRangeChange('forecast_qty', [min, max]);
                                      }}
                                      colorScheme="blue">
                                      <RangeSliderTrack bg={`${theme.colors.tertiary.border}`} height="4px">
                                        <RangeSliderFilledTrack />
                                      </RangeSliderTrack>
                                      <RangeSliderThumb 
                                        index={0} 
                                        boxSize={5} 
                                        boxShadow="md" 
                                        border="2px solid white"
                                        _focus={{
                                          boxShadow: `0 0 0 3px ${theme.colors.sleekButton.background}30`
                                        }}
                                      />
                                      <RangeSliderThumb 
                                        index={1} 
                                        boxSize={5} 
                                        boxShadow="md" 
                                        border="2px solid white"
                                        _focus={{
                                          boxShadow: `0 0 0 3px ${theme.colors.sleekButton.background}30`
                                        }}
                                      />
                                    </RangeSlider>
                                  </Box>
                                  
                                  <Flex justify="space-between" px={2}>
                                    <Text fontSize="12px" fontWeight="medium" color={theme.colors.tertiary.color}>
                                      {filterOptions.forecast_qty.min || 0}
                                    </Text>
                                    <Text fontSize="12px" fontWeight="medium" color={theme.colors.tertiary.color}>
                                      {filterOptions.forecast_qty.max || 10000}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Box>
                            )}
                            
                            {/* Sold Quantity Range */}
                            {filterOptions?.sold_qty && (
                              <Box mb={6}>
                                <Flex mb={3} alignItems="center">
                                  <DataUsageOutlined style={{ fontSize: '18px', marginRight: '8px', color: theme.colors.sleekButton.text }} />
                                  <Text fontWeight="600" fontSize="15px">Sold Quantity</Text>
                                </Flex>
                                
                                <Flex direction="column" bg={theme.colors.tertiary.background} p={4} borderRadius="md">
                                  <Flex mb={4} align="center" justify="space-between">
                                    <Box>
                                      <Text fontSize="13px" color={theme.colors.tertiary.color} mb={1}>Min Value</Text>
                                      <NumberInput 
                                        size="sm" 
                                        maxW="100px" 
                                        defaultValue={filterOptions.sold_qty.min || 0}
                                        min={filterOptions.sold_qty.min || 0}
                                        max={filterOptions.sold_qty.max || 10000}
                                        value={filters?.sold_qty?.min !== undefined ? filters.sold_qty.min : (filterOptions.sold_qty.min || 0)}
                                        onChange={(valueString) => {
                                          const min = parseFloat(valueString);
                                          handleRangeChange('sold_qty', [min, filters?.sold_qty?.max !== undefined ? filters.sold_qty.max : (filterOptions.sold_qty.max || 10000)]);
                                        }}
                                        borderRadius="md"
                                        _focus={{
                                          borderColor: theme.colors.sleekButton.text,
                                          boxShadow: `0 0 0 1px ${theme.colors.sleekButton.text}`
                                        }}
                                      >
                                        <NumberInputField bg="white" />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Box>
                                    
                                    <Box textAlign="center" mx={3}>
                                      <Text fontSize="12px" color={theme.colors.tertiary.color} fontWeight="bold">to</Text>
                                    </Box>
                                    
                                    <Box>
                                      <Text fontSize="13px" color={theme.colors.tertiary.color} mb={1}>Max Value</Text>
                                      <NumberInput 
                                        size="sm" 
                                        maxW="100px"
                                        defaultValue={filterOptions.sold_qty.max || 10000}
                                        min={filterOptions.sold_qty.min || 0}
                                        max={filterOptions.sold_qty.max || 10000}
                                        value={filters?.sold_qty?.max !== undefined ? filters.sold_qty.max : (filterOptions.sold_qty.max || 10000)}
                                        onChange={(valueString) => {
                                          const max = parseFloat(valueString);
                                          handleRangeChange('sold_qty', [filters?.sold_qty?.min !== undefined ? filters.sold_qty.min : (filterOptions.sold_qty.min || 0), max]);
                                        }}
                                        borderRadius="md"
                                        _focus={{
                                          borderColor: theme.colors.sleekButton.text,
                                          boxShadow: `0 0 0 1px ${theme.colors.sleekButton.text}`
                                        }}
                                      >
                                        <NumberInputField bg="white" />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Box>
                                  </Flex>
                                  
                                  <Box px={2} py={4}>
                                    <RangeSlider
                                      aria-label={['min', 'max']}
                                      min={filterOptions.sold_qty.min || 0}
                                      max={filterOptions.sold_qty.max || 10000}
                                      defaultValue={[
                                        filterOptions.sold_qty.min || 0, 
                                        filterOptions.sold_qty.max || 10000
                                      ]}
                                      value={[
                                        filters?.sold_qty?.min !== undefined ? filters.sold_qty.min : (filterOptions.sold_qty.min || 0),
                                        filters?.sold_qty?.max !== undefined ? filters.sold_qty.max : (filterOptions.sold_qty.max || 10000)
                                      ]}
                                      onChange={([min, max]) => {
                                        handleRangeChange('sold_qty', [min, max]);
                                      }}
                                      colorScheme="blue">
                                      <RangeSliderTrack bg={`${theme.colors.tertiary.border}`} height="4px">
                                        <RangeSliderFilledTrack />
                                      </RangeSliderTrack>
                                      <RangeSliderThumb 
                                        index={0} 
                                        boxSize={5} 
                                        boxShadow="md" 
                                        border="2px solid white"
                                        _focus={{
                                          boxShadow: `0 0 0 3px ${theme.colors.sleekButton.background}30`
                                        }}
                                      />
                                      <RangeSliderThumb 
                                        index={1} 
                                        boxSize={5} 
                                        boxShadow="md" 
                                        border="2px solid white"
                                        _focus={{
                                          boxShadow: `0 0 0 3px ${theme.colors.sleekButton.background}30`
                                        }}
                                      />
                                    </RangeSlider>
                                  </Box>
                                  
                                  <Flex justify="space-between" px={2}>
                                    <Text fontSize="12px" fontWeight="medium" color={theme.colors.tertiary.color}>
                                      {filterOptions.sold_qty.min || 0}
                                    </Text>
                                    <Text fontSize="12px" fontWeight="medium" color={theme.colors.tertiary.color}>
                                      {filterOptions.sold_qty.max || 10000}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Box>
                            )}
                            
                            {/* Consensus Quantity Range */}
                            {filterOptions?.consensus_qty && (
                              <Box mb={0}>
                                <Flex mb={3} alignItems="center">
                                  <DataUsageOutlined style={{ fontSize: '18px', marginRight: '8px', color: theme.colors.sleekButton.text }} />
                                  <Text fontWeight="600" fontSize="15px">Consensus Quantity</Text>
                                </Flex>
                                
                                <Flex direction="column" bg={theme.colors.tertiary.background} p={4} borderRadius="md">
                                  <Flex mb={4} align="center" justify="space-between">
                                    <Box>
                                      <Text fontSize="13px" color={theme.colors.tertiary.color} mb={1}>Min Value</Text>
                                      <NumberInput 
                                        size="sm" 
                                        maxW="100px" 
                                        defaultValue={filterOptions.consensus_qty.min || 0}
                                        min={filterOptions.consensus_qty.min || 0}
                                        max={filterOptions.consensus_qty.max || 10000}
                                        value={filters?.consensus_qty?.min !== undefined ? filters.consensus_qty.min : (filterOptions.consensus_qty.min || 0)}
                                        onChange={(valueString) => {
                                          const min = parseFloat(valueString);
                                          handleRangeChange('consensus_qty', [min, filters?.consensus_qty?.max !== undefined ? filters.consensus_qty.max : (filterOptions.consensus_qty.max || 10000)]);
                                        }}
                                        borderRadius="md"
                                        _focus={{
                                          borderColor: theme.colors.sleekButton.text,
                                          boxShadow: `0 0 0 1px ${theme.colors.sleekButton.text}`
                                        }}
                                      >
                                        <NumberInputField bg="white" />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Box>
                                    
                                    <Box textAlign="center" mx={3}>
                                      <Text fontSize="12px" color={theme.colors.tertiary.color} fontWeight="bold">to</Text>
                                    </Box>
                                    
                                    <Box>
                                      <Text fontSize="13px" color={theme.colors.tertiary.color} mb={1}>Max Value</Text>
                                      <NumberInput 
                                        size="sm" 
                                        maxW="100px"
                                        defaultValue={filterOptions.consensus_qty.max || 10000}
                                        min={filterOptions.consensus_qty.min || 0}
                                        max={filterOptions.consensus_qty.max || 10000}
                                        value={filters?.consensus_qty?.max !== undefined ? filters.consensus_qty.max : (filterOptions.consensus_qty.max || 10000)}
                                        onChange={(valueString) => {
                                          const max = parseFloat(valueString);
                                          handleRangeChange('consensus_qty', [filters?.consensus_qty?.min !== undefined ? filters.consensus_qty.min : (filterOptions.consensus_qty.min || 0), max]);
                                        }}
                                        borderRadius="md"
                                        _focus={{
                                          borderColor: theme.colors.sleekButton.text,
                                          boxShadow: `0 0 0 1px ${theme.colors.sleekButton.text}`
                                        }}
                                      >
                                        <NumberInputField bg="white" />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Box>
                                  </Flex>
                                  
                                  <Box px={2} py={4}>
                                    <RangeSlider
                                      aria-label={['min', 'max']}
                                      min={filterOptions.consensus_qty.min || 0}
                                      max={filterOptions.consensus_qty.max || 10000}
                                      defaultValue={[
                                        filterOptions.consensus_qty.min || 0, 
                                        filterOptions.consensus_qty.max || 10000
                                      ]}
                                      value={[
                                        filters?.consensus_qty?.min !== undefined ? filters.consensus_qty.min : (filterOptions.consensus_qty.min || 0),
                                        filters?.consensus_qty?.max !== undefined ? filters.consensus_qty.max : (filterOptions.consensus_qty.max || 10000)
                                      ]}
                                      onChange={([min, max]) => {
                                        handleRangeChange('consensus_qty', [min, max]);
                                      }}
                                      colorScheme="blue">
                                      <RangeSliderTrack bg={`${theme.colors.tertiary.border}`} height="4px">
                                        <RangeSliderFilledTrack />
                                      </RangeSliderTrack>
                                      <RangeSliderThumb 
                                        index={0} 
                                        boxSize={5} 
                                        boxShadow="md" 
                                        border="2px solid white"
                                        _focus={{
                                          boxShadow: `0 0 0 3px ${theme.colors.sleekButton.background}30`
                                        }}
                                      />
                                      <RangeSliderThumb 
                                        index={1} 
                                        boxSize={5} 
                                        boxShadow="md" 
                                        border="2px solid white"
                                        _focus={{
                                          boxShadow: `0 0 0 3px ${theme.colors.sleekButton.background}30`
                                        }}
                                      />
                                    </RangeSlider>
                                  </Box>
                                  
                                  <Flex justify="space-between" px={2}>
                                    <Text fontSize="12px" fontWeight="medium" color={theme.colors.tertiary.color}>
                                      {filterOptions.consensus_qty.min || 0}
                                    </Text>
                                    <Text fontSize="12px" fontWeight="medium" color={theme.colors.tertiary.color}>
                                      {filterOptions.consensus_qty.max || 10000}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Box>
                            )}
                          </Box>
                        </TabPanel>
                        
                        {/* Dates Tab */}
                        <TabPanel p={5}>
                          {/* Week Start Date */}
                          <Box mb={4}>
                            <Text fontWeight="bold" mb={2}>Week Start Date</Text>
                            <Flex flexWrap="wrap" gap={2} flexDirection="column" maxH="300px" overflowY="auto">
                              {Array.isArray(filterOptions?.week_start_date) && filterOptions.week_start_date.map(item => (
                                <Checkbox 
                                  key={item.value} 
                                  isChecked={isFilterValueSelected('week_start_date', item.value)}
                                  onChange={() => applyFilter('week_start_date', item.value)}
                                  colorScheme="blue">
                                  {(() => {
                                    try {
                                      return new Date(item.value).toLocaleDateString();
                                    } catch (e) {
                                      return item.value;
                                    }
                                  })()} <Text as="span" fontSize="xs" color={theme.colors.tertiary.color}>({item.count})</Text>
                                </Checkbox>
                              ))}
                            </Flex>
                          </Box>
                        </TabPanel>
                        
                        {/* Location Tab */}
                        <TabPanel p={5}>
                          {LocationFilterTab}
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  )}
                </PopoverBody>
                <PopoverFooter
                  borderTop={`1px solid ${theme.colors.tertiary.border}`}
                  display="flex"
                  justifyContent="space-between"
                  p={4}
                  bg={theme.colors.tertiary.background}
                >
                  <Text color={theme.colors.tertiary.color} fontSize="13px">
                    {filters && Object.keys(filters).length > 0 ? 
                      `${Object.keys(filters).length} filter${Object.keys(filters).length > 1 ? 's' : ''} applied` : 
                      "No filters applied"
                    }
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    borderRadius="full"
                    onClick={() => {
                      setFilters(null);
                      // Reload filter options with null filters
                      fetchFilterOptions(null);
                    }}
                    leftIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
                    isDisabled={!filters || Object.keys(filters).length === 0}
                    height="24px"
                    minH="24px"
                    fontSize="12px"
                    fontWeight="500"
                    px={3}
                    color="red.500"
                    borderColor="red.500"
                    _hover={{
                      bg: `rgba(229, 62, 62, 0.1)`,
                      borderColor: 'red.500'
                    }}
                  >
                    Clear All
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
            
            {/* Sort dropdown */}
            <Menu closeOnSelect={true}>
              <MenuButton
                as={Button}
                leftIcon={<SortOutlined style={{ fontSize: '16px' }} />}
                rightIcon={<ArrowDropDown style={{ fontSize: '20px' }} />}
                size={'md'}
                style={{
                  height: '40px',
                  borderRadius: '5px',
                  border: `1px solid ${theme.colors.tertiary.border}`,
                  color: theme.colors.sleekButton.text,
                  backgroundColor: theme.colors.tertiary.background,
                  fontSize: '13px',
                  boxShadow: 'none',
                  fontWeight: '600'
                }}
                _hover={{ bg: theme.colors.tertiary.hover }}>
                Sort
              </MenuButton>
              <MenuList
                gap="5px"
                padding="5px 5px"
                borderColor={theme.colors.tertiary.border}
                bg={theme.colors.secondary.background}
                color={theme.colors.secondary.color}>
                <MenuItem 
                  onClick={() => handleSort('forecast_qty')} 
                  padding="10px 10px"
                  _hover={{
                    bg: theme.colors.tertiary.hover
                  }}
                  bg={sortInfo.field === 'forecast_qty' ? theme.colors.tertiary.background : ''}>
                  Forecast Quantity {sortInfo.field === 'forecast_qty' && (sortInfo.direction === 'asc' ? '↑' : '↓')}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSort('sold_qty')} 
                  padding="10px 10px"
                  _hover={{
                    bg: theme.colors.tertiary.hover
                  }}
                  bg={sortInfo.field === 'sold_qty' ? theme.colors.tertiary.background : ''}>
                  Sold Quantity {sortInfo.field === 'sold_qty' && (sortInfo.direction === 'asc' ? '↑' : '↓')}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSort('consensus_qty')} 
                  padding="10px 10px"
                  _hover={{
                    bg: theme.colors.tertiary.hover
                  }}
                  bg={sortInfo.field === 'consensus_qty' ? theme.colors.tertiary.background : ''}>
                  Consensus Quantity {sortInfo.field === 'consensus_qty' && (sortInfo.direction === 'asc' ? '↑' : '↓')}
                </MenuItem>
              </MenuList>
            </Menu>
            
            {/* Export button */}
            {data.items.length > 0 && (
              <CSVLink
                data={csvData}
                filename="forecast-data.csv"
                className="hidden-csv-link">
                <Button
                  leftIcon={<DownloadOutlined style={{ fontSize: '16px' }} />}
                  size={'md'}
                  style={{
                    height: '40px',
                    borderRadius: '5px',
                    border: `1px solid ${theme.colors.tertiary.border}`,
                    color: theme.colors.sleekButton.text,
                    backgroundColor: theme.colors.tertiary.background,
                    fontSize: '13px',
                    boxShadow: 'none',
                    fontWeight: '600'
                  }}
                  _hover={{ bg: theme.colors.tertiary.hover }}>
                  Export
                </Button>
              </CSVLink>
            )}
            
            {/* Refresh button */}
            <Button
              onClick={fetchData}
              leftIcon={<RefreshOutlined style={{ fontSize: '16px' }} />}
              size={'md'}
              style={{
                height: '40px',
                borderRadius: '5px',
                border: `1px solid ${theme.colors.tertiary.border}`,
                color: theme.colors.sleekButton.text,
                backgroundColor: theme.colors.tertiary.background,
                fontSize: '13px',
                boxShadow: 'none',
                fontWeight: '600'
              }}
              _hover={{ bg: theme.colors.tertiary.hover }}>
              Refresh
            </Button>
          </Flex>
        </Flex>
      </Box>
      
      {/* Applied filters */}
      {filters && Object.keys(filters).length > 0 && (
        <Flex 
          mb={4} 
          gap={2} 
          flexWrap="wrap" 
          p={2} 
          borderRadius="6px" 
          bg={theme.colors.tertiary.background}
          border={`1px solid ${theme.colors.tertiary.border}`}
        >
          {Object.entries(filters).map(([field, filter]) => {
            // Format the display based on the field type
            let icon;
            let color = "blue";
            let displayValue;
            
            // Set field-specific icons and formatting
            let fieldDisplayName = field.replace(/_/g, ' ');
            fieldDisplayName = fieldDisplayName.charAt(0).toUpperCase() + fieldDisplayName.slice(1);
            
            if (filter.type === 'discrete') {
              displayValue = filter.values.length > 1 
                ? `${filter.values[0]} +${filter.values.length - 1}` 
                : filter.values[0];
            } else {
              displayValue = `${filter.min || 0} - ${filter.max || 'max'}`;
            }
            
            if (field === 'week_start_date') {
              icon = <DateRangeOutlined style={{ fontSize: '12px' }} />;
              fieldDisplayName = 'Week';
              color = "purple";
              try {
                if (filter.type === 'discrete' && filter.values.length > 0) {
                  displayValue = filter.values.length > 1 
                    ? `${new Date(filter.values[0]).toLocaleDateString().split('/').slice(0, 2).join('/')} +${filter.values.length - 1}`
                    : new Date(filter.values[0]).toLocaleDateString().split('/').slice(0, 2).join('/');
                }
              } catch (e) {
                // Keep original if date parsing fails
              }
            } else if (field === 'super_category') {
              icon = <CategoryOutlined style={{ fontSize: '12px' }} />;
              fieldDisplayName = 'Category';
              color = "teal";
            } else if (field === 'store_type') {
              icon = <StorefrontOutlined style={{ fontSize: '12px' }} />;
              color = "green";
            } else if (field === 'format') {
              icon = <LocalMallOutlined style={{ fontSize: '12px' }} />;
              color = "purple";
            } else if (field === 'p1_dc') {
              icon = <DataUsageOutlined style={{ fontSize: '12px' }} />;
              fieldDisplayName = 'DC';
              color = "gray";
            } else if (field.includes('_qty')) {
              icon = <DataUsageOutlined style={{ fontSize: '12px' }} />;
              color = "orange";
            } else {
              icon = <FilterAltOutlined style={{ fontSize: '12px' }} />;
            }
            
            // Map color names to theme colors
            const getBgColor = (colorName) => {
              const colorMap = {
                blue: `${theme.colors.blue.bg}`,
                purple: `${theme.colors.purple.primary}`,
                teal: `rgba(49, 151, 149, 0.2)`,
                green: `${theme.colors.green.lightbg}`,
                gray: `${theme.colors.gray.bg}`,
                orange: `${theme.colors.orange.light}`
              };
              return colorMap[colorName] || colorMap.blue;
            };
            
            const getTextColor = (colorName) => {
              const colorMap = {
                blue: theme.colors.blue.main,
                purple: '#8575C8',
                teal: '#319795',
                green: theme.colors.green.main,
                gray: theme.colors.gray.main,
                orange: theme.colors.orange.main
              };
              return colorMap[colorName] || colorMap.blue;
            };
            
            return (
              <Button
                key={field}
                size="xs"
                variant="outline"
                leftIcon={icon}
                rightIcon={
                  <CloseOutlined 
                    style={{ 
                      fontSize: '10px', 
                      color: getTextColor(color)
                    }} 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFilter(field);
                    }}
                  />
                }
                borderRadius="full"
                fontSize="12px"
                fontWeight="500"
                boxShadow="none"
                height="22px"
                minH="22px"
                px={2}
                bg={getBgColor(color)}
                color={getTextColor(color)}
                borderColor={`${getTextColor(color)}40`}
                _hover={{ 
                  bg: getBgColor(color),
                  opacity: 0.8,
                  borderColor: getTextColor(color)
                }}
              >
                <Text as="span" fontWeight="500" mr={0.5}>
                  {fieldDisplayName}:
                </Text>
                <Text as="span" fontWeight="400" noOfLines={1} maxW="100px">
                  {displayValue}
                </Text>
              </Button>
            );
          })}
          
          <Spacer />
          
          <Button
            size="xs"
            variant="outline"
            colorScheme="red"
            onClick={() => {
              setFilters(null); 
              setTimeout(() => fetchData(), 0);
            }}
            height="24px"
            minH="24px"
            fontSize="12px"
            fontWeight="500"
            px={3}
            leftIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
            borderRadius="full"
            bg="rgba(229, 62, 62, 0.05)"
            color="red.500"
            borderColor="red.300"
            _hover={{ 
              bg: `rgba(229, 62, 62, 0.1)`,
              borderColor: 'red.500'
            }}
          >
            Clear All
          </Button>
        </Flex>
      )}
      
      {/* Move pagination to top of table */}
      {/* Pagination */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        p={0}
        borderRadius="8px"  
      >
        <Text fontSize="13px" color={theme.colors.tertiary.color}>
          {loading ? (
            <Spinner size="xs" mr={2} />
          ) : (
            <>
              Showing <Text as="span" fontWeight="bold">{data.items.length ? offset + 1 : 0}</Text>
              {" - "}
              <Text as="span" fontWeight="bold">{Math.min(offset + data.items.length, totalRecords)}</Text>
              {" of "}
              <Text as="span" fontWeight="bold">{totalRecords.toLocaleString()}</Text>
              {" records"}
            </>
          )}
        </Text>
        
        <Flex alignItems="center">
          <Box 
            position="relative" 
            borderRadius="8px" 
            overflow="hidden"
            border={`1px solid ${theme.colors.tertiary.border}`}
            mr={4}
          >
            <Select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setLimit(newLimit);
                setCurrentPage(1);
                setOffset(0);
              }}
              size="sm"
              w="80px"
              style={{
                height: '32px',
                paddingLeft: '8px',
                paddingRight: '24px',
                color: theme.colors.sleekButton.text,
                backgroundColor: theme.colors.tertiary.background,
                fontSize: '13px',
                fontWeight: '500',
                border: 'none',
                boxShadow: 'none'
              }}
              _hover={{ backgroundColor: theme.colors.tertiary.hover }}
              _focus={{ boxShadow: 'none', borderColor: theme.colors.tertiary.border }}
              iconSize="16px"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </Box>
          
          <Flex 
            alignItems="center" 
            border={`1px solid ${theme.colors.tertiary.border}`}
            borderRadius="8px"
            overflow="hidden"
          >
            <IconButton
              aria-label="Previous page"
              icon={<KeyboardArrowLeft style={{ fontSize: '18px' }} />}
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1 || loading}
              size="sm"
              style={{
                height: '32px',
                width: '32px',
                minWidth: '32px',
                borderRadius: '0',
                borderRight: `1px solid ${theme.colors.tertiary.border}`,
                color: currentPage === 1 ? theme.colors.tertiary.color : theme.colors.sleekButton.text,
                backgroundColor: theme.colors.tertiary.background,
                boxShadow: 'none'
              }}
              _hover={{ bg: theme.colors.tertiary.hover }}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: theme.colors.tertiary.background }}
            />
            
            <Flex 
              alignItems="center" 
              justifyContent="center" 
              height="32px" 
              px={3} 
              borderRight={`1px solid ${theme.colors.tertiary.border}`}
              minW="80px"
              bg={theme.colors.tertiary.background}
            >
              <Text fontSize="13px" fontWeight="medium" color={theme.colors.tertiary.color}>
                {currentPage}
                <Text as="span" color={theme.colors.tertiary.color} mx={1} opacity="0.5">/</Text>
                {Math.max(1, Math.ceil(totalRecords / limit))}
              </Text>
            </Flex>
            
            <IconButton
              aria-label="Next page"
              icon={<KeyboardArrowRight style={{ fontSize: '18px' }} />}
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage >= Math.ceil(totalRecords / limit) || loading}
              size="sm"
              style={{
                height: '32px',
                width: '32px',
                minWidth: '32px',
                borderRadius: '0',
                color: currentPage >= Math.ceil(totalRecords / limit) ? theme.colors.tertiary.color : theme.colors.sleekButton.text,
                backgroundColor: theme.colors.tertiary.background,
                boxShadow: 'none'
              }}
              _hover={{ bg: theme.colors.tertiary.hover }}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: theme.colors.tertiary.background }}
            />
          </Flex>
        </Flex>
      </Flex>
      
      {/* Data table */}
      <Box
        borderWidth="1px"
        borderColor={theme.colors.tertiary.border}
        borderRadius="12px"
        overflow="hidden"
        mb={4}
        position="relative"
        boxShadow="0 4px 12px rgba(0,0,0,0.05)">
        {loading && data.items.length > 0 && (
          <Flex 
            position="absolute" 
            top="0" 
            left="0" 
            right="0" 
            height="3px" 
            zIndex="10"
            overflow="hidden"
            bg="transparent"
          >
            <Box 
              height="100%" 
              width="30%" 
              bg={`${theme.colors.sleekButton.text}`}
              borderRadius="full"
              position="absolute"
              animation="loading 1.5s infinite"
              sx={{
                '@keyframes loading': {
                  '0%': {
                    left: '-30%',
                  },
                  '100%': {
                    left: '100%',
                  },
                },
              }}
            />
          </Flex>
        )}
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg={`${theme.colors.tertiary.background}`}>
              <Tr>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                  width="280px"
                >
                  <Flex align="center" gap={1}>
                    <CategoryOutlined style={{ fontSize: '16px', color: theme.colors.tertiary.color }} />
                    Article Details
                  </Flex>
                </Th>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                >
                  <Flex align="center" gap={1}>
                    <LocalMallOutlined style={{ fontSize: '16px', color: theme.colors.tertiary.color }} />
                    Brand
                  </Flex>
                </Th>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                >
                  <Flex align="center" gap={1}>
                    <StorefrontOutlined style={{ fontSize: '16px', color: theme.colors.tertiary.color }} />
                    Location
                  </Flex>
                </Th>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                  isNumeric
                >
                  <Flex 
                    alignItems="center" 
                    cursor="pointer" 
                    onClick={() => handleSort('forecast_qty')}
                    position="relative"
                    justifyContent="flex-end"
                    _hover={{
                      color: theme.colors.sleekButton.text
                    }}
                    color={sortInfo.field === 'forecast_qty' ? theme.colors.sleekButton.text : theme.colors.tertiary.color}
                    transition="color 0.2s ease"
                  >
                    <Text>Forecast</Text>
                    {sortInfo.field === 'forecast_qty' ? (
                      <Flex 
                        ml={2}
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                        borderRadius="4px"
                        bg={`${theme.colors.sleekButton.background}20`}
                      >
                        <Text fontWeight="bold" fontSize="12px">
                          {sortInfo.direction === 'asc' ? '↑' : '↓'}
                        </Text>
                      </Flex>
                    ) : (
                      <Flex 
                        ml={2}
                        opacity="0.3"
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                        _groupHover={{ opacity: 0.7 }}
                      >
                        <Text fontSize="12px">↕</Text>
                      </Flex>
                    )}
                  </Flex>
                </Th>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                  isNumeric
                >
                  <Flex 
                    alignItems="center" 
                    cursor="pointer" 
                    onClick={() => handleSort('sold_qty')}
                    position="relative"
                    justifyContent="flex-end"
                    _hover={{
                      color: theme.colors.sleekButton.text
                    }}
                    color={sortInfo.field === 'sold_qty' ? theme.colors.sleekButton.text : theme.colors.tertiary.color}
                    transition="color 0.2s ease"
                  >
                    <Text>Sold</Text>
                    {sortInfo.field === 'sold_qty' ? (
                      <Flex 
                        ml={2}
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                        borderRadius="4px"
                        bg={`${theme.colors.sleekButton.background}20`}
                      >
                        <Text fontWeight="bold" fontSize="12px">
                          {sortInfo.direction === 'asc' ? '↑' : '↓'}
                        </Text>
                      </Flex>
                    ) : (
                      <Flex 
                        ml={2}
                        opacity="0.3"
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                        _groupHover={{ opacity: 0.7 }}
                      >
                        <Text fontSize="12px">↕</Text>
                      </Flex>
                    )}
                  </Flex>
                </Th>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                  isNumeric
                >
                  <Flex 
                    alignItems="center" 
                    cursor="pointer" 
                    onClick={() => handleSort('consensus_qty')}
                    position="relative"
                    justifyContent="flex-end"
                    _hover={{
                      color: theme.colors.sleekButton.text
                    }}
                    color={sortInfo.field === 'consensus_qty' ? theme.colors.sleekButton.text : theme.colors.tertiary.color}
                    transition="color 0.2s ease"
                  >
                    <Text>Consensus</Text>
                    {sortInfo.field === 'consensus_qty' ? (
                      <Flex 
                        ml={2}
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                        borderRadius="4px"
                        bg={`${theme.colors.sleekButton.background}20`}
                      >
                        <Text fontWeight="bold" fontSize="12px">
                          {sortInfo.direction === 'asc' ? '↑' : '↓'}
                        </Text>
                      </Flex>
                    ) : (
                      <Flex 
                        ml={2}
                        opacity="0.3"
                        alignItems="center"
                        justifyContent="center"
                        w="20px"
                        h="20px"
                        _groupHover={{ opacity: 0.7 }}
                      >
                        <Text fontSize="12px">↕</Text>
                      </Flex>
                    )}
                  </Flex>
                </Th>
                <Th 
                  color={theme.colors.tertiary.color} 
                  py={4} 
                  fontSize="13px"
                  borderBottom={`2px solid ${theme.colors.tertiary.border}`}
                  fontWeight="600"
                >
                  <Flex align="center" gap={1}>
                    <StorefrontOutlined style={{ fontSize: '16px', color: theme.colors.tertiary.color }} />
                    Type
                  </Flex>
                </Th>
              </Tr>
            </Thead>
            <Tbody opacity={loading && data.items.length > 0 ? 0.6 : 1} transition="opacity 0.2s ease">
              {data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <Tr 
                    key={index} 
                    _hover={{ 
                      bg: `${theme.colors.tertiary.hover}`,
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                    }}
                    transition="all 0.2s ease"
                    borderBottom={`1px solid ${theme.colors.tertiary.border}`}
                  >
                    <Td py={4} px={4}>
                      <Box
                        p={3}
                        bg={`${theme.colors.tertiary.background}${themeMode === 'dark' ? '80' : '50'}`}
                        border={`1px solid ${theme.colors.tertiary.border}`}
                        borderRadius="md"
                        _hover={{
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          borderColor: `${theme.colors.sleekButton.background}80`
                        }}
                        transition="all 0.2s ease"
                      >
                        <Flex direction="column" gap={2}>
                          {/* Article ID Badge */}
                          <Flex justify="space-between" align="center">
                            <Badge
                              colorScheme="gray"
                              variant="subtle"
                              fontSize="10px"
                              px={2}
                              py={0.5}
                              borderRadius="4px"
                              textTransform="none"
                              bg={`${theme.colors.tertiary.border}50`}
                              color={theme.colors.tertiary.color}
                            >
                              #{item.article_id || '-'}
                            </Badge>
                            
                            {item.kvi === 'Yes' && (
                              <Badge
                                colorScheme="purple"
                                variant="solid"
                                fontSize="10px"
                                px={2}
                                borderRadius="full"
                              >
                                KVI
                              </Badge>
                            )}
                          </Flex>
                          
                          {/* Article Name */}
                          <Text 
                            fontWeight="600" 
                            fontSize="14px" 
                            noOfLines={2}
                            lineHeight="1.3"
                            color={theme.colors.secondary.color}
                          >
                            {item.article_description || 'Unknown Article'}
                          </Text>
                          
                          {/* Brand & Segment */}
                          <Flex gap={2} wrap="wrap" align="center">
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              fontSize="11px"
                              px={2}
                              py={0.5}
                              borderRadius="4px"
                            >
                              {item.brand || 'No Brand'}
                            </Badge>
                            
                            {item.segment && (
                              <Text fontSize="11px" color={theme.colors.tertiary.color} noOfLines={1}>
                                {item.segment}
                                {item.segment_code && <span> ({item.segment_code})</span>}
                              </Text>
                            )}
                          </Flex>
                          
                          {/* Division if available */}
                          {item.division && (
                            <Text fontSize="11px" color={theme.colors.tertiary.color} noOfLines={1}>
                              Division: {item.division}
                            </Text>
                          )}
                        </Flex>
                      </Box>
                    </Td>
                    
                    <Td py={4}>
                      <Flex direction="column" gap={1}>
                        <Text fontWeight="500">{item.brand || 'No Brand'}</Text>
                        {item.division && (
                          <Text fontSize="12px" color={theme.colors.tertiary.color}>
                            {item.division}
                          </Text>
                        )}
                      </Flex>
                    </Td>
                    
                    <Td py={4}>
                      <Flex direction="column" gap={1}>
                        <Text fontWeight="500">{item.city || '-'}</Text>
                        {item.region && (
                          <Text fontSize="12px" color={theme.colors.tertiary.color}>
                            {item.region}, {item.state || ''}
                          </Text>
                        )}
                        {item.p1_dc && (
                          <Badge 
                            colorScheme="gray" 
                            variant="outline" 
                            fontSize="10px" 
                            alignSelf="flex-start"
                          >
                            DC: {item.p1_dc}
                          </Badge>
                        )}
                      </Flex>
                    </Td>
                    
                    <Td py={4} isNumeric>
                      <Text fontWeight="600" fontSize="15px" color={theme.colors.sleekButton.text}>
                        {item.forecast_qty?.toLocaleString() || '0'}
                      </Text>
                    </Td>
                    
                    <Td py={4} isNumeric>
                      <Text 
                        fontWeight="600" 
                        fontSize="15px" 
                        color={
                          item.sold_qty > item.forecast_qty 
                            ? "green.500" 
                            : item.sold_qty < item.forecast_qty * 0.8 
                              ? "red.500" 
                              : theme.colors.tertiary.color
                        }
                      >
                        {item.sold_qty?.toLocaleString() || '0'}
                      </Text>
                    </Td>
                    
                    <Td py={4} isNumeric>
                      <Text fontWeight="600" fontSize="15px" color={theme.colors.tertiary.color}>
                        {item.consensus_qty?.toLocaleString() || '0'}
                      </Text>
                    </Td>
                    
                    <Td py={4}>
                      <Badge 
                        colorScheme={
                          item.store_type === 'Online' ? 'blue' : 
                          item.store_type === 'Offline' ? 'orange' : 'gray'
                        }
                        variant="subtle"
                        fontSize="12px"
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {item.store_type || 'Unknown'}
                      </Badge>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={10}>
                    <Flex direction="column" alignItems="center" gap={2}>
                      <CategoryOutlined style={{ fontSize: '32px', color: theme.colors.tertiary.border }} />
                      <Text fontSize="16px" fontWeight="medium" color={theme.colors.tertiary.color}>
                        No forecast data found
                      </Text>
                      <Text fontSize="14px" color={theme.colors.tertiary.color}>
                        Try adjusting your filters or search criteria
                      </Text>
                      {filters && Object.keys(filters).length > 0 && (
                        <Button
                          size="sm"
                          mt={2}
                          onClick={() => {
                            setFilters(null);
                            fetchData();
                          }}
                          colorScheme="blue"
                          variant="outline"
                        >
                          Clear all filters
                        </Button>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Forecast; 