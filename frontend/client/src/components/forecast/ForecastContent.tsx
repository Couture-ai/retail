import ForecastMasterTable from "./ForecastMasterTable";
import AdjustmentDiffView from "./AdjustmentDiffView";
import { forecastTabDataRegistry } from "./ForecastModule";

interface ForecastContentProps {
  forecastType?: string;
}

const ForecastContent = ({ forecastType }: ForecastContentProps) => {
  // Debug logging
  console.log('[ForecastContent] Received forecastType:', forecastType);
  
  // Get tab data from registry for additional props
  const tabId = forecastType ? `forecast-${forecastType}` : '';
  const registryData = forecastTabDataRegistry.get(tabId);
  const selectedWeekStartDate = registryData?.selectedWeekStartDate || '';
  
  console.log('[ForecastContent] Registry data:', { tabId, registryData, selectedWeekStartDate });
  
  // If no forecast type is provided, show empty state
  if (!forecastType) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--panel-background))]">
        <div className="text-center">
          <div className="text-[hsl(var(--panel-foreground))] text-lg mb-2">
            Select a forecast view from the sidebar
          </div>
          <div className="text-[hsl(var(--panel-muted-foreground))] text-sm">
            Choose from available forecast data views and analytics
          </div>
        </div>
      </div>
    );
  }

  // Check if this is an adjustment view (starts with "adjustment-")
  const isAdjustmentView = forecastType.startsWith('adjustment-');
  const isConsensusMode = forecastType === 'consensus-adjustment';

  // Render different components based on forecast type
  const renderForecastContent = () => {
    if (isAdjustmentView) {
      // Render adjustment diff view for specific adjustments
      return (
        <AdjustmentDiffView
          adjustmentId={forecastType}
          adjustmentTitle={registryData?.title || forecastType}
          selectedWeekStartDate={selectedWeekStartDate}
        />
      );
    }

    switch (forecastType) {
      case 'master-table':
        return <ForecastMasterTable consensusMode={false} selectedWeekStartDate={selectedWeekStartDate} />;
      case 'consensus-adjustment':
        return <ForecastMasterTable consensusMode={true} selectedWeekStartDate={selectedWeekStartDate} />;
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-[hsl(var(--panel-muted-foreground))]">
              Unknown forecast view: {forecastType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-[hsl(var(--panel-background))]">
      {renderForecastContent()}
    </div>
  );
};

export default ForecastContent; 