import { Skeleton, useTheme } from '@chakra-ui/react';

const SkeletonLoader = ({ w, h }) => {
  const theme = useTheme();
  return (
    <Skeleton
      h={h}
      startColor={theme.colors.tertiary.background}
      endColor={theme.colors.tertiary.skeletonEnd}
      w={w}
      style={{ borderRadius: '5px' }}></Skeleton>
  );
};
export default SkeletonLoader;
