# Product Filter Feature Documentation

## Overview
The filter feature enables dynamic product filtering based on attributes, ranges, and complex conditions. It supports both pre-defined and dynamic filters, with capabilities for nested conditions, range queries, and full-text search within specific fields.

## Implementation

### Data Structure
The system maintains filter configurations and cached results:

```javascript
{
  // Pre-defined filter configurations
  filterConfigs: [
    {
      id: 'price_range',
      type: 'range',
      attribute: 'price',
      ranges: [
        { min: 0, max: 50, label: 'Under $50' },
        { min: 50, max: 100, label: '$50-$100' }
      ]
    },
    {
      id: 'brand_list',
      type: 'list',
      attribute: 'brand',
      multiSelect: true
    },
    {
      id: 'availability',
      type: 'boolean',
      attribute: 'in_stock'
    }
  ],

  // Dynamic filter aggregations
  filterAggregations: {
    brand: ['BrandX', 'BrandY', 'BrandZ'],
    category: ['Electronics', 'Clothing'],
    price_ranges: [
      { min: 0, max: 50, count: 150 },
      { min: 50, max: 100, count: 200 }
    ]
  }
}
```

### API Endpoints

#### Apply Filters
```javascript
POST /api/products/filter

// Request body
{
  "filters": [
    {
      "attribute": "price",
      "operation": "range",
      "min": 50,
      "max": 100
    },
    {
      "attribute": "brand",
      "operation": "in",
      "values": ["BrandX", "BrandY"]
    },
    {
      "attribute": "category",
      "operation": "equals",
      "value": "Electronics"
    },
    {
      "attribute": "description",
      "operation": "text_contains",
      "value": "wireless"
    }
  ],
  "sort": {
    "attribute": "price",
    "direction": "asc"
  },
  "page": 1,
  "perPage": 20
}

// Response
{
  "products": [...],
  "total": 150,
  "aggregations": {...},
  "appliedFilters": [...]
}
```

#### Get Filter Configurations
```javascript
GET /api/filters/config

// Response
{
  "availableFilters": [
    {
      "id": "price_range",
      "type": "range",
      "attribute": "price",
      "ranges": [...]
    },
    ...
  ],
  "defaultFilters": [...],
  "sortOptions": [...]
}
```

#### Update Filter Configurations
```javascript
PUT /api/filters/config

// Request body
{
  "filterId": "price_range",
  "config": {
    "type": "range",
    "attribute": "price",
    "ranges": [...]
  }
}
```

### Filter Types and Operations

```javascript
const filterTypes = {
  RANGE: {
    operations: ['between', 'greater_than', 'less_than'],
    dataTypes: ['number', 'date']
  },
  LIST: {
    operations: ['in', 'not_in', 'equals'],
    dataTypes: ['string', 'number']
  },
  BOOLEAN: {
    operations: ['equals'],
    dataTypes: ['boolean']
  },
  TEXT: {
    operations: ['contains', 'starts_with', 'ends_with'],
    dataTypes: ['string']
  },
  COMPOSITE: {
    operations: ['and', 'or', 'not'],
    allowNested: true
  }
};
```

### Query Building Implementation

```javascript
class FilterQueryBuilder {
  buildQuery(filters) {
    return filters.map(filter => {
      switch(filter.operation) {
        case 'range':
          return this.buildRangeQuery(filter);
        case 'in':
          return this.buildInQuery(filter);
        case 'text_contains':
          return this.buildTextQuery(filter);
        case 'composite':
          return this.buildCompositeQuery(filter);
        default:
          return this.buildSimpleQuery(filter);
      }
    });
  }

  buildRangeQuery(filter) {
    return {
      range: {
        [filter.attribute]: {
          gte: filter.min,
          lte: filter.max
        }
      }
    };
  }

  buildInQuery(filter) {
    return {
      terms: {
        [filter.attribute]: filter.values
      }
    };
  }

  buildTextQuery(filter) {
    return {
      match_phrase: {
        [filter.attribute]: filter.value
      }
    };
  }

  buildCompositeQuery(filter) {
    return {
      bool: {
        [filter.operation]: this.buildQuery(filter.filters)
      }
    };
  }
}
```

### Aggregation Implementation

```javascript
class FilterAggregator {
  buildAggregations(filters) {
    return {
      // Dynamic range aggregations
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { to: 50 },
            { from: 50, to: 100 },
            { from: 100 }
          ]
        }
      },

      // Terms aggregations
      brands: {
        terms: {
          field: 'brand',
          size: 50
        }
      },

      // Nested aggregations
      categories: {
        terms: {
          field: 'category',
          size: 20
        },
        aggs: {
          subcategories: {
            terms: {
              field: 'subcategory',
              size: 20
            }
          }
        }
      }
    };
  }
}
```

