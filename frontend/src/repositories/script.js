// Headers for the CSV file
const headers = ['name', 'searchable', 'facetable', 'filterable', 'fetchable', 'data_type'];

// Define key attributes
const keyAttributes = [
  {
    name: 'ageing_double',
    searchable: false,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'allPromotions_string_mv',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'averageRating_double',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'brandName_text_en_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'text_en_mv'
  },
  {
    name: 'brandtype_en_string_mv',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'brandtype_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'brickprimarycolor_en_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'brickstyletype_en_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'catalogCommercialType_string',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'catalogId',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'category_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'code_string',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'colorGroup_string',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'commercialType_string',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'creationtime_date',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'date'
  },
  {
    name: 'discountType_string',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'dod_enabled_int',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'int'
  },
  {
    name: 'dod_price_inr_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'dohL30_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'earlyAccessPrice_float',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'float'
  },
  {
    name: 'exactdiscount_int',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'int'
  },
  {
    name: 'exclusiveTill_date',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'date'
  },
  {
    name: 'extraImages_string_mv',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'futureDiscountPercentage_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'futureListPrice_inr_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'golivedays_int',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'int'
  },
  {
    name: 'id',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'img-174Wx218H_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'img-286Wx359H_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'img-288Wx360H_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'img-473Wx593H_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'img-thumbNail_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'inStockCount_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'inStockFlag_boolean',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'boolean'
  },
  {
    name: 'inTakeMarginPerc_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'isCodDisabled_boolean',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'boolean'
  },
  {
    name: 'l1category_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'l1l2category_en_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'l1l3category_en_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'l2category_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'l3category_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'mrp_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'name_text_en',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'text_en'
  },
  {
    name: 'netDohL30_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'netRosL30_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'numUserRatings_int',
    searchable: false,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'int'
  },
  {
    name: 'outfitPicture_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'planningCategory_text_en',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'text_en'
  },
  {
    name: 'priceValue_inr_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'price_inr_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'primaryPromotionCode_string',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'productToggleOn_string',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'rosL30_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'seasonCodeYear_string',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'segmentProductTagValidity_date',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'date'
  },
  {
    name: 'segmentProductTag_string',
    searchable: true,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'sizeData_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  },
  {
    name: 'size_en_string',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'tradeDiscountedValue_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'url_en_string',
    searchable: false,
    facetable: false,
    filterable: false,
    fetchable: true,
    data_type: 'string'
  },
  {
    name: 'wasPrice_double',
    searchable: false,
    facetable: false,
    filterable: true,
    fetchable: true,
    data_type: 'double'
  },
  {
    name: 'webcategory_string_mv',
    searchable: true,
    facetable: true,
    filterable: true,
    fetchable: true,
    data_type: 'string_mv'
  }
];

// Convert to CSV format
const csvRows = [headers.join(',')];
keyAttributes.forEach((attr) => {
  csvRows.push(
    [
      attr.name,
      attr.searchable,
      attr.facetable,
      attr.filterable,
      attr.fetchable,
      attr.data_type
    ].join(',')
  );
});

// Output the CSV
const fs = require('fs');
fs.writeFileSync('keys_metadata.csv', csvRows.join('\n'));
console.log('CSV file created successfully: keys_metadata.csv');
