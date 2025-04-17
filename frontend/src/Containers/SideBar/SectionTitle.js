// import { Divider, Flex, Text } from '@chakra-ui/react';
// import React from 'react';

// const SectionTitle = (props) => {
//   return (
//     <Flex w={'100%'} h={'10px'} alignItems={'center'} gap={'10px'}>
//       <Divider borderColor={'gray.600'} alignItems={'center'} w={'10%'} />
//       <Text fontSize="xs" fontWeight="400" color={'gray.600'} whiteSpace={'nowrap'}>
//         {props.title}
//       </Text>
//       <Divider borderColor={'gray.600'} />
//     </Flex>
//   );
// };

// export default SectionTitle;

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

const SectionTitle = (props) => {
  return (
    <Flex w={'100%'} h={'10px'} alignItems={'flex-start'} gap={'10px'} direction={'column'}>
      {/* <Divider borderColor={'gray.600'} alignItems={'center'} w={'10%'} /> */}
      <Text fontSize="xs" fontWeight="400" color={'gray.600'} whiteSpace={'nowrap'} ml={3}>
        {props.title}
      </Text>
      {/* <Divider borderColor={'gray.400'} /> */}
    </Flex>
  );
};

export default SectionTitle;
