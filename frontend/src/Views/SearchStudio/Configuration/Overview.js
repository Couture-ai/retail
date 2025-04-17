/* eslint-disable no-unused-vars */
import {
  Button,
  Flex,
  IconButton,
  Input,
  Spacer,
  Text,
  useTheme,
  useToast
} from '@chakra-ui/react';

import React, { useContext, useState } from 'react';
import LearnMoreButton from '../Components/LearnMore';

const ConfigOverview = () => {
  const theme = useTheme();
  return (
    <Flex w="100%" p="10px 00px 20px 0px" direction={'column'}>
      <Text fontSize="14px" color={`1px solid ${theme.colors.secondary.colorGray}`} mb="30px">
        The Configuration section empowers precise search optimization by defining product
        attributes, filters, facets, synonyms, optional words, and stop words. Tailor search
        functionality to enhance relevance, streamline results, and deliver a seamless, user-focused
        discovery experience <LearnMoreButton url={'/documentation/configuration/attributes'} />
      </Text>
      {/* <Flex alignItems={'center'} gap="5px">
        <Text fontWeight={'bold'}>{index}</Text>
        <LockOutlined
          style={{
            fontSize: '15px',
            color: '#bbb'
          }}
        />
      </Flex> */}
      {/* <Text fontSize={'13px'} color="#777">
        23,456,566 Records
      </Text> */}
    </Flex>
  );
};

export default ConfigOverview;