### Filter URL Generation

```javascript
class FilterUrlBuilder {
  buildUrl(filters, sort, pagination) {
    const params = new URLSearchParams();
    
    // Add filters
    filters.forEach(filter => {
      switch(filter.operation) {
        case 'range':
          params.append(`${filter.attribute}_min`, filter.min);
          params.append(`${filter.attribute}_max`, filter.max);
          break;
        case 'in':
          filter.values.forEach(value => 
            params.append(filter.attribute, value)
          );
          break;
        default:
          params.append(filter.attribute, filter.value);
      }
    });
    
    // Add sorting
    if (sort) {
      params.append('sort', `${sort.attribute}_${sort.direction}`);
    }
    
    // Add pagination
    params.append('page', pagination.page);
    params.append('per_page', pagination.perPage);
    
    return `?${params.toString()}`;
  }
}
```

### Cache Implementation

```javascript
class FilterCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 300000; // 5 minutes
  }

  async getResults(filterKey) {
    const cached = this.cache.get(filterKey);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    return null;
  }

  async cacheResults(filterKey, data) {
    this.cache.set(filterKey, {
      data,
      timestamp: Date.now()
    });
  }
}
```

## Usage Examples

### Basic Filtering

```javascript
// Simple attribute filter
await fetch('/api/products/filter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filters: [
      {
        attribute: 'brand',
        operation: 'equals',
        value: 'BrandX'
      }
    ]
  })
});
```

### Complex Filtering

```javascript
// Complex nested filters
await fetch('/api/products/filter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filters: [
      {
        operation: 'composite',
        type: 'and',
        filters: [
          {
            attribute: 'price',
            operation: 'range',
            min: 50,
            max: 100
          },
          {
            operation: 'composite',
            type: 'or',
            filters: [
              {
                attribute: 'brand',
                operation: 'in',
                values: ['BrandX', 'BrandY']
              },
              {
                attribute: 'category',
                operation: 'equals',
                value: 'Electronics'
              }
            ]
          }
        ]
      }
    ]
  })
});
```

## Best Practices

1. Cache frequently used filter combinations
2. Use appropriate indexing for filtered fields
3. Implement pagination for large result sets
4. Pre-calculate common aggregations
5. Use filter facets for better UX
6. Optimize query performance for complex filters
7. Consider partial matches for text filters
8. Implement proper error handling for invalid filters

## Error Handling

```javascript
const errorResponses = {
  INVALID_FILTER: {
    code: 'INVALID_FILTER',
    message: 'Invalid filter configuration'
  },
  INVALID_OPERATION: {
    code: 'INVALID_OPERATION',
    message: 'Operation not supported for this filter type'
  },
  INVALID_VALUE: {
    code: 'INVALID_VALUE',
    message: 'Filter value is not valid for the specified attribute'
  },
  TOO_MANY_FILTERS: {
    code: 'TOO_MANY_FILTERS',
    message: 'Number of filters exceeds maximum allowed'
  }
};
```

## Performance Optimization

```javascript
// Filter optimization strategies
class FilterOptimizer {
  // Optimize filter order
  optimizeFilterOrder(filters) {
    return filters.sort((a, b) => {
      // Apply most selective filters first
      return this.getSelectivity(a) - this.getSelectivity(b);
    });
  }

  // Calculate filter selectivity
  getSelectivity(filter) {
    // Implementation based on historical data
    // Lower number = more selective
    return this.selectivityMap[filter.attribute] || 1.0;
  }

  // Cache frequently used combinations
  async getCachedResults(filters) {
    const cacheKey = this.generateCacheKey(filters);
    return await this.cacheService.get(cacheKey);
  }
}
```

## Monitoring and Analytics

```javascript
class FilterAnalytics {
  // Track filter usage
  async trackFilterUsage(filters) {
    await this.analyticsService.track('filter_used', {
      filters,
      timestamp: new Date(),
      resultCount: filters.resultCount
    });
  }

  // Generate filter insights
  async generateInsights() {
    return {
      popularFilters: await this.getPopularFilters(),
      averageResultCount: await this.getAverageResultCount(),
      filterCombinations: await this.getPopularCombinations(),
      performanceMetrics: await this.getPerformanceMetrics()
    };
  }
}
```