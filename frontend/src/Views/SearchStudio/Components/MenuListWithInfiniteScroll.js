import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MenuList, MenuItem, Text, Input, Spacer, useTheme } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import MetadataRepository from '../../../repositories/metadata';
import { useParams } from 'react-router-dom';

const highlight = (text, highlight, color = '#E4EFFF') => {
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

const MenuListWithInfiniteScroll = ({ company_name, attribute_name, filterValues, setFilter }) => {
  // States
  const [input, setInput] = useState('');
  const [valueSearch, setValueSearch] = useState('');
  const [keys, setKeys] = useState([]); // Holds the fetched values
  const [page, setPage] = useState(1); // Tracks the current page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Checks if more pages are available
  const [error, setError] = useState(null);
  const { appName } = useParams();

  const menuListRef = useRef(null);
  const inputRef = useRef(null);
  const theme = useTheme();

  // Track previous filterValues for comparison
  const prevFilterValuesRef = useRef(filterValues);

  // Focus management helper function
  const maintainFocus = useCallback(() => {
    if (inputRef.current) {
      const activeElement = document.activeElement;
      // Only focus if it's not already focused or if focus is lost
      if (activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, []);

  // Initial focus
  useEffect(() => {
    maintainFocus();
  }, []);

  const metadataRepository = new MetadataRepository(
    import.meta.env.VITE_API_STUDIO_URL + '/retailstudio'
  );

  // Fetch data function with better focus handling
  const fetchData = async (newPage = 1, search = '') => {
    if (loading || (!hasMore && newPage !== 1)) return;

    setLoading(true);
    try {
      const res = await metadataRepository.fetchAttributeValues({
        company_name,
        attribute_name,
        stateSetters: {
          setLoading: () => {}, // Handle loading state directly
          setError: () => {}, // Handle error state directly
          setData: () => {} // Handle data state directly
        },
        app: appName,
        data: { search, page: newPage, limit: 10 }
      });

      // Update keys with new values
      setKeys((prevKeys) => {
        return newPage === 1
          ? res?.map((e) => e.value) || []
          : [...prevKeys, ...(res?.map((e) => e.value) || [])];
      });

      // Update hasMore based on if we got fewer results than expected
      setHasMore((res?.length || 0) >= 10);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      // Restore focus after state updates
      setTimeout(maintainFocus, 0);
    }
  };

  // Handle scroll for infinite scroll
  const handleScroll = () => {
    const menuList = menuListRef.current;
    if (!menuList || loading || !hasMore) return;

    // Check if scrolled to bottom
    if (menuList.scrollTop + menuList.clientHeight >= menuList.scrollHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    fetchData(page, valueSearch);
  }, [page]);

  // Separate effect for search value changes to reset pagination
  useEffect(() => {
    if (valueSearch !== undefined) {
      // Only run if valueSearch is defined (not on initial mount)
      // Preserve focus before resetting state
      const wasFocused = document.activeElement === inputRef.current;

      setKeys([]);
      setPage(1);
      setHasMore(true);
      fetchData(1, valueSearch);

      // Ensure focus is maintained after state changes
      if (wasFocused) {
        setTimeout(maintainFocus, 0);
      }
    }
  }, [valueSearch]);

  // Add effect to respond to filterValues changes
  useEffect(() => {
    // Check if filterValues has actually changed
    const hasFilterChanged =
      JSON.stringify(prevFilterValuesRef.current) !== JSON.stringify(filterValues);

    if (hasFilterChanged) {
      // Update our ref to the current filterValues
      prevFilterValuesRef.current = filterValues;

      // No need to refetch data when only the selected state changes
      // Just ensure the UI updates by maintaining focus
      maintainFocus();
    }
  }, [filterValues, maintainFocus]);

  // Attach scroll listener
  useEffect(() => {
    const menuList = menuListRef.current;
    if (menuList) {
      menuList.addEventListener('scroll', handleScroll);
      return () => menuList.removeEventListener('scroll', handleScroll);
    }
  }, [loading, hasMore]);

  // Focus restoration after data loading
  useEffect(() => {
    if (!loading) {
      maintainFocus();
    }
  }, [loading, maintainFocus]);

  // Add effect to refresh the list when attribute_name changes
  useEffect(() => {
    // Reset state and fetch new data when attribute changes
    setKeys([]);
    setPage(1);
    setHasMore(true);
    setValueSearch('');
    fetchData(1, '');
  }, [attribute_name, company_name]);

  const handleSearchChange = (e) => {
    setValueSearch(e.target.value);
  };

  return (
    <MenuList
      ref={menuListRef}
      gap="5px"
      maxH={'500px'}
      overflowY={'scroll'}
      borderColor={theme.colors.tertiary.border}
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}
      padding="5px 5px"
      minWidth={'300px'}>
      <Input
        ref={inputRef}
        value={valueSearch}
        borderColor={theme.colors.tertiary.border}
        borderRadius={'5px'}
        bg={theme.colors.tertiary.background}
        color={theme.colors.tertiary.color}
        onChange={handleSearchChange}
        w="100%"
        _focus={{ border: '1px solid blue' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && valueSearch !== '') {
            if (!filterValues.includes(valueSearch)) {
              setFilter(attribute_name, [...filterValues, valueSearch]);
            }
            setValueSearch('');
          }
        }}
        mt="5px"
        placeholder={'Search Or Add Value'}
        variant={'outline'}
        mb="5px"
      />

      {keys.map((key, index) => (
        <MenuItem
          key={`${key}-${index}`} // Better key for stability
          padding="10px 10px"
          borderBottom={`1px solid ${theme.colors.tertiary.border}`}
          mb="5px"
          _hover={{
            bg: theme.colors.tertiary.hover
          }}
          bg={filterValues.includes(key) ? theme.colors.tertiary.background : ''}
          onClick={() => {
            // Keep track of whether the input was focused
            const wasFocused = document.activeElement === inputRef.current;

            if (!filterValues.includes(key)) {
              setFilter(attribute_name, [...filterValues, key]);
            } else {
              setFilter(
                attribute_name,
                filterValues.filter((e) => e !== key)
              );
            }

            // Restore focus after state update if it was focused before
            if (wasFocused) {
              setTimeout(maintainFocus, 0);
            }
          }}
          gap="10px">
          <Text ml="10px" fontSize="13px" fontWeight={'bold'}>
            {valueSearch ? highlight(key.toString(), valueSearch, theme.colors.link.bg) : key}
          </Text>
          <Spacer />
          {filterValues.includes(key) ? (
            <CheckIcon style={{ color: '#158939', fontSize: '15px' }} />
          ) : null}
        </MenuItem>
      ))}

      {loading && (
        <Text fontSize="13px" textAlign="center">
          Loading...
        </Text>
      )}
      {!hasMore && keys.length > 0 && (
        <Text fontSize="13px" textAlign="center">
          No more data
        </Text>
      )}
      {error && (
        <Text color="red" fontSize="13px" textAlign="center">
          {error.message}
        </Text>
      )}
    </MenuList>
  );
};

export default MenuListWithInfiniteScroll;
