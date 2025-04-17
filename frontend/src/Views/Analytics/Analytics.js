/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Spinner,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  theme
  // Button
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import BreadCrumb from '../../Components/BreadCrumb/BreadCrumb';
import Card from '../../Components/Card/Card';
import Container from '../../Components/Container/Container';
import StatsCard from '../../Containers/Stats/StatsCard';
// import AreaGraphChart from '../../Components/Charts/AreaGraphChart';
import AnalyticsTable from '../../Containers/AnalyticsTable/AnalyticsTable';
import ComparisonStatsChart from '../../Containers/Stats/ComparisonStatsCard';
import ComparisonCard from '../../Containers/ComparisonCard/ComparisonCard';
// import CustomFunnelChart from '../../Components/Charts/CustomFunnelChart';
// import LineChart from '../../Components/Charts/LineChart';
import SinglePieChart from '../../Components/Charts/SinglePieChart';
// import ShortcutIcon from '@mui/icons-material/Shortcut';
import axios from 'axios';
import format from 'date-fns/format';
// import useDetectSticky from '../../Hooks/sticky';
import { AnalyticsContext } from '../../Contexts/AnalyticsContext';

const AnalyticsDetails = (props) => {
  const valueInPer = '+38%';
  const isValueInPerPositive = valueInPer.includes('+') || !valueInPer.includes('-');
  const [filter, setFilter] = useState(false);
  const [totalSearchesData, setTotalSearchesData] = useState(null);
  // const [totalUsersData, setTotalUsersData] = useState(null);
  const [clickThroughRate, setClickThroughRate] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [noResultsRate, setNoResultsRate] = useState(null);
  const [noClicksRate, setNoClicksRate] = useState(null);
  const [noData, setNoData] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsAreaData, setAnalyticsAreaData] = useState(null);
  const [analyticsComparisonAreaData, setAnalyticsComparisonAreaData] = useState(null);
  const [cancelToken, setCancelToken] = useState(null);
  const [funnelData, setFunnelData] = useState();
  // const [selectedShortCut, setSelectedShortCut] = useState('');
  // const shortcuts = ['Yesterday', 'Past Week', 'Past Month'];
  // const [totalData, setTotalData] = useState(null);
  // const [range, setRange] = useState([
  //   {
  //     startDate: new Date(2023, 9, 1),
  //     endDate: new Date(2023, 9, 31),
  //     key: 'selection'
  //   }
  // ]);

  // const [rangeComp, setRangeComp] = useState([
  //   {
  //     startDate: new Date(2023, 9, 1),
  //     endDate: new Date(2023, 9, 31),
  //     key: 'selection'
  //   }
  // ]);
  const { range, setRange, rangeComp, setRangeComp, comparison, setComparison } =
    useContext(AnalyticsContext);
  // const [isSticky, ref] = useDetectSticky();

  useEffect(() => {
    return () => {
      // Cleanup function to cancel the request if component unmounts
      if (cancelToken) {
        cancelToken.cancel('Request canceled due to component unmounting.');
      }
    };
  }, [cancelToken]);

  useEffect(() => {
    if (cancelToken) {
      cancelToken.cancel('Request canceled due to new request.');
    }
    // Create a new cancellation token for the current request
    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken);
    var config = {
      method: 'get',
      url: comparison
        ? `${import.meta.env.VITE_API_ANALYTICS_URL}/analytics?start=${format(
            range[0].startDate,
            'yyyy-MM-dd'
          )}&end=${format(range[0].endDate, 'yyyy-MM-dd')}&startComp=${format(
            rangeComp[0].startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(rangeComp[0].endDate, 'yyyy-MM-dd')}`
        : `${import.meta.env.VITE_API_ANALYTICS_URL}/analytics?start=${format(
            range[0].startDate,
            'yyyy-MM-dd'
          )}&end=${format(range[0].endDate, 'yyyy-MM-dd')}&startComp=${format(
            range[0].startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(range[0].endDate, 'yyyy-MM-dd')}`,
      cancelToken: newCancelToken.token
    };
    axios(config)
      .then(function (response) {
        setNoData(false);
        setAnalyticsData(response.data);
        setTotalSearchesData(response.data?.searches_graph);
        // setTotalUsersData(response.data?.users_graph);
        setClickThroughRate(response.data?.ctr_graph);
        setConversionRate(response.data?.cvr_graph);
        setNoResultsRate(response.data?.zsr_graph);
        setNoClicksRate(response.data?.zcr_graph);
        const transformedData = {};

        response.data.overview_graph.forEach((entry) => {
          Object.keys(entry).forEach((key) => {
            if (key != 'name') {
              if (!transformedData[key]) {
                transformedData[key] = [];
              }
              transformedData[key].push(entry[key]);
            }
          });
        });
        setAnalyticsAreaData(transformedData);
        setAnalyticsComparisonAreaData(transformedData);
        let funnel_data = {
          'Date Range A': [
            {
              name: 'Total Searches',
              value: response.data.funnel.data.total_searches,
              fill: '#CAA00B'
            },
            {
              name: 'Total Clicks',
              value: response.data.funnel.data.total_clicks,
              fill: '#1A54EC'
            },
            {
              name: 'Total Bag',
              value: response.data.funnel.data.total_bag,
              fill: '#E83D18'
            },
            {
              name: 'Total Conversions',
              value: response.data.funnel.data.total_conversions,
              fill: '#D76291'
            }
          ]
        };
        comparison &&
          (funnel_data['Date Range B'] = [
            {
              name: 'Total Searches',
              value: response.data.funnel.data_comp.total_searches,
              fill: '#CAA00B'
            },
            {
              name: 'Total Clicks',
              value: response.data.funnel.data_comp.total_clicks,
              fill: '#1A54EC'
            },
            {
              name: 'Total Bag',
              value: response.data.funnel.data_comp.total_bag,
              fill: '#E83D18'
            },
            {
              name: 'Total Conversions',
              value: response.data.funnel.data_comp.total_conversions,
              fill: '#D76291'
            }
          ]);
        setFunnelData(funnel_data);
      })
      .catch(function () {
        setAnalyticsData(null);
        setNoData(true);
      });
  }, [range, rangeComp]);

  const handleComparison = () => {
    setComparison(!comparison);
  };

  const handleFilter = () => {
    setFilter(!filter);
  };

  // const handleShortcuts = (shortcut) => {
  //   let startDate = '';
  //   let endDate = '';
  //   if (shortcut == 'Yesterday') {
  //     startDate = addDays(new Date(), -1);
  //     endDate = addDays(new Date(), -1);
  //   } else if (shortcut == 'Past Week') {
  //     startDate = addDays(new Date(), -7);
  //     endDate = addDays(new Date(), -1);
  //   } else if (shortcut == 'Past Month') {
  //     startDate = addDays(new Date(), -30);
  //     endDate = addDays(new Date(), -1);
  //   }
  //   setRange([
  //     {
  //       startDate: startDate,
  //       endDate: endDate,
  //       key: 'selection'
  //     }
  //   ]);
  //   setRangeComp([
  //     {
  //       startDate: startDate,
  //       endDate: endDate,
  //       key: 'selection'
  //     }
  //   ]);
  // };

  const breadCrumbItemList = [
    {
      name: 'Visual Merchandiser',
      asLink: true,
      toLink: `${import.meta.env.VITE_ROUTE_PREFIX}/vm/visual-merchandiser`
    },
    {
      name: 'Analytics Details',
      asLink: false,
      toLink: null
    }
  ];

  const header = [
    {
      name: 'Query',
      colSpan: 1
    },
    {
      name: 'Count A',
      colSpan: 1
    }
  ];

  const headerTopResults = [
    {
      name: 'Product Name',
      colSpan: 1
    },
    {
      name: 'Count',
      colSpan: 1
    }
  ];

  const formatNumber = (num) => {
    if (String(num).length <= 3) {
      return num;
    }
    if (String(num).length === 4 || String(num).length === 5) {
      return String(parseFloat((num / 1000).toFixed(2))) + 'K';
    } else if (String(num).length === 6 || String(num).length === 7) {
      return String(parseFloat((num / 100000).toFixed(2))) + 'Lk';
    } else {
      return String(parseFloat((num / 10000000).toFixed(2))) + 'Cr';
    }
  };

  const [isHover, setIsHover] = useState(false);

  const handleInfo = () => {
    setIsHover(true);
  };

  const handleInfoLeave = () => {
    setIsHover(false);
  };

  return (
    <Container isCollapsed={props.isCollapsed} w="100%">
      <Box w="100%" mx={4} gap={6} pl="2">
        {/* <BreadCrumb itemList={breadCrumbItemList} /> */}
        <Flex flexDir={'column'} w="100%" mt={4}>
          <Text variant={'body1'} style={{ fontSize: '20px' }} my={2}>
            Overview
          </Text>
          {/* <Flex
            w="100%"
            ref={ref}
            style={{
              position: 'sticky',
              top: '-1px',
              transition: '.2s ease-out',
              zIndex: 999
            }}>
            {' '}
            <ComparisonCard
              isSticky={isSticky}
              handleComparison={handleComparison}
              comparison={comparison}
              filter={filter}
              handleFilter={handleFilter}
              range={range}
              setRange={setRange}
              rangeComp={rangeComp}
              setRangeComp={setRangeComp}
            />
          </Flex> */}

          {analyticsData ? (
            <>
              <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(3, 1fr)" gap="20px">
                <GridItem rowSpan={1} colSpan={3} gap="20px">
                  <Grid
                    h="100%"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(3, 1fr)"
                    gap={'20px'}
                    mt={4}>
                    <GridItem rowSpan={1} colSpan={1}>
                      {comparison ? (
                        <ComparisonStatsChart
                          bg={'#263f5b'}
                          textColor="white"
                          title={'Total Sessions'}
                          info={'Total unique search sessions initiated on the portal'}
                          valueInNumA={formatNumber(analyticsData.users_stats.totalUsers)}
                          valueInPerA={String(analyticsData.users_stats.perChange)}
                          valueInNumB={formatNumber(analyticsData.users_stats.totalUsersComp)}
                          graphDir={'bottom'}
                          // graphData={totalUsersData}
                          color={'#1AADEC'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      ) : (
                        <StatsCard
                          bg={'#263f5b'}
                          textColor="white"
                          title={'Total Sessions'}
                          info={'Total unique search sessions initiated on the portal '}
                          valueInNum={formatNumber(analyticsData.users_stats?.totalUsers)}
                          valueInPer={String(analyticsData.users_stats?.perChange)}
                          graphDir={'bottom'}
                          // graphData={totalUsersData}
                          color={'#1AADEC'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      )}
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={1}>
                      {comparison ? (
                        <ComparisonStatsChart
                          title={'Total Searches'}
                          info={'Total unique search queries entered by users'}
                          valueInNumA={formatNumber(analyticsData.search_stats?.totalSearches)}
                          valueInPerA={String(analyticsData.search_stats?.perChange)}
                          valueInNumB={formatNumber(analyticsData.search_stats?.totalSearchesComp)}
                          graphDir={'bottom'}
                          graphData={totalSearchesData}
                          colorA={'#CAA00B'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      ) : (
                        <StatsCard
                          title={'Total Searches'}
                          info={'Total unique search queries entered by users'}
                          valueInNum={formatNumber(analyticsData.search_stats?.totalSearches)}
                          valueInPer={String(analyticsData.search_stats?.perChange)}
                          graphDir={'bottom'}
                          // graphData={totalSearchesData}
                          color={'#CAA00B'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      )}
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={1}>
                      {comparison ? (
                        <ComparisonStatsChart
                          title={'No Results Rate'}
                          info={'Percentage of queries retrieving no products'}
                          valueInNumA={formatNumber(analyticsData.zsr_stats.totalZsr)}
                          valueInPerA={String(analyticsData.zsr_stats.perChange)}
                          valueInNumB={formatNumber(analyticsData.zsr_stats.totalZsrComp)}
                          graphDir={'bottom'}
                          graphData={noResultsRate}
                          colorA={'#DE7777'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      ) : (
                        <StatsCard
                          title={'No Results Rate'}
                          info={'Percentage of queries retrieving no products'}
                          valueInNum={formatNumber(analyticsData.zsr_stats?.totalZsr)}
                          valueInPer={String(analyticsData.zsr_stats?.perChange)}
                          graphDir={'bottom'}
                          // graphData={noResultsRate}
                          color={'#DE7777'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      )}
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={1}>
                      {comparison ? (
                        <ComparisonStatsChart
                          title={'Click-Through Rate'}
                          info={'Percentage of search queries that elicit a click from a user'}
                          valueInNumA={`${analyticsData.ctr_stats.totalClicks}%`}
                          valueInPerA={String(analyticsData.ctr_stats.perChange)}
                          valueInNumB={`${analyticsData.ctr_stats.totalClicksComp}%`}
                          graphDir={'bottom'}
                          graphData={clickThroughRate}
                          colorA={'#1A54EC'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      ) : (
                        <StatsCard
                          title={'Click-Through Rate'}
                          info={'Percentage of search queries that elicit a click from a user'}
                          valueInNum={`${analyticsData.ctr_stats?.totalClicks}%`}
                          valueInPer={String(analyticsData.ctr_stats?.perChange)}
                          graphDir={'botttom'}
                          // graphData={clickThroughRate}
                          color={'#1A54EC'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      )}
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={1}>
                      {comparison ? (
                        <ComparisonStatsChart
                          title={'Conversion Rate'}
                          info={
                            'Percentage of search queries that result in at least one "Purchase" action by a user'
                          }
                          valueInNumA={`${analyticsData.cvr_stats.totalClicks}%`}
                          valueInPerA={String(analyticsData.cvr_stats.perChange)}
                          valueInNumB={`${analyticsData.cvr_stats.totalClicksComp}%`}
                          graphDir={'bottom'}
                          graphData={conversionRate}
                          colorA={'#D76291'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      ) : (
                        <StatsCard
                          title={'Conversion Rate'}
                          info={
                            'Percentage of search queries that result in at least one "Purchase" action by a user'
                          }
                          valueInNum={`${analyticsData.cvr_stats?.totalClicks}%`}
                          valueInPer={String(analyticsData.cvr_stats?.perChange)}
                          graphDir={'bottom'}
                          // graphData={conversionRate}
                          color={'#D76291'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      )}
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={1}>
                      {comparison ? (
                        <ComparisonStatsChart
                          title={'No Clicks Rate'}
                          info={
                            'Percentage of search queries that do not elicit a click from a user'
                          }
                          valueInNumA={`${analyticsData.zcr_stats.totalZcr}%`}
                          valueInPerA={String(analyticsData.zcr_stats.perChange)}
                          valueInNumB={`${analyticsData.zcr_stats.totalZcrComp}%`}
                          graphDir={'bottom'}
                          graphData={noClicksRate}
                          colorA={'#E83D18'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      ) : (
                        <StatsCard
                          title={'No Clicks Rate'}
                          info={
                            'Percentage of search queries that do not elicit a click from a user'
                          }
                          valueInNum={`${analyticsData.zcr_stats?.totalZcr}%`}
                          valueInPer={String(analyticsData.zcr_stats?.perChange)}
                          graphDir={'bottom'}
                          // graphData={noClicksRate}
                          color={'#E83D18'}
                          margin={2}
                          graphWidth={300}
                          graphHeight={50}
                        />
                      )}
                    </GridItem>
                  </Grid>
                </GridItem>
                {/* <GridItem rowSpan={1} colSpan={1} mt={4}>
                  <Card h="100%">
                    <Flex>
                      <Text variant="body1">Conversion/Bag</Text>
                      <Popover placement="right" trigger="hover">
                        <PopoverTrigger>
                          <InfoOutlined
                            style={{
                              color: isHover ? 'black.400' : 'Alpha',
                              width: '15px',
                              height: '15px'
                            }}
                            onMouseEnter={handleInfo}
                            onMouseLeave={handleInfoLeave}
                            cursor={'pointer'}
                          />
                        </PopoverTrigger>
                        <PopoverContent maxW="30vh" p={3}>
                          <PopoverArrow />
                          <Text
                            color="black.1000"
                            fontSize="10px"
                            wordBreak="break-word"
                            wordWrap="break-word"
                            ml={1}
                            maxW="20vh">
                            Conversion/Bag is the ratio of the number of conversions to the number
                            of bags.
                          </Text>
                        </PopoverContent>
                      </Popover>
                    </Flex>
                    <Flex w="100%" justifyContent="center" alignItems="center">
                      <SinglePieChart
                        width={300}
                        // innerRadius={60}
                        height={300}
                        isTooltip={true}
                        data={[
                          {
                            name: 'Conversion',
                            value: analyticsData.pie_chart.date.ratio,
                            color: '#52AF77'
                          },
                          { name: 'Bag', value: 100, color: '#ebebeb' }
                        ]}
                      />
                    </Flex>
                  </Card>
                </GridItem> */}
              </Grid>

              {/* <Card w="100%" mt={4} h={'80vh'} position={'relative'}>
                <Flex flexDir={'column'} w="100%" align={'center'} justifyContent={'center'}> */}
              {/* <Grid
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(5, 1fr)"
                gap={'20px'}
                mt="20px">
                <GridItem rowSpan={1} colSpan={3}>
                  <Card mt={4} h={'80vh'}>
                    <Flex direction="column">
                      <Flex flexDir={'row'} gap="5px" alignItems={'center'}>
                        <Text variant={'body1'} my={2}>
                          User Engagement and Conversion Overview
                        </Text>
                        <Popover placement="right" trigger="hover">
                          <PopoverTrigger>
                            <InfoOutlined
                              style={{
                                color: theme.colors.gray.light,
                                width: '15px',
                                height: '15px'
                              }}
                              onMouseEnter={handleInfo}
                              onMouseLeave={handleInfoLeave}
                              cursor={'pointer'}
                            />
                          </PopoverTrigger>
                          <PopoverContent maxW="30vh" p={3}>
                            <PopoverArrow />
                            <Text
                              color="black.1000"
                              fontSize="10px"
                              wordBreak="break-word"
                              wordWrap="break-word"
                              ml={1}
                              maxW="20vh">
                              Illustration of key performance indicators encompassing user activity,
                              search outcomes, and conversion effectiveness.
                            </Text>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                      <Text color="#999999">Click through Rates, Conversion Rates over time.</Text>
                    </Flex>
                    <Box h="90%" m={5} align={'center'} justifyContent={'center'}>
                      {comparison ? (
                        <LineChart
                          data={analyticsComparisonAreaData}
                          xAxisLabels={analyticsData?.overview_graph?.map((item) => item.name)}
                        />
                      ) : (
                        // <AreaGraphChart data={analyticsAreaData} width={850} />
                        <LineChart
                          data={analyticsAreaData}
                          xAxisLabels={analyticsData?.overview_graph?.map((item) => item.name)}
                        />
                      )}
                    </Box>
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={2}>
                  <Card mt={4} h={'80vh'}>
                    <Flex flexDir={'row'} gap="5px" mb={2} alignItems={'center'}>
                      <Text variant={'body1'} my={2}>
                        Search Funnel
                      </Text>
                      <Popover placement="right" trigger="hover">
                        <PopoverTrigger>
                          <InfoOutlined
                            style={{
                              color: isHover ? 'black.400' : '#bbbbbb',
                              width: '15px',
                              height: '15px'
                            }}
                            onMouseEnter={handleInfo}
                            onMouseLeave={handleInfoLeave}
                            cursor={'pointer'}
                          />
                        </PopoverTrigger>
                        <PopoverContent maxW="30vh" p={3}>
                          <PopoverArrow />
                          <Text
                            color="black.1000"
                            fontSize="10px"
                            wordBreak="break-word"
                            wordWrap="break-word"
                            ml={1}
                            maxW="20vh">
                            Funnel visualization of the search process, from the number of searches,
                            to the number of clicks, and finally to the number of conversions.
                          </Text>
                        </PopoverContent>
                      </Popover>
                    </Flex>
                    <Flex h="90%" justifyContent="center" alignItems="center">
                      <CustomFunnelChart funnelData={funnelData} comparison={comparison} />
                    </Flex>
                  </Card>
                </GridItem>
              </Grid> */}
              {/* </Flex>
              </Card> */}
              {/* <Card w="100%" mt={4} h={'30vh'}>
                <Flex flexDir={'row'} justifyContent={'space-between'}>
                  <Flex flexDir={'column'}>
                    <Text variant={'body1'}>Click Position</Text>
                    <Text variant={'body3regular'} w={'40%'} style={{ fontSize: '10px' }}>
                      Average position of the clicks performed on the search results. Smaller values
                      are better.
                    </Text>
                  </Flex>
                  <Flex alignContent={'end'} alignItems={'end'}>
                    <Text variant={'body3regular'} fontSize="10px" color="Alpha">
                      There is no data
                    </Text>
                  </Flex>
                  <Flex flexDir={'column'}>
                    <Text variant={'body1'} align={'right'}>
                      Average
                    </Text>
                    <Text
                      variant={'body3regular'}
                      align={'right'}
                      style={{
                        fontSize: '10px'
                      }}>
                      Showing click positions on 0 searches with clicks.
                    </Text>
                  </Flex>
                </Flex>
              </Card> */}
              <AnalyticsTable
                header={comparison ? [...header, { name: 'Count B', colSpan: 1 }] : header}
                isValueInPerPositive={isValueInPerPositive}
                headerTopResults={
                  comparison
                    ? [...headerTopResults, { name: 'Count B', colSpan: 1 }]
                    : headerTopResults
                }
                data={analyticsData}
                comparison={comparison}
                range={range}
                rangeComp={rangeComp}
              />
            </>
          ) : noData ? (
            <Box align={'center'} justifyContent={'center'} w="98%" h="60vh" mt={3}>
              <Text fontSize="12px" color="Alpha">
                No Data Available
              </Text>
              <Text fontSize="12px" color="Alpha">
                Change Date Range
              </Text>
            </Box>
          ) : (
            <Box align={'center'} justifyContent={'center'} w="98%" h="60vh" mt={3}>
              <Spinner size="xl" color="blue.500" />
            </Box>
          )}
        </Flex>
      </Box>
    </Container>
  );
};

export default AnalyticsDetails;
