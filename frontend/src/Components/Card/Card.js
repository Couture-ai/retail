import { Box, useTheme } from '@chakra-ui/react';

const Card = (props) => {
  const theme = useTheme();
  // const boxShadow = props.boxShadow ?? `${theme.colors.gray.bg} 0px 0px 20px 10px`;
  return (
    <Box
      bg={theme.colors.white}
      borderRadius="20px"
      w="full"
      p="4"
      border="1px solid #eee"
      {...props}
      // boxShadow={`${theme.colors.gray.hover} 0px 0px 40px 0px`}
    >
      {props.children}
    </Box>
  );
};

export default Card;
