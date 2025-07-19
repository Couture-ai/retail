import React, { useState, useEffect } from 'react';
import { ForecastRepository } from '@/repository/forecast_repository';
import { Minus, Plus, GitBranch, Clock, User } from 'lucide-react';

export interface DiffRow {
  storeNo: string;
  storeName: string;
  articleId: string;
  articleDescription: string;
  brand: string;
  previousQty: number;
  newQty: number;
  diff: number;
  changeType: 'added' | 'removed' | 'modified';
}

interface AdjustmentDiffViewProps {
  adjustmentId: string;
  adjustmentTitle: string;
  selectedWeekStartDate: string;
  manualDiffData?: DiffRow[];
}

const AdjustmentDiffView: React.FC<AdjustmentDiffViewProps> = ({
  adjustmentId,
  adjustmentTitle,
  selectedWeekStartDate,
  manualDiffData
}) => {
  const [diffData, setDiffData] = useState<DiffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const forecastRepo = new ForecastRepository(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

  // Generate random adjustment data based on adjustment ID
  const generateRandomAdjustment = (data: any[], adjustmentId: string): DiffRow[] => {
    // Use adjustment ID as seed for consistent randomness
    const seed = adjustmentId.split('-')[1] ? parseInt(adjustmentId.split('-')[1]) : 1;
    
    // Select random subset of data (10-20 rows)
    const rowCount = Math.min(data.length, 10 + (seed % 11)); // 10-20 rows
    const selectedRows = [];
    
    for (let i = 0; i < rowCount; i++) {
      const index = (seed * (i + 1) * 9301 + 49297) % data.length;
      const row = data[index];
      
      if (row && !selectedRows.find(r => r.store_no === row.store_no && r.article_id === row.article_id)) {
        // Generate random adjustment (-500 to +500)
        const randomSeed = (seed + i) * 9301 + 49297;
        const randomValue = (randomSeed % 1001) - 500;
        const previousQty = row.forecast_qty || 0;
        const newQty = Math.max(0, previousQty + randomValue);
        
        selectedRows.push({
          storeNo: row.store_no,
          storeName: `Store ${row.store_no}`,
          articleId: row.article_id,
          articleDescription: row.article_description || 'Unknown Product',
          brand: row.brand || 'Unknown Brand',
          previousQty,
          newQty,
          diff: newQty - previousQty,
          changeType: newQty > previousQty ? 'added' : newQty < previousQty ? 'removed' : 'modified'
        });
      }
    }
    
    return selectedRows.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  };

  useEffect(() => {
    const loadAdjustmentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If manual diff data is provided, use it directly
        if (manualDiffData) {
          setDiffData(manualDiffData);
          setLoading(false);
          return;
        }
        
        // Query real forecast data for the selected week
        const query = `
          SELECT DISTINCT 
            store_no,
            article_id,
            article_description,
            brand,
            forecast_qty
          FROM forecast 
          WHERE week_start_date = '${selectedWeekStartDate}'
            AND store_no IS NOT NULL 
            AND article_id IS NOT NULL
            AND forecast_qty > 0
          ORDER BY forecast_qty DESC
          LIMIT 50
        `;
        
        const result = await forecastRepo.executeSqlQuery({ sql_query: query }, {
          setLoading: () => {},
          setError: () => {},
          setData: () => {}
        });
        
        if (result?.data && result.data.length > 0) {
          const diffRows = generateRandomAdjustment(result.data, adjustmentId);
          setDiffData(diffRows);
        } else {
          setError('No forecast data found for the selected date');
        }
      } catch (err) {
        console.error('Error loading adjustment data:', err);
        setError('Failed to load adjustment data');
      } finally {
        setLoading(false);
      }
    };

    if (selectedWeekStartDate || manualDiffData) {
      loadAdjustmentData();
    }
  }, [adjustmentId, selectedWeekStartDate, manualDiffData]);

  const getAdjustmentAuthor = (adjustmentId: string) => {
    const consensusAuthors = ['You', 'Anvay Karmore', 'Shagun Tyagi', 'Deepanshu Jain', 'Asish M.', 'Shobhit Agarwal'];
    const adjustmentNumber = parseInt(adjustmentId.split('-')[1]) || 1;
    return consensusAuthors[adjustmentNumber % consensusAuthors.length];
  };

  const getRowIcon = (changeType: string) => {
    switch (changeType) {
      case 'added': return <Plus size={14} className="text-green-400" />;
      case 'removed': return <Minus size={14} className="text-red-400" />;
      default: return <div className="w-3 h-3 bg-blue-400 rounded-full" />;
    }
  };

  const getRowBg = (changeType: string) => {
    switch (changeType) {
      case 'added': return 'bg-green-500/10 border-l-2 border-green-500';
      case 'removed': return 'bg-red-500/10 border-l-2 border-red-500';
      default: return 'bg-blue-500/10 border-l-2 border-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[hsl(var(--foreground))] opacity-70">Loading adjustment data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const totalChanges = diffData.reduce((sum, row) => sum + Math.abs(row.diff), 0);
  const addedRows = diffData.filter(row => row.changeType === 'added').length;
  const removedRows = diffData.filter(row => row.changeType === 'removed').length;
  const modifiedRows = diffData.filter(row => row.changeType === 'modified').length;

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] p-4 bg-[hsl(var(--muted))/30]">
        <div className="flex items-center space-x-3 mb-3">
          <GitBranch size={20} className="text-[hsl(var(--primary))]" />
          <h2 className="text-[hsl(var(--foreground))] font-semibold text-lg">{adjustmentTitle}</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <User size={14} className="text-[hsl(var(--muted-foreground))]" />
            <span className="text-[hsl(var(--foreground))]">{getAdjustmentAuthor(adjustmentId)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-[hsl(var(--muted-foreground))]" />
            <span className="text-[hsl(var(--muted-foreground))]">
              {new Date(selectedWeekStartDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-green-400 font-medium">+{addedRows} added</span>
            <span className="text-red-400 font-medium">-{removedRows} removed</span>
            <span className="text-blue-400 font-medium">~{modifiedRows} modified</span>
          </div>
          
          <div className="text-[hsl(var(--muted-foreground))]">
            Total change: <span className="font-medium">{totalChanges.toLocaleString()} units</span>
          </div>
        </div>
      </div>

      {/* Diff Table */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="sticky top-0 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))] grid grid-cols-12 gap-2 p-3 text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Store</div>
            <div className="col-span-1">Article ID</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Brand</div>
            <div className="col-span-1 text-right">Previous</div>
            <div className="col-span-1 text-right">New</div>
            <div className="col-span-2 text-right">Change</div>
          </div>
          
          {/* Diff Rows */}
          <div className="space-y-1 p-2">
            {diffData.map((row, index) => (
              <div key={`${row.storeNo}-${row.articleId}`} className={`${getRowBg(row.changeType)} grid grid-cols-12 gap-2 p-3 rounded text-sm transition-colors hover:bg-[hsl(var(--muted))]/20`}>
                <div className="col-span-1 flex items-center">
                  {getRowIcon(row.changeType)}
                </div>
                
                <div className="col-span-1 font-mono text-[hsl(var(--foreground))]">
                  {row.storeNo}
                </div>
                
                <div className="col-span-1 font-mono text-[hsl(var(--muted-foreground))]">
                  {row.articleId}
                </div>
                
                <div className="col-span-3 text-[hsl(var(--foreground))] truncate" title={row.articleDescription}>
                  {row.articleDescription}
                </div>
                
                <div className="col-span-2 text-[hsl(var(--muted-foreground))] truncate" title={row.brand}>
                  {row.brand}
                </div>
                
                <div className="col-span-1 text-right font-mono">
                  <span className="text-red-400 line-through">
                    {row.previousQty.toLocaleString()}
                  </span>
                </div>
                
                <div className="col-span-1 text-right font-mono">
                  <span className="text-green-400">
                    {row.newQty.toLocaleString()}
                  </span>
                </div>
                
                <div className="col-span-2 text-right">
                  <span className={`font-mono font-medium ${
                    row.diff > 0 ? 'text-green-400' : row.diff < 0 ? 'text-red-400' : 'text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {row.diff > 0 ? '+' : ''}{row.diff.toLocaleString()}
                  </span>
                  <span className="text-[hsl(var(--muted-foreground))] ml-2 text-xs">
                    ({((row.diff / row.previousQty) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-[hsl(var(--border))] p-3 bg-[hsl(var(--muted))/30] text-xs text-[hsl(var(--muted-foreground))]">
        Showing {diffData.length} modified store-product pairs • Total quantity adjustment: {totalChanges.toLocaleString()} units
      </div>
    </div>
  );
};

export default AdjustmentDiffView; 