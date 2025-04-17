import { useTheme } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef } from 'react';

const formatNumber = (params, includeDateRange, includeName) => {
  const num = params.value;
  let formattedString = '';
  if (String(num).length <= 3) {
    formattedString = `${params.data.name}: ${num}`;
  }
  if (String(num).length === 4 || String(num).length === 5) {
    formattedString = String(parseFloat((num / 1000).toFixed(2))) + 'K';
  } else if (String(num).length === 6 || String(num).length === 7) {
    formattedString = String(parseFloat((num / 100000).toFixed(2))) + ' Lk';
  } else {
    formattedString = String(parseFloat((num / 10000000).toFixed(2))) + ' Cr';
  }
  includeName && (formattedString = `${params.data.name}: ` + formattedString);
  includeDateRange && (formattedString = `${params.seriesName}` + '<br />' + formattedString);
  return formattedString;
};

const CustomFunnelChart = (props) => {
  const theme = useTheme();
  const echartsRef = useRef(null);
  useEffect(() => {
    const options = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return formatNumber(params, true, true);
        }
      },
      series: [
        {
          name: Object.keys(props?.funnelData)[0],
          type: 'funnel',
          left: '10%',
          width: '80%',
          label: {
            formatter: function (params) {
              return formatNumber(params, false, false);
            },
            textStyle: {
              color: `${theme.colors.black[1000]}`
            }
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            opacity: 0.7
          },
          emphasis: {
            label: {
              position: 'outside',
              formatter: function (params) {
                return formatNumber(params, false, false);
              },
              textStyle: {
                color: `${theme.colors.black[1000]}`
              }
            }
          },
          data: props?.funnelData[Object.keys(props?.funnelData)[0]]
        }
      ]
    };
    if (props.comparison && Object.keys(props?.funnelData).length > 1) {
      options.series.push({
        name: Object.keys(props?.funnelData)[1],
        type: 'funnel',
        left: '10%',
        width: '80%',
        maxSize: '70%',
        label: {
          position: 'inside',
          formatter: function (params) {
            return formatNumber(params, false, false);
          },
          color: `${theme.colors.black[1000]}`
        },
        itemStyle: {
          opacity: 0.5,
          borderColor: `${theme.colors.white}`,
          borderWidth: 2
        },
        emphasis: {
          label: {
            position: 'inside',
            formatter: function (params) {
              return formatNumber(params, false, false);
            },
            textColor: `${theme.colors.black[1000]}`
          }
        },
        data: props?.funnelData[Object.keys(props?.funnelData)[1]],
        z: 100
      });
    }
    echartsRef.current.getEchartsInstance().setOption(options, true);
  }, [props.funnelData, props.comparison]);
  return <ReactECharts option={{}} ref={echartsRef} style={{ height: '100%', width: '100%' }} />;
};

export default CustomFunnelChart;
