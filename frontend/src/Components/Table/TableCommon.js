import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useTheme
} from '@chakra-ui/react';
import { InfoOutlined } from '@mui/icons-material';
import React, { useState } from 'react';

const TableCommon = (props) => {
  const theme = useTheme();
  const [isHover, setIsHover] = useState(false);

  const handleInfo = () => {
    setIsHover(true);
  };

  const handleInfoLeave = () => {
    setIsHover(false);
  };
  return (
    <TableContainer display="flex" w="100%" maxW="100%" overflowY="auto" {...props}>
      <Table variant={'simple'}>
        <Thead
          bgColor={theme.colors.primary.lighter}
          sx={{ position: 'sticky', top: 0, zIndex: 900 }}>
          <Tr textColor={theme.colors.primary.main}>
            {props.header &&
              props.header.map((title, i) => (
                <Th key={i} colSpan={title.colSpan ? title.colSpan : null}>
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
                      <Text color={theme.colors.primary.main}>{title.name}</Text>
                      {title.info && (
                        <Popover placement="right" trigger="hover">
                          <PopoverTrigger>
                            <InfoOutlined
                              style={{
                                color: isHover
                                  ? `${theme.colors.black[1000]}`
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
        <Tbody>{props.children}</Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableCommon;
