# Retail Analytics API Contract

This document defines the REST API endpoints to replace direct SQL query execution (`executeSqlQuery`) for security and maintainability reasons. The endpoints are organized by functional area with proper request/response formats.

## Authentication & Headers

All endpoints require standard authentication headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Base URL
```
https://api.retail-analytics.com/v1
```

**Note:** All endpoints require a valid `tenant_id` in the URL path to ensure proper data isolation and multi-tenancy support.

---

## 1. Dashboard Statistics Endpoints

### 1.1 Get Dashboard Overview Stats
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/stats/overview`

**Description:** Retrieve high-level statistics for the dashboard homepage including total stores, products, forecasts, and sales.

**Query Parameters:**
- `month_year` (optional): Filter by specific month (format: YYYY-MM) ("Fashion & Lifestyle" uses forecast_fnl table)

**Request Example:**
```
GET /tenant/fashion/dashboard/stats/overview?month_year=2024-12
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "total_stores": 1250,
    "total_products": 45000,
    "total_forecasts": 2500000,
    "total_sales": 1850000.50,
    "calculated_at": "2024-12-01T10:30:00Z"
  }
}
```

### 1.2 Get Available Time Periods
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/time-periods`

**Description:** Get available week start dates for filtering data.

**Query Parameters:**

**Request Example:**
```
GET /tenant/fashion/dashboard/time-periods
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "available_weeks": [
      "2025-01-01",
      "2024-12-01", 
      "2024-11-01"
    ],
    "date_range": {
      "earliest": "2024-01-01",
      "latest": "2025-01-01"
    }
  }
}
```

### 1.3 Get Regional Performance
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/stats/regional-performance`

**Description:** Get performance metrics grouped by region.

**Query Parameters:**
- `limit` (optional): Number of regions to return (default: 7)

**Request Example:**
```
GET /tenant/fashion/dashboard/stats/regional-performance?limit=10
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "region": "North",
      "stores": 120,
      "avg_sales": 15000.75,
      "performance": 85.5
    },
    {
      "region": "South",
      "stores": 98,
      "avg_sales": 12500.25,
      "performance": 78.2
    }
  ]
}
```

### 1.4 Get Product Performance by Category
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/stats/product-performance`

**Description:** Get forecast accuracy and sales volume by super category.

**Query Parameters:**
- `limit` (optional): Number of categories to return (default: 5)

**Request Example:**
```
GET /tenant/fashion/dashboard/stats/product-performance?limit=8
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Electronics",
      "forecast_accuracy": 87.3,
      "sales_volume": 250000,
      "trend": "up"
    },
    {
      "category": "Clothing",
      "forecast_accuracy": 72.1,
      "sales_volume": 180000,
      "trend": "down"
    }
  ]
}
```

### 1.5 Get Weekly Trends
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/stats/weekly-trends`

**Description:** Get weekly forecast vs actual trends.

**Query Parameters:**
- `weeks` (optional): Number of weeks to return (default: 7)

**Request Example:**
```
GET /tenant/fashion/dashboard/stats/weekly-trends?weeks=12
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "week_start_date": "2024-12-01",
      "avg_forecast": 1500.25,
      "avg_actual": 1420.75,
      "accuracy": 83.2
    },
    {
      "week_start_date": "2024-11-24",
      "avg_forecast": 1450.00,
      "avg_actual": 1380.50,
      "accuracy": 81.8
    }
  ]
}
```

### 1.6 Get Top Products
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/stats/top-products`

**Description:** Get top-selling products with their performance metrics.

**Query Parameters:**
- `limit` (optional): Number of products to return (default: 5)

**Request Example:**
```
GET /tenant/fashion/dashboard/stats/top-products?limit=10
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "article_description": "iPhone 15 Pro Max",
      "brand": "Apple",
      "total_sales": 25000,
      "avg_forecast": 23500,
      "store_count": 150
    }
  ]
}
```

### 1.7 Get Low Stock Alerts
**Endpoint:** `GET /tenant/{tenant_id}/dashboard/alerts/low-stock`

**Description:** Get products with low forecast quantities.

