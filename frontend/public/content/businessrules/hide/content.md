## Overview

The hide feature allows administrators to remove specific products from search results, either by their ObjectID or by matching attributes. Hidden products will be excluded from all search results and product listings.

## Implementation

### Data Structure

The system maintains two collections for hidden products:

```javascript
{
  // Products hidden by ID
  hiddenProducts: ['id_1', 'id_2', 'id_3'],

  // Products hidden by attributes
  hiddenAttributes: [
    {
      attribute: 'brand',
      value: 'BrandX',
      reason: 'discontinued'
    },
    {
      attribute: 'category',
      value: 'electronics',
      condition: 'price < 10',
      reason: 'low margin products'
    }
  ]
}
```

### API Endpoints

#### Hide Products by ID

```javascript
POST /api/hide-products

// Request body
{
  "productIds": ["id_1", "id_2"],
  "reason": "discontinued",  // Optional
  "expiryDate": "2025-12-31"  // Optional
}

// Response
{
  "success": true,
  "hiddenCount": 2
}
```

#### Hide Products by Attributes

```javascript
POST /api/hide-products-by-attribute

// Request body
{
  "attribute": "brand",
  "value": "BrandX",
  "condition": "price < 10",  // Optional
  "reason": "discontinued",   // Optional
  "expiryDate": "2025-12-31" // Optional
}

// Response
{
  "success": true,
  "estimatedAffectedProducts": 150
}
```

#### Unhide Products

```javascript
DELETE /api/hide-products

// Request body
{
  "productIds": ["id_1"],  // For ID-based hiding
  // OR
  "attribute": "brand",    // For attribute-based hiding
  "value": "BrandX"
}

// Response
{
  "success": true,
  "unhiddenCount": 1
}
```

### Bulk Upload Format

#### CSV Format

Products can be hidden using CSV format with the following structures:

For ID-based hiding:

```csv
ObjectID,Reason,ExpiryDate
id_1,discontinued,2025-12-31
id_2,out of stock,2025-12-31
id_3,quality issue,2025-12-31
```

For attribute-based hiding:

```csv
Attribute,Value,Condition,Reason,ExpiryDate
brand,BrandX,,discontinued,2025-12-31
category,electronics,price < 10,low margin,2025-12-31
```

#### JSON Format

Alternatively, products can be hidden using JSON format:

```json
{
  "hiddenProducts": [
    {
      "ObjectID": "id_1",
      "reason": "discontinued",
      "expiryDate": "2025-12-31"
    },
    {
      "ObjectID": "id_2",
      "reason": "out of stock",
      "expiryDate": "2025-12-31"
    }
  ],
  "hiddenAttributes": [
    {
      "attribute": "brand",
      "value": "BrandX",
      "reason": "discontinued",
      "expiryDate": "2025-12-31"
    },
    {
      "attribute": "category",
      "value": "electronics",
      "condition": "price < 10",
      "reason": "low margin",
      "expiryDate": "2025-12-31"
    }
  ]
}
```

### Search Implementation

The search function needs to be modified to exclude hidden products:

```javascript
async function search(query, options = {}) {
  // Get hidden product IDs
  const hiddenProductIds = await getHiddenProducts();

  // Get hidden attribute conditions
  const hiddenAttributes = await getHiddenAttributes();

  // Build exclusion query
  const exclusionQuery = {
    $and: [
      { ObjectID: { $nin: hiddenProductIds } },
      ...hiddenAttributes.map(({ attribute, value, condition }) => ({
        $or: [
          { [attribute]: { $ne: value } },
          ...(condition ? [{ $expr: { $not: { $eval: condition } } }] : [])
        ]
      }))
    ]
  };

  // Perform search with exclusions
  return await performSearch(query, {
    ...options,
    additionalFilters: exclusionQuery
  });
}
```

### Monitoring and Management Interface

```javascript
// Get hidden products summary
GET /api/hidden-products/summary

// Response
{
  "totalHiddenProducts": 150,
  "hiddenByID": 25,
  "hiddenByAttributes": 125,
  "expiringWithin30Days": 15,
  "byReason": {
    "discontinued": 80,
    "out of stock": 45,
    "quality issue": 25
  }
}

// Get detailed hidden products report
GET /api/hidden-products/report

// Response
{
  "hiddenProducts": [...],
  "hiddenAttributes": [...],
  "lastUpdated": "2025-01-10T12:00:00Z"
}
```

## Usage Examples

### Hide Products via API

```javascript
// Hide products by ID
await fetch('/api/hide-products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productIds: ['id_1', 'id_2'],
    reason: 'discontinued',
    expiryDate: '2025-12-31'
  })
});

// Hide products by attribute
await fetch('/api/hide-products-by-attribute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    attribute: 'brand',
    value: 'BrandX',
    condition: 'price < 10',
    reason: 'low margin'
  })
});
```

### Bulk Upload Hidden Products

```javascript
// Upload CSV file
const formData = new FormData();
formData.append('file', csvFile);

await fetch('/api/bulk-upload-hidden', {
  method: 'POST',
  body: formData
});

// Upload JSON file
await fetch('/api/bulk-upload-hidden', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    hiddenProducts: [...],
    hiddenAttributes: [...]
  })
});
```

## Best Practices

1. Always provide a reason for hiding products
2. Set expiration dates for temporary hide conditions
3. Regularly review hidden products and attributes
4. Monitor the impact on search results and user experience
5. Document all hide decisions for audit purposes
6. Use attribute-based hiding for systematic issues
7. Use ID-based hiding for individual product issues

## Error Handling

```javascript
const errorResponses = {
  INVALID_OBJECT_ID: {
    code: 'INVALID_OBJECT_ID',
    message: 'One or more ObjectIDs are invalid'
  },
  INVALID_ATTRIBUTE: {
    code: 'INVALID_ATTRIBUTE',
    message: 'Specified attribute is not valid'
  },
  INVALID_CONDITION: {
    code: 'INVALID_CONDITION',
    message: 'Specified condition is not valid'
  },
  EXPIRY_DATE_PAST: {
    code: 'EXPIRY_DATE_PAST',
    message: 'Expiry date must be in the future'
  }
};
```

## Automatic Cleanup

```javascript
// Scheduled job to remove expired hidden products
async function cleanupExpiredHidden() {
  const currentDate = new Date();

  // Remove expired ID-based hidden products
  await HiddenProducts.deleteMany({
    expiryDate: { $lt: currentDate }
  });

  // Remove expired attribute-based hidden products
  await HiddenAttributes.deleteMany({
    expiryDate: { $lt: currentDate }
  });
}
```
