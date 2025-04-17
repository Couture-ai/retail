const data = {
  ExtractCatalogueRightWords: {
    max_rightword_length: 17,
    max_categories: 1000,
    min_category_percentile: 1,
    min_category_wise_rightword_percentage: 1,
    min_product_count: 30,
    min_product_count_for_known_words: 500
  },
  GetBrandCollectionsAndStyleType: {},
  AnalyseR2RMapping: {
    query_column: 'query',
    history_freq_column: 'freq',
    min_token_count: 10,
    max_query_length: 3,
    analysis: 'false',
    wrong_word_column: 'rightword'
  },
  DetectMerchantWords: {
    precision_threshold: 0.2,
    min_history_queries_consideration: 100,
    max_merchant_word_freq: 250
  },
  AnalyseM2RMapping: {
    query_column: 'query',
    history_freq_column: 'freq',
    min_token_count: 10,
    max_query_length: 3,
    analysis: 'false',
    wrong_word_column: 'wrongword',
    right_word_column: 'rightword'
  },
  FilterMerchantCorrections: {
    merchant_top_one_score_threshold: 0.5,
    merchantCorrectionPrecisionThreshold: 0.05
  },
  GeneratePhrasesMetaData: { test: 'true' },
  FetchPropertiesForNewPhrases: {},
  GenerateDerivedPhrases: { min_entities_percentile: 0.9973 },
  FilterGeneratedPhrasesTest: {
    phrases_column_name: 'phrase',
    frequency_column_name: 'count',
    test: 'true'
  },
  AddBrandsCategoriesAndOtherWords: {},
  CombineEntityCorpuses: {
    word_entities_corpus_paths: 'WordsWithEntitiesPerCategory',
    phrase_entities_corpus_paths: 'EntityCorpusForNewPhrases,PhrasesWithEntitiesPerCategory',
    test: 'true'
  },
  PopulateNumericalEntitiesRangeWise: {},
  InternalBrandSubstitutes: {
    cosine_threshold: 0.5,
    brand_sub_count_threshold: 20
  },
  BrandClustering: {},
  GetBrandFamilySynonyms: { min_count_for_brand_significance: 10 },
  GenerateSimilarWords: {
    user_column_name: 'rightword',
    feature_column_name: 'vector',
    max_similar_items: '10',
    similar_hierarchical: 'false',
    similar_algo: 'dotcosine'
  },
  MapSimilarWordsToCategoryWords: {},
  FilterCategorySynonyms: {},
  FilterSplitWordPhrases: { test: 'true' },
  FilterRightQueriesFromHistory: {
    query_col: 'query',
    query_split_col: 'query_normalised',
    freq_col: 'freq',
    min_query_clicks_confidence: 5
  },
  FilterCategoriesForPhrases: { correct_word_column_name: 'phrase' },
  FilterCategoriesForWords: { correct_word_column_name: 'rightword' },
  AddHistoryCategoriesToPhrases: {
    right_column: 'phrase',
    couture_weight: 0.7,
    threshold: 0.01
  },
  AddHistoryCategoriesToWords: {
    right_column: 'rightword',
    couture_weight: 0.7,
    threshold: 0.01
  },
  CombineWordProperties: { token_col: 'rightword', test: 'true' },
  CombinePhraseProperties: { token_col: 'phrase', test: 'true' },
  FilterExternalVariants: { external_word_column: 'word' },
  GenerateSpellVariantsForWords: { hierarchy: 'colorGroup_string' },
  CombineWordVariants: {
    all_dfs: 'SpellVariants,WordsExternalVariants,LemmatizedVariants,PhoneticVariants',
    primary_cols: 'wrongword,rightword',
    cols_handle_type: 'intersect',
    test: 'true'
  },
  ScoreW2RVariants: { test: 'true' },
  IdentifyMissedHistoryWords: { frequency_threshold: 20 },
  AddHistoryPhoneticVariants: { search_term_column: 'search_term' },
  DetermineCandidatesForMissedHistoryWords: {
    max_word_length_deviation: 4
  },
  CombineHistoryVariantsIntoW2R: {
    all_dfs: 'W2RCombinedVariants,HistoryVariants,PhoneticallySameVariants',
    primary_cols: 'wrongword,rightword',
    cols_handle_type: 'reference',
    test: 'true'
  },
  CheckW2RMappingsPrecision: {
    wrong_word_column: 'wrongword',
    right_word_column: 'rightword'
  },
  RemoveExternalPhraseVariantsFromW2R: {},
  CalculateDamerauLevenshteinSimilarity: {
    compare_columns_list: 'wrongword,rightword,ipa_wrongword,ipa_rightword',
    score_columns_list: 'levenshtein_score,phonetic_score',
    test: 'true'
  },
  GetW2RScoreFromHistory: {
    query_column: 'query',
    history_freq_column: 'freq',
    min_token_count: 0,
    max_query_length: 3,
    analysis: 'false'
  },
  CalculateFinalScore: {
    levenshtein_weight: 0.25,
    phonetics_weight: 0.25,
    history_precision_weight: 0.5,
    test: 'true'
  },
  CleanAndNormalisePhrases: { query_col: 'phrase', test: 'true' },
  SpellCheckPhrases: { query_col: 'phrase', test: 'true' },
  GeneratePhraseKeyVariants: { test: 'true' },
  GenerateBrandChunks: { test: 'true' },
  CombineTokenVariantsWithProperties: { test: 'true' },
  MakeManualChanges: { test: 'true' },
  HandleConflictingCategoryPhrases: { test: 'true' },
  GenerateInternalW2RJSON: {
    correct_word_column_name: 'rightword',
    wrong_word_column_name: 'wrongword'
  },
  GenerateInternalPhrasesJSON: {
    correct_word_column_name: 'phrase',
    wrong_word_column_name: 'phrase_key'
  },
  EntityCorpusToInternalJSON: {
    pg_table_entity_corpus: 'project_ajiowordentitiesdict'
  },
  NumericalEntitiesToInternalJSON: {
    pg_table_numerical_corpus: 'project_ajionumericalrangedict'
  },
  GetTopKRightwordsForMerchantWords: {
    k: 10,
    w1: 0.0,
    w2: 0.04,
    w3: 0.7,
    w4: 0.26,
    w5: 0.0,
    length_threshold: 5,
    led_threshold: 0.3,
    ped_threshold: 0.2
  },
  PluralizeWordsToCategoryWords: { test: 'true' },
  GenerateEntityWiseAttributes: { test: 'true' },
  GetBrandPhrases: {},
  RefineCategorySynonyms: {},
  SplitRightWords: {
    splitword_products_threshold: 20,
    single_character_products_threshold: 1000,
    test: 'true'
  },
  GenerateUserSplitWords: { test: 'true' },
  GeneratePhoneticVariants: { phonetic_edit_dist_threshold: 0.85 },
  GenerateLemmatizedVariants: {},
  MapMissedHistoryWords: {
    levenshtein_edit_dist_threshold: 0.2,
    phonetic_edit_dist_threshold: 0.18,
    top_k_missed_words: 500
  },
  GenerateIPATransliterations: {
    max_ipa_computations: 30000,
    test: 'true'
  },
  PermutePluralWordsInPhrases: { test: 'true' },

  PreProcessCatalogueData: {
    min_catalogue_attributes_count: 100,
    min_product_count: 400000,
    min_brands_count: 3500,
    min_l1l2_categories_count: 70,
    min_l1l3_categories_count: 290,
    pg_table_catalogue: 'project_catalogue',
    test: 'true'
  },
  GenerateCatalogueSummary: { SUMMARYTYPE: 'catalogue' },
  DeriveCategoryAssociations: { test: 'true' },
  ExtractBrandsAndSpecialBrands: {},
  TransposeCatalogueAttributes: { test: 'true' },
  TransposeCatalogueNumericalAttributes: {},
  GenerateCatalogueWordIndexes: {
    product_id_column: 'colorGroup_string',
    pg_table_open_tokens: 'project_opentokenindex'
  }
};
export default data;
