import React, { useState } from 'react';
import { Sector, Legend } from 'recharts';
import SinglePieChart from './SinglePieChart';

const legendData = [
  {
    name: 'Tryouts',
    color: '#1AADEC'
  },
  {
    name: 'Impressions',
    color: '#1A54EC'
  }
];

const lipstickLegendData = [
  {
    name: 'Tryouts',
    color: '#2E69AE'
  },
  {
    name: 'Impressions',
    color: '#d76291'
  }
];

const eyelinerLegendData = [
  {
    name: 'Tryouts',
    color: '#099E95'
  },
  {
    name: 'Impressions',
    color: '#1a54ec'
  }
];

const mascaraLegendData = [
  {
    name: 'Tryouts',
    color: '#bb5a72'
  },
  {
    name: 'Impressions',
    color: '#CAA00B'
  }
];

const foundationLegendData = [
  {
    name: 'Tryouts',
    color: '#c98621'
  },
  {
    name: 'Impressions',
    color: '#1AADEC'
  }
];

const blushLegendData = [
  {
    name: 'Tryouts',
    color: '#9c3eae'
  },
  {
    name: 'Impressions',
    color: '#2CE53F'
  }
];

const concealerLegendData = [
  {
    name: 'Tryouts',
    color: '#CA5D0D'
  },
  {
    name: 'Impressions',
    color: '#DE7777'
  }
];

const eyeshadowLegendData = [
  {
    name: 'Tryouts',
    color: '#c2354f'
  },
  {
    name: 'Impressions',
    color: '#E83D18'
  }
];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <text x={cx} y={cy} textAnchor="middle" fill={fill}>
        73 %
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill={fill}>
        Conversion
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
    </g>
  );
};

const ImpressionsPieChart = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <SinglePieChart
      data={props.data}
      isLabel={true}
      innerRadius={60}
      outerRadius={80}
      height={props.height ? props.height : 250}
      width={props.width ? props.width : 300}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      onPieEnter={onPieEnter}
      renderActiveShape={renderActiveShape}>
      <Legend
        wrapperStyle={{ bottom: 50 }}
        layout="vertical"
        align="right"
        payload={
          props.category === 'total'
            ? legendData &&
              legendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'lipstick'
            ? lipstickLegendData &&
              lipstickLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'eyeliner'
            ? eyelinerLegendData &&
              eyelinerLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'mascara'
            ? mascaraLegendData &&
              mascaraLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'foundation'
            ? foundationLegendData &&
              foundationLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'blush'
            ? blushLegendData &&
              blushLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'concealer'
            ? concealerLegendData &&
              concealerLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : props.category === 'eyeshadow'
            ? eyeshadowLegendData &&
              eyeshadowLegendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
            : legendData &&
              legendData.map((item) => ({
                id: item.name,
                value: `${item.name}`,
                color: item.color
              }))
        }
      />
    </SinglePieChart>
  );
};

export default ImpressionsPieChart;
