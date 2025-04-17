import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
  useTheme
} from '@chakra-ui/react';
import { InfoOutlined, Launch } from '@mui/icons-material';
import React from 'react';
import Card from '../../Components/Card/Card';

const AnalyticsTableIndi = (props) => {
  const theme = useTheme();
  return (
    <Card w="100%">
      <Flex flexDir={'column'}>
        <Flex flexDir={'row'} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap="5px">
            <Text variant={'body1'}>{props.title}</Text>
            <Popover placement="right" trigger="hover">
              <PopoverTrigger>
                <InfoOutlined
                  style={{
                    color: `${theme.colors.gray.light}`,
                    width: '15px',
                    height: '15px'
                  }}
                  cursor={'pointer'}
                />
              </PopoverTrigger>
              <PopoverContent maxW="30vh" p={3}>
                <PopoverArrow />
                <Text
                  color={theme.colors.black[1000]}
                  fontSize="10px"
                  wordBreak="break-word"
                  wordWrap="break-word"
                  ml={1}
                  maxW="20vh">
                  {props.info}
                </Text>
              </PopoverContent>
            </Popover>
          </Flex>
          {props.handleRedirect && (
            <IconButton
              variant="outline"
              height="20px"
              borderColor="transparent"
              onClick={() => props.handleRedirect()}
              icon={<Launch />}></IconButton>
          )}
        </Flex>
        <Box mx={-4} my={2}>
          {props.children}
        </Box>
      </Flex>
    </Card>
  );
};

export default AnalyticsTableIndi;
