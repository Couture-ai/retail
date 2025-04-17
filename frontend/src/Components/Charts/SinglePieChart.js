import React from 'react';
import { Pie } from 'recharts/lib/polar/Pie';
import { PieChart } from 'recharts/lib/chart/PieChart';
import { Cell } from 'recharts/lib/component/Cell';
import { Tooltip } from 'recharts/lib/component/Tooltip';

const SinglePieChart = (props) => {
  return (
    <PieChart width={props.width} height={props.height}>
      <Pie
        activeIndex={props.activeIndex}
        activeShape={props.renderActiveShape}
        isAnimationActive={true}
        label={props.isLabel}
        data={props.data}
        cx="50%"
        cy="50%"
        innerRadius={props.innerRadius}
        outerRadius={props.outerRadius}
        fill="color"
        dataKey={props.dataKey ? props.dataKey : 'value'}
        onMouseEnter={props.onPieEnter}>
        {props.data &&
          props.data.map((item) => {
            return <Cell key={item.name} fill={item.color} />;
          })}
      </Pie>
      {props.isTooltip ? <Tooltip /> : null}
      {props.children}
    </PieChart>
  );
};

export default SinglePieChart;
