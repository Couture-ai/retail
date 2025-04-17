import { Box, Divider, Flex, HStack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import Container from '../../Components/Container/Container';
import XFilters from './RawFilters';
import addDays from 'date-fns/addDays';

const Analytics = (props) => {
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  // const filterConfig = {
  //   fields: [
  //     {
  //       groupName: 'Date'
  //     }
  //   ]
  // };
  const tabs = [
    'Overview',
    'Searches',
    'Zero Search Results',
    'Zero Click Results',
    'Faceted Search Results',
    'Filters'
  ];
  const [tab, setTab] = useState(tabs[0]);
  return (
    <Container isCollapsed={props.isCollapsed}>
      <Box w="100%" gap={'20px'} pl="20px">
        <Flex flexDir={'column'} w="98%" mt={4} mb="20px">
          <Text variant={'body1'} style={{ fontSize: '24px' }}>
            Analytics
          </Text>
          <Divider />
        </Flex>
        <Flex w="100%" h="100%" alignItems={'flex-start'} gap="40px">
          <Flex w="300px">
            <XFilters range={range} setRange={setRange} />
          </Flex>
          <Flex direction={'column'} gap="5px">
            <HStack spacing={'40px'}>
              {tabs.map((item) => (
                <Text
                  key={item}
                  onClick={() => setTab(item)}
                  style={{
                    color: tab === item ? '#444746' : '#888888',
                    fontSize: '16px',
                    fontWeight: tab === item ? '600' : '400',
                    cursor: 'pointer'
                  }}>
                  {item}
                </Text>
              ))}
            </HStack>
            <Divider />
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Analytics;
