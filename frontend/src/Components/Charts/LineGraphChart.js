// import { Line, LineChart, Tooltip, Legend, XAxis, YAxis } from 'recharts';

// const LineGraphChart = (props) => {
//   return (
//     <LineChart
//       width={props.width ? props.width : 300}
//       height={props.height ? props.height : 100}
//       data={props.data}
//       {...props}>
//       {props.label ? (
//         props.label.map((item) => {
//           if (props.checkedItems) {
//             if (props.checkedItems[item.id]) {
//               return (
//                 <Line
//                   key={item.name}
//                   type={props.type ? props.type : 'monotone'}
//                   isAnimationActive={false}
//                   dataKey={item.name}
//                   stroke={item.color}
//                   strokeDasharray={item.strokeDashArray ? '3 3' : null}
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               );
//             } else {
//               return null;
//             }
//           } else {
//             return (
//               <Line
//                 key={item.name}
//                 type={props.type ? props.type : 'monotone'}
//                 dataKey={item.name}
//                 stroke={item.color}
//                 strokeDasharray={item.strokeDashArray ? '3 3' : null}
//                 strokeWidth={2}
//                 dot={false}
//               />
//             );
//           }
//         })
//       ) : (
//         <Line
//           type={props.type ? props.type : 'monotone'}
//           dataKey={props.label ? props.label : 'pv'}
//           stroke={props.color ? props.color : 'Gamma'}
//           strokeWidth={2}
//           dot={false}
//         />
//       )}
//       {props.isXAxis ? (
//         <XAxis dataKey={props.dataKeyXAxis ? props.dataKeyXAxis : 'name'} fontSize={10} />
//       ) : null}
//       {props.isYAxis ? <YAxis /> : null}
//       {props.isLegend ? (
//         <Legend layout="horizontal" align="center" verticalAlign="top" type="circle" />
//       ) : null}
//       {props.isTooltip ? <Tooltip /> : null}
//       {props.children}
//     </LineChart>
//   );
// };

// export default LineGraphChart;
