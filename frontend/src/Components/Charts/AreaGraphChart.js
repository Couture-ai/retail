import { Checkbox, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
// import { Legend } from 'recharts';
import LineGraphChart from './LineGraphChart';
// import { Text, Flex } from '@chakra-ui/react';

const legendData = [
  {
    id: 0,
    name: 'Total Users',
    color: '#1AADEC'
  },
  {
    id: 1,
    name: 'Total Searches',
    color: '#CAA00B'
  },
  {
    id: 2,
    name: 'No Results Rate',
    color: '#DE7777'
  },
  {
    id: 3,
    name: 'Click Through Rate',
    color: '#1A54EC'
  },
  {
    id: 4,
    name: 'Conversion Rate',
    color: '#D76291'
  },
  {
    id: 5,
    name: 'No Clicks Rate',
    color: '#E83D18'
  }
];

const legendComparisonData = [
  {
    id: 0,
    name: 'Total Users',
    color: '#1AADEC',
    strokeDashArray: false
  },
  {
    id: 1,
    name: 'Total Users B',
    color: '#1AADEC',
    strokeDashArray: true
  },
  {
    id: 2,
    name: 'Total Searches',
    color: '#CAA00B',
    strokeDashArray: false
  },
  {
    id: 3,
    name: 'Total Searches B',
    color: '#CAA00B',
    strokeDashArray: true
  },
  {
    id: 4,
    name: 'No Results Rate',
    color: '#DE7777',
    strokeDashArray: false
  },
  {
    id: 5,
    name: 'No Results Rate B',
    color: '#DE7777',
    strokeDashArray: true
  },
  {
    id: 6,
    name: 'Click Through Rate',
    color: '#1A54EC',
    strokeDashArray: false
  },
  {
    id: 7,
    name: 'Click Through Rate B',
    color: '#1A54EC',
    strokeDashArray: true
  },
  {
    id: 8,
    name: 'Conversion Rate',
    color: '#D76291',
    strokeDashArray: false
  },
  {
    id: 9,
    name: 'Conversion Rate B',
    color: '#D76291',
    strokeDashArray: true
  },
  {
    id: 10,
    name: 'No Clicks Rate',
    color: '#E83D18',
    strokeDashArray: false
  },
  {
    id: 11,
    name: 'No Clicks Rate B',
    color: '#E83D18',
    strokeDashArray: true
  }
];

const AreaGraphChart = (props) => {
  const [checkedItems, setCheckedItems] = useState([true, true, true, true, true, true, true]);
  const [checkedComparisonItems, setCheckedComparisonItems] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
  ]);
  // const [lineData, setLineData] = useState(props.data);

  const handleChange = (event, index) => {
    setCheckedItems((prevNumbers) => {
      // Create a new array with the updated element
      const updatedNumbers = [...prevNumbers];
      updatedNumbers[index] = event.target.checked;
      // Return the updated numbers array
      return updatedNumbers;
    });
    // let updatedData = [];
    // checkedItems.map((item, i) => {
    //   console.log(item);
    //   console.log(i);
    //   console.log(updatedData);
    //   if (item) {
    //     updatedData.push(props.data[i]);
    //   }
    // });
    // setLineData(updatedData);
  };

  const handleChangeComparison = (event, index) => {
    setCheckedComparisonItems((prevNumbers) => {
      // Create a new array with the updated element
      const updatedNumbers = [...prevNumbers];
      updatedNumbers[index] = event.target.checked;
      // Return the updated numbers array
      return updatedNumbers;
    });
  };

  return (
    <Flex flexDir="row">
      <LineGraphChart
        width={props.width ? props.width : 900}
        height={props.height ? props.height : 500}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
        data={props.data}
        label={props.comparison ? legendComparisonData : legendData}
        checkedItems={props.comparison ? checkedComparisonItems : checkedItems}
        isXAxis={true}
        isYAxis={true}
        isTooltip={true}
        type={'linear'}></LineGraphChart>
      <Flex flexDir={'column'} justify={'end'}>
        {props.isLegend === null || props.isLegend === false
          ? null
          : props.comparison
          ? legendComparisonData &&
            legendComparisonData.map((item) => {
              return (
                <Flex flexDir={'row'} key={item.id}>
                  <Checkbox
                    iconColor={item.color}
                    isChecked={checkedComparisonItems[item.id]}
                    onChange={(e) => {
                      handleChangeComparison(e, item.id);
                    }}
                    value={item.name}>
                    <Text color={item.color}>{item.name}</Text>
                  </Checkbox>
                </Flex>
              );
            })
          : legendData &&
            legendData.map((item) => {
              return (
                <Flex flexDir={'row'} key={item.id}>
                  <Checkbox
                    iconColor={item.color}
                    isChecked={checkedItems[item.id]}
                    onChange={(e) => {
                      handleChange(e, item.id);
                    }}
                    value={item.name}>
                    <Text color={item.color}>{item.name}</Text>
                  </Checkbox>
                </Flex>
              );
            })}
      </Flex>
    </Flex>
  );
};

export default AreaGraphChart;
