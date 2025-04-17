import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import CalendarComp from '../../Components/CalendarComp/CalendarComp';
import { useState } from 'react';

const XFilters = ({ range, setRange }) => {
  const [comparing, setComparing] = useState(false);
  return (
    <Flex
      direction="column"
      w="100%"
      h="100%"
      padding="20px"
      borderRadius={'0px'}
      bg="#F8FBFD"
      border="0px solid #eeeeee">
      {/* <Text fontSize="20px" style={{ fontWeight: '600', color: '#888888' }}>
        Filters
      </Text> */}
      {/* <Divider mb="20px" /> */}
      <VStack spacing={4} align="stretch">
        <VStack spacing={'5px'} align="stretch">
          <Text
            style={{
              fontFamily: 'Jost',
              fontSize: '14px',
              fontWeight: '600',
              color: '#444746'
            }}>
            Time Period
          </Text>
          <CalendarComp range={range} setRange={setRange} isPreview={true} />
          {!comparing ? (
            <Button
              onClick={() => setComparing(true)}
              variant={'outline'}
              style={{
                color: '#888888',
                borderColor: '#cccccc',
                fontSize: '12px',
                padding: '5px',
                marginTop: '10px'
              }}>
              Compare To Another Duration
            </Button>
          ) : null}
        </VStack>
        {comparing ? (
          <VStack spacing={'5px'} align="stretch">
            <Text
              style={{
                fontFamily: 'Jost',
                fontSize: '14px',
                fontWeight: '600',
                color: '#444746'
              }}>
              Compared With
            </Text>
            <CalendarComp range={range} setRange={setRange} isPreview={true} />

            <Button
              onClick={() => setComparing(false)}
              variant={'outline'}
              style={{
                color: '#888888',
                borderColor: '#cccccc',
                fontSize: '12px',
                padding: '5px',
                marginTop: '10px'
              }}>
              Stop Comparing
            </Button>
          </VStack>
        ) : null}
      </VStack>
    </Flex>
  );
};

export default XFilters;