**Query Parameters:**
- `threshold` (optional): Forecast quantity threshold (default: 20)
- `limit` (optional): Number of alerts to return (default: 4)

**Request Example:**
```
GET /tenant/fashion/dashboard/alerts/low-stock?threshold=15&limit=8
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "article_description": "Winter Jacket XL",
      "brand": "Nike",
      "avg_forecast": 12.5,
      "affected_stores": 25,
      "severity": "high"
    }
  ]
}
```

---

## 2. Store Management Endpoints

### 2.1 Get Store Hierarchy
**Endpoint:** `GET /tenant/{tenant_id}/stores/hierarchy`

**Description:** Get hierarchical store data for tree navigation.

**Query Parameters:**
- `level` (required): Hierarchy level (region, state, city, store_no)
- `parent_filters` (optional): JSON object with parent level filters

**Request Example:**
```
GET /tenant/fashion/stores/hierarchy?level=region
GET /tenant/fashion/stores/hierarchy?level=state&parent_filters={"region":"North"}
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "name": "North",
      "level": "region",
      "count": 120,
      "context": {
        "region": "North"
      }
    },
    {
      "name": "South", 
      "level": "region",
      "count": 98,
      "context": {
        "region": "South"
      }
    }
  ]
}
```

### 2.2 Get Store Details
**Endpoint:** `GET /tenant/{tenant_id}/stores/{store_no}/details`

**Description:** Get detailed information about a specific store.

**Path Parameters:**
- `store_no` (required): Store number

**Query Parameters:**

**Request Example:**
```
GET /tenant/fashion/stores/ST001/details
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "store_no": "ST001",
    "store_name": "Downtown Mall",
    "region": "North",
    "state": "NY",
    "city": "New York",
    "stats": {
      "total_forecasted": 125000.50,
      "total_sold": 118750.25,
      "accuracy": 87.3,
      "avg_forecast": 1250.75,
      "record_count": 1500,
      "unique_products": 850,
      "week_count": 52
    }
  }
}
```

### 2.3 Create New Store
**Endpoint:** `POST /tenant/{tenant_id}/stores/validate-new`

**Description:** Validate and get dropdown options for creating a new store.

**Request Body:**
```json
{
  "field": "region",
  "existing_selections": {
    "state": "NY"
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "field": "region",
    "options": [
      {
        "value": "North",
        "count": 120
      },
      {
        "value": "South",
        "count": 98
      }
    ]
  }
}
```

---

## 3. Product Management Endpoints

### 3.1 Get Product Hierarchy
**Endpoint:** `GET /tenant/{tenant_id}/products/hierarchy`

**Description:** Get hierarchical product data for tree navigation.

**Query Parameters:**
- `level` (required): Hierarchy level (vertical, super_category, segment, article_id)
- `parent_filters` (optional): JSON object with parent level filters

**Request Example:**
```
GET /tenant/fashion/products/hierarchy?level=vertical
GET /tenant/fashion/products/hierarchy?level=super_category&parent_filters={"vertical":"Electronics"}
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Electronics",
      "level": "vertical",
      "count": 15000,
      "context": {
        "vertical": "Electronics"
      }
    }
  ]
}
```

### 3.2 Get Product Details
**Endpoint:** `GET /tenant/{tenant_id}/products/{article_id}/details`

**Description:** Get detailed information about a specific product.

**Path Parameters:**
- `article_id` (required): Article ID

**Query Parameters:**

**Request Example:**
```
GET /tenant/fashion/products/ART12345/details
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "article_id": "ART12345",
    "article_description": "iPhone 15 Pro Max",
    "brand": "Apple",
    "segment": "Premium",
    "super_category": "Smartphones",
    "vertical": "Electronics",
    "division": "Consumer Tech",
    "stats": {
      "total_forecasted": 25000,
      "total_sold": 23500,
      "accuracy": 94.0,
      "avg_forecast": 125.5,
      "record_count": 200,
      "unique_stores": 150,
      "week_count": 52
    }
  }
}
```

### 3.3 Get Product Statistics
**Endpoint:** `GET /tenant/{tenant_id}/products/{product_identifier}/stats`

**Description:** Get statistics for a product at any hierarchy level.

**Path Parameters:**
- `product_identifier` (required): Product identifier (can be vertical, super_category, segment, or article_id value)

**Query Parameters:**
- `level` (required): Hierarchy level of the identifier

**Request Example:**
```
GET /tenant/fashion/products/Electronics/stats?level=vertical
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "identifier": "Electronics",
    "level": "vertical",
    "stats": {
      "total_forecasted": 2500000.50,
      "total_sold": 2350000.25,
      "accuracy": 89.2,
      "avg_forecast": 1250.75,
      "record_count": 15000
    }
  }
}
```

### 3.4 Create New Product
**Endpoint:** `POST /tenant/{tenant_id}/products/validate-new`

**Description:** Validate and get dropdown options for creating a new product.

**Request Body:**
```json
{
  "field": "brand",
  "existing_selections": {
    "vertical": "Electronics",
    "super_category": "Smartphones"
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "field": "brand",
    "options": [
      {
        "value": "Apple",
        "count": 50
      },
      {
        "value": "Samsung",
        "count": 45
      }
    ]
  }
}
```

---

## 4. Forecast Data Endpoints

### 4.1 Get Forecast Table Data
**Endpoint:** `GET /tenant/{tenant_id}/forecast/table-data`

**Description:** Get paginated forecast data with optional grouping and filtering.

**Query Parameters:**
- `week_start_date` (required): Week start date filter
- `page` (optional): Page number (default: 0)
- `limit` (optional): Records per page (default: 100)
- `group_by` (optional): Comma-separated list of columns to group by
- `filters` (optional): JSON object with column filters

**Request Example:**
```
GET /tenant/fashion/forecast/table-data?week_start_date=2024-12-01&page=0&limit=100&group_by=region,super_category
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "region": "North",
        "super_category": "Electronics",
        "total_forecast_qty": 15000,
        "total_sold_qty": 14250,
        "store_count": 25
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 100,
      "total_records": 2500,
      "has_more": true
    },
    "metadata": {
      "group_by_columns": ["region", "super_category"],
      "aggregated_columns": ["forecast_qty", "sold_qty"]
    }
  }
}
```

### 4.2 Get Available Week Start Dates
**Endpoint:** `GET /tenant/{tenant_id}/forecast/available-dates`

**Description:** Get available week start dates for forecast data.

**Query Parameters:**

**Request Example:**
```
GET /tenant/fashion/forecast/available-dates
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "dates": [
      "2025-01-01",
      "2024-12-01",
      "2024-11-01"
    ],
    "default_date": "2025-01-01"
  }
}
```

### 4.3 Get Forecast Adjustments Comparison
**Endpoint:** `GET /tenant/{tenant_id}/forecast/adjustments/{adjustment_id}/comparison`

**Description:** Get forecast data for adjustment comparison view.

**Path Parameters:**
- `adjustment_id` (required): Adjustment identifier

**Query Parameters:**
- `week_start_date` (required): Week start date
- `limit` (optional): Number of records (default: 50)

**Request Example:**
```
GET /tenant/fashion/forecast/adjustments/ADJ123/comparison?week_start_date=2024-12-01&limit=100
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "store_no": "ST001",
      "article_id": "ART123",
      "article_description": "iPhone 15 Pro Max",
      "original_forecast": 125.5,
      "adjusted_forecast": 135.2,
      "difference": 9.7,
      "difference_percent": 7.7
    }
  ]
}
```

---

## 5. Inventory Management Endpoints

### 5.1 Get Purchase Order Data
**Endpoint:** `GET /tenant/{tenant_id}/inventory/purchase-orders`

**Description:** Get purchase order data for inventory management.

**Query Parameters:**
- `week_start_date` (required): Week start date filter
- `filters` (optional): JSON object with additional filters

**Request Example:**
```
GET /tenant/fashion/inventory/purchase-orders?week_start_date=2024-12-01
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "store_no": "ST001",
      "article_id": "ART123",
      "article_description": "iPhone 15 Pro Max",
      "brand": "Apple",
      "forecast_qty": 125.5,
      "recommended_order_qty": 130,
      "current_stock": 25
    }
  ]
}
```

### 5.2 Get Order History
**Endpoint:** `GET /tenant/{tenant_id}/inventory/orders/history`

**Description:** Get historical order data for tracking.

**Query Parameters:**
- `store_no` (optional): Filter by store
- `article_id` (optional): Filter by product
- `date_from` (optional): Start date filter
- `date_to` (optional): End date filter

**Request Example:**
```
GET /tenant/fashion/inventory/orders/history?store_no=ST001&date_from=2024-11-01&date_to=2024-12-01
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "order_id": "PO12345",
      "store_no": "ST001", 
      "article_id": "ART123",
      "article_description": "iPhone 15 Pro Max",
      "ordered_qty": 130,
      "order_date": "2024-11-15",
      "status": "delivered"
    }
  ]
}
```

---

## 6. Analytics Endpoints

### 6.1 Get Column Filter Options
**Endpoint:** `GET /tenant/{tenant_id}/analytics/filters/{column}/options`

**Description:** Get distinct values for a column to populate filter dropdowns.

**Path Parameters:**
- `column` (required): Column name

**Query Parameters:**
- `limit` (optional): Maximum number of options (default: 1000)
- `search` (optional): Search term to filter options

**Request Example:**
```
GET /tenant/fashion/analytics/filters/region/options?limit=50&search=North
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "column": "region",
    "options": [
      "North",
      "Northeast",
      "Northwest"
    ],
    "total_count": 3,
    "has_more": false
  }
}
```

### 6.2 Execute Analytics Query (Restricted)
**Endpoint:** `POST /tenant/{tenant_id}/analytics/execute-query`

**Description:** Execute custom SQL queries for analytics (with restrictions and validation).

**Request Body:**
```json
{
  "sql_query": "SELECT region, COUNT(*) FROM forecast GROUP BY region",
  "context": {
    "widget_id": "chart_123",
    "analytics_type": "dashboard"
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "region": "North",
      "count": 1500
    },
    {
      "region": "South", 
      "count": 1200
    }
  ],
  "query_metadata": {
    "execution_time_ms": 245,
    "rows_returned": 2,
    "query_hash": "abc123def456"
  }
}
```

**Note:** This endpoint should implement SQL injection protection, query whitelisting, and rate limiting.

---

## 7. Replenishment Planning Endpoints

### 7.1 Get Replenishment Data
**Endpoint:** `GET /tenant/{tenant_id}/replenishment/recommendations`

**Description:** Get replenishment recommendations grouped by category and region.

**Query Parameters:**
- `week_start_date` (optional): Target week (uses latest if not provided)
- `group_by` (optional): Grouping columns (default: super_category,region)
- `min_forecast` (optional): Minimum forecast threshold (default: 10)

**Request Example:**
```
GET /tenant/fashion/replenishment/recommendations?week_start_date=2024-12-01&min_forecast=20
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "super_category": "Electronics",
      "region": "North",
      "total_forecast": 25000,
      "total_sold": 23500,
      "replenishment_needed": 1500,
      "priority": "high"
    }
  ]
}
```

### 7.2 Get State-Level Forecast Data
**Endpoint:** `GET /tenant/{tenant_id}/replenishment/state-forecast`

**Description:** Get state-level forecast data for geographic analysis.

**Query Parameters:**
- `week_start_date` (optional): Target week

**Request Example:**
```
GET /tenant/fashion/replenishment/state-forecast?week_start_date=2024-12-01
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "state": "NY",
      "total_forecast": 125000,
      "store_count": 45,
      "avg_forecast_per_store": 2777.78
    }
  ]
}
```

---

## Error Response Format

All endpoints use a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Missing required parameter: week_start_date",
    "details": {
      "parameter": "week_start_date",
      "expected_format": "YYYY-MM-DD"
    }
  },
  "timestamp": "2024-12-01T10:30:00Z",
  "request_id": "req_123456789"
}
```
