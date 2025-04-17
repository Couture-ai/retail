import React from 'react';
import { Sector } from 'recharts';
import SinglePieChart from './SinglePieChart';
import { useState } from 'react';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

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
        innerRadius={outerRadius - 1}
        outerRadius={outerRadius + 3}
        fill={fill}
      />
    </g>
  );
};

const TryoutPie = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <SinglePieChart
      data={props.tryoutsData}
      isLabel={true}
      innerRadius={60}
      outerRadius={80}
      width={300}
      height={250}
      file={'tryout'}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      onPieEnter={onPieEnter}
      renderActiveShape={renderActiveShape}
    />
  );
};

export default TryoutPie;
