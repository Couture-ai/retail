## Overview
The pin feature allows administrators to pin specific products to the top of search results. This ensures important or featured products always appear first, regardless of the search algorithm's ranking.

## Implementation

### Data Structure
Products can be pinned using their unique ObjectID. The system maintains a collection of pinned products in the following format:

```javascript
{
  pinnedProducts: {
    searchTerm1: ['id_1', 'id_2'],
    searchTerm2: ['id_3']
  }
}
```

### API Endpoints

#### Pin Products
```javascript
POST /api/pin-products

// Request body
{
  "searchTerm": "wireless headphones",
  "productIds": ["id_1", "id_2"]
}

// Response
{
  "success": true,
  "pinnedCount": 2
}
```

#### Remove Pins
```javascript
DELETE /api/pin-products

// Request body
{
  "searchTerm": "wireless headphones",
  "productIds": ["id_1"]  // Optional - if not provided, removes all pins for the search term
}

// Response
{
  "success": true,
  "removedCount": 1
}
```

### Bulk Upload Format

#### CSV Format
Products can be uploaded in CSV format with the following structure:

```csv
ObjectID,SearchTerm
id_1,wireless headphones
id_2,wireless headphones
id_3,bluetooth speakers
```

#### JSON Format
Alternatively, products can be uploaded in JSON format:

```json
{
  "pins": [
    {
      "ObjectID": "id_1",
      "SearchTerm": "wireless headphones"
    },
    {
      "ObjectID": "id_2",
      "SearchTerm": "wireless headphones"
    },
    {
      "ObjectID": "id_3",
      "SearchTerm": "bluetooth speakers"
    }
  ]
}
```

### Search Implementation

The search function needs to be modified to incorporate pinned results:

```javascript
async function search(query, options = {}) {
  // Get pinned products for this query
  const pinnedProductIds = await getPinnedProducts(query);
  
  // Fetch pinned products first
  const pinnedProducts = await Product.find({
    ObjectID: { $in: pinnedProductIds }
  });
  
  // Perform regular search for remaining products
  const regularSearch = await performSearch(query, {
    ...options,
    exclude: pinnedProductIds
  });
  
  // Combine results, with pinned products first
  return [...pinnedProducts, ...regularSearch];
}
```

## Usage Examples

### Pin Products via API

```javascript
// Pin multiple products
await fetch('/api/pin-products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    searchTerm: 'wireless headphones',
    productIds: ['id_1', 'id_2']
  })
});

// Remove specific pins
await fetch('/api/pin-products', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    searchTerm: 'wireless headphones',
    productIds: ['id_1']
  })
});
```

### Upload Pins via File

```javascript
// Upload CSV file
const formData = new FormData();
formData.append('file', csvFile);

await fetch('/api/bulk-upload-pins', {
  method: 'POST',
  body: formData
});

// Upload JSON file
await fetch('/api/bulk-upload-pins', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pins: [
      {
        "ObjectID": "id_1",
        "SearchTerm": "wireless headphones"
      }
    ]
  })
});
```

## Best Practices

1. Limit the number of pinned products per search term to maintain result relevance
2. Regularly review and update pinned products
3. Consider implementing an expiration date for pins
4. Monitor the impact of pins on overall search performance
5. Implement proper validation for ObjectIDs before pinning

## Error Handling

The system should handle these common errors:

```javascript
const errorResponses = {
  INVALID_OBJECT_ID: {
    code: 'INVALID_OBJECT_ID',
    message: 'One or more ObjectIDs are invalid'
  },
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'One or more products do not exist'
  },
  DUPLICATE_PIN: {
    code: 'DUPLICATE_PIN',
    message: 'Product is already pinned for this search term'
  }
};
```