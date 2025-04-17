import { Flex, Text } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/system';
const EmptyBlockPrmopt = ({ Icon, headline, description, ...style }) => {
  const theme = useTheme();
  return (
    <Flex direction={'column'} gap={'10px'} alignItems={'center'} {...style}>
      <Icon style={{ color: '#aaa', fontSize: '30px' }} />
      <Text fontSize="14px" color={theme.colors.tertiary.color} fontWeight={'bold'}>
        {headline}
      </Text>
      <Text
        fontSize="13px"
        color={theme.colors.secondary.colorGray}
        maxW="400px"
        textAlign={'center'}>
        {description}
      </Text>
    </Flex>
  );

  // prop validation
};

export default EmptyBlockPrmopt;
