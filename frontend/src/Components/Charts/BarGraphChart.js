import { Bar, BarChart, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts';

const BarGraphChart = (props) => {
  return (
    // <ResponsiveContainer width="98%" height="90%">
    <BarChart data={props.data} width={props.width} height={props.height}>
      {props.isXAxisTick ? (
        <XAxis dataKey={props.dataKeyXAxis} fontSize={10} />
      ) : (
        <XAxis tick={false} />
      )}

      <YAxis />
      {props.isTooltip ? <Tooltip /> : null}
      {props.isBarSize ? (
        <Bar
          dataKey={props.dataKey}
          barSize={props.barSize}
          fill="#8884d8"
          margin={{
            top: props.marginTop,
            right: props.marginRight,
            left: props.marginLeft,
            bottom: props.marginBottom
          }}>
          {props.data &&
            props.data.map((item) => {
              return <Cell key={item.name} fill={item.color} />;
            })}
        </Bar>
      ) : (
        <Bar
          dataKey={props.dataKey}
          fill="#8884d8"
          margin={{
            top: props.marginTop,
            right: props.marginRight,
            left: props.marginLeft,
            bottom: props.marginBottom
          }}>
          {props.data &&
            props.data.map((item) => {
              return <Cell key={item.name} fill={item.color} />;
            })}
        </Bar>
      )}
      {props.isLegend ? (
        <Legend
          wrapperStyle={{ bottom: props.wrapperStyleBottom, left: props.wrapperStyleLeft }}
          layout={props.layout}
          align={props.align}
          verticalAlign={props.verticalAlign ? props.verticalAlign : null}
          payload={
            props.data &&
            props.data.map((item) => ({
              id: item.name,
              type: 'circle',
              value: `${item.name}`,
              color: item.color
            }))
          }
        />
      ) : null}
    </BarChart>
    // </ResponsiveContainer>
  );
};

export default BarGraphChart;
