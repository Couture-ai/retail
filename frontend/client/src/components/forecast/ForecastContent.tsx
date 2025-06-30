import ForecastMasterTable from "./ForecastMasterTable";

interface ForecastContentProps {
  forecastType?: string;
}

const ForecastContent = ({ forecastType }: ForecastContentProps) => {
  // Debug logging
  console.log('[ForecastContent] Received forecastType:', forecastType);
  
  // If no forecast type is provided, show empty state
  if (!forecastType) {
    return (
      <div className="h-full flex items-center justify-center bg-[hsl(var(--dark-8))]">
        <div className="text-center">
          <div className="text-[hsl(var(--dark-3))] text-lg mb-2">
            Select a forecast view from the sidebar
          </div>
          <div className="text-[hsl(var(--dark-4))] text-sm">
            Choose from available forecast data views and analytics
          </div>
        </div>
      </div>
    );
  }

  // Render different components based on forecast type
  const renderForecastContent = () => {
    switch (forecastType) {
      case 'master-table':
        return <ForecastMasterTable />;
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-[hsl(var(--dark-3))]">
              Unknown forecast view: {forecastType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-[hsl(var(--dark-8))]">
      {renderForecastContent()}
    </div>
  );
};

export default ForecastContent; 