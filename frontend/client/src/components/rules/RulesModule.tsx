import React, { useState } from "react";
import { Settings2, Save, RotateCcw, Info, Clock, Package, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RuleConfig {
  stockDays: number;
  reorderPoint: number;
  maxStockLevel: number;
  autoReorderEnabled: boolean;
  forecastAccuracyThreshold: number;
  seasonalAdjustmentEnabled: boolean;
  promotionBufferPercent: number;
  lowStockAlertEnabled: boolean;
  excessStockAlertEnabled: boolean;
  demandVolatilityBuffer: number;
}

const RulesModule = () => {
  const [rules, setRules] = useState<RuleConfig>({
    stockDays: 3,
    reorderPoint: 10,
    maxStockLevel: 1000,
    autoReorderEnabled: true,
    forecastAccuracyThreshold: 85,
    seasonalAdjustmentEnabled: true,
    promotionBufferPercent: 20,
    lowStockAlertEnabled: true,
    excessStockAlertEnabled: false,
    demandVolatilityBuffer: 15
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleRuleChange = (key: keyof RuleConfig, value: number | boolean) => {
    setRules(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setRules({
      stockDays: 3,
      reorderPoint: 10,
      maxStockLevel: 1000,
      autoReorderEnabled: true,
      forecastAccuracyThreshold: 85,
      seasonalAdjustmentEnabled: true,
      promotionBufferPercent: 20,
      lowStockAlertEnabled: true,
      excessStockAlertEnabled: false,
      demandVolatilityBuffer: 15
    });
    setHasChanges(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[hsl(var(--primary))]/10 rounded-lg">
            <Settings2 size={24} className="text-[hsl(var(--primary))]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Business Rules</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Configure automated rules and thresholds for inventory management
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              <AlertTriangle size={12} className="mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Information Alert */}
          <Alert>
            <Info size={16} />
            <AlertDescription>
              These rules automatically control inventory management, forecasting adjustments, and alert triggers across your retail network.
            </AlertDescription>
          </Alert>

          {/* Inventory Management Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package size={20} className="text-blue-500" />
                <span>Inventory Management</span>
              </CardTitle>
              <CardDescription>
                Configure stock levels, reorder points, and inventory thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stockDays" className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <span>Stock Days Coverage</span>
                  </Label>
                  <Input
                    id="stockDays"
                    type="number"
                    value={rules.stockDays}
                    onChange={(e) => handleRuleChange('stockDays', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Number of days of stock to maintain as safety buffer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorderPoint" className="flex items-center space-x-2">
                    <Target size={16} className="text-gray-500" />
                    <span>Reorder Point</span>
                  </Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={rules.reorderPoint}
                    onChange={(e) => handleRuleChange('reorderPoint', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Minimum stock level that triggers automatic reordering
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStockLevel">Maximum Stock Level</Label>
                  <Input
                    id="maxStockLevel"
                    type="number"
                    value={rules.maxStockLevel}
                    onChange={(e) => handleRuleChange('maxStockLevel', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Maximum inventory level to prevent overstocking
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandVolatilityBuffer">Demand Volatility Buffer (%)</Label>
                  <Input
                    id="demandVolatilityBuffer"
                    type="number"
                    value={rules.demandVolatilityBuffer}
                    onChange={(e) => handleRuleChange('demandVolatilityBuffer', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Additional buffer for demand uncertainty
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Reordering</Label>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Automatically generate purchase orders when stock hits reorder point
                    </p>
                  </div>
                  <Switch
                    checked={rules.autoReorderEnabled}
                    onCheckedChange={(checked) => handleRuleChange('autoReorderEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecasting Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp size={20} className="text-green-500" />
                <span>Forecasting & Planning</span>
              </CardTitle>
              <CardDescription>
                Configure forecast accuracy thresholds and seasonal adjustments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="forecastAccuracy">Forecast Accuracy Threshold (%)</Label>
                  <Input
                    id="forecastAccuracy"
                    type="number"
                    value={rules.forecastAccuracyThreshold}
                    onChange={(e) => handleRuleChange('forecastAccuracyThreshold', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Minimum acceptable forecast accuracy before triggering alerts
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promotionBuffer">Promotion Buffer (%)</Label>
                  <Input
                    id="promotionBuffer"
                    type="number"
                    value={rules.promotionBufferPercent}
                    onChange={(e) => handleRuleChange('promotionBufferPercent', parseInt(e.target.value) || 0)}
                    className="w-full"
                  />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Additional stock buffer during promotional periods
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Seasonal Adjustments</Label>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Automatically adjust forecasts based on seasonal patterns
                    </p>
                  </div>
                  <Switch
                    checked={rules.seasonalAdjustmentEnabled}
                    onCheckedChange={(checked) => handleRuleChange('seasonalAdjustmentEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <span>Alert Configuration</span>
              </CardTitle>
              <CardDescription>
                Set up automated alerts for various inventory conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Send alerts when inventory falls below reorder point
                    </p>
                  </div>
                  <Switch
                    checked={rules.lowStockAlertEnabled}
                    onCheckedChange={(checked) => handleRuleChange('lowStockAlertEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Excess Stock Alerts</Label>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Send alerts when inventory exceeds maximum stock level
                    </p>
                  </div>
                  <Switch
                    checked={rules.excessStockAlertEnabled}
                    onCheckedChange={(checked) => handleRuleChange('excessStockAlertEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default RulesModule; 