// {BASE_URL}/bestsellerproducts?page=1&pageSize=20&gender=male&category=all&fashiongrade=core&brand=megainfluencer&storeCohort=somevalue&price=&state=s1&geography=g1&city=c1&pinCode=10222&attrKey=fabric&attrValue=cottonblend&trend=fashonableTop&sort=ros&sortOrder=asc

const queryParameters = {
  page: 1,
  page_size: 20,
  gender: 'male', // 'male','female', ''
  category: '', 
  brandname: '', 
  fashion_grade: 'core', 
  zone: '',
  state: '',
  city: '',
  pincode: '',
  min_mrp: '1000',
  max_mrp: '3000',
  attribute_key: 'fabric',
  attribute_value: 'cottonblend',
  sort_attribute: 'ros',
  sort_order: 'asc' // 'asc' or 'desc'
};
const response = 
[
  {
    item_id: 1,
    title: 'Wide Joggers',
    brand_name: 'gap',
    mrp: 499.99,
    ajio_weekly_ros: '75%',
    trends_weekly_ros: '75%',
    image_url: 'https://image_url'
  },
  {
    item_id: 2,
    title: 'Wide Joggers',
    brand_name: 'gap',
    mrp: 499.99,
    ajio_weekly_ros: '75%',
    trends_weekly_ros: '75%',
    image_url: 'https://image_url'
  }
];
const queryParameters2 = 
{
  gender: 'male' // 'male','female', ''
};
const response2 = [
  {
    id: 1,
    category: 'Topwear',
    gender: 'male',
    image_url: 'https://image_url'
  },
  {
    id: 2,
    category: 'Dress',
    gender: 'female',
    image_url: 'https://image_url'
  }
];

const queryParameters3 = {
  page: 1,
  page_size: 20,
  category: 'Topwear',
  attribute: 'fabric' // 'specific' or ['all' or '' for all]
};
const response3 = 
[
  {
    attribute: 'FABRIC',
    values: [
      {
        id: 1,
        name: '100% Cotton',
        current_sales: 100,
        previous_sales: 80,
        precentage_change: 20,
        image_url: 'https://image_url'
      },
      {
        id: 2,
        name: 'Cotton Blend',
        current_sales: 100,
        previous_sales: 80,
        precentage_change: 20,
        image_url: 'https://image_url'
      }
    ]
  }
];

// {BASE_URL}/bestsellers/mostsearchedtrends?page=1&pageSize=5&time="last30days"&category="jeans"&bricks="allbricks"&city="allcity"&state="allstate"

const queryParameters4 = 
{
  page: 1,
  page_size: 5,
  num_days: 30, // in last X days
  category: 'jeans',
  brick: '', 
  city: '', 
  state: '',
  zone: '' 
};

const response4 = [
  {
    id: '1',
    name: 'Silver Maxi Dress',
    last_searched_timestamp: 2, // hours
    search_distribution: {
      divisions: 12,
      data: [12, 23, 23, 23, 45, 45, 44, 34, 2, 445, 34, 34]
    }, // details required
    total_searches: 2000
  },
  {
    id: '2',
    name: 'Black Mini Dress',
    last_searched_timestamp: 2,
    search_distribution: {
      divisions: 12,
      data: [12, 23, 23, 23, 45, 45, 44, 34, 2, 445, 34, 34]
    },
    total_searches: 2000
  }
  // Add more items as needed
];

const response5 = 
[
  {
    attribute: 'COLOR',
    distribution: [
      { name: 'Pistachio', percentage: 10 },
      { name: 'Powder blue', percentage: 20 }
    ]
  },
  {
    attribute: 'PATTERN',
    distribution: [
      { name: 'Draping', percentage: 10 },
      { name: 'Workwea', percentage: 20 }
    ]
  }
];
