import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

interface SalesDataPoint {
  x: string;
  y: number;
  week: number;
}

interface SalesChartProps {
  selectedRecord?: any;
  data: any[];
  selectedRows: Set<string | number>;
}

interface HolidayIndicator {
  week: number;
  type: 'spike' | 'dip';
  label: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ selectedRecord, data, selectedRows }) => {
  // Holiday indicators
  const holidayIndicators: HolidayIndicator[] = [
    { week: 11, type: 'spike', label: 'Valentine\'s Day' },
    { week: 12, type: 'spike', label: 'Presidents Day' },
    { week: 19, type: 'dip', label: 'Spring Slowdown' },
    { week: 26, type: 'spike', label: 'Memorial Day' },
    { week: 27, type: 'spike', label: 'Summer Start' },
    { week: 36, type: 'spike', label: 'Back to School' },
    { week: 37, type: 'spike', label: 'Labor Day' },
    { week: 15, type: 'dip', label: 'Mid-Year Dip' }
  ];

  // Mock sales data for 2024 weeks 1-40 + forecast for weeks 41-52
  const salesData = useMemo(() => {
    // Get the selected row to influence the sales pattern
    const selectedRecordData = selectedRecord || data.find((record, index) => {
      const rowId = record.id || `${record.store_no || ''}-${record.article_id || ''}-${index}`;
      return selectedRows.has(rowId);
    });
    
    // Create a seed based on selected row properties for consistent but different patterns
    const getSeedFromRecord = (record: any): number => {
      if (!record) return 1; // Default seed
      
      // Create a numeric seed from various record properties
      const storeNo = record.store_no ? String(record.store_no).charCodeAt(0) : 100;
      const articleId = record.article_id ? String(record.article_id).charCodeAt(0) : 200;
      const forecastQty = record.forecast_qty || 1000;
      
      return (storeNo + articleId + forecastQty) % 1000 + 1; // Ensure positive seed
    };
    
    const seed = getSeedFromRecord(selectedRecordData);
    
    // Simple seeded random function
    const seededRandom = (seed: number, iteration: number): number => {
      const x = Math.sin(seed * iteration) * 10000;
      return x - Math.floor(x);
    };
    
    const salesWeeks: SalesDataPoint[] = [];
    const forecastWeeks: SalesDataPoint[] = [];
    
    // Base sales level influenced by selected row
    const baseSalesMultiplier = selectedRecordData ? 
      (1 + ((selectedRecordData.forecast_qty || 10000) / 20000)) : 1.2; // Scale based on forecast qty
    
    // Generate sales data for weeks 1-40 (historical)
    for (let week = 1; week <= 40; week++) {
      // Generate mock sales data with some seasonal patterns and holiday effects
      let baseSales = (15000 * baseSalesMultiplier) + Math.sin((week / 52) * 2 * Math.PI) * 3000; // Seasonal pattern
      
      // Add holiday spikes and dips
      if ([11, 12, 13].includes(week)) baseSales *= 1.3; // Q1 holiday spike
      if ([19, 20].includes(week)) baseSales *= 0.8; // Spring dip
      if ([26, 27, 28].includes(week)) baseSales *= 1.4; // Summer spike
      if ([36, 37, 38].includes(week)) baseSales *= 1.5; // Back-to-school spike
      if ([15, 16].includes(week)) baseSales *= 0.7; // Mid-year dip
      
      // Add seeded randomness based on selected row
      baseSales += (seededRandom(seed, week) - 0.5) * 2000;
      
      salesWeeks.push({
        x: `W${week}`,
        y: Math.round(Math.max(baseSales, 1000)), // Ensure minimum sales
        week: week
      });
    }
    
    // Generate forecast data for weeks 41-52 (future)
    for (let week = 41; week <= 52; week++) {
      // Generate forecast data with slightly different pattern (more optimistic)
      let baseForecast = (16000 * baseSalesMultiplier) + Math.sin((week / 52) * 2 * Math.PI) * 3500; // Seasonal pattern
      
      // Add holiday forecast spikes for end of year
      if ([47, 48, 49, 50].includes(week)) baseForecast *= 1.6; // Black Friday / Holiday season
      if ([52].includes(week)) baseForecast *= 1.2; // New Year
      
      // Add seeded variance but less than historical
      baseForecast += (seededRandom(seed, week + 100) - 0.5) * 1000;
      
      forecastWeeks.push({
        x: `W${week}`,
        y: Math.round(Math.max(baseForecast, 1200)), // Ensure minimum forecast
        week: week
      });
    }
    
    return [
      {
        id: 'sales',
        color: '#3b82f6', // blue for sales
        data: salesWeeks
      },
      {
        id: 'forecast', 
        color: '#10b981', // green for forecast
        data: forecastWeeks
      }
    ];
  }, [selectedRecord, data, selectedRows]); // Now depends on selectedRows to regenerate when selection changes

  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1 relative mb-4">
        <ResponsiveLine
          data={salesData}
          margin={{ top: 20, right: 80, bottom: 60, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          curve="cardinal"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Week',
            legendOffset: 50,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Sales',
            legendOffset: -60,
            legendPosition: 'middle',
            format: value => `${(Number(value) / 1000).toFixed(0)}K`
          }}
          colors={{ datum: 'color' }}
          pointSize={6}
          pointColor="#ffffff"
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.15}
          useMesh={true}
          layers={[
            'grid',
            'markers',
            'axes',
            'areas',
            'crosshair',
            'lines',
            'points',
            'slices',
            'mesh',
            'legends'
          ]}
          markers={holidayIndicators.map(holiday => ({
            axis: 'x',
            value: `W${holiday.week}`,
            lineStyle: {
              stroke: holiday.type === 'spike' ? '#10b981' : '#f59e0b',
              strokeWidth: 2,
              strokeDasharray: '5, 5'
            },
            legend: holiday.label,
            legendOrientation: 'vertical',
            legendPosition: 'top-left',
            textStyle: {
              fill: holiday.type === 'spike' ? '#10b981' : '#f59e0b',
              fontSize: 10
            }
          }))}
          theme={{
            background: 'transparent',
            text: {
              fontSize: 11,
              fill: '#9ca3af',
              outlineWidth: 0,
              outlineColor: 'transparent'
            },
            axis: {
              domain: {
                line: {
                  stroke: '#374151',
                  strokeWidth: 1
                }
              },
              legend: {
                text: {
                  fontSize: 12,
                  fill: '#9ca3af'
                }
              },
              ticks: {
                line: {
                  stroke: '#374151',
                  strokeWidth: 1
                },
                text: {
                  fontSize: 11,
                  fill: '#9ca3af'
                }
              }
            },
            grid: {
              line: {
                stroke: '#374151',
                strokeWidth: 1,
                strokeOpacity: 0.3
              }
            },
            tooltip: {
              container: {
                background: '#1f2937',
                color: '#ffffff',
                fontSize: '12px',
                border: '1px solid #374151',
                borderRadius: '4px'
              }
            }
          }}
          tooltip={({ point }) => (
            <div className="bg-[hsl(var(--dark-6))] p-2 rounded border border-gray-600 text-white text-xs">
              <div className="font-medium">{point.data.x}</div>
              <div className={point.seriesId === 'forecast' ? 'text-green-400' : 'text-blue-400'}>
                {point.seriesId === 'forecast' ? 'Forecast: ' : 'Sales: '}{point.data.y?.toLocaleString()}
              </div>
              {holidayIndicators.find(h => h.week === point.data.week) && (
                <div className="text-amber-300 mt-1">
                  {holidayIndicators.find(h => h.week === point.data.week)?.label}
                </div>
              )}
            </div>
          )}
        />
      </div>
      
      {/* Legend positioned below the chart */}
      <div className="flex justify-center">
        <div className="bg-[hsl(var(--dark-8))] p-3 rounded border border-gray-600 flex space-x-6">
          {/* Data Series Legend */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-blue-400 text-xs">Historical Sales</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-green-400 text-xs">Forecast</span>
            </div>
          </div>
          
          {/* Holiday Indicators */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-green-400 text-xs">Holiday Spikes</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-0.5 bg-amber-500" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-amber-400 text-xs">Holiday Dips</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart; 