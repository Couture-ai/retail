import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  ChakraProvider,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useTheme
} from '@chakra-ui/react';
import enter from '../../Static/images/enter.png';
import { useEffect, useState } from 'react';

const Pagination = ({ page, setPage, fetch, totalProductsCount, pageSize }) => {
  const [pageInputFocused, setPageInputFocused] = useState(false);
  const [pageInputValueChanged, setPageInputValueChanged] = useState(false);
  const [pageInputValue, setPageInputValue] = useState(page);
  useEffect(() => {
    setPageInputValue(page);
  }, [page]);
  const theme = useTheme();
  return (
    <ChakraProvider>
      <Flex
        gap="10px"
        flexDir={'row'}
        mt={5}
        my={2}
        alignItems={'center'}
        justifyContent="center"
        color={theme.colors.tertiary.color}>
        <Button
          leftIcon={<ChevronLeftIcon />}
          color={`${theme.colors.tertiary.color} !important`}
          _hover={{
            bg: theme.colors.tertiary.hover
          }}
          bg={theme.colors.tertiary.background}
          border={`1px solid ${theme.colors.tertiary.border}`}
          onClick={() => {
            setPage(page - 1);
            fetch(page - 1);
            // fetchProducts(page - 1, currentQuery, rawSearch, searchedFilters);
          }}
          isDisabled={page <= 1}
          size="sm">
          Prev
        </Button>
        <Flex alignItems={'center'}>
          {' '}
          <InputGroup>
            {pageInputFocused && pageInputValueChanged ? (
              <InputLeftElement width="4.0rem" h="30px">
                <Button
                  ml="4px"
                  leftIcon={
                    <Image src={enter} filter={theme.colors.gray.filter} h="15px" w="15px" />
                  }
                  h="1.5rem"
                  size="sm"
                  bg="#eeeeee"
                  borderRadius={'5px'}
                  fontSize={'10px'}
                  boxShadow={'none'}
                  color="#aaaaaa">
                  ENTER
                </Button>
              </InputLeftElement>
            ) : null}
            <Input
              textAlign={'right'}
              p="0px 5px"
              w="120px"
              h="30px"
              borderColor={theme.colors.tertiary.border}
              type="number"
              fontSize={'14px'}
              value={pageInputValue}
              onFocus={() => {
                setPageInputFocused(true);
              }}
              onBlur={() => {
                setPageInputFocused(false);
                setPageInputValue(page);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (
                    pageInputValue < 1 ||
                    pageInputValue > Math.ceil(totalProductsCount / pageSize) ||
                    pageInputValue == null
                  ) {
                    setPageInputFocused(false);
                    setPageInputValueChanged(false);
                    setPageInputValue(page);
                    return;
                  }
                  setPage(pageInputValue);
                  //   fetchProducts(pageInputValue, currentQuery, rawSearch, searchedFilters);
                  fetch(pageInputValue);
                  setPageInputFocused(false);
                  setPageInputValueChanged(false);
                }
              }}
              onChange={(e) => {
                setPageInputValue(parseInt(e.target.value));
                setPageInputValueChanged(true);
              }}
            />
          </InputGroup>
          <Text>
            /
            <span
              onClick={() => {
                setPage(Math.ceil(totalProductsCount / pageSize));
                // fetchProducts(
                //   Math.ceil(totalProductsCount / pageSize),
                //   currentQuery,
                //   rawSearch,
                //   searchedFilters
                // );
                fetch(Math.ceil(totalProductsCount / pageSize));
              }}
              style={{
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}>
              {Math.ceil(totalProductsCount / pageSize)}
            </span>
          </Text>
        </Flex>

        <Button
          bg={theme.colors.tertiary.background}
          color={`${theme.colors.tertiary.color} !important`}
          border={`1px solid ${theme.colors.tertiary.border}`}
          _hover={{
            bg: theme.colors.tertiary.hover
          }}
          rightIcon={<ChevronRightIcon />}
          onClick={() => {
            setPage(parseInt(page) + 1);
            // fetchProducts(page + 1, currentQuery, rawSearch, searchedFilters);
            fetch(parseInt(page) + 1);
          }}
          isDisabled={page >= Math.ceil(totalProductsCount / pageSize)}
          size="sm">
          Next
        </Button>
      </Flex>
    </ChakraProvider>
  );
};
export default Pagination;
