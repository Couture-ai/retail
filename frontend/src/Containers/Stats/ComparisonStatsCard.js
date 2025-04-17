/* eslint-disable no-unused-vars */
import {
  Avatar,
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
  useTheme,
  Spacer
} from '@chakra-ui/react';
import Card from '../../Components/Card/Card';
// import LineGraphChart from '../../Components/Charts/LineGraphChart';
import { ArrowDownward, ArrowUpward, InfoOutlined, LooksOne, LooksTwo } from '@mui/icons-material';
import { useState } from 'react';

const ComparisonStatsChart = ({
  title,
  info,
  valueInNumA,
  valueInPerA,
  valueInNumB,
  graphDir,
  bg,
  textColor
  // graphData,
  // graphWidth = 200,
  // graphHeight = 70,
}) => {
  const isValueInPerPositive = valueInPerA.includes('+') || !valueInPerA.includes('-');
  const [isHover, setIsHover] = useState(false);

  const handleInfo = () => {
    setIsHover(true);
  };

  const handleInfoLeave = () => {
    setIsHover(false);
  };

  // const labelData = [
  //   {
  //     name: 'pv',
  //     color: colorA,
  //     strokeDashArray: false
  //   },
  //   {
  //     name: 'uv',
  //     color: colorB,
  //     strokeDashArray: true
  //   }
  // ];

  const theme = useTheme();

  return graphDir === 'right' ? (
    <Flex justifyContent="end" pos="relative" w="full">
      <Card>
        <Flex flexDir={'column'}>
          <Flex flexDir={'row'}>
            <Text variant="body1">{title}</Text>
            <Popover placement="right" trigger="hover">
              <PopoverTrigger>
                <InfoOutlined
                  style={{
                    color: isHover ? 'black.400' : `${theme.colors.gray.light}`,
                    width: '15px',
                    height: '15px'
                  }}
                  onMouseEnter={handleInfo}
                  onMouseLeave={handleInfoLeave}
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
                  {info}
                </Text>
              </PopoverContent>
            </Popover>
          </Flex>
          <Flex flexDir={'row'} w="100%" justifyContent={'space-between'} mt={1}>
            <Flex flexDir={'column'}>
              <Flex>
                <Text>{valueInNumA}</Text>
                <Text variant="body3" color={isValueInPerPositive ? 'Gamma' : 'Delta'}>
                  {valueInPerA}
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent={'center'}>
              {/* <LineGraphChart data={graphData} color={colorA} width={100} height={30} /> */}
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  ) : (
    // <Flex justifyContent="end" pos="relative" w="full">
    <Flex pos="relative" w="full" maxH={'25vh'}>
      <Card direction="column" style={{ height: '13vh', width: '20vw' }}>
        {/* <Flex flexDir={'column'}> */}
        <Flex flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Text
            variant="body1"
            style={{
              fontWeight: 'semibold',
              fontSize: '18px'
            }}>
            {title}
          </Text>
          <Popover placement="right" trigger="hover">
            <PopoverTrigger>
              <InfoOutlined
                style={{
                  color: isHover ? 'black.400' : `${theme.colors.gray.light}`,
                  width: '15px',
                  height: '15px'
                }}
                onMouseEnter={handleInfo}
                onMouseLeave={handleInfoLeave}
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
                {info}
              </Text>
            </PopoverContent>
          </Popover>
        </Flex>
        <Box w="50px" h="3px" borderRadius={'2px'} backgroundColor={theme.colors.blue.main} />
        <Spacer />
        <Flex flexDir={'row'} w="100%" justifyContent={'space-between'} mt={4}>
          {/* <Flex flexDir={'row'}> */}
          <Box mt={2}>
            <Avatar
              name="A"
              h={'20px'}
              w={'20px'}
              mr={2}
              display="flex"
              bgColor={`${theme.colors.primary.light}`}
            />
          </Box>
          <Flex>
            <Text variant="subtitle1">{valueInNumA}</Text>
            <Flex>
              <Text
                verticalAlign="center"
                variant="body3"
                color={
                  isValueInPerPositive ? `${theme.colors.green.main}` : `${theme.colors.red.main}`
                }>
                {valueInPerA}%
              </Text>
              {isValueInPerPositive ? (
                <ArrowUpward
                  style={{
                    color: `${theme.colors.green.main}`,
                    fontSize: '11px',
                    marginTop: '4px'
                  }}
                />
              ) : (
                <ArrowDownward
                  style={{
                    color: `${theme.colors.red.main}`,
                    fontSize: '11px',
                    marginTop: '4px'
                  }}
                />
              )}
            </Flex>
          </Flex>
          <Flex flexDir={'row'} mx={3}>
            <Box mt={2}>
              <Avatar
                name="B"
                h={'20px'}
                w={'20px'}
                mr={2}
                display="flex"
                bgColor={`${theme.colors.red.pastel}`}
              />
            </Box>
            <Flex flexDir={'column'}>
              <Flex>
                <Text variant="subtitle1">{valueInNumB}</Text>
              </Flex>
            </Flex>
          </Flex>
          {/* </Flex> */}
        </Flex>
        {/* <Flex justifyContent={'center'} my={margin}>
          <LineGraphChart
              data={graphData}
              label={labelData}
              width={graphWidth}
              height={graphHeight}
              isTooltip={true}
            />
        </Flex> */}
        {/* </Flex> */}
      </Card>
    </Flex>
  );
};

export default ComparisonStatsChart;
