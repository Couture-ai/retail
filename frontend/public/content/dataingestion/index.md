# Current Schema

```python
point_id = Column(String)
sku_id_internal = Column(Integer)
sku_id = Column(String, primary_key=True)
product_option_id = Column(String)
product_name = Column(String)
product_description = Column(String)
medias = Column(types.Map(String, String))
url_slug = Column(String)
popularity_score = Column(Float)
average_rating = Column(Float)
avg_selling_price = Column(Float)
avg_discount_pct = Column(Float)
avg_mrp = Column(Float)
avg_discount_rate = Column(Float)
avg_discount = Column(Float)
number_of_user_ratings = Column(Integer)
promotions = Column(ARRAY(String))
tags = Column(ARRAY(String))
payment_tags = Column(ARRAY(String))
is_available = Column(Integer)
product_theme = Column(String)

l0 = Column(ARRAY(String))
l1 = Column(ARRAY(String))
l2 = Column(ARRAY(String))
l3 = Column(ARRAY(String))
l4 = Column(ARRAY(String))

tags = Column(ARRAY(String))
promotions = Column(ARRAY(String))
applicable_stores = Column(ARRAY(String))
brand_name = Column(String)
color = Column(String)

l1l2l4_category = Column(ARRAY(String))
l1l2l3_category = Column(ARRAY(String))

mart_availability = Column(String)
vertical_code = Column(String)

inventory_stores = Column(ARRAY(String))
inventory_stores_3p = Column(ARRAY(String))

discount = Column(Float)
price_range = Column(Float)
price = Column(String)
variants = Column(String)

# New Entries:
transition_event = Column(String)
```

## Inventory

### In the Dump File:

```json
{
  "tenantId": "JioMart",
  "sku_id": "606721409",
  "sku_id_internal": 494260170,
  "transition_event": "in-stock",
  "applicable_Stores": [
    {
      "inventory_stores": ["TOD0", "TV14", "TV13", "TV12"],
      "inventory_stores_3p": ["ggeneral_zone"]
    }
  ]
}
```

### Expected Input to the API:

```json
[
  {
    "sku_id": "606721409",
    "transition_event": "in-stock",
    "inventory_stores": ["TOD0", "TV14", "TV13", "TV12"],
    "inventory_stores_3p": ["ggeneral_zone"]
  }
]
```

### Mapping to SQL:

```text
"sku_id": "sku_id",
"transition_event": "transition_event",
"inventory_stores": "inventory_stores",
"inventory_stores_3p": "inventory_stores_3p"
```

### Note:

All required fields except `transition_event` are currently used by the JioMart API. The schema needs to be edited to consume this field.

## Variants

### In the Dump File:

```json
[{ "json": "value" }]
```

### Expected Input to the API:

```json
[
  {
    "sku_id": "606721409",
    "variants": [{}, {}]
  }
]
```

### Mapping to SQL:

```text
"sku_id": "sku_id",
"variants": json.dumps(variants)
```

### Note:

Variants are stored as a string after JSON dumping since it's assumed that the entire field will always be passed as a whole.

## Price

### In the Dump File:

```json
{
  "sku_id": 606721409,
  "sku_id_internal": 606721409,
  "avg_selling_price": 69.9,
  "avg_discount_pct": 0.1359223300970874,
  "price_range": "0-1000",
  "avg_mrp": 70,
  "avg_discount_rate": 0,
  "avg_discount": 0.09,
  "price": [
    {
      "weight_range": null,
      "max_qty_in_order": 2,
      "seller_id": 1,
      "seller_name": "Reliance Retail",
      "max_exchange_amount": null,
      "tag": null,
      "is_sellable": true,
      "mrp": 70,
      "channelType": "ALL",
      "dealPrice": null,
      "message": null,
      "dealType": null,
      "discountPercentage": 0,
      "isDealEnabled": false,
      "dealPercentage": 0,
      "discountType": "percentage",
      "dealCode": null,
      "discountValue": 0,
      "listPrice": 70,
      "timestamp": 12344558,
      "applicable_regions": ["2051"]
    }
  ]
}
```

### Expected Input to the API:

```json
[
  {
    "sku_id": 606721409,
    "avg_selling_price": 69.9,
    "avg_discount_pct": 0.1359223300970874,
    "price_range": "0-1000",
    "avg_mrp": 70,
    "avg_discount_rate": 0,
    "avg_discount": 0.09,
    "price": [
      {
        "weight_range": null,
        "max_qty_in_order": 2,
        "seller_id": 1,
        "seller_name": "Reliance Retail",
        "max_exchange_amount": null,
        "tag": null,
        "is_sellable": true,
        "mrp": 70,
        "channelType": "ALL",
        "dealPrice": null,
        "message": null,
        "dealType": null,
        "discountPercentage": 0,
        "isDealEnabled": false,
        "dealPercentage": 0,
        "discountType": "percentage",
        "dealCode": null,
        "discountValue": 0,
        "listPrice": 70,
        "timestamp": 12344558,
        "applicable_regions": ["2051"]
      }
    ]
  }
]
```

### Mapping to SQL:

```text
"sku_id": sku_id,
"avg_selling_price": avg_selling_price,
"avg_discount_pct": avg_discount_pct,
"price_range": price_range,
"avg_mrp": avg_mrp,
"avg_discount_rate": avg_discount_rate,
"avg_discount": avg_discount,
"price": price[0].listPrice
```

### Note:

The price type needs to be changed to a string in the schema. This cannot go with the current API design. Clarification is needed on whether the `price` field will be used for filtering and the main price field for applying filters.

## Popularity Scores

### In the Dump File:

```json
{
  "sku_id": "606721409",
  "sku_id_internal": 494260170,
  "gpr_score": 99999,
  "relevancyScores": []
}
```

### Expected Input to the API:

```json
[
  {
    "sku_id": "606721409",
    "gpr_score": 99999
  }
]
```

### Mapping to SQL:

```text
"sku_id": "sku-id",
"popularity_score": gpr_score
```

### Note:

Unclear how to consume `relevancyScores` or use it.

## Catalog

Everything in the above schema can be updated. The code will expect a list of the above schema with the same field names. Type conversion will be handled, and a Pydantic object will validate structured fields like `price` fully.

## Promotions

### No Change

### Expected Input:

```json
[
  {
    "sku_id": "String",
    "applicable_tags": ["List[str]"],
    "applicable_promotions": ["List[str]"]
  }
]
```

### Mapping to SQL:

```text
"sku_id": "sku_id",
"applicable_tags": "tags",
"applicable_promotions": "promotions"
```
