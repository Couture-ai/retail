import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { agentService } from '@/services/agentService';
import { AlertCircle, BarChart3, Table, PieChart, TrendingUp, FileText, BarChart } from 'lucide-react';

interface ToolCall {
  type: 'show_chart';
  chart_type: 'bar' | 'table' | 'pie' | 'line' | 'text' | 'stacked_bar';
  sql_query: string;
  title?: string;
  description?: string;
  chart_config?: any;
}

interface ChartRendererProps {
  toolCall: ToolCall;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ toolCall }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const executeQuery = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await agentService.executeQuery(toolCall.sql_query);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to execute query');
      } finally {
        setLoading(false);
      }
    };

    executeQuery();
  }, [toolCall.sql_query]);

  if (loading) {
    return (
      <div className="bg-[hsl(var(--panel-accent))] rounded-lg p-4 my-2 border border-[hsl(var(--panel-border))]">
        <div className="flex items-center space-x-2 text-[hsl(var(--panel-muted-foreground))]">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span className="text-sm">Executing query...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-2">
        <div className="flex items-center space-x-2">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      </div>
    );
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart3 size={16} />;
      case 'stacked_bar': return <BarChart size={16} />;
      case 'line': return <TrendingUp size={16} />;
      case 'pie': return <PieChart size={16} />;
      case 'table': return <Table size={16} />;
      case 'text': return <FileText size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };

  // Transform data for charts
  const transformDataForBar = (rawData: any[]) => {
    if (rawData.length === 0) return [];
    
    const keys = Object.keys(rawData[0]);
    const categoryKey = keys[0]; // First column as category
    const valueKeys = keys.slice(1).filter(key => 
      rawData.some(item => typeof item[key] === 'number')
    );

    return rawData.slice(0, 10).map(item => ({
      id: String(item[categoryKey] || 'Unknown'),
      ...valueKeys.reduce((acc, key) => ({
        ...acc,
        [key]: Number(item[key]) || 0
      }), {})
    }));
  };

  // Transform data for stacked bar charts
  const transformDataForStackedBar = (rawData: any[], xAxisField?: string) => {
    if (rawData.length === 0) return [];
    
    const keys = Object.keys(rawData[0]);
    
    // Determine the grouping fields
    let groupByField = xAxisField || keys[0]; // Use chart_config.xaxis or first field
    let stackByField = keys.find(key => key !== groupByField && typeof rawData[0][key] === 'string') || keys[1];
    let valueField = keys.find(key => typeof rawData[0][key] === 'number') || keys[2];
    
    // Create a map to group and aggregate data
    const groupedData = new Map();
    
    rawData.forEach(item => {
      const groupKey = String(item[groupByField] || 'Unknown');
      const stackKey = String(item[stackByField] || 'Other');
      const value = Number(item[valueField]) || 0;
      
      if (!groupedData.has(groupKey)) {
        groupedData.set(groupKey, { id: groupKey });
      }
      
      const group = groupedData.get(groupKey);
      group[stackKey] = (group[stackKey] || 0) + value;
    });
    
    return Array.from(groupedData.values()).slice(0, 10);
  };

  const transformDataForPie = (rawData: any[]) => {
    if (rawData.length === 0) return [];
    
    const keys = Object.keys(rawData[0]);
    const labelKey = keys[0];
    const valueKey = keys.find(key => 
      rawData.some(item => typeof item[key] === 'number')
    ) || keys[1];

    return rawData.slice(0, 8).map((item, index) => ({
      id: String(item[labelKey] || `Item ${index + 1}`),
      label: String(item[labelKey] || `Item ${index + 1}`),
      value: Number(item[valueKey]) || 0
    }));
  };

  const transformDataForLine = (rawData: any[]) => {
    if (rawData.length === 0) return [];
    
    const keys = Object.keys(rawData[0]);
    const xKey = keys[0]; // First column as X axis
    const yKeys = keys.slice(1).filter(key => 
      rawData.some(item => typeof item[key] === 'number')
    );

    return yKeys.map(yKey => ({
      id: yKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      data: rawData.slice(0, 20).map(item => ({
        x: String(item[xKey]),
        y: Number(item[yKey]) || 0
      }))
    }));
  };



  // Chart theme based on CSS variables
  const chartTheme = {
    background: 'transparent',
    text: {
      fontSize: 11,
      fill: 'hsl(var(--panel-accent-foreground))',
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
    axis: {
      domain: {
        line: {
          stroke: 'hsl(var(--panel-border))',
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fill: 'hsl(var(--panel-accent-foreground))',
        },
      },
      ticks: {
        line: {
          stroke: 'hsl(var(--panel-border))',
          strokeWidth: 1,
        },
        text: {
          fontSize: 10,
          fill: 'hsl(var(--panel-muted-foreground))',
        },
      },
    },
    grid: {
      line: {
        stroke: 'hsl(var(--panel-border-subtle))',
        strokeWidth: 1,
      },
    },
    legends: {
      text: {
        fontSize: 11,
        fill: 'hsl(var(--panel-accent-foreground))',
      },
    },
    tooltip: {
      container: {
        background: 'hsl(var(--panel-background))',
        color: 'hsl(var(--panel-foreground))',
        fontSize: 12,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid hsl(var(--panel-border))',
      },
    },
  };

  const colorScheme = [
    'hsl(var(--primary))',
    'hsl(var(--dashboard-primary-orange))',
    'hsl(var(--dashboard-primary-green))',
    'hsl(var(--dashboard-primary-purple))',
    'hsl(var(--dashboard-warning))',
    'hsl(var(--dashboard-error))',
    'hsl(var(--dashboard-success))',
  ];

  const renderChart = () => {
    switch (toolCall.chart_type) {
      case 'bar':
        const barData = transformDataForBar(data);
        if (barData.length === 0) return <div className="text-center text-[hsl(var(--panel-muted-foreground))] py-8">No data to display</div>;
        
        const barKeys = Object.keys(barData[0]).filter(key => key !== 'id');
        
        return (
          <div className="h-64">
            <ResponsiveBar
              data={barData}
              keys={barKeys}
              indexBy="id"
              margin={{ top: 20, right: 80, bottom: 60, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={colorScheme}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legendPosition: 'middle',
                legendOffset: 50
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: -60
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
              role="application"
              ariaLabel="Bar chart"
              barAriaLabel={e => `${e.id}: ${e.formattedValue}`}
              theme={chartTheme}
            />
          </div>
        );

      case 'pie':
        const pieData = transformDataForPie(data);
        if (pieData.length === 0) return <div className="text-center text-[hsl(var(--panel-muted-foreground))] py-8">No data to display</div>;
        
        return (
          <div className="h-64">
            <ResponsivePie
              data={pieData}
              margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
              }}
              colors={colorScheme}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="hsl(var(--panel-accent-foreground))"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
              }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: 'hsl(var(--panel-accent-foreground))',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: 'hsl(var(--panel-foreground))'
                      }
                    }
                  ]
                }
              ]}
              theme={chartTheme}
            />
          </div>
        );

      case 'line':
        const lineData = transformDataForLine(data);
        if (lineData.length === 0) return <div className="text-center text-[hsl(var(--panel-muted-foreground))] py-8">No data to display</div>;
        
        const isAreaChart = toolCall.chart_config?.area === true;
        
        return (
          <div className="h-64">
            <ResponsiveLine
              data={lineData}
              margin={{ top: 20, right: 110, bottom: 60, left: 80 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              yFormat=" >-.2f"
              colors={colorScheme}
              pointSize={isAreaChart ? 4 : 8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableArea={isAreaChart}
              areaOpacity={isAreaChart ? 0.3 : 0}
              areaBaselineValue={isAreaChart ? 0 : undefined}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
              theme={chartTheme}
            />
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--panel-border))]">
                  {data.length > 0 && Object.keys(data[0]).map((key) => (
                    <th key={key} className="text-left py-2 px-3 text-[hsl(var(--panel-accent-foreground))] font-medium">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b border-[hsl(var(--panel-border-subtle))]">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="py-2 px-3 text-[hsl(var(--panel-accent-foreground))]">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 10 && (
              <p className="text-[hsl(var(--panel-muted-foreground))] text-xs mt-2">
                Showing first 10 of {data.length} results
              </p>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="bg-[hsl(var(--panel-input-background))] rounded-lg p-3 border border-[hsl(var(--panel-border-subtle))]">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-1">
                    <span className="font-medium text-[hsl(var(--panel-accent-foreground))]">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                    </span>
                    <span className="text-[hsl(var(--panel-muted-foreground))]">
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {data.length > 5 && (
              <p className="text-[hsl(var(--panel-muted-foreground))] text-xs">
                Showing first 5 of {data.length} results
              </p>
            )}
          </div>
        );

      case 'stacked_bar':
        const stackedBarData = transformDataForStackedBar(data, toolCall.chart_config?.xaxis);
        if (stackedBarData.length === 0) return <div className="text-center text-[hsl(var(--panel-muted-foreground))] py-8">No data to display</div>;
        
        const stackedBarKeys = Object.keys(stackedBarData[0]).filter(key => key !== 'id');
        
        return (
          <div className="h-64">
            <ResponsiveBar
              data={stackedBarData}
              keys={stackedBarKeys}
              indexBy="id"
              margin={{ top: 20, right: 80, bottom: 60, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={colorScheme}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legendPosition: 'middle',
                legendOffset: 50
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: -60
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
              role="application"
              ariaLabel="Stacked bar chart"
              barAriaLabel={e => `${e.id}: ${e.formattedValue}`}
              theme={chartTheme}
            />
          </div>
        );



      default:
        return (
          <div className="h-64 bg-[hsl(var(--panel-input-background))] rounded-lg flex items-center justify-center">
            <div className="text-center text-[hsl(var(--panel-muted-foreground))]">
              <div className="mb-2">{getChartIcon(toolCall.chart_type)}</div>
              <p className="text-sm">Unsupported chart type: {toolCall.chart_type}</p>
              <p className="text-xs">Data loaded: {data.length} rows</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[hsl(var(--panel-accent))] rounded-lg p-4 my-2 border border-[hsl(var(--panel-border))]">
      <div className="flex items-center space-x-2 mb-3">
        <div className="text-[hsl(var(--panel-accent-foreground))]">
          {getChartIcon(toolCall.chart_type)}
        </div>
        <div>
          <h4 className="text-[hsl(var(--panel-accent-foreground))] font-medium text-sm">
            {toolCall.title || `${
              toolCall.chart_type === 'line' && toolCall.chart_config?.area 
                ? 'Area' 
                : toolCall.chart_type === 'stacked_bar' 
                  ? 'Stacked Bar' 
                  : toolCall.chart_type.charAt(0).toUpperCase() + toolCall.chart_type.slice(1)
            } Chart`}
          </h4>
          {toolCall.description && (
            <p className="text-[hsl(var(--panel-muted-foreground))] text-xs">{toolCall.description}</p>
          )}
        </div>
      </div>

      {/* Render chart */}
      {renderChart()}

      {/* Show query for debugging */}
      <details className="mt-3">
        <summary className="text-[hsl(var(--panel-muted-foreground))] text-xs cursor-pointer hover:text-[hsl(var(--panel-accent-foreground))]">
          View SQL Query
        </summary>
        <pre className="mt-2 p-2 bg-[hsl(var(--panel-input-background))] rounded text-[hsl(var(--panel-muted-foreground))] text-xs overflow-x-auto">
          {toolCall.sql_query}
        </pre>
      </details>
    </div>
  );
}; 