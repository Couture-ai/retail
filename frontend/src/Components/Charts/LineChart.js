// import ReactECharts from 'echarts-for-react';
// import { useEffect, useRef } from 'react';

// const LineChart = (props) => {
//   const echartsRef = useRef(null);
//   const seriesSkeleton = {
//     name: '',
//     type: 'line',
//     data: []
//   };
//   useEffect(() => {
//     const options = {
//       tooltip: {
//         trigger: 'axis'
//       },
//       legend: {
//         data: props.data && Object.keys(props?.data)
//       },
//       grid: {
//         left: '0%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//       },
//       // toolbox: {
//       //   feature: {
//       //     saveAsImage: {}
//       //   }
//       // },
//       xAxis: {
//         type: 'category',
//         boundaryGap: false,
//         data: props.xAxisLabels
//       },
//       yAxis: {
//         type: 'value'
//       },
//       series:
//         props.data &&
//         Object.keys(props?.data)?.map((item) => {
//           const series = { ...seriesSkeleton };
//           series.name = item;
//           series.data = props.data[item];
//           return series;
//         })
//     };
//     echartsRef.current.getEchartsInstance().setOption(options, true);
//   }, [props.data]);
//   return <ReactECharts ref={echartsRef} option={{}} style={{ height: '100%', width: '100%' }} />;
// };

// export default LineChart;
