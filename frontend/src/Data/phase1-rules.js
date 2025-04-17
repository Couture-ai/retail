const data = {
  'Phrase Key Replacement': {
    description: 'Replace the key of a phrase with a new key',
    columns: {
      'old phrase': {
        type: 'string'
      },
      'new phrase': {
        type: 'string'
      }
    },
    data: [
      {
        'old phrase': 'onepiece',
        'new phrase': 'dresses'
      },
      {
        'old phrase': 'one piece',
        'new phrase': 'dresses'
      }
    ]
  },
  'Drop Tokens': {
    description: 'Drop tokens from a phrase',
    columns: {
      token: {
        type: 'string'
      }
    },
    data: [
      {
        token: 'underwear'
      },
      {
        token: 'boys'
      },
      {
        token: 'kids'
      }
    ]
  },
  'Token Groups': {
    description: 'Group tokens together',
    columns: {
      tokens: {
        type: 'string[]'
      },
      'final phrase keys': {
        type: 'string[]'
      },
      'final phrase': {
        type: 'string'
      },
      iscategory: {
        type: 'boolean'
      }
    },
    data: [
      {
        tokens: ['onepiece', 'one piece'],
        'final phrase keys': ['dresses'],
        'final phrase': 'dresses',
        iscategory: true
      },
      {
        tokens: ['underwear'],
        'final phrase keys': ['underwear'],
        'final phrase': 'underwear',
        iscategory: true
      }
    ]
  },
  'Add Categories': {
    description: 'Add categories to a phrase',
    columns: {
      token: {
        type: 'string'
      },
      category: {
        type: 'string'
      },
      categories: {
        type: '(float, string)[]'
      }
    },
    data: [
      {
        token: 'decor',
        category: 'l1l2',
        categories: [
          [0.5, 'Home & Kitchen - Decor & Gifting'],
          [0.5, 'Home & Kitchen - Decor & Gifting - Decor'],
          [0.5, 'Home & Kitchen - Decor & Gifting - Decor'],
          [0.5, 'Home & Kitchen - Decor & Gifting - Decor']
        ]
      },
      {
        token: 'light',
        category: 'l1l3',
        categories: [[0.5, 'Home & Kitchen - lighting']]
      }
    ]
  },
  'Replace Categories': {
    description: 'Add categories to a phrase',
    columns: {
      token: {
        type: 'string'
      },
      category: {
        type: 'string'
      },
      categories: {
        type: '(float, string)[]'
      }
    },
    data: [
      {
        token: 'decor',
        category: 'l1l2',
        categories: [
          [0.5, 'Home & Kitchen - Decor & Gifting'],
          [0.5, 'Home & Kitchen - Decor & Gifting - Decor']
        ]
      },
      {
        token: 'light',
        category: 'l1l3',
        categories: [[0.5, 'Home & Kitchen - lighting']]
      }
    ]
  },
  'Drop Categories': {
    description: 'Add categories to a phrase',
    columns: {
      token: {
        type: 'string'
      },
      category: {
        type: 'string'
      },
      categories: {
        type: 'string[]|string'
      }
    },
    data: [
      {
        token: 'shirts',
        category: 'l1l3',
        categories: ['Women - Tshirts', 'Women - Tshirt - Casual']
      },
      {
        token: 'tshirts',
        category: 'l1l3',
        categories: 'Women - Tshirts'
      }
    ]
  },
  'Word Mappings': {
    description: 'Add categories to a phrase',
    columns: {
      from: {
        type: 'string'
      },
      type: {
        type: 'string'
      },
      to: {
        type: 'string'
      }
    },
    data: [
      {
        from: 'sling',
        type: 'rightword',
        to: 'slings'
      }
    ]
  }
};
export default data;

/* 
'malenia' : string
('malenia') : (string)
['malenia;,'john'] : string[]
['malenia', 2.0 ] : (float|string)[]
('malenia',2.0) : (string,float)
[('malenia',2.0),('john',3.0)] : (string,float)[]
(['malenia', 'john'],2.0) : (string[],float)


//options and range
'malenia'/'john' : string{malenia,john}
(1.0,2.0): (float{[0,10]}, float{[0,10]})
(1,2.0)  :    {int{[0,10,2]}, float{[0,10,int,2]}}

data types allowed: float, int, tuple, string and list







*/
