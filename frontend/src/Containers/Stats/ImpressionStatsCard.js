// import { Box, Text, useTheme } from '@chakra-ui/react';
// import Card from '../../Components/Card/Card';
// import LineGraphChart from '../../Components/Charts/LineGraphChart';

// const ImpressionStatsCard = ({ title, subtitle1, subtitle2, graphData }) => {
//   const theme = useTheme();
//   return (
//     <Card
//       bg={`${theme.colors.white}`}
//       display={'flex'}
//       flexDirection={'column'}
//       w={'full'}
//       p={'4'}
//       borderRadius={'8px'}
//       boxShadow={'1px 1px 10px 2px rgba(0, 0, 0, 0.03)'}>
//       <Text variant={'body2semiBold'} pb={'2'} fontSize={'18'}>
//         {title}
//       </Text>
//       <Box display={'flex'} gap={'2'} mt={2}>
//         <Text variant={'body2semiBold'} fontSize={'14'}>
//           {subtitle1}
//         </Text>
//         <Text variant={'body2'} fontSize={'14'}>
//           {subtitle2}
//         </Text>
//       </Box>
//       <Box width={'100%'} h={'100%'} pt={'6'}>
//         <LineGraphChart data={graphData} />
//       </Box>
//     </Card>
//   );
// };

// export default ImpressionStatsCard;
