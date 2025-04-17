import axios from 'axios';
const _applicable_regions = [
  'TNA7',
  'TND3',
  'U2I4',
  'TNJ2',
  'U3PT',
  '3338',
  'U2RN',
  '6224',
  '6701',
  'TXX8',
  'U1RU',
  'U1GA',
  'TIZ4',
  'TNJ1',
  'TPM4',
  'U27I',
  '6220',
  'TDC1',
  'U1QS',
  'TNA9',
  'U509',
  'T1IP',
  'U3AU',
  '6217',
  'U681',
  '6206',
  'FR45',
  'TXPO',
  'TS34',
  'U651',
  'FRGK',
  'TQ58',
  'TT57',
  'U1QQ',
  '3201',
  'TXCK',
  'U1C7',
  'U2UN',
  'TVD7',
  'TNC7',
  'TJJ4',
  'TE39',
  'FRFH',
  'TXCF',
  'PANINDIADIGITAL',
  'U2ZG',
  'TNM2',
  'TXCJ',
  'FRGS',
  'TNB8',
  '6722',
  'TOJ7',
  'U1RB',
  'PANINDIAHOMEANDKITCHEN',
  'U2ZV',
  '2164',
  'TV26',
  'TXY2',
  'U629',
  '2852',
  '6205',
  'TG87',
  '2933',
  'PANINDIAWELLNESS',
  'TP76',
  'U2E6',
  'TNJ0',
  '6243',
  'TUM6',
  'TC95',
  '6203',
  'TA9N',
  'U1QR',
  'FR71',
  'U831',
  'DSVS33',
  'U22T',
  'T12D',
  'TAC1',
  '6703',
  'FRGA',
  '6219',
  'TNE2',
  'TFD6',
  'TB23',
  'TNC1',
  'U1IJ',
  'FR98',
  'TNA8',
  'U267',
  '6202',
  'TNC4',
  'TFP8',
  'TDB7',
  'FRGH',
  'TH91',
  'FRAU',
  'TI76',
  'U495',
  'TXPN',
  'TND1',
  '6723',
  'TNC6',
  'TNC8',
  'TMZ5',
  'TZ20',
  'TCD6',
  'PANINDIAGROCERIES',
  'TND0',
  'U22S',
  'TW11',
  'U1ZR',
  'U1DA',
  'F1BB',
  'FRFK',
  'TXOR',
  'TNC2',
  'TND4',
  'T917',
  'TOG2',
  'TK48',
  'U907',
  'U3VI',
  'U1YZ',
  'U708',
  'TA35',
  'U3IY',
  'TNE3',
  'U271',
  'TLI7',
  'TUI2',
  'TUB4',
  '2051',
  'TZ5V',
  'FRGW',
  'TIX7',
  'TR86',
  'FR79',
  'U3JA',
  '6704',
  'U2WT',
  'FR23',
  'TND7',
  'U588',
  'TXUL',
  'FR52',
  'TO20',
  'TLI2',
  'FR74',
  'TDB2',
  'U1P7',
  'U2SZ',
  'TCE7'
];
class SearchRepository {
  // write a init method
  constructor(baseURL,key) {
    this.baseURL = baseURL;
    this.key = key;
  }

  async fetchSearchResults({ stateSetters, data }) {
    const { query, page, pincode, disableRules, applicable_regions, state_code, city } = data;
    const { setData, setLoading, setError } = stateSetters;
    const config = {
      url: `${this.baseURL}`,
      method: 'POST',
      headers: {
        'api-key': this.key
      },
      data: {
        query,
        store: 'rilfnl',
        page_number: page,
        records_per_page: 12,
        filters: [
          {
            fieldName: 'applicable_regions',
            values:
              applicable_regions.filter((e) => e != '').length == 0
                ? _applicable_regions
                : applicable_regions.filter((e) => e != '')
          }
        ],
        pincode,
        state_code,
        city,
        disable_rules: disableRules
      }
    };
    setLoading(true);
    try {
      const response = await axios(config);
      setData(response.data);
      setLoading(false);

      return response.data;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  }
}

export default SearchRepository;
