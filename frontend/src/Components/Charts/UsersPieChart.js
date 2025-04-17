import React, { useState } from 'react';
import { Sector } from 'recharts';
// import { Box } from '@chakra-ui/react';
import SinglePieChart from './SinglePieChart';

const renderActiveShape = (props) => {
  const { cx, cy, startAngle, endAngle, fill, innerRadius, outerRadius, payload } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius}
        outerRadius={outerRadius}
        fill={fill}
      />
    </g>
  );
};

const UsersPieChart = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <SinglePieChart
      data={props.usersData}
      innerRadius={70}
      outerRadius={80}
      startAngle={90}
      endAngle={450}
      width={200}
      height={200}
      file={'user'}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      onPieEnter={onPieEnter}
      renderActiveShape={renderActiveShape}
      isTooltip={true}
      isLabel={false}
    />
  );
};

export default UsersPieChart;
