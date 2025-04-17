import { Avatar, Box, Button, Divider, Flex, Input, Text, useTheme } from '@chakra-ui/react';
import {
  LooksOne,
  LooksTwo,
  Pause,
  PlayArrow,
  PlayCircleOutline,
  StopCircleOutlined
} from '@mui/icons-material';
import { addDays, differenceInDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import CalendarComp from '../../Components/CalendarComp/CalendarComp';
// import Card from '../../Components/Card/Card';
import OptionBox from '../../Components/Select/OptionBox';

const useStyles = (theme) => ({
  comparisonCard: {
    width: '225px',
    border: '0px',
    backgroundColor: `${theme.colors.white}`,
    boxShadow: `${theme.colors.gray.bg} 0px 0px 20px 10px`
  },
  avatarButton: {
    display: 'flex',
    height: '20px',
    width: '20px',
    marginRight: '20px',
    backgroundColor: `${theme.colors.primary.light}`
  }
});

const ComparisonCard = (props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  // const [range, setRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: 'selection'
  //   }
  // ]);

  const [diff, setDiff] = useState(0);

  useEffect(() => {
    setDiff(differenceInDays(props.range[0].endDate, props.range[0].startDate));
    // if (!props.comparison)
    props.setRangeComp([
      {
        startDate: props.range[0].startDate,
        endDate: props.range[0].endDate,
        key: 'selection'
      }
    ]);
  }, [props.range]);

  const handleRangeCompChange = (item) => {
    if (props.rangeComp[0].startDate != item.selection.startDate) {
      const endDate = addDays(item.selection.startDate, diff);
      props.setRangeComp([
        {
          startDate: item.selection.startDate,
          endDate: endDate,
          key: 'selection'
        }
      ]);
    } else {
      const startDate = item.selection.endDate;
      const endDate = addDays(item.selection.endDate, diff);
      props.setRangeComp([
        {
          startDate: startDate,
          endDate: endDate,
          key: 'selection'
        }
      ]);
    }
  };

  const optionList = [
    {
      name: 'AND',
      value: 'and'
    },
    {
      name: 'OR',
      value: 'or'
    },
    {
      name: 'IS GREATER THAN',
      value: 'greater'
    },
    {
      name: 'IS LESSER THAN',
      value: 'lesser'
    }
  ];
  return (
    <Flex
      direction="column"
      style={{
        padding: '8px',
        paddingLeft: '8px'
      }}
      w="100%"
      borderRadius={props.isSticky ? '0px' : '5px'}
      bgColor={theme.colors.primary.lighter}>
      {props.filter ? (
        props.comparison ? (
          <Flex flexDir={'column'}>
            <Flex flexDir={'row'}>
              <Flex flexDir={'row'}>
                <Text color="red">Date Range</Text>
                <Flex flexDir={'row'}>
                  <Box mt={2}>
                    <Avatar name="A" style={styles.avatarButton} />
                  </Box>
                  <CalendarComp range={props.range} setRange={props.setRange} isPreview={true} />
                </Flex>
              </Flex>
              <Flex flexDir={'column'} mx={2}>
                <Text>Filters (Analytics Tags)</Text>
                <Flex flexDir={'row'} w="100%">
                  <Input
                    placeholder="Select Tags to Filter Metrics Below"
                    mt={2}
                    bgColor={theme.colors.white}
                  />
                  <OptionBox
                    bgColor={theme.colors.white}
                    optionList={optionList}
                    mt={2}
                    ml={2}
                    size={'md'}
                    w="25%"
                  />
                  <Box height="40px">
                    <Divider mt={2} mx={2} orientation="vertical" />
                  </Box>
                  {/* <Button mt={2} variant={'outline'} style={{ border: '0px' }}>
                    <FilterAltOffOutlined
                      style={{ color: 'black.400' }}
                      onClick={props.handleFilter}
                    />
                  </Button> */}
                  <Button
                    leftIcon={<StopCircleOutlined style={{ color: 'black.400' }} />}
                    variant={'outline'}
                    style={styles.comparisonCard}
                    onClick={props.handleComparison}>
                    Stop Comparison
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            <Flex flexDir={'column'} mt={2}>
              <Text color={theme.colors.white}>Compared To</Text>
              <Flex flexDir={'row'}>
                <Box mt={2}>
                  <Avatar name="B" style={styles.avatarButton} />
                </Box>
                <CalendarComp
                  range={props.rangeComp}
                  setRange={props.setRangeComp}
                  isPreview={true}
                />
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex flexDir={'row'}>
            <Flex flexDir={'column'}>
              <Text color={theme.colors.white}>Date Range</Text>
              <CalendarComp range={props.range} setRange={props.setRange} isPreview={true} />
            </Flex>
            <Flex flexDir={'column'} mx={2}>
              <Text color={theme.colors.white}>Filters (Analytics Tags)</Text>
              <Flex flexDir={'row'} w="100%">
                <Input
                  placeholder="Select Tags to Filter Metrics Below"
                  mt={2}
                  bgColor={theme.colors.white}
                />
                <OptionBox
                  bgColor={theme.colors.white}
                  optionList={optionList}
                  mt={2}
                  ml={2}
                  size={'md'}
                  w="25%"
                />
                <Box height="40px">
                  <Divider mt={2} mx={2} orientation="vertical" />
                </Box>
                {/* <Button mt={2} variant={'outline'} style={{ border: '0px' }}>
                  <FilterAltOffOutlined
                    style={{ color: 'black.400' }}
                    onClick={props.handleFilter}
                  />
                </Button> */}
                <Button
                  ml={2}
                  mt={2}
                  leftIcon={<PlayCircleOutline style={{ color: 'black.400' }} />}
                  variant={'outline'}
                  w="300px"
                  style={{ border: '0px' }}
                  onClick={props.handleComparison}>
                  Compare
                </Button>
              </Flex>
            </Flex>
          </Flex>
        )
      ) : props.comparison ? (
        <Flex flexDir={'row'} gap="20px">
          <Flex flexDir={'row'}>
            <CalendarComp
              Icon={LooksOne}
              range={props.range}
              setRange={props.setRange}
              isPreview={true}
            />
          </Flex>
          <Flex flexDir={'row'}>
            <Flex flexDir={'row'}>
              <CalendarComp
                Icon={LooksTwo}
                range={props.rangeComp}
                setRange={props.setRangeComp}
                handleChange={handleRangeCompChange}
                isPreview={false}
              />
            </Flex>
          </Flex>
          <Button
            leftIcon={<Pause style={{ color: '#666666' }} />}
            variant={'outline'}
            color={theme.colors.tertiary.color}
            fontWeight={'regular'}
            style={{
              borderRadius: '20px',
              boxShadow: 'none',
              border: '0px solid #dddddd',
              backgroundColor: theme.colors.primary.lightmed
            }}
            onClick={props.handleComparison}>
            Stop Comparison
          </Button>
        </Flex>
      ) : (
        <Flex flexDir={'column'}>
          <Flex flexDir={'row'}>
            <CalendarComp range={props.range} setRange={props.setRange} isPreview={true} />
            <Box height="40px">
              <Divider mx={2} orientation="vertical" />
            </Box>

            <Button
              leftIcon={<PlayArrow style={{ color: '#041E49' }} />}
              variant={'outline'}
              color="#041E49"
              fontSize={'14px'}
              fontWeight={'regular'}
              style={{
                borderRadius: '20px',
                boxShadow: 'none',
                border: '0px solid #dddddd',
                backgroundColor: theme.colors.primary.lightmed
              }}
              onClick={props.handleComparison}>
              Comparison Mode
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default ComparisonCard;
