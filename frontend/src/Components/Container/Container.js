// import { Box } from '@chakra-ui/react';

// const Container = (props) => {
//   return (
//     <Box
//       position="relative"
//       right={!props.isCollapsed ? '0px' : '55%'}
//       width={!props.isCollapsed ? '98%' : '192vh'}
//       {...props}
//       css={`
//         @media (max-width: 2000px) {
//           right: ${!props.isCollapsed ? '0%' : '20%'};
//           width: ${!props.isCollapsed ? '98%' : '120%'};
//         }
//         @media (max-width: 1280px) {
//           right: ${!props.isCollapsed ? '-3%' : '20%'};
//           width: ${!props.isCollapsed ? '97%' : '120%'};
//         }
//         @media (max-width: 912px) {
//           right: ${!props.isCollapsed ? '0%' : '10%'};
//           width: ${!props.isCollapsed ? '98%' : '110%'};
//         }
//         @media (max-width: 480px) {
//           right: ${!props.isCollapsed ? '0%' : '5%'};
//           width: ${!props.isCollapsed ? '98%' : '100%'};
//         }
//       `}>
//       {props.children}
//     </Box>
//   );
// };

// export default Container;

import { Box } from '@chakra-ui/react';

// const Container = (props) => {
//   return (
//     <Box
//       position="relative"
//       right={!props.isCollapsed ? '10px' : '300px'}
//       width={!props.isCollapsed ? '100%' : '200vh'}
//       {...props}>
//       {props.children}
//     </Box>
//   );
// };

// export default Container;

const Container = (props) => {
  return (
    <Box position="relative" padding="10px 50px 0px 20px" {...props}>
      {props.children}
    </Box>
  );
};

export default Container;
