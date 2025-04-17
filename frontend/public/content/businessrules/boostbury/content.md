# Product Boost/Bury Feature Documentation

## Overview
The boost/bury feature allows administrators to adjust product rankings in search results using numerical scores. Positive scores boost products higher in results, while negative scores bury them lower. This can be applied to specific products by ID or to groups of products matching certain attributes.

## Implementation

### Data Structure
The system maintains a collection of boost/bury rules:

```javascript
{
  // Products boosted/buried by ID
  productScores: [
    {
      objectId: 'id_1',
      score: 2.5,
      reason: 'high margin product',
      expiryDate: '2025-12-31'
    },
    {
      objectId: 'id_2',
      score: -1.5,
      reason: 'poor performance'
    }
  ],
  
  // Products boosted/buried by attributes
  attributeScores: [
    {
      attribute: 'brand',
      value: 'BrandX',
      score: 1.8,
      condition: 'price > 100',
      reason: 'premium products'
    },
    {
      attribute: 'category',
      value: 'electronics',
      score: -0.5,
      condition: 'margin < 0.1',
      reason: 'low margin category'
    }
  ]
}
```

### API Endpoints

#### Boost/Bury by ID
```javascript
POST /api/scoring/products

// Request body
{
  "products": [
    {
      "objectId": "id_1",
      "score": 2.5,
      "reason": "high margin product",
      "expiryDate": "2025-12-31"  // Optional
    },
    {
      "objectId": "id_2",
      "score": -1.5,
      "reason": "poor performance"
    }
  ]
}

// Response
{
  "success": true,
  "updatedCount": 2
}
```

#### Boost/Bury by Attributes
```javascript
POST /api/scoring/attributes

// Request body
{
  "attribute": "brand",
  "value": "BrandX",
  "score": 1.8,
  "condition": "price > 100",  // Optional
  "reason": "premium products",
  "expiryDate": "2025-12-31"   // Optional
}

// Response
{
  "success": true,
  "estimatedAffectedProducts": 150
}
```

#### Remove Scoring Rules
```javascript
DELETE /api/scoring

// Request body
{
  "objectIds": ["id_1"],  // For ID-based rules
  // OR
  "attribute": "brand",   // For attribute-based rules
  "value": "BrandX"
}

// Response
{
  "success": true,
  "removedCount": 1
}
```

### Bulk Upload Format

#### CSV Format
Scoring rules can be uploaded in CSV format:

For ID-based scoring:
```csv
ObjectID,Score,Reason,ExpiryDate
id_1,2.5,high margin product,2025-12-31
id_2,-1.5,poor performance,2025-12-31
id_3,1.8,featured product,2025-12-31
```

For attribute-based scoring:
```csv
Attribute,Value,Score,Condition,Reason,ExpiryDate
brand,BrandX,1.8,price > 100,premium products,2025-12-31
category,electronics,-0.5,margin < 0.1,low margin category,2025-12-31
```

#### JSON Format
Alternatively, scoring rules can be uploaded in JSON format:

```json
{
  "productScores": [
    {
      "objectId": "id_1",
      "score": 2.5,
      "reason": "high margin product",
      "expiryDate": "2025-12-31"
    },
    {
      "objectId": "id_2",
      "score": -1.5,
      "reason": "poor performance"
    }
  ],
  "attributeScores": [
    {
      "attribute": "brand",
      "value": "BrandX",
      "score": 1.8,
      "condition": "price > 100",
      "reason": "premium products",
      "expiryDate": "2025-12-31"
    }
  ]
}
```

### Search Implementation

The search function needs to incorporate scoring rules:

```javascript
async function search(query, options = {}) {
  // Get all scoring rules
  const productScores = await getProductScores();
  const attributeScores = await getAttributeScores();
  
  // Build scoring function
  const scoringFunction = `
    _score * (
      // ID-based scoring
      ${productScores.map(rule => `
        (doc['objectId'].value == '${rule.objectId}' ? ${rule.score} : 1)
      `).join(' * ')}
      
      // Attribute-based scoring
      ${attributeScores.map(rule => `
        (
          doc['${rule.attribute}'].value == '${rule.value}' 
          ${rule.condition ? `&& ${rule.condition}` : ''} 
          ? ${rule.score} : 1
        )
      `).join(' * ')}
    )
  `;
  
  // Perform search with custom scoring
  return await performSearch(query, {
    ...options,
    customScore: scoringFunction
  });
}
```

### Score Calculation Examples

```javascript
// Example of how scores compound
const calculateFinalScore = (baseScore, rules) => {
  return rules.reduce((score, rule) => {
    // Positive scores multiply above 1.0
    // Negative scores multiply below 1.0
    const multiplier = rule.score > 0 
      ? 1 + rule.score 
      : 1 / (1 + Math.abs(rule.score));
    return score * multiplier;
  }, baseScore);
};

// Examples:
// Base score: 1.0
// Rules: [+2.5, -1.5]
// Calculation: 1.0 * (1 + 2.5) * (1 / (1 + 1.5)) = 1.4

// This ensures:
// 1. Positive scores boost proportionally
// 2. Negative scores bury proportionally
// 3. Multiple rules compound fairly
```

### Monitoring Interface

```javascript
// Get scoring summary
GET /api/scoring/summary

// Response
{
  "totalScoringRules": 150,
  "productRules": 25,
  "attributeRules": 125,
  "averageScore": 0.8,
  "scoreDistribution": {
    "veryNegative": 10,  // score < -2.0
    "negative": 40,      // -2.0 <= score < 0
    "positive": 80,      // 0 < score <= 2.0
    "veryPositive": 20   // score > 2.0
  },
  "expiringWithin30Days": 15
}

// Get detailed scoring report
GET /api/scoring/report

// Response
{
  "productScores": [...],
  "attributeScores": [...],
  "lastUpdated": "2025-01-10T12:00:00Z",
  "impactAnalysis": {
    "totalAffectedProducts": 1500,
    "averageScoreImpact": 0.5
  }
}
```

## Usage Examples

### Apply Scoring via API

```javascript
// Boost/bury products by ID
await fetch('/api/scoring/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    products: [
      {
        objectId: 'id_1',
        score: 2.5,
        reason: 'high margin product'
      }
    ]
  })
});

// Boost/bury products by attribute
await fetch('/api/scoring/attributes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    attribute: 'brand',
    value: 'BrandX',
    score: 1.8,
    condition: 'price > 100',
    reason: 'premium products'
  })
});
```

## Best Practices

1. Use consistent scoring ranges (e.g., -5.0 to +5.0)
2. Document reasons for all scoring adjustments
3. Set expiration dates for temporary boosts/buries
4. Regularly review and update scoring rules
5. Monitor the impact on search result quality
6. Use attribute-based scoring for systematic adjustments
7. Use ID-based scoring for specific product adjustments
8. Consider the compound effect of multiple rules

## Error Handling

```javascript
const errorResponses = {
  INVALID_SCORE: {
    code: 'INVALID_SCORE',
    message: 'Score must be between -5.0 and +5.0'
  },
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
  SCORE_CONFLICT: {
    code: 'SCORE_CONFLICT',
    message: 'Conflicting scoring rules detected'
  }
};
```

## Automated Tasks

```javascript
// Scheduled job to manage scoring rules
async function manageScoringRules() {
  // Remove expired rules
  await removeExpiredRules();
  
  // Detect and log conflicting rules
  await detectConflicts();
  
  // Generate impact report
  await generateImpactReport();
}

// Impact analysis
async function analyzeScoreImpact() {
  // Calculate average position changes
  // Monitor conversion rates
  // Track revenue impact
  // Generate recommendations
}
```