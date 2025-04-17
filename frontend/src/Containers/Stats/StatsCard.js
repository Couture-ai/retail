import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
  useTheme
} from '@chakra-ui/react';
import { InfoOutlined, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useState } from 'react';
import Card from '../../Components/Card/Card';
// import LineGraphChart from '../../Components/Charts/LineGraphChart';

const StatsCard = ({
  title,
  info,
  valueInNum,
  valueInPer,
  graphDir,
  bg,
  textColor,
  // graphData,
  // color,
  // graphWidth = 200,
  // graphHeight = 70,
  margin = 3
}) => {
  const isValueInPerPositive = valueInPer.includes('+') || !valueInPer.includes('-');
  const [isHover, setIsHover] = useState(false);

  const handleInfo = () => {
    setIsHover(true);
  };

  const handleInfoLeave = () => {
    setIsHover(false);
  };

  const theme = useTheme();

  return graphDir === 'right' ? (
    <Flex justifyContent="end" pos="relative" w="full">
      <Card maxH={'12vh'}>
        <Flex flexDir={'column'}>
          <Flex flexDir={'row'}>
            <Text variant="body1">{title}</Text>
            <Popover placement="right" trigger="hover">
              <PopoverTrigger>
                <InfoOutlined
                  style={{
                    color: isHover ? 'black.400' : 'Alpha',
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
                <Text variant="subtitle1">{valueInNum}</Text>
                <Text variant="body3" color={isValueInPerPositive ? 'Gamma' : 'Delta'}>
                  {valueInPer}
                </Text>
              </Flex>
            </Flex>
            <Flex justifyContent={'center'}>
              {/* <LineGraphChart data={graphData} color={color} width={100} height={30} /> */}
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  ) : (
    <Flex justifyContent="end" pos="relative" w="full" maxH={'25vh'}>
      <Card bg={bg || null} color={textColor || null}>
        <Flex flexDir={'column'}>
          <Flex flexDir={'row'} alignItems={'center'}>
            <Text variant="body1" mr="2">
              {title}
            </Text>
            <Popover placement="right" trigger="hover">
              <PopoverTrigger>
                <InfoOutlined
                  style={{
                    color: '#cccccc',
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
          <Flex flexDir={'row'} w="100%" justifyContent={'space-between'} mt={margin + 2}>
            <Flex flexDir={'column'}>
              <Flex direction="column">
                <Text fontSize="40px" fontWeight="">
                  {valueInNum}
                </Text>
                <Flex alignItems={'center'}>
                  <Text
                    variant="body3"
                    fontSize="20px"
                    justifyContent={'center'}
                    fontWeight={'bold'}
                    color={isValueInPerPositive ? 'Gamma' : 'Delta'}>
                    {valueInPer}%
                  </Text>
                  {isValueInPerPositive ? (
                    <KeyboardDoubleArrowUp style={{ color: 'green', fontSize: '20px' }} />
                  ) : (
                    <KeyboardDoubleArrowDown style={{ color: 'red', fontSize: '20px' }} />
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {/* <Flex justifyContent={'center'} my={margin}>
            <LineGraphChart
              data={graphData}
              color={color}
              width={graphWidth}
              height={graphHeight}
            />
          </Flex> */}
        </Flex>
      </Card>
    </Flex>
  );
};

export default StatsCard;
