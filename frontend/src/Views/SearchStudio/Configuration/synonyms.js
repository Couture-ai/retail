const synonyms = [
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '50inch',
    synonyms: '50 inch'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: '',
    synonyms: 'lcd tv|led tv'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'fast charger|turbo charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'AC Adaptor',
    synonyms: 'AC Adapter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'turbo charging',
    synonyms: 'turbo charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'fast charging',
    synonyms: 'fast charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'fhone',
    synonyms: 'phone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'fone',
    synonyms: 'phone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'phne',
    synonyms: 'phone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'phine',
    synonyms: 'phone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'फोन',
    synonyms: 'phone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्मार्टफोन',
    synonyms: 'smartphone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मोबाइल',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मोबाईल',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smartphine',
    synonyms: 'smartphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'samartphone',
    synonyms: 'smartphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smartphones',
    synonyms: 'smartphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smart phone',
    synonyms: 'smartphone'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'mobile|phone|smartphone|mobile phone'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'mobile charger|adapter|AC Adapter|charger|AC power adapter|plug adapter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mag safe',
    synonyms: 'magsafe'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'magsafe|magnetic charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '20000mAh',
    synonyms: '20000 mAh'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '20kmAh',
    synonyms: '20k mAh'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '20000 mAh|20k mAh'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10000mAh',
    synonyms: '10000 mAh'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10kmAh',
    synonyms: '10k mAh'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '10k mAh|10000 mAh'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'powerbank',
    synonyms: 'power bank'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'power bank|recharger|portable charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Jio Dive',
    synonyms: 'JioDive'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: '',
    synonyms: 'Google Cardboard|VR Headset|okter|Daydream|oculus|quest|rift|JioDive'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'VR|Virtual Reality'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'tile',
    synonyms: 'Smart Tags'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: '25 W',
    synonyms: '25 Watt'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: '25W',
    synonyms: '25 Watt'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'steam iron|steam iron for cloths'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jamini oil',
    synonyms: 'Gemini Oil'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'samsung',
    synonyms: 'samsung original'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'headphone',
    synonyms: 'headphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'headset',
    synonyms: 'headsets'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'head set',
    synonyms: 'headsets'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'headphones|headsets'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: '',
    synonyms: 'earbuds|headphones|headsets'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'matic liquid',
    synonyms: 'matic front load liquid|matic top load liquid'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'shower gel|body wash|body & shower wash|body & shower gel|shower gel & body wash|bath & shower cream wash'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'backpack',
    synonyms: 'bag'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'spining',
    synonyms: 'spinning'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'lattu',
    synonyms: 'spinning top'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'carromboard',
    synonyms: 'carrom board'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'carrom board|carrom'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'futball',
    synonyms: 'football'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'foot ball',
    synonyms: 'football'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'football'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Chyavanprasha',
    synonyms: 'Chyawanprash'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Arandi ka tel',
    synonyms: 'castor oil'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kagaz ki katori',
    synonyms: 'paper bowl'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kagaz ke glass',
    synonyms: 'paper glass'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kagaz ki plate',
    synonyms: 'paper plate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'leggins',
    synonyms: 'leggings'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'legging',
    synonyms: 'leggings'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'leggings|stretchable leggings'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hankerchief',
    synonyms: 'handkerchief'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hankerchif',
    synonyms: 'handkerchief'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'rumal',
    synonyms: 'rumaal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'rumaal',
    synonyms: 'handkerchief'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Chapal',
    synonyms: 'chappal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chappal',
    synonyms: 'slipper'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wild berry',
    synonyms: 'wildberry'
  },
  {
    type: 'synonym',
    variant: 'UK TO US',
    keyword: 'flavoured',
    synonyms: 'flavored'
  },
  {
    type: 'synonym',
    variant: 'UK TO US',
    keyword: 'flavour',
    synonyms: 'flavor'
  },
  {
    type: 'synonym',
    variant: 'STEM VARIANT',
    keyword: 'flavor',
    synonyms: 'flavored'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'fresh milk',
    synonyms: 'pouch milk|pasteurized'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'tedhe medhe|bingo'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Khumb|kukurmuta|kathfula|Masaruma|Anabe|koon|aalambe|musa|Khubha|Kalan|Puttagodugu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Khumb',
    synonyms: 'mushroom'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mashroom',
    synonyms: 'mushroom'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'zeera',
    synonyms: 'jeera'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jira',
    synonyms: 'jeera'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'jeera',
    synonyms: 'cumin'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'fair n lovely|glow n lovely|fair & lovely|glow & lovely'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ponds',
    synonyms: "pond's"
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'battery|cell|battery cell|cell battery'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mom color',
    synonyms: 'crayons'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Gudiya',
    synonyms: 'doll'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'parda',
    synonyms: 'curtain'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mazza',
    synonyms: 'maaza'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'navratan',
    synonyms: 'navratna'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'balti',
    synonyms: 'bucket'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stik',
    synonyms: 'stick'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'phynyl',
    synonyms: 'phenyl'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'phenyl|bathroom cleaner|toilet cleaner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'all out',
    synonyms: 'allout'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'haath ke moje',
    synonyms: 'arm sleeves'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stiki',
    synonyms: 'sticky'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'steeky',
    synonyms: 'sticky'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'disposable bag|garbage bag'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'belan',
    synonyms: 'Rolling pin'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'pattal',
    synonyms: 'leaf plate'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chamcha',
    synonyms: 'ladle'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'chimta|pakkad'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Stove|Cooktop'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chhilni',
    synonyms: 'peeler'
  },
  {
    type: 'synonym',
    variant: 'UK TO US',
    keyword: 'Organiser',
    synonyms: 'Organizer'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chakki',
    synonyms: 'flour mill'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'mill|flour mill'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'matka',
    synonyms: 'pot'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'bubble sheet',
    synonyms: 'bubble wrap'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'thumps up',
    synonyms: 'thums up'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'butter milk',
    synonyms: 'buttermilk'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chhaas',
    synonyms: 'chaas'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chhas',
    synonyms: 'chaas'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chaach',
    synonyms: 'chaas'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chach',
    synonyms: 'chaas'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chanch',
    synonyms: 'chaanch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chaas',
    synonyms: 'buttermilk'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'chaas|chaanch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bombino',
    synonyms: 'bambino'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'ice tray|iceberg tray|ice cube tray'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Chopping Board|Cutting Board|Chop Board'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Chopping|Chopper|chop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chakku',
    synonyms: 'chaku'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chaku',
    synonyms: 'knife'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Frypan',
    synonyms: 'Fry pan'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Frying pan'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Fry|Frying'
  },
  {
    type: 'synonym',
    variant: 'UK TO US',
    keyword: 'Anodised',
    synonyms: 'Anodized'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'non stick',
    synonyms: 'non-stick'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kadai',
    synonyms: 'kadhai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Ghoda',
    synonyms: 'horse rocker'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'horse toys|horse rocker'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'jhunjhuna',
    synonyms: 'rattle'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'rattle',
    synonyms: 'infant toys'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'creame',
    synonyms: 'cream'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ceral',
    synonyms: 'cereal'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cerel',
    synonyms: 'cereal'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'arial',
    synonyms: 'Ariel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'maza',
    synonyms: 'maaza'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'patla|plastic patla'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'fortune atta',
    synonyms: 'atta'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'dahi',
    synonyms: 'curd'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'pure & tender bathing bar|aqua fresh bathing bar|glycerine soap'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'safelife',
    synonyms: 'safe life'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'lux rose|lux pink'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'coffe',
    synonyms: 'coffee'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'coffeee',
    synonyms: 'coffee'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'moti',
    synonyms: 'beads'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bead',
    synonyms: 'beads'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'scrubber|scrub'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'washing liquid|liquid detergent|detergent liquid'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1kg',
    synonyms: '1 kg'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'vegetables|veggies'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'close up',
    synonyms: 'closeup'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'diya|deep'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'karpoor',
    synonyms: 'kapoor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kapur',
    synonyms: 'kapoor'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kapoor',
    synonyms: 'camphor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'baati',
    synonyms: 'batti'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'batti',
    synonyms: 'wicks'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'car freshener|car fragrance|car perfume'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'air freshener|room freshener|room fragrance'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'utencil',
    synonyms: 'utensil'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'dishwash gel|utensil gel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dish wash',
    synonyms: 'Dishwash'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dish washer',
    synonyms: 'dishwasher'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Dishwash|dishwasher|dish washing'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'detergent powder|laundry powder|washing powder'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'detergent bar|detergent cake|detergent soap|washing soap|laundry bar|laundry cake|laundry soap|washing bar|washing cake'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dust bin',
    synonyms: 'dustbin'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'dustbin|trash can|garbage bin|waste bin|waste basket|waste bucket|garbage bucket|garbage basket|garbage container|garbage'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'soapcase',
    synonyms: 'soap case'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'soap case|soap box|soap dish'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'thali',
    synonyms: 'plate'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'lota|Kalash'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'taulia',
    synonyms: 'towel'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'microfiber|microfiber cloth'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'dholak',
    synonyms: 'drum'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'paaydaan',
    synonyms: 'paidaan'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'paidan',
    synonyms: 'paidaan'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'paidaan',
    synonyms: 'doormat'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'foot mat|doormat'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'canvas|canvas board'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Pathar ka mandir',
    synonyms: 'stone temple'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'oil pastels|oil color'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sui dhaga',
    synonyms: 'sui dhaaga'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'asian paint brush|wall paint brush|paint brush'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kursi',
    synonyms: 'chair'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'mop|mopping|floor mopping'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mandir',
    synonyms: 'temple'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Lakdi ka mandir',
    synonyms: 'wooden temple'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'sui dhaaga',
    synonyms: 'sewing kit'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'tala',
    synonyms: 'lock'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'locks',
    synonyms: 'lock'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'lock|lock and key'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mombatti',
    synonyms: 'candles'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'candle',
    synonyms: 'candles'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'nail polish|nail paint|nail color|nail trend|nail enamel'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'foot cream|heel cream'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'dari|chatai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'dari',
    synonyms: 'carpet'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'carpet'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Fairness Cream|Face Cream|Radiance Cream'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Body Lotion|Body Butter|Body Milk|Body Cream|Lotion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Sun Screen',
    synonyms: 'Sunscreen'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Sunscreen|Sunscreen Lotion|SPF|Sun Block'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Talcum Powder|Talc'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Tooth Paste',
    synonyms: 'Toothpaste'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Tooth Brush',
    synonyms: 'Toothbrush'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Shave|Shaving'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'daadhi',
    synonyms: 'beard'
  },
  {
    type: 'synonym',
    variant: 'UK TO US',
    keyword: 'Colour',
    synonyms: 'Color'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Eye Liner',
    synonyms: 'Eyeliner'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Cold Relief Balm|Cold Balm'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Antiseptic Disinfectant Liquid|Antiseptic Liquid|Disinfectant Liquid'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Adult Diaper|Absord Pants|Adult Diaper Pants'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'parachute',
    synonyms: 'coconut hair oil|coconut oil'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Hair Cream|Hair Gel|Leave In Cream|Hair Fixing Spray|Hair Fixer'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'Tampon',
    synonyms: 'Sanitary Napkins|Sanitary Pads'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Sanitary Pads|Sanitary Napkins'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Urination Funnel|Urination Device'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Intimate Hygiene Wipes|Intimate Wipes'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Intimate Hygiene Wash|Intimate Cleansing Foam Wash|Feminine Wash|Intimate wash'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'Blade',
    synonyms: 'Cartridges'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'perfume|Eau De Perfume |EDP|Eau De Parfum|Eau De Toilette|EDT|Body Parfum|Cologne|Cologne Spray'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'Deodrant|Deo|Deodorizer|Deo Spray|Deo Body Spray|Body Deodrant|Deodrant Spray|eau fraiche'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Fragerant',
    synonyms: 'Fragrant'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Body Mist|Body Splash|Fragrance Mist|Fragrant Body Mist'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bodywash',
    synonyms: 'Body Wash'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Shower Gel|Shower Wash|Body Wash'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Handwash',
    synonyms: 'Hand Wash'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bath sop',
    synonyms: 'bath soap'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Bath Soap|Bathing Soap|Bathing Bar'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Shower Oil|Bath Oil'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kangha',
    synonyms: 'comb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'moje',
    synonyms: 'socks'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chasma',
    synonyms: 'sunglasses'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kanan',
    synonyms: 'kannan'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'rice|rice bag|rice bags'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'aluminium ladder',
    synonyms: 'ladder'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'adaptor',
    synonyms: 'adapter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'adeptor',
    synonyms: 'adapter'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'extension|extension box|extension board|extension cord|power strip|powerstrip|cord'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'redbull',
    synonyms: 'red bull'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mungfali',
    synonyms: 'mumfali'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mumfali',
    synonyms: 'peanuts'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'patti',
    synonyms: 'leaves'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'fruit cake',
    synonyms: 'cake'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'avocado|butter fruit'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'avacado',
    synonyms: 'avocado'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'makhan phal|benne hannu|avaiakkada'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'makhan phal',
    synonyms: 'avocado'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'detol',
    synonyms: 'dettol'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chawal',
    synonyms: 'rice'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mozarella',
    synonyms: 'mozzarella'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tamato',
    synonyms: 'tomato'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'pudding',
    synonyms: 'pudding mix'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'panner',
    synonyms: 'paneer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'panneer',
    synonyms: 'paneer'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'paltaa',
    synonyms: 'spatula'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ketali',
    synonyms: 'ketli'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'ketli',
    synonyms: 'kettle'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bhaarat',
    synonyms: 'bharat'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bharath',
    synonyms: 'bharat'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'freshner',
    synonyms: 'freshener'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mung',
    synonyms: 'moong'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'makki',
    synonyms: 'maize'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'jardalu|khubani'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'jardalu',
    synonyms: 'apricot'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'whole apricot',
    synonyms: 'apricot'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'tangerine',
    synonyms: 'orange'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'pudina|podina|pudino|puthina|Putina'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pudhina',
    synonyms: 'pudina'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'pudina',
    synonyms: 'mint leaves'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'akrot',
    synonyms: 'akhrot'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'akhrot',
    synonyms: 'walnut'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dryfruit',
    synonyms: 'dry fruit'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'walnut|walnut dry fruit'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kit kat',
    synonyms: 'kitkat'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'cooking oil|oil cooking|edible oil'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'magie',
    synonyms: 'maggi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'maggie',
    synonyms: 'maggi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'baigan|baingan|begun|vankaya|Bengena|Ringan|badanek ayi|Vazhuthananga|vangi|baigana|wambatu|kathri kai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'baingan',
    synonyms: 'Brinjal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'jimikand|suvarna gadde|senai kizhangu|kanda gadda|karunai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'jimikand',
    synonyms: 'yam'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'coco cola',
    synonyms: 'Coca Cola'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tamataar',
    synonyms: 'tamatar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tometo',
    synonyms: 'tomato'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'bilahi|tamatar|taameta|thakkaalli|bilati baigana|thakkali|thakkaali|Raamamulaga kaaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'tamatar',
    synonyms: 'tomato'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'oil 15 kg|oil 15 liter|oil 15 L|oil 15 litre'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vegitable',
    synonyms: 'vegetables'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vegitables',
    synonyms: 'vegetables'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'vegetables in fresh|vegetables'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'water bottle|packaged water'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'anar|dalim|dadam|dalimbe|maathalanaarakam|dallimba|Matulai|Danima'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'anar',
    synonyms: 'pomegranate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pomogranate',
    synonyms: 'pomegranate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cleaners',
    synonyms: 'cleaner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'udad',
    synonyms: 'urad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tur',
    synonyms: 'toor'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'toor|arhar'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'stove|burner'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'imli|teteli|tetul|aambli|hunase hannu|valanpuli|puli|chincha|tentuli|siyambala|chinta pandu'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'imlee',
    synonyms: 'imli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'eemli',
    synonyms: 'imli'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'imli',
    synonyms: 'tamarind'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'hari mirch|kancha lonka|lila marcha|hasi menasu|hirvi mirchi|kancha lanka|Padhai milagai|pacchi mirpakaya|green mirchi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'hari mirch',
    synonyms: 'Green chilli'
  },
  {
    type: 'onewaysynonym',
    variant: 'SYNONYMS',
    keyword: 'beans',
    synonyms: 'cluster bean|French bean|Cowpea beans'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'phaliyan',
    synonyms: 'beans'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'gwar phali|gaur phali|barbati|borboti|guvar|huruli kayi|shravvan ghevada|kothavarangai|goru chikkudu kaya|matti kaya|bahuruli kayi|shravvan ghevada'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'gwar phali',
    synonyms: 'cluster bean'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'bhindi|bhendi|dherosh|bhinda|bende kayi|vendakka|bandakka|vendaikaai|benda kaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'bhindi',
    synonyms: 'okra'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'arabi|kochu|alavi|pattarveliya|kesuvinagadde|chembu|arvi|arbi|saru|seppan kizhangu|chaama gadda'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'arbi',
    synonyms: 'colocasia'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'soyabin',
    synonyms: 'soyabean'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'cigarette',
    synonyms: 'Nicotex|Nicotene|Nicotine'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'lauki|dudhi|soray kayi|churakkai|churaykka|dudhi bhopala|ghisya|diya labu|surai kai|sorakaaya'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lau',
    synonyms: 'lauki'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'loki',
    synonyms: 'lauki'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'louki',
    synonyms: 'lauki'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'lauki',
    synonyms: 'bottle gourd'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'karela|korola|uchchhey|kaarela|hagalak ayi|kaipakka|pavakka|karle|kalara|karawi|pavai kai|paaharkai|kakara kaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'karela',
    synonyms: 'bitter gourd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tomato catchup',
    synonyms: 'tomato ketchup'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'tomato ketchup|tomato sauce'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'dhaniya|dhoniya|dhoney|kothamir|kothamiri soppu|kothimbir|kothamalli'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'coriander leaves',
    synonyms: 'coriander'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'dhaniya',
    synonyms: 'coriander'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'hara dhaniya',
    synonyms: 'coriander leaves'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kismis',
    synonyms: 'kishmish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kismish',
    synonyms: 'kishmish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kishmis',
    synonyms: 'kishmish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chaai',
    synonyms: 'chai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chai',
    synonyms: 'tea'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'life boy',
    synonyms: 'lifebuoy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lifeboy',
    synonyms: 'lifebuoy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'shampu',
    synonyms: 'shampoo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'shampo',
    synonyms: 'shampoo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sampoo',
    synonyms: 'shampoo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sempo',
    synonyms: 'shampoo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sempu',
    synonyms: 'shampoo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sempoo',
    synonyms: 'shampoo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'nutri choice',
    synonyms: 'nutrichoice'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'hing',
    synonyms: 'hing powder'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'umbrella|umbrella for rain|rain umbrella'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'lahsun|nohoru|roshun|lasan|belulli|veluthulli|lasun|rasuna|sudu luunu|poondu|vellulli|chinna ullipaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'lahsun',
    synonyms: 'garlic'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'choco',
    synonyms: 'chocolate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'choclate',
    synonyms: 'chocolate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'choclates',
    synonyms: 'chocolate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chocolates',
    synonyms: 'chocolate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'choklet',
    synonyms: 'chocolate'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'rawa|suji|sooji|rava'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cauli flower',
    synonyms: 'cauliflower'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'phool gobi|phool gobhi|phul gobi|phool kopi|fulevar|hoo kosu|phula kopi|phull gobhi|mal gova|puvva'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'phool gobhi',
    synonyms: 'cauliflower'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sambhar',
    synonyms: 'sambar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tyer',
    synonyms: 'tyre'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tire',
    synonyms: 'tyre'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bitaruta',
    synonyms: 'beetroot'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bitrut',
    synonyms: 'beetroot'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Pitrut',
    synonyms: 'beetroot'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'beet root',
    synonyms: 'beetroot'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chukandar',
    synonyms: 'beetroot'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'chukandar|butmah|Bitano kanda|beettoottu|bit mula|Cukadara'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'cold drink|soft drink|cold drinks|soft drinks|drinks|coldrink|colddrink'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dalia',
    synonyms: 'daliya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'ful|phul|phool|hoovu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'phool',
    synonyms: 'Flowers'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'flower',
    synonyms: 'Flowers'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'halapeno',
    synonyms: 'jalapeno'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'gajar|gaazor|gajor|gaajar|gajjari|sheema mullangi|gajara'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'gajar',
    synonyms: 'carrot'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'aaloo|batata|alu|bataka|aalo|aalu|aloogedde|urlakizhangu|arthapal|urulai kizhangu|bangaladumpa|urlagadda'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'aaloo',
    synonyms: 'potato'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gobi',
    synonyms: 'gobhi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gobhee',
    synonyms: 'gobhi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gobhie',
    synonyms: 'gobhi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gohbi',
    synonyms: 'gobhi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gohbee',
    synonyms: 'gobhi'
  },
  {
    type: 'onewaysynonym',
    variant: 'HINGLISH',
    keyword: 'gobhi',
    synonyms: 'cabbage|cauliflower'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bycycle',
    synonyms: 'bicycle'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'cycle|bicycle'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ladies finger',
    synonyms: 'lady finger'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'fruits and vegetables|fruits & vegetables|vegetables and fruits|fresh fruits and vegetables'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ashirwad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aashirvad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ashirvad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aashirwaad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aashirwad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ashirwaad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ashirvaad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'asirvad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'asirwad',
    synonyms: 'aashirvaad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ce3',
    synonyms: 'ce 3'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'health|nutrition|energy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'almari',
    synonyms: 'almirah'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'almirah',
    synonyms: 'wardrobe'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'tws|truly wireless|true wireless|truly wireless in ear earbuds|tws earbuds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lader',
    synonyms: 'ladder'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hudi',
    synonyms: 'hoodie'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dryign',
    synonyms: 'drying'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'cloth drying stand|cloth dry stand|cloth dryer stand|cloth dryer|cloth dry standard|cloth drying|cloth drying rack|cloth drying hanger|cloth dry|cloth drying stand hanging|cloth drying plastic stand|cloth drier|cloth dryers|clothes drying stand|clothes dryer stand|clothes dryer|clothes drying rack|cloth stand'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Museli',
    synonyms: 'Muesli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Burfi',
    synonyms: 'Barfi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bakarwadi',
    synonyms: 'Bhakarwadi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bhakharwadi',
    synonyms: 'Bhakarwadi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: "baggry's",
    synonyms: "Bagrry's"
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bagrrys',
    synonyms: "Bagrry's"
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Baggrys',
    synonyms: "Bagrry's"
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Baggry',
    synonyms: "Bagrry's"
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Bagrry',
    synonyms: "Bagrry's"
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'levis',
    synonyms: "levi's"
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'levi',
    synonyms: "levi's"
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'airdopes 141|airdopes 148|boat 141'
  },
  {
    type: 'synonym',
    variant: 'BRAND ACRONYM',
    keyword: 'uspa',
    synonyms: 'U.S. POLO ASSN.'
  },
  {
    type: 'synonym',
    variant: 'BRAND EXPANSION',
    keyword: 'US Polo',
    synonyms: 'U.S. POLO ASSN.'
  },
  {
    type: 'synonym',
    variant: 'BRAND EXPANSION',
    keyword: 'US Polo Assn',
    synonyms: 'U.S. POLO ASSN.'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'notebooks',
    synonyms: 'notebook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'note book',
    synonyms: 'notebook'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'tablet|tab'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bhujia',
    synonyms: 'bhujiya'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'claycraft',
    synonyms: 'clay craft'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'rc car|remote control car|remote car'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'avantra|varja|vivitka|anukta'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'LG 81.28 cm (32 inch) HD|LG 32 inch|LG 32inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'in ear earbud',
    synonyms: 'in ear earbuds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inear earbud',
    synonyms: 'in ear earbuds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'in ear ear bud',
    synonyms: 'in ear ear buds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bed sheet',
    synonyms: 'bedsheet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bed sheets',
    synonyms: 'bedsheet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bedsheets',
    synonyms: 'bedsheet'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जीयोफोन',
    synonyms: 'Jiophone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जिवोफोन',
    synonyms: 'Jiophone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Jiophones',
    synonyms: 'Jiophone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Jio Phone',
    synonyms: 'Jiophone'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Jiophone|Jio phone 2|Jio mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'T-Shirt',
    synonyms: 'Tshirt'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 't shirt',
    synonyms: 'Tshirt'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sound bar',
    synonyms: 'soundbar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sound bars',
    synonyms: 'soundbar'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'neckband',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms:
      'fire bolt smartwatch|fire-boltt smartwatch|fire boltt smartwatch|fire bolt|fire-boltt|fireboltt|firebolt smartwatch|firebolt smart watch|fireboltt smartwatch|fire boltt smart watch|firebolt|fire boltt|firebolt smart smartwatch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'basic phone|keypad phone|Basic Mobile Phone|keypad Mobile|Basic Keypad mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'computermonitor',
    synonyms: 'computer monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'computer monitors',
    synonyms: 'computer monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'computermonitors',
    synonyms: 'computer monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Televisions',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'telivision',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Telivison',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'televison',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'televisan',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Telivisan',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टीवी',
    synonyms: 'TV'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टीव्ही',
    synonyms: 'TV'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'TV|Television'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'High-end TV',
    synonyms: 'Television'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mangoes',
    synonyms: 'mango'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'aam|mambalam|maambalam|keri|maavina|maambazham|aamba|amba|Mampalam|mamidi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'aam',
    synonyms: 'mango'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mircha',
    synonyms: 'mirchi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mirch',
    synonyms: 'mirchi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mirchee',
    synonyms: 'mirchi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mirchi',
    synonyms: 'chilli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chili',
    synonyms: 'chilli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smart watch',
    synonyms: 'smartwatch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smartwatches',
    synonyms: 'smartwatch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'watches',
    synonyms: 'watch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wacth',
    synonyms: 'watch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wach',
    synonyms: 'watch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'smartwatch|watch smart smartwatch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'onnion',
    synonyms: 'onion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'anniyan',
    synonyms: 'onion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'piyaz',
    synonyms: 'pyaaz'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'peyaaj',
    synonyms: 'pyaaz'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'piyaja',
    synonyms: 'pyaaz'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'pyaaz|vengayam|vengaayam|kanda|kaanda|dungri|erulli|savola|valiya|ulli|luunu|venkgayam|ullipaaya|erragadda'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'pyaaz',
    synonyms: 'onion'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'onion|onion5kg|onion 5kg|onion 5 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'silipar',
    synonyms: 'slipper'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'farchun',
    synonyms: 'fortune'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मिक्सर',
    synonyms: 'mixer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mixture',
    synonyms: 'mixer'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mixie',
    synonyms: 'mixer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mixsar',
    synonyms: 'mixer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mix sar',
    synonyms: 'mixer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'treamer',
    synonyms: 'trimmer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'treemar',
    synonyms: 'trimmer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jucer',
    synonyms: 'juicer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tedibar',
    synonyms: 'teddy bear'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tedi bar',
    synonyms: 'teddy bear'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'teddybear',
    synonyms: 'teddy bear'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'multi grain',
    synonyms: 'multigrain'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'pista',
    synonyms: 'pistachios'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'sabja',
    synonyms: 'basil'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'laung',
    synonyms: 'cloves'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'laung|lavangam|Lavang|Lavangalu|Lavanga|Grampoo|Kirampoo|Krambu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'till|til|ellu|aellu|elu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'til',
    synonyms: 'sesame'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ajven',
    synonyms: 'ajwain'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ajwa',
    synonyms: 'ajwain'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ajwan',
    synonyms: 'ajwain'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ajawain',
    synonyms: 'ajwain'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ajavain',
    synonyms: 'ajwain'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'ajwain',
    synonyms: 'carrom seeds'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Ajwain|Owa|Ayamodakam|Omam'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cardamon',
    synonyms: 'cardamom'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'elaichi',
    synonyms: 'cardamom'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'Shakkar|chini|cheeni|jeeni|jini|sakarai|sakar|shakar|Khand|Saakhar|Sakkara|Sakkare|Panchasara|Sakarai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Shakkar',
    synonyms: 'sugar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'suger',
    synonyms: 'sugar'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Haldi|Halud|Halad'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'haldi',
    synonyms: 'turmeric'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'turmeric fresh',
    synonyms: 'turmeric'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kacchi Haldi',
    synonyms: 'turmeric fresh'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'tarbooz|tormuz|kallangadi hannu|Thannimathan|Kallingad|tarabhuja|Tarpucani|Puchakaaya|Puchakaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'tarbooz',
    synonyms: 'watermelon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'water melon',
    synonyms: 'watermelon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cocacola',
    synonyms: 'coca cola'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'coca cola|coke'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pinute',
    synonyms: 'peanut'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'meonise',
    synonyms: 'mayonaise'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'neklesses',
    synonyms: 'necklace'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'necklaces',
    synonyms: 'necklace'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'geezer',
    synonyms: 'geyser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobeil',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobiel',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'moblie',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'moblies',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobil',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobie',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'movail',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobael',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobila',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobail',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mobiles',
    synonyms: 'mobile'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'refaind',
    synonyms: 'refined'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'rifaind',
    synonyms: 'refined'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'conflex',
    synonyms: 'cornflakes'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'corn flakes',
    synonyms: 'cornflakes'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'yepee',
    synonyms: 'yipee'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'yeppi',
    synonyms: 'yipee'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'feviquick',
    synonyms: 'fewikwik'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'namkin',
    synonyms: 'namkeen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kechap',
    synonyms: 'ketchup'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vesline',
    synonyms: 'vaseline'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'oodles',
    synonyms: 'noodles'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'noodle',
    synonyms: 'noodles'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'noodels',
    synonyms: 'noodles'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'penuts',
    synonyms: 'peanuts'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'BISKUT',
    synonyms: 'BISCUIT'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'BISKIT',
    synonyms: 'BISCUIT'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Nariyal|narikol|tengina kaayi|naalikeram|nadia|tenkay|Kobbarikaya'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'naariyal',
    synonyms: 'Nariyal'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Naryal',
    synonyms: 'Nariyal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Nariyal',
    synonyms: 'Coconut'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'diaper',
    synonyms: 'diapers'
  },
  {
    type: 'synonym',
    variant: 'SYMBOL',
    keyword: '&',
    synonyms: 'and'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dudh',
    synonyms: 'doodh'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dhoodh',
    synonyms: 'doodh'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'doodh|paal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'doodh',
    synonyms: 'milk'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Wishper',
    synonyms: 'Whisper'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4kg',
    synonyms: '4 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4kilo',
    synonyms: '4 kilo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4kilos',
    synonyms: '4 kilos'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4kilogram',
    synonyms: '4 kilogram'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'kg|kilo|kilos|kilogram|kilograms'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'para',
    synonyms: 'parachute'
  },
  {
    type: 'onewaysynonym',
    variant: 'SYNONYMS',
    keyword: 'vegetables',
    synonyms: 'fresh vegetables'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'nirma',
    synonyms: 'detergent'
  },
  {
    type: 'onewaysynonym',
    variant: 'EXPANSION',
    keyword: 'freedom',
    synonyms: 'freedom oil'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Namak|Meeth|Uppu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'namak',
    synonyms: 'salt'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mag',
    synonyms: 'maggi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Saunf|Badishep|Peda Jilakara|Sopuginja|Sombu|Perum jeerakam|Perumjeeragam'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sauf',
    synonyms: 'Saunf'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Saunf',
    synonyms: 'fennel'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Fennel seeds|fennel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sur',
    synonyms: 'surf'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'coco powder',
    synonyms: 'cocoa powder'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'Amul cho',
    synonyms: 'Amul chocolate'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'Brush',
    synonyms: 'Toothbrush'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'Bru',
    synonyms: 'Bru coffee'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Gud|Gur|Gul|Bellam|Bella|Chakkara|Vellam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Gud',
    synonyms: 'Jaggery'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Badam',
    synonyms: 'Almond'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Almonds',
    synonyms: 'Almond'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'Paste',
    synonyms: 'Toothpaste|paste toothpaste'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Snack',
    synonyms: 'Snacks'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'Yeast',
    synonyms: 'Baking'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ब्लैक',
    synonyms: 'Black'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'काला',
    synonyms: 'kaala'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'balck',
    synonyms: 'Black'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kaala',
    synonyms: 'Black'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kala',
    synonyms: 'Kaala'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'Amul milk',
    synonyms: 'Milk'
  },
  {
    type: 'onewaysynonym',
    variant: 'SYNONYMS',
    keyword: 'groceries',
    synonyms: 'vegetables|fruits'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'grocery',
    synonyms: 'groceries'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'prim',
    synonyms: 'pril'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cakes',
    synonyms: 'cake'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dals',
    synonyms: 'dal'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dhal',
    synonyms: 'dal'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'daal',
    synonyms: 'dal'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'dal|dhuli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kaaju',
    synonyms: 'kaju'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kaju',
    synonyms: 'cashew nut'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'cashew nut|cashew'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10kg',
    synonyms: '10 kg'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'cumin seeds',
    synonyms: 'cumin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '500ml',
    synonyms: '500 ml'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1/2L',
    synonyms: '1/2 L'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '0.5L',
    synonyms: '0.5 L'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '500 ml|half litre|0.5 L|0.5 Litre|1/2 L|1/2 Litre'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '500g',
    synonyms: '500 g'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1/2kg',
    synonyms: '1/2 kg'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '500 g|500 gram|500 grams|half kg|half kilo|1/2 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5kg',
    synonyms: '5 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5000g',
    synonyms: '5000 g'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5kilo',
    synonyms: '5 kilo'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '5 kg|5000 g|5000 grams|5 kilo|5 kilogram|5 kilograms'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2kg',
    synonyms: '2 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2000g',
    synonyms: '2000 g'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2kilo',
    synonyms: '2 kilo'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '2 kg|2000 g|2000 grams|2 kilo|2 kilogram|2 kilograms'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5L',
    synonyms: '5 L'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5000ml',
    synonyms: '5000 ml'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '5 L|5000 ml|5 Litre|5 Liter|5 Litres|5 Liters'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2L',
    synonyms: '2 L'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2000ml',
    synonyms: '2000 ml'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '2 L|2000 ml|2 Litre|2 Liter|2 Litres|2 Liters'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1L',
    synonyms: '1 L'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1000ml',
    synonyms: '1000 ml'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '1 L|1000 ml|1 Litre|1 Liter|1 Litres|1 Liters'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1kg',
    synonyms: '1 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1000g',
    synonyms: '1000 g'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1kilo',
    synonyms: '1 kilo'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '1 kg|1000 g|1000 grams|1 kilo|1 kilogram|1 kilograms'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Naringa',
    synonyms: 'narangi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'santara',
    synonyms: 'santra'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'santra|komola|narangi|kittale|oranju|kamala|Arancupalam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'santra',
    synonyms: 'orange'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'peech',
    synonyms: 'peach'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'nora bogori|pic|peechu|pIch phala|Pic pallam|Peachu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'pIch phala',
    synonyms: 'peach'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Neembu',
    synonyms: 'Nimbu'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Neebu',
    synonyms: 'Nimbu'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'nimboo',
    synonyms: 'Nimbu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'nimbu|nemu|limbu|nimbe|naaranga|lembu|Elumiccai|Nimmakaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Nimbu',
    synonyms: 'Lemon'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Lime|lemon'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '8085b| mms8085b'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'हायसेन्स',
    synonyms: 'hisense'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hisene',
    synonyms: 'hisense'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hi sense',
    synonyms: 'hisense'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hisence',
    synonyms: 'hisense'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hicense',
    synonyms: 'hisense'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hicence',
    synonyms: 'hisense'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '12tb',
    synonyms: '12 tb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कीबोर्ड',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kybord',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'keybord',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'keboard',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kaybored',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'keybored',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'keybod',
    synonyms: 'keyboard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '7inch',
    synonyms: '7 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.67inch',
    synonyms: '6.67 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'icecream',
    synonyms: 'ice cream'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.2inch',
    synonyms: '6.2 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'falsa',
    synonyms: 'Phalsa'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Phalsa|Palastri|Phalsi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Phalsa',
    synonyms: 'Sherbet berry'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Sherbet berry|Indian sherbet berry'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'simla mirch',
    synonyms: 'shimla mirch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'shimla mirch|gholar marcha|bhombha marcha|bholar marcha|donne menasina|dhobali mirchi|malu miris|kudai milagai|bengulooru mirapakaaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'shimla mirch',
    synonyms: 'capsicum'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'murunga|marungai|munaga|mullakkaaya|sahjan|sojina|shojne danta|saragwaa ni shing|nugge kaayi|muringakka|shevgyachya shenga|sajana|sujuna'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'murunga',
    synonyms: 'drumstick'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'माइक्रोवेव',
    synonyms: 'microwave'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'naspati',
    synonyms: 'nashpati'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'naspoti',
    synonyms: 'nashpati'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'piyar',
    synonyms: 'pear'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'nashpati|mara sebi|Perikkay pallam|Peerupandu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'nashpati',
    synonyms: 'pear'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5.99inch',
    synonyms: '5.99 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'a 23',
    synonyms: 'a23'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '500gb',
    synonyms: '500 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'शगुन',
    synonyms: 'omen'
  },
  {
    type: 'synonym',
    variant: 'NUMERICAL',
    keyword: 5,
    synonyms: 'five'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '8kg',
    synonyms: '8 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'spalshproof',
    synonyms: 'splashproof'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'इंकजेट',
    synonyms: 'inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inkget',
    synonyms: 'inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'incjet',
    synonyms: 'inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inkjat',
    synonyms: 'inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inkjit',
    synonyms: 'inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'enkjet',
    synonyms: 'inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Inktenk',
    synonyms: 'Inktank'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Inktnk',
    synonyms: 'Inktank'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Inktan',
    synonyms: 'Inktank'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Enktank',
    synonyms: 'Inktank'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Inktank|inkjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Metti',
    synonyms: 'Methi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Meti',
    synonyms: 'Methi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Methi',
    synonyms: 'Fenugreek'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5.3inch',
    synonyms: '5.3 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'इंच',
    synonyms: 'inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'redy',
    synonyms: 'ready'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'HD ready|HDR'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रंगीन',
    synonyms: 'colour'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'लेजर',
    synonyms: 'laser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lasar',
    synonyms: 'laser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'leser',
    synonyms: 'laser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lesar',
    synonyms: 'laser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lazer',
    synonyms: 'laser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lezar',
    synonyms: 'laser'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'गोदरेज',
    synonyms: 'godrej'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'godreg',
    synonyms: 'godrej'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'godrege',
    synonyms: 'godrej'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'godrj',
    synonyms: 'godrej'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आईटेल',
    synonyms: 'itel'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'kundru|tendli|kunduru|tindli|kunduli|kundri|tindola|kaagethonde|theekuduru|tondekayi|kova|koval|tondli|kunduri|kovi|kotturukanni|naripputu|vimpa|donda kaya|kaki donda kaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kundru',
    synonyms: 'coccinia'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'coccinia|ivy gourd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'grape fruit',
    synonyms: 'grapefruit'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'grapefruit|pomelo|Citrus paradisi|shaddock'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.53inch',
    synonyms: '6.53 inch'
  },
  {
    type: 'synonym',
    variant: 'NUMERICAL',
    keyword: 4,
    synonyms: 'four'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kunda|Makarandam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kunda',
    synonyms: 'jasmine'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tetar',
    synonyms: 'theater'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'पैवेलियन',
    synonyms: 'pavilion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pevilion',
    synonyms: 'pavilion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pavelion',
    synonyms: 'pavilion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pavilon',
    synonyms: 'pavilion'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Pavilion',
    synonyms: 'pavilion'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'HP Pav',
    synonyms: 'HP Pavilion'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'HP Pavilion|pavilion'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्लीव',
    synonyms: 'sleeve'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'one plus',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'वनप्लस',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'onplus',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '0neples',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '0ne plus',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1 plus',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1+',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1plus',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'one+',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vanplus',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'onepluse',
    synonyms: 'oneplus'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'प्रिंटर',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'printar',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'printur',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'prenter',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'prentar',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pinter',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pintar',
    synonyms: 'printer'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'peas|snap peas'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'a 32',
    synonyms: 'a32'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'uhd',
    synonyms: 'ultra hd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'altra hd',
    synonyms: 'ultra hd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'alta hd',
    synonyms: 'ultra hd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6inch',
    synonyms: '6 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5tb',
    synonyms: '5 tb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'towar',
    synonyms: 'tower'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'karbuja',
    synonyms: 'kharbooja'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kharabhuja',
    synonyms: 'kharbooja'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kharbooj',
    synonyms: 'kharbooja'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'kharbooja|shakar teti|kasthoori thannimathan|Kasturi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kharbooja',
    synonyms: 'musk melon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'applewatch',
    synonyms: 'apple watch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'iwatch|apple watch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dolby®',
    synonyms: 'dolby'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2gb',
    synonyms: '2 gb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Safed Mirch| Vella Kurumulaku| Vellai Milaku'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Safed Mirch',
    synonyms: 'White Pepper'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'White Pepper|White peppercorns'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'sarso sag|gethiya sag'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'sarso sag',
    synonyms: 'kale'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kali Mirch powder|Kurumulaku Podi|Karimilagu Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kali Mirch powder',
    synonyms: 'Black Pepper powder'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'matur',
    synonyms: 'matar'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'matar',
    synonyms: 'Peas'
  },
  {
    type: 'synonym',
    variant: 'NUMERICAL',
    keyword: 7,
    synonyms: 'seven'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'Kheera|tiyoh|shosha|savthekaee|vellarikka|kaakdi|kakudi|pipigna|keera kai|vellari kai|keera dosakaaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kheera',
    synonyms: 'Cucumber'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'व्हर्लपूल',
    synonyms: 'whirlpool'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'whollpool',
    synonyms: 'whirlpool'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'celling',
    synonyms: 'ceiling'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sealing',
    synonyms: 'ceiling'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'seeling',
    synonyms: 'ceiling'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'इन्फिनिटी',
    synonyms: 'infinity'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आईवा',
    synonyms: 'aiwa'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '11inch',
    synonyms: '11 inch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'mustard leaf|leafy mustard'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kadugu|Karisasive|Sarson|sarso|Banarasi Rai|Rai|Shorshe|Sasaun'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'sarso',
    synonyms: 'mustard'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'mustard',
    synonyms: 'mustard leaf'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'rockarz',
    synonyms: 'rockerz'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'ps5|playstation 5'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Windos',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Windo',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Windoz',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Vindows',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Vindos',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Vindoz',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Windowz',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wondow',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'woindow',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'windon',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'window',
    synonyms: 'Windows'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ascus',
    synonyms: 'asus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4gb',
    synonyms: '4 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'नोकिआ',
    synonyms: 'nokia'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'नोकिया',
    synonyms: 'nokia'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'karonda|Kilaakkaai'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'boys',
    synonyms: 'men'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'juice',
    synonyms: 'drinks'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रेफ्रिजरेटर',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'frig',
    synonyms: 'fridge'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'ref',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'refridgerator',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'refrigorator',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'refrigereter',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'refreezerator',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'refreegerator',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'referigerator',
    synonyms: 'refrigerator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'frige',
    synonyms: 'fridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'frij',
    synonyms: 'fridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'freeg',
    synonyms: 'fridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'fride',
    synonyms: 'fridge'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'फ्रिज',
    synonyms: 'fridge'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'fridge|refrigerator|freeze'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'bread',
    synonyms: 'bun'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'badam',
    synonyms: 'kaju'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'basmati rice|biryani rice'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'sabun',
    synonyms: 'soap'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'moong phali|cheena badam|magfuli|shing|kadale kaayi|shenga|shengdana|china badam|Rata kaju|kadalai|veru senega pappu|pallelu|senega pappu'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'groundnut|peanuts|peanut'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'moong phali',
    synonyms: 'groundnut'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'face facewash|face wash'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'ladies|women'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'paint|polish|enamel'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'biscuit|cookies'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'achar',
    synonyms: 'pickle'
  },
  {
    type: 'oneWaySynonym',
    variant: 'SUBSTITUTE',
    keyword: 'drinks',
    synonyms: 'colddrink|juice'
  },
  {
    type: 'oneWaySynonym',
    variant: 'SUBSTITUTE',
    keyword: 'sauce',
    synonyms: 'mayonnaise'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'detergent',
    synonyms: 'washing'
  },
  {
    type: 'oneWaySynonym',
    variant: 'SUBSTITUTE',
    keyword: 'masala',
    synonyms: 'chilli'
  },
  {
    type: 'oneWaySynonym',
    variant: 'SUBSTITUTE',
    keyword: 'chutney',
    synonyms: 'sauce'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'lotion|moisturizer|cream'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'deo',
    synonyms: 'perfume'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'sarso oil',
    synonyms: 'mustard oil'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'noodles',
    synonyms: 'pasta'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'girls',
    synonyms: 'women'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'baby|kids'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'jaggery',
    synonyms: 'sugar'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'paleng xaak|paalong shaak|palak|palak soppu|palanga|niwithi|pasalai keerai|paala koora'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'paalak',
    synonyms: 'palak'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'palak',
    synonyms: 'spinach'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'chips',
    synonyms: 'kurkure'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'kurkure',
    synonyms: 'chips'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'ketchup',
    synonyms: 'sauce'
  },
  {
    type: 'altCorrection1',
    variant: 'SUBSTITUTE',
    keyword: 'snacks',
    synonyms: 'chips'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'rusk|toast'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'women night dress|women night wear'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '65inch',
    synonyms: '65 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'heatchi',
    synonyms: 'hitachi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hitacho',
    synonyms: 'hitachi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hatachi',
    synonyms: 'hitachi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hitach',
    synonyms: 'hitachi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '8tb',
    synonyms: '8 tb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '13.3inch',
    synonyms: '13.3 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.3inch',
    synonyms: '10.3 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '16gb',
    synonyms: '16 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'पैनासोनिक',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'पेनासोनिक',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'panassonic',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'painasonic',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Panasonek',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Panasonik',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Panasanic',
    synonyms: 'Panasonic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1.5tb',
    synonyms: '1.5 tb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'makkhan|maakhan'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'makkhan',
    synonyms: 'butter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1.5ton',
    synonyms: '1.5 ton'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Britania',
    synonyms: 'Britannia'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Brittannia',
    synonyms: 'Britannia'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Brittania',
    synonyms: 'Britannia'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inveter',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inventer',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'invater',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'invertor',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'invetor',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'invorter',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'invartar',
    synonyms: 'inverter'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.52inch',
    synonyms: '6.52 inch'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'Hazelnut',
    synonyms: 'chocolate'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Shrikhan',
    synonyms: 'shrikhand'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Srikand',
    synonyms: 'shrikhand'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'shreekhand',
    synonyms: 'shrikhand'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '7kg',
    synonyms: '7 kg'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'soyabean ki fali',
    synonyms: 'Edamame'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ulta',
    synonyms: 'ultra'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मशीन',
    synonyms: 'machine'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kathal|Jaiphal|Jajikayi|Jajikayi|Jathikka|Jatikkai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'jaiphal',
    synonyms: 'Nutmeg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ful hd',
    synonyms: 'full hd'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'fhd',
    synonyms: 'full hd'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'केसीओ',
    synonyms: 'casio'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'केसिओ',
    synonyms: 'casio'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kuttipayar bean|Cowpea Kuttipayar|lobiya ki phaliyaan'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'lobiya ki phaliyaan',
    synonyms: 'Cowpea beans'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Cowpea beans|Bean Cow Pea'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'splite',
    synonyms: 'split'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'spilit',
    synonyms: 'split'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aplit',
    synonyms: 'split'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'slit',
    synonyms: 'split'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Insperon',
    synonyms: 'Inspiron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Insipron',
    synonyms: 'Inspiron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Insipiron',
    synonyms: 'Inspiron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Inspirn',
    synonyms: 'Inspiron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inspiring',
    synonyms: 'Inspiron'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Inspiron|Dell inspiron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'leptop',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'लैपटॉप',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'loptop',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'laptopp',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'laptup',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lap top',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'laptp',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lapy',
    synonyms: 'lappy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lapt',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lapto',
    synonyms: 'laptop'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'laptop|portable computer|lappy'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'khajur|xejur|kharjurada hannu|Eenthapazham|kharjur|khajuri|tetikal|Kharjooram'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'khajur',
    synonyms: 'dates'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1tb',
    synonyms: '1 tb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'विवो',
    synonyms: 'vivo'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'वीवो',
    synonyms: 'vivo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '128gb',
    synonyms: '128 gb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'chandramallika|sevanti'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chandramallika',
    synonyms: 'Chrysanthamum'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Chrysanthamum|chrysanthamum flowers'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'चार्जर',
    synonyms: 'charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chrgr',
    synonyms: 'charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chargers',
    synonyms: 'charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'charjer',
    synonyms: 'charger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.5kg',
    synonyms: '6.5 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'biskoot',
    synonyms: 'Biscuit'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'biscut',
    synonyms: 'Biscuit'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Biscuits',
    synonyms: 'Biscuit'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.1inch',
    synonyms: '10.1 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'हेडसेट',
    synonyms: 'headset'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '12gb',
    synonyms: '12 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'शाओमी',
    synonyms: 'xiaomi'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ब्लूस्टार',
    synonyms: 'bluestar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bulestar',
    synonyms: 'bluestar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blusrar',
    synonyms: 'bluestar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bluster',
    synonyms: 'bluestar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bluestad',
    synonyms: 'bluestar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blue star',
    synonyms: 'bluestar'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5.4inch',
    synonyms: '5.4 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.4inch',
    synonyms: '10.4 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'accer',
    synonyms: 'acer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'singal function',
    synonyms: 'single function'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'adrak|adrik|ada|aadu|shunti|aale|ada|inguru|inji|allam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'adrak',
    synonyms: 'Ginger'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'giloy|amrutha balli|aamoi lota|chittamruthu|Guduchi|Seendilkodi|Tippateega|Shindilakodi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'giloy',
    synonyms: 'giloy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: "apple's",
    synonyms: 'apple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aaple',
    synonyms: 'apple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'appe',
    synonyms: 'apple'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ऐपल',
    synonyms: 'apple'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एप्पल',
    synonyms: 'apple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'undar',
    synonyms: 'under'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.58inch',
    synonyms: '6.58 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'नोट',
    synonyms: 'note'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mackbook',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'macbuk',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'makbook',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mcbook',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mecbook',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mecbuk',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'macbok',
    synonyms: 'macbook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '16tb',
    synonyms: '16 tb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'patta gobhi|banda gobhi|bandhakopi|cobij|ele kosu|muttakkoos|kovees|cobi|bandha kobi|patta gobi|gova|muttai kosu|kosu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'patta gobhi',
    synonyms: 'Cabbage'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एसएसडी',
    synonyms: 'ssd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '24inch',
    synonyms: '24 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2ton',
    synonyms: '2 ton'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'kadipatta|narasingha paat|kaari paata|mitho limado|kari bevina soppu|karivepila|kariyapela|goad limba|bhrunsunga patra|karapincha|kari veppilai|karivepaaku'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kadipatta',
    synonyms: 'Curry Leaves'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'प्रोजेक्टर',
    synonyms: 'projector'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'turai|bhol|jhingey|turiya|ghisoda|heeray kayi|peechhinga|dodke|shirale|janhhi|tori|wetakolu|peerkan kai|beera kaaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'turai',
    synonyms: 'Ridge gourd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '18tb',
    synonyms: '18 tb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '21.5inch',
    synonyms: '21.5 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'fansi|farsbi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'fansi',
    synonyms: 'French bean'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'prize',
    synonyms: 'price'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'razar',
    synonyms: 'razor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'razer',
    synonyms: 'razor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'razr',
    synonyms: 'razor'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'amla|aamlokhi|nellikayi|nellikka|avla|Nellikkay|Jamakaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'amla',
    synonyms: 'gooseberry'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '43inch',
    synonyms: '43 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dispencer',
    synonyms: 'dispenser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dispensor',
    synonyms: 'dispenser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dispensar',
    synonyms: 'dispenser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dispanser',
    synonyms: 'dispenser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.5inch',
    synonyms: '6.5 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'trule',
    synonyms: 'truly'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एलईडी',
    synonyms: 'led'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'डेस्कजेट',
    synonyms: 'deskjet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '9.7inch',
    synonyms: '9.7 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'amabrane',
    synonyms: 'ambrane'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '58inch',
    synonyms: '58 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smol',
    synonyms: 'small'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'volts',
    synonyms: 'voltas'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'वोल्टास',
    synonyms: 'voltas'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सीगेट',
    synonyms: 'seagate'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सिगेट',
    synonyms: 'seagate'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '750d|d750'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'White Til|Safed Til|Velutha ellu|Vellai Ellu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Safed Til',
    synonyms: 'White Sesame'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5.8inch',
    synonyms: '5.8 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सैन्सुई',
    synonyms: 'sansui'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sensui',
    synonyms: 'sansui'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sansue',
    synonyms: 'sansui'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sansiu',
    synonyms: 'sansui'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.38inch',
    synonyms: '6.38 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'frontload',
    synonyms: 'front load'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '8.5kg',
    synonyms: '8.5 kg'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्कैनर',
    synonyms: 'scanner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '0pp0',
    synonyms: 'oppo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'appo',
    synonyms: 'oppo'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ओप्पो',
    synonyms: 'oppo'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ओपो',
    synonyms: 'oppo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '8.7inch',
    synonyms: '8.7 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kesar|Zafran|Keshar|Kukumpoovu|Kesari|Kumkuma poovu|Kunkumapoo'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kesar',
    synonyms: 'Saffron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'alevera',
    synonyms: 'Aloe Vera'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'alo vera',
    synonyms: 'Aloe Vera'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'foxed',
    synonyms: 'fixed'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'बैकपैक',
    synonyms: 'backpack'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Heeng|Hing|Inguva|Kaayam|Perunkayam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Hing',
    synonyms: 'Asafoetida'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'airconditionars',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'airconditionar',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircondioner',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircondisner',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircondition',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircondotioner',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircondiners',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'airconditinors',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircondinors',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'airconditinor',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'airconditiner',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'airconditner',
    synonyms: 'air conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'a.c',
    synonyms: 'AC'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aircon',
    synonyms: 'air con'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'air conditioner|AC|air con'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'black berry',
    synonyms: 'blackberry'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'kaddu|kumara|kumro|kolu|kumbala kayi|maththanga|laal bhopla|kakharu|wattakka|parangika|gummadi kaya|arasanai kai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kaddu',
    synonyms: 'Pumpkin'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कारतूस',
    synonyms: 'cartridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cartage',
    synonyms: 'cartridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cartrige',
    synonyms: 'cartridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cartrig',
    synonyms: 'cartridge'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kartridge',
    synonyms: 'cartridge'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सभी',
    synonyms: 'all'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '780d|d780'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.35inch',
    synonyms: '6.35 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'condiyion',
    synonyms: 'condition'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'condition|conditioning|conditioner'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wevobook',
    synonyms: 'Vivobook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vevobook',
    synonyms: 'Vivobook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'viwobook',
    synonyms: 'Vivobook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vivobuk',
    synonyms: 'Vivobook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vivobooc',
    synonyms: 'Vivobook'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Asus book|asus vivobook|Vivobook'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Converteble',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Canvertible',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Cunvertible',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Convertibal',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Convartibal',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Canvartibal',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'conertible',
    synonyms: 'Convertible'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'e55|e55bt'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aru gula',
    synonyms: 'Arugula'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Roquette|Arugula|Rucula'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'ch|channel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1.8ton',
    synonyms: '1.8 ton'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Lal mirch powder|Mulaku Podi|Melagai Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Lal mirch powder',
    synonyms: 'Chilli Powder'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'onita',
    synonyms: 'onida'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '7.9inch',
    synonyms: '7.9 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kalonji|Kaala Jeera|Nalla vittanalu|Karim jeerakam|Karuncirakam'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Black Cumin|Nigella Seeds|Black Onion seeds'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kalonji',
    synonyms: 'Black Onion seeds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kala khata',
    synonyms: 'kala khatta'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'parwal|parora|patal|potol|parval|mara thonde|parwar|potala|potals'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'parwal',
    synonyms: 'pointed gourd'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'फिलिप्स',
    synonyms: 'philips'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 't50|t50hi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'pui saag|poi patta|poi saag'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'pui saag',
    synonyms: 'malabar spinach'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vastro',
    synonyms: 'vostro'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '70inch',
    synonyms: '70 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Xiomi',
    synonyms: 'Xiaomi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Xiomi',
    synonyms: 'Xiaomi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Xiomai',
    synonyms: 'Xiaomi'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Mi|Xiaomi|Redmi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.43inch',
    synonyms: '6.43 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'गोप्रो',
    synonyms: 'gopro'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Tel',
    synonyms: 'oil'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Dalchini powder| Karuvapatta podi| Ilavangappattai podi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Cinnmon',
    synonyms: 'Cinnamon'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Dalchini powder',
    synonyms: 'Cinnamon Powder'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Tinda|thonde kayi|dhemse|tinda|tinda kaaya|Dhemase'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'tinda',
    synonyms: 'Round Gourd'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्क्रीन',
    synonyms: 'screen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '3gb',
    synonyms: '3 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सफेद',
    synonyms: 'white'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kasuri Methi|Menthikora|Kaaindha vendhaya ilaigal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kasuri Methi',
    synonyms: 'Fenugreek leaves'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pappaaya',
    synonyms: 'Papaya'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Pappaya',
    synonyms: 'Papaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'papita|omita|papayu|parangi|papai|amruta banda|Pappali'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'papita',
    synonyms: 'Papaya'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.9inch',
    synonyms: '6.9 inch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '1/2|0.5'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'निकॉन',
    synonyms: 'nikon'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '10 Generation|10th Generation'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'ganna',
    synonyms: 'sugar cane'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Choti Elaichi|Hari Elaichi|Velchi|Yalakulu|Elaikka|Elakkay'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Hari Elaichi',
    synonyms: 'Green Cardamom'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'Badi Elaichi|Kali Elaichi|Mothi Elaychi|Veldoda|Nalla Yalakulu|Karupp Elam|Karuppu Elakkay'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kali Elaichi',
    synonyms: 'Black Cardamom'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'amaranthus|Thotakura|chaulai|amaranth|dhantinasopp|Sirikeerai|Thota Koora|siru keerai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'amaranthus',
    synonyms: 'pigweed'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'pigweed|templeweed'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Haldi powder|Manjal Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Haldi powder',
    synonyms: 'Turmeric Powder'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.8inch',
    synonyms: '6.8 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hoome',
    synonyms: 'home'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Seb|safarchand|sebu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Seb',
    synonyms: 'Apple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aapel',
    synonyms: 'Apple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'appil',
    synonyms: 'Apple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'apal',
    synonyms: 'Apple'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Methi powder|Uluva Podi|Vengaya Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Methi powder',
    synonyms: 'Fenugreek Powder'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कार्यालय',
    synonyms: 'office'
  },
  {
    type: 'synonym',
    variant: 'NUMERICAL',
    keyword: 2,
    synonyms: 'two'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '256gb',
    synonyms: '256 gb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earpod',
    synonyms: 'earpods'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear pods',
    synonyms: 'earpods'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear bud',
    synonyms: 'earbuds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear buds',
    synonyms: 'earbuds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear pod',
    synonyms: 'earpods'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earbud',
    synonyms: 'earbuds'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'earpods|earbuds|earphones|in ear earbuds|in ear ear buds|ear speaker|earpiece'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stare',
    synonyms: 'star'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stebilizer',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'steplizer',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'steplizee',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sateplijar',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stblicer',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stablalaiser',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stablicer',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stabliser',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stablizr',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'stablizar',
    synonyms: 'stabilizer'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जियो',
    synonyms: 'jio'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जिओ',
    synonyms: 'jio'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'geo',
    synonyms: 'jio'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'प्रोबुक',
    synonyms: 'probook'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'लॉयड',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'लोयड',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lyod',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lloyad',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'loid',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lyead',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'llyods',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'loyed',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'loyld',
    synonyms: 'lloyd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '9kg',
    synonyms: '9 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '7.5kg',
    synonyms: '7.5 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '8gb',
    synonyms: '8 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'डिस्प्ले',
    synonyms: 'display'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Jeera powder|Jeeraka podi|Jeeragam Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Jeera powder',
    synonyms: 'Cumin powder'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सेलेरॉन',
    synonyms: 'Celeron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Cileron',
    synonyms: 'Celeron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Ciliron',
    synonyms: 'Celeron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Celiron',
    synonyms: 'Celeron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Celerun',
    synonyms: 'Celeron'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.44inch',
    synonyms: '6.44 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Karbann',
    synonyms: 'Karbonn'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kaarbon',
    synonyms: 'Karbonn'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Karbon',
    synonyms: 'Karbonn'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'karban',
    synonyms: 'Karbonn'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blendor',
    synonyms: 'blender'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pals',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lpus',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'plash',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'plas',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pilas',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pkus',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pluse',
    synonyms: 'plus'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'केल्विनेटर',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'केल्वीनेटर',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kelvinaotor',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kalvinatar',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kalvinator',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kalvinatot',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kavinetore',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kelivanator',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'calvinator',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kelvinetor',
    synonyms: 'kelvinator'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kichan',
    synonyms: 'kitchen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kichen',
    synonyms: 'kitchen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '12.4inch',
    synonyms: '12.4 inch'
  },
  {
    type: 'synonym',
    variant: 'NUMERICAL',
    keyword: 3,
    synonyms: 'three'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ग्राइंडर',
    synonyms: 'grinder'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'बीपीएल',
    synonyms: 'bpl'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'लेनोवो',
    synonyms: 'lenovo'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'लिनोवो',
    synonyms: 'lenovo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lenov',
    synonyms: 'lenovo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'leno',
    synonyms: 'lenovo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lenova',
    synonyms: 'lenovo'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lonovo',
    synonyms: 'lenovo'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Safed Mirch powder|Vella Kurumulaku Podi|Vellai Milagu Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Safed Mirch powder',
    synonyms: 'White Pepper powder'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'genda|jhendu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'genda',
    synonyms: 'marigold'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mari gold',
    synonyms: 'marigold'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'डेस्कटॉप',
    synonyms: 'desktop'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '512gb',
    synonyms: '512 gb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Sarda|Sirala'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Sarda',
    synonyms: 'sun melon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1gb',
    synonyms: '1 gb'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'weight|weighing'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'katthal|kothal|kanthal|fanas|halasina kayi|chakka|panasa|Kos|palakkai|panasa kaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'katthal',
    synonyms: 'Jack fruit'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Rizen',
    synonyms: 'Ryzen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Rysen',
    synonyms: 'Ryzen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Ryson',
    synonyms: 'Ryzen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Ryzon',
    synonyms: 'Ryzen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Ryzin',
    synonyms: 'Ryzen'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एक',
    synonyms: 'one'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dubal',
    synonyms: 'dual'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '15.6inch',
    synonyms: '15.6 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Meetha Paan|mitha pan|mitha paan|meetha pan|paan'
  },
  {
    type: '',
    variant: 'HINGLISH',
    keyword: 'Meetha Paan',
    synonyms: 'sweet betel'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एचपी',
    synonyms: 'hp'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'celery|Ajwainn ke patte|Celery|Joni|Khak|sivari'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टन',
    synonyms: 'tonne'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'tons|tn|tonne|ton'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'chhole|kuragaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chhole',
    synonyms: 'chickpea'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'chick pea',
    synonyms: 'chickpea'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cheeku',
    synonyms: 'chiku'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'chiku',
    synonyms: 'sapota'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कैनन',
    synonyms: 'canon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Wird',
    synonyms: 'Wired'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Vired',
    synonyms: 'Wired'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Wired|Wire'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रेडमी',
    synonyms: 'redmi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'redemi',
    synonyms: 'redmi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'redimi',
    synonyms: 'redmi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'redme',
    synonyms: 'redmi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'redmy',
    synonyms: 'redmi'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आदिदास',
    synonyms: 'adidas'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टेबलेट',
    synonyms: 'tablet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tablate',
    synonyms: 'tablet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'teblet',
    synonyms: 'tablet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'teb',
    synonyms: 'tab'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tablat',
    synonyms: 'tablet'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tablit',
    synonyms: 'tablet'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टीबी',
    synonyms: 'tb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'semiautomatic',
    synonyms: 'semi-automatic'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'alfa',
    synonyms: 'alpha'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'bhutta|makoi|Makai|Jola|cheaalam|makaa|Maki|Colam|Mokkajonna'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'bhutta',
    synonyms: 'Sweet corn'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'shatavari',
    synonyms: 'asparagus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '1.6ton',
    synonyms: '1.6 ton'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'phonez',
    synonyms: 'phones'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Dhaniya powder|Dhanepud|Malli podi|Kothamalli podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Dhaniya powder',
    synonyms: 'Coriander Powder'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टीसीएल',
    synonyms: 'tcl'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टिसीएल',
    synonyms: 'tcl'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Romaine|romaine lettuce'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'petha|raksahawa|komora|chaal kumro|safed kolu|kumbala|kumbhalanga|kohla|puhul|neer poosanikai|boodida gummadi kaya|poosani kai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'petha',
    synonyms: 'ash gourd'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '12 Generation|12th Generation'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ghaans',
    synonyms: 'ghaas'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'ghaas',
    synonyms: 'grass'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Shahi Jeera|Shajeera|Seema Sopyginjale|Peruncirakam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Shahi Jeera',
    synonyms: 'Caraway Seeds'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Black Til|Kala Til|Karutha ellu|Karuppu ellu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kala Til',
    synonyms: 'Black Sesame'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'gulab|gulab phool'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'gulab',
    synonyms: 'rose'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5star',
    synonyms: '5 star'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ओलम्पस',
    synonyms: 'olympus'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Rujamari',
    synonyms: 'rosemary'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.55inch',
    synonyms: '6.55 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'हावेल्स',
    synonyms: 'havells'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'पार्टी',
    synonyms: 'party'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'topload',
    synonyms: 'top load'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'duble door',
    synonyms: 'double door'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '2 door|two door|double door'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'तोशिबा',
    synonyms: 'toshiba'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Javitri|Jaipatri|Japathri|Jatipatri|Jadipattri'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Javitri',
    synonyms: 'Mace'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '32gb',
    synonyms: '32 gb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Knolkhol',
    synonyms: 'knol khol'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'knol khol|Navil Kosu|Nookal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'knol khol',
    synonyms: 'Kohlrabi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Anasphal|Chakri Phool|Anasa Puvu|Thakkolam|Annachi Poo'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Chakri Phool',
    synonyms: 'Star Anise'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Lili Dungri',
    synonyms: 'spring onion'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kantola|bhat karela'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kantola',
    synonyms: 'Forest Bitter Goud'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'spike gourd|Forest Bitter Goud'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Tejpatta|Tamal Patra|Talisapatri|Karuvayila|Vayanayila|Piriyani Ilai|Brinji elai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Tejpatta',
    synonyms: 'Bayleaf'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.3inch',
    synonyms: '6.3 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सैनडिस्क',
    synonyms: 'sandisk'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kamal',
    synonyms: 'lotus'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.22inch',
    synonyms: '6.22 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ओवन',
    synonyms: 'oven'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'strawberry',
    synonyms: 'strawberry flavor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vannila',
    synonyms: 'vanilla'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'vanila',
    synonyms: 'vanilla'
  },
  {
    type: 'onewaysynonym',
    variant: 'SYNONYMS',
    keyword: 'vanilla',
    synonyms: 'vanilla flavor'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Khus khus|Posto|Posta dana|Gasagasalu|Kasakase|Kasa Kasa'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Khus khus',
    synonyms: 'Poppy Seeds'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ibf',
    synonyms: 'ifb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.51inch',
    synonyms: '6.51 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '14inch',
    synonyms: '14 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.9inch',
    synonyms: '10.9 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '64gb',
    synonyms: '64 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'माउस',
    synonyms: 'mouse'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mous',
    synonyms: 'mouse'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mose',
    synonyms: 'mouse'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mouce',
    synonyms: 'mouse'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mause',
    synonyms: 'mouse'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'mauce',
    synonyms: 'mouse'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'वॉशिंग',
    synonyms: 'washing'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'spkr',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'speeker',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'spikar',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'speakers',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'speakre',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'speakres',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'spekcars',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्पीकर',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्पीकर',
    synonyms: 'speaker'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Maravalli Kizhangu|Kappa|Karapendalam|Marageanasu|Cassava'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Cassava',
    synonyms: 'tapioca'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.56inch',
    synonyms: '6.56 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'daikon',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'daiking',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dainik',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'daiken',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dailen',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dakini',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ddaikin',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dacian',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'daikn',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dainkin',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dakin',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dycine',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'dekni',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'diekin',
    synonyms: 'diakin'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'singal',
    synonyms: 'single'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'mooli|mulo|mulangi|mula|mulaa|Mullanki|Mullangi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mooli',
    synonyms: 'Radish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.2inch',
    synonyms: '10.2 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'colf',
    synonyms: 'cold'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मॉनिटर',
    synonyms: 'monitor'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मॉनीटर',
    synonyms: 'monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'monitors',
    synonyms: 'monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'monitar',
    synonyms: 'monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'monitars',
    synonyms: 'monitor'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'moniter',
    synonyms: 'monitor'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'angur|draksh|dhraakshi|munthiri|angura|Tiratcai'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'angur',
    synonyms: 'Grapes'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कुलर',
    synonyms: 'cooler'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कूलर',
    synonyms: 'cooler'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6kg',
    synonyms: '6 kg'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'डोंगल',
    synonyms: 'dongle'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'turee|Kumbaḷakayiyannu holuva cinikayi|mareaachedi|Curaikkay|Gummadikaya'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jucini',
    synonyms: 'Zucchini'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jhucini',
    synonyms: 'Zucchini'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jusini',
    synonyms: 'Zucchini'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jhukini',
    synonyms: 'Zucchini'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'turee',
    synonyms: 'Zucchini'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10tb',
    synonyms: '10 tb'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Barph Matar|Barf Matar|Thanda Matar'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Barf Matar',
    synonyms: 'snow peas'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'anjeer|anjir|dimoru|anjura'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'anjeer',
    synonyms: 'fig'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'compreesor',
    synonyms: 'compressor'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आइफोन',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आयफोन',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आईफोन',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'आइफ़ोन',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'inphone',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'iphonee',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'i p h o n e',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'i phone',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'iphine',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ihone',
    synonyms: 'iphone'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kamalam',
    synonyms: 'dragon fruit'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जबरा',
    synonyms: 'jabra'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.1inch',
    synonyms: '6.1 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'kela|kol|kolaa|kela|baley hannu|kadali|kesel|vazhaikkai|arati kaya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'kela',
    synonyms: 'Banana'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'milk shake',
    synonyms: 'milkshake'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'milkshake|flavored milk',
    '': 'keep as synonyms'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smat',
    synonyms: 'smart'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smar',
    synonyms: 'smart'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'बोस',
    synonyms: 'bose',
    '': 'disregard for now'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'padwal|chichinga|dhunduli|chichinga|pandola|padavali|paddvala kayi|padaval anga|padval|chachindra|galartori|pathol|padavalangai|pudalankai|potla kaaya|lingapotla',
    '': '1-1 map to representative, in this case padwal. eg: w2r chichinga -> padwal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'padwal',
    synonyms: 'Snake gourd'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'crampton',
    synonyms: 'crompton',
    '': 'keep as 1-1 w2r mapping'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pine apple',
    synonyms: 'pineapple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pineaple',
    synonyms: 'pineapple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'pine aple',
    synonyms: 'pineapple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'painaappil',
    synonyms: 'pineapple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ananas',
    synonyms: 'anaanas'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'anaras',
    synonyms: 'anaanas'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'anaanas',
    synonyms: 'pineapple'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'anaanas|sapurI|Annaci|Anasapandu|panasapandu'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6gb',
    synonyms: '6 gb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'स्याही',
    synonyms: 'ink'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.2kg',
    synonyms: '6.2 kg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'trimer',
    synonyms: 'trimmer'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रीकनेक्ट',
    synonyms: 'reconnect'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'rconncet',
    synonyms: 'reconnect'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'इंडक्शन',
    synonyms: 'induction'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aata',
    synonyms: 'atta'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ata',
    synonyms: 'atta'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'atta',
    synonyms: 'flour'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sonyh',
    synonyms: 'sony'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'soni',
    synonyms: 'sony'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sonny',
    synonyms: 'sony'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sone',
    synonyms: 'sony'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सोनी',
    synonyms: 'sony'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'fold 4',
    synonyms: 'fold4'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blue berry',
    synonyms: 'Blueberry'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gernal',
    synonyms: 'general'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'अक्वागार्ड',
    synonyms: 'aquaguard'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Tuchscreen',
    synonyms: 'Touchscreen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Tachscreen',
    synonyms: 'Touchscreen'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Touchscren',
    synonyms: 'Touchscreen'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'मोटरोला',
    synonyms: 'motorola'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earphon',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear phone',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear phones',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earphone',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earfon',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earfons',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earfones',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earfone',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear fone',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear fon',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear fons',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear fine',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear fones',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear fines',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'earphoens',
    synonyms: 'earphones'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ear piece',
    synonyms: 'earpiece'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'ltr|litre|liters|litres|ltrs|liter|L'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'यूएसबी',
    synonyms: 'usb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सेमसंग',
    synonyms: 'samsung'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'सॅमसंग',
    synonyms: 'samsung'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'smsung',
    synonyms: 'samsung'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'samsang',
    synonyms: 'samsung'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'truly|true'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रेलमी',
    synonyms: 'realme'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रीलमे',
    synonyms: 'realme'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रीलमी',
    synonyms: 'realme'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रीयलमी',
    synonyms: 'realme'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'रियलमी',
    synonyms: 'realme'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'realm',
    synonyms: 'realme'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sandwhich',
    synonyms: 'sandwich'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4tb',
    synonyms: '4 tb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एलजी',
    synonyms: 'lg'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'geming',
    synonyms: 'gaming'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gameng',
    synonyms: 'gaming'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gamming',
    synonyms: 'gaming'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'गेमिंग',
    synonyms: 'gaming'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'digi|digital'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'didital',
    synonyms: 'digital'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जीबी',
    synonyms: 'gb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'reyal',
    synonyms: 'real'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'केस',
    synonyms: 'case'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'iflacon',
    synonyms: 'iffalcon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.39inch',
    synonyms: '6.39 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'haiar',
    synonyms: 'haier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'haiet',
    synonyms: 'haier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'heier',
    synonyms: 'haier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'heire',
    synonyms: 'haier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'hiare',
    synonyms: 'haier'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'वायरलेस',
    synonyms: 'Wireless'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wirelss',
    synonyms: 'Wireless'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Wayarless',
    synonyms: 'Wireless'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Vireless',
    synonyms: 'Wireless'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Wireles',
    synonyms: 'Wireless'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Vireles',
    synonyms: 'Wireless'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.6inch',
    synonyms: '6.6 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कंप्यूटर',
    synonyms: 'computer'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'leetchi',
    synonyms: 'litchi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'litchee',
    synonyms: 'litchi'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'massage|massager'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'masager',
    synonyms: 'massager'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'messager',
    synonyms: 'massager'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'massag',
    synonyms: 'massage'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ईर्ष्या',
    synonyms: 'envy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bosh',
    synonyms: 'bosch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Tulaci',
    synonyms: 'tulsi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tulas',
    synonyms: 'tulsi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'thulasi',
    synonyms: 'tulsi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tulasi',
    synonyms: 'tulsi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tulsi',
    synonyms: 'Basil'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'khaari',
    synonyms: 'khari'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'sounbar',
    synonyms: 'soundbar'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'mosambi|mausomi|Inippu cunnampu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mosambi',
    synonyms: 'sweet lime'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Mausambi',
    synonyms: 'mosambi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Musambi',
    synonyms: 'mosambi'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '8inch',
    synonyms: '8 inch'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'bt',
    synonyms: 'bluetooth'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'bluetooh',
    synonyms: 'bluetooth'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blutooth',
    synonyms: 'bluetooth'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blootooth',
    synonyms: 'bluetooth'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'blue tooth',
    synonyms: 'bluetooth'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'ब्लूटूथ',
    synonyms: 'bluetooth'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'mic| microphone'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'long lasting| long last'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'brocoli',
    synonyms: 'Broccoli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'broccoli',
    synonyms: 'Broccoli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'brocolli',
    synonyms: 'Broccoli'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '11kg',
    synonyms: '11 kg'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'amrud|madhri aam|jamphala|perala|Payrakka|peru|pijuli|Koyya'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'amrud',
    synonyms: 'guava'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.5kg',
    synonyms: '10.5 kg'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'kochu|alavi|pattarveliya|kesuvinagadde|chembu|arvi|saru|arbi|seppan kizhangu|chaama gadda'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'arabi',
    synonyms: 'arbi'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'ankurit|ankuron|Aṅkura|Moggugaḷu|mulakal|Aṅkura|fala|Mulaikal|Molakalu'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'ankurit',
    synonyms: 'Sprouts'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Sprauts',
    synonyms: 'Sprouts'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '85inch',
    synonyms: '85 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Elaichi powder|Elaikka podi|Elakkai Podi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Elaichi powder',
    synonyms: 'Cardamom Powder'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '5inch',
    synonyms: '5 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '2tb',
    synonyms: '2 tb'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '12.9inch',
    synonyms: '12.9 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Kali Mirch|Kalimiri|Miriyalu|Kurumulaku|Karumilaku'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Kali Mirch',
    synonyms: 'Black Pepper'
  },
  {
    type: 'onewaysynonym',
    variant: 'SUBSTITUTE',
    keyword: 'pepper',
    synonyms: 'Black Pepper'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'KaliMirch',
    synonyms: 'Kali Mirch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'reddish',
    synonyms: 'radish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'resish',
    synonyms: 'radish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'raddish',
    synonyms: 'radish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'muli',
    synonyms: 'mooli'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'mooli',
    synonyms: 'radish'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'tebal',
    synonyms: 'table'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'paan ke patte',
    synonyms: 'betel'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'thamala pakulu|paan ke patte|supari de patte|verillai|verrila|suparichi pane'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'गैलेक्सी',
    synonyms: 'galaxy'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'galkaxy',
    synonyms: 'galaxy'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'pepper|fruity hot pepper|fruity chilli pepper'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'kaali mirch',
    synonyms: 'Kali Mirch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '14tb',
    synonyms: '14 tb'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'बोट',
    synonyms: 'boat'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'salgam',
    synonyms: 'Shalgam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Shalgam|Xalgom|shaalgom|knolknol|shajam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Shalgam',
    synonyms: 'Turnip'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.4inch',
    synonyms: '6.4 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '4.7inch',
    synonyms: '4.7 inch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'cam|camera'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'camk',
    synonyms: 'cam'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कैमरा',
    synonyms: 'camera'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कॅमेरा',
    synonyms: 'camera'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kiwwi',
    synonyms: 'Kiwi'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Saunth|Sunth| Shunti|Ona soonti|Chukku|Sukku'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'ahdrak',
    synonyms: 'adrak'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Saunth',
    synonyms: 'Dry Ginger'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'norad',
    synonyms: 'nord'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'nard',
    synonyms: 'nord'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'node',
    synonyms: 'nord'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'servic',
    synonyms: 'service'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'bael|vilampazham|Velega Pandu|Baelada Hannu|Kaith|Katbel|Kathbel'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'bael',
    synonyms: 'woodapple'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'wood apple',
    synonyms: 'woodapple'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'Ideapad|Lenovo idea|Lenovo pad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Ideaped',
    synonyms: 'Ideapad'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Idiapad',
    synonyms: 'Ideapad'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'air bud|apple pods|airpods'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'air pods',
    synonyms: 'airpods'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'एयरपॉड्स',
    synonyms: 'airpods'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '9.5kg',
    synonyms: '9.5 kg'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'टोनर',
    synonyms: 'toner'
  },
  {
    type: 'synonym',
    variant: 'NUMERICAL',
    keyword: 1,
    synonyms: 'one'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'जेबीएल',
    synonyms: 'jbl'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'माइक्रोसॉफ्ट',
    synonyms: 'microsoft'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'chestnut|trapa natans|ling|ling chio|jesuit nut|water caltrops'
  },
  {
    type: 'synonym',
    variant: 'EXPANSION',
    keyword: 'sbs',
    synonyms: 'side-by-side'
  },
  {
    type: 'synonym',
    variant: 'SUBSTITUTE',
    keyword: 'Strawberry',
    synonyms: 'berries'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '10.5inch',
    synonyms: '10.5 inch'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'chow chow|bangalore brinjal'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6tb',
    synonyms: '6 tb'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: '11 generation|11th generation'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'intal',
    synonyms: 'intel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'intil',
    synonyms: 'intel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'intell',
    synonyms: 'intel'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'intul',
    synonyms: 'intel'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms:
      'mitha aalu|shakkariya|genasu|madhurakkiz|kandamula|shakkar kandi|sarkaraivalli kizhangu|chilakada dumpa|shakarkand|shakar kand|ranga aaloo|mishti aaloo|ratale|ratalu|bathal'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'shakkar kandi',
    synonyms: 'sweet potato'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.7inch',
    synonyms: '6.7 inch'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'shahtut',
    synonyms: 'shahtoot'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'shahtoot',
    synonyms: 'Mulberry'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '55inch',
    synonyms: '55 inch'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'उषा',
    synonyms: 'usha'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'gyser',
    synonyms: 'geyser'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'plam',
    synonyms: 'plum'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Pilam',
    synonyms: 'plum'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'bogori|koli|Alubukhara'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aloobukhara',
    synonyms: 'Alubukhara'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'alubhukkara',
    synonyms: 'Alubukhara'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'aalobukhara',
    synonyms: 'Alubukhara'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Alubukhara',
    synonyms: 'plum'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'babymelon',
    synonyms: 'baby melon'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lasoda',
    synonyms: 'lasura'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lasua',
    synonyms: 'lasura'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'lasora',
    synonyms: 'lasura'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'lasura',
    synonyms: 'Cordia'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कॅरियर',
    synonyms: 'carrier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'carrie',
    synonyms: 'carrier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'career',
    synonyms: 'carrier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'cariar',
    synonyms: 'carrier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'caryar',
    synonyms: 'carrier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'carior',
    synonyms: 'carrier'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '75inch',
    synonyms: '75 inch'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH SYNONYMS',
    keyword: '',
    synonyms: 'Methi dana|Methi dane|Menthulu|Menthe|Uluva|Vendayam'
  },
  {
    type: 'synonym',
    variant: 'HINGLISH',
    keyword: 'Methi dane',
    synonyms: 'Fenugreek seeds'
  },
  {
    type: 'synonym',
    variant: 'DEVNAGRI',
    keyword: 'कोडेक',
    synonyms: 'Kodak'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kodek',
    synonyms: 'Kodak'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kodac',
    synonyms: 'Kodak'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kodec',
    synonyms: 'Kodak'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'Kodk',
    synonyms: 'Kodak'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'jeneration',
    synonyms: 'generation'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: 'genration',
    synonyms: 'generation'
  },
  {
    type: 'synonym',
    variant: 'SYNONYMS',
    keyword: '',
    synonyms: 'gen|generation'
  },
  {
    type: 'synonym',
    variant: 'SPELL VARIANT',
    keyword: '6.26inch',
    synonyms: '6.26 inch'
  }
];
export default synonyms;
