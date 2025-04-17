import React, { useEffect, useRef, useState } from 'react';
import {
  MenuList,
  MenuItem,
  Text,
  Input,
  Spacer,
  useTheme,
  Flex,
  CircularProgress
} from '@chakra-ui/react';
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

const AttributesMenuList = ({ company_name, setFilter, filter, currentKeys, filterObject }) => {
  const [input, setInput] = useState('');
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { appName } = useParams();

  const menuListRef = useRef(null);
  const inputRef = useRef(null);
  const theme = useTheme();

  // Focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Preserve focus after input changes
  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Schedule focus preservation after state update and re-render
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const metadataRepository = new MetadataRepository(
    import.meta.env.VITE_API_STUDIO_URL + '/retailstudio'
  );

  const fetchData = async () => {
    setLoading(true);
    const stateSetters = {
      setData: () => {},
      setLoading,
      setError
    };

    try {
      const res = await metadataRepository.fetchAttributeNames({
        company_name,
        stateSetters,
        app: appName
      });
      setKeys(res.columns);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [company_name, appName]);

  const dataTypeMap = {
    varchar: 'options',
    text: 'options',
    integer: 'range',
    float: 'range',
    array: 'options',
    date: 'range',
    dataetime: 'range',
    boolean: 'options'
  };

  return (
    <MenuList
      ref={menuListRef}
      gap="5px"
      maxH={'500px'}
      overflowY={'scroll'}
      padding="5px 5px"
      borderColor={theme.colors.tertiary.border}
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}
      minWidth={'300px'}>
      <Input
        ref={inputRef}
        borderColor={theme.colors.tertiary.border}
        borderRadius={'5px'}
        bg={theme.colors.tertiary.background}
        color={theme.colors.tertiary.color}
        value={input}
        onChange={handleInputChange}
        w="100%"
        _focus={{
          border: '1px solid blue'
        }}
        mt="5px"
        placeholder={'Search Attribute'}
        variant={'outline'}
        mb="5px"
      />
      {loading && (
        <Flex w="100%" justifyContent={'center'}>
          <CircularProgress isIndeterminate size="20px" />
        </Flex>
      )}
      {keys
        .filter((e) => !currentKeys.includes(e.name))
        .filter((e) => e.name.toLowerCase().includes(input.toLowerCase()))
        .map((key) => (
          <MenuItem
            padding="5px 10px"
            borderBottom={`1px solid ${theme.colors.tertiary.border}`}
            mb="0px"
            _hover={{
              bg: theme.colors.tertiary.hover
            }}
            bg={key.name == filter ? theme.colors.tertiary.background : ''}
            onClick={() => {
              setFilter(
                key.name,
                dataTypeMap[key.type] == 'options' ? [] : [0],
                dataTypeMap[key.type] == 'options' ? 'is' : '<',
                dataTypeMap[key.type]
              );
            }}
            gap="10px"
            key={key.name}>
            <Flex
              w="30px"
              fontSize={'14px'}
              color="#777"
              h="30px"
              borderRadius={'5px'}
              p="5px"
              alignItems={'center'}
              justifyContent={'center'}
              bg="transparent">
              #
            </Flex>
            <Text ml="10px" fontSize="13px" fontWeight={'bold'}>
              {input ? highlight(key.name, input) : key.name}
            </Text>
            <Spacer />
            <Flex
              p="2px 5px"
              borderRadius={'2px'}
              fontSize={'12px'}
              bg={theme.colors.tertiary.background}>
              {key.type}
            </Flex>
            {key.name == filter ? (
              <CheckIcon style={{ color: '#158939', fontSize: '15px' }} />
            ) : null}
          </MenuItem>
        ))}
    </MenuList>
  );
};

export default AttributesMenuList;
