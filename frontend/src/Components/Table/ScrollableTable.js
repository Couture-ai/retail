import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useTheme
} from '@chakra-ui/react';
import { InfoOutlined } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';

const TableCommon = (props) => {
  const theme = useTheme();
  const [isHover, setIsHover] = useState(false);
  const scrollRef = useRef();
  const colSpan = props?.header.reduce((acc, current) => acc + current.colSpan, 0);
  const handleInfo = () => {
    setIsHover(true);
  };

  const handleInfoLeave = () => {
    setIsHover(false);
  };
  const handleScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      let scrolledToBottom =
        scrollContainer.scrollHeight - Math.ceil(scrollContainer.scrollTop) <=
        scrollContainer.clientHeight;
      scrolledToBottom = scrolledToBottom && !props.isLoading;
      if (scrolledToBottom) {
        props.fetchData();
      }
    }
  };
  return (
    <TableContainer
      ref={scrollRef}
      onScroll={handleScroll}
      display="flex"
      w="100%"
      maxW="100%"
      overflowY="scroll"
      {...props}>
      <Table variant={'simple'}>
        <Thead
          // bgColor={theme.colors.primary.lighter}
          sx={{ position: 'sticky', top: 0, zIndex: 900 }}>
          <Tr
            textColor={theme.colors.black[1000]}
            style={{ border: `1px solid ${theme.colors.gray.light}`, borderRadius: '8px' }}>
            {props.header &&
              props.header.map((title, i) => (
                <Th
                  key={i}
                  colSpan={title.colSpan ? title.colSpan : null}
                  style={{ border: `1px solid ${theme.colors.gray.light}` }}>
                  {title.leftIconHeader ? (
                    <Flex flexDir={'row'}>
                      <Text color={theme.colors.white}>{title.leftIconHeader}</Text>
                      <Text color={theme.colors.white}>{title.name}</Text>
                      <Text color={theme.colors.white}>
                        {title.rightIconHeader ? title.rightIconHeader : null}
                      </Text>
                    </Flex>
                  ) : (
                    <Flex flexDir={'row'}>
                      <Text
                        style={{
                          color: `${theme.colors.secondary.colorGray}`,

                          fontSize: '15px',
                          fontWeight: 'bold'
                        }}>
                        {title.name}
                      </Text>
                      {title.info && (
                        <Popover placement="right" trigger="hover">
                          <PopoverTrigger>
                            <InfoOutlined
                              style={{
                                color: isHover
                                  ? `${theme.colors.white}`
                                  : `${theme.colors.primary.main}`,
                                width: '15px',
                                height: '15px'
                              }}
                              onMouseEnter={handleInfo}
                              onMouseLeave={handleInfoLeave}
                              cursor={'pointer'}
                            />
                          </PopoverTrigger>
                          <PopoverContent maxW="30vh" p={3}>
                            <PopoverArrow />
                            <Text
                              color={theme.colors.black[1000]}
                              fontSize="10px"
                              // wordBreak="break-word"
                              // wordWrap="break-word"
                              whiteSpace="normal"
                              ml={1}
                              maxW="20vh">
                              {title.info.toLowerCase()}
                            </Text>
                          </PopoverContent>
                        </Popover>
                      )}
                    </Flex>
                  )}
                </Th>
                // <Th key={i} colSpan={title.colSpan}>
                //   {title.leftIconHeader ? title.leftIconHeader : title.name}
                // </Th>
              ))}
          </Tr>
        </Thead>
        <Tbody verticalAlign="middle" textAlign="center" justifyContent="center">
          {props.children}
          <Tr justifyContent="center">
            <Td textAlign="center" colSpan={colSpan}>
              <ClipLoader color={theme.colors.primary.main} size={40} loading={props.isLoading} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableCommon;
