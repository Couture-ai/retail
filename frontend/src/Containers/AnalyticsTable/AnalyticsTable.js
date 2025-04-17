/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Flex, Text, Tr, Td, useTheme, Spacer } from '@chakra-ui/react';
import format from 'date-fns/format';
// import Card from "../../Components/Card/Card";
import ScrollableTable from '../../Components/Table/ScrollableTable';
import AnalyticsTableIndi from './AnalyticsTableIndi';
import axios from 'axios';
import { AnalyticsContext } from '../../Contexts/AnalyticsContext';
import { XTable, useXTableState } from '../../Library/Table/CommonTable';

const AnalyticsTable = (props) => {
  const theme = useTheme();
  const isValueInPerPositive = (per) => {
    return per.includes('+') || !per.includes('-') ? true : false;
  };
  const pageSize = 100;
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState([]);
  const [topInteractedProducts, setTopInteractedProducts] = useState([]);
  const [zsr, setZsr] = useState([]);
  // const [isSearchLoading, setIsSearchLoadig] = useState(false);
  // const [isTopLoading, setIsTopLoading] = useState(false);
  // const [isZsrLoading, setIsZsrLoading] = useState(false);
  const [searchHistoryPage, setSearchHistoryPage] = useState(0);
  const [topProductsPage, setTopProductsPage] = useState(0);
  const [zsrPage, setZsrPage] = useState(0);
  const { range, setRange, rangeComp, setRangeComp, comparison, setComparison } =
    useContext(AnalyticsContext);

  const fetchSearchHistory = async (state, page = 1) => {
    const _range = state.external.range ?? range[0];
    const _rangeComp = state.external.rangeComp ?? rangeComp[0];
    console.log('x external RANGE', _range, _rangeComp);

    const start_row = Math.floor((page - 1) * pageSize);
    const end_row = Math.floor((page - 1) * pageSize + pageSize - 1);
    var config = {
      method: 'GET',
      url: comparison
        ? `${import.meta.env.VITE_API_ANALYTICS_URL}/search?start=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&end=${format(_range.endDate, 'yyyy-MM-dd')}&startComp=${format(
            _rangeComp.startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(
            _rangeComp.endDate,
            'yyyy-MM-dd'
          )}&flag=${false}&start_row=${start_row}&end_row=${end_row}`
        : `${import.meta.env.VITE_API_ANALYTICS_URL}/search?start=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&end=${format(_range.endDate, 'yyyy-MM-dd')}&startComp=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(
            _range.endDate,
            'yyyy-MM-dd'
          )}&flag=${false}&start_row=${start_row}&end_row=${end_row}`
    };
    let response;
    try {
      response = await axios(config);
    } catch (e) {
      console.log('X external error', e);
    }

    return {
      data: response?.data?.search ?? [],
      totalRecords: response.data.totalRecords ?? 1000
    };
  };

  const fetchTopProducts = async (state, page = 1) => {
    const start_row = Math.floor((page - 1) * pageSize);
    const end_row = Math.floor((page - 1) * pageSize + pageSize - 1);
    const _range = state.external.range ?? range[0];
    const _rangeComp = state.external.rangeComp ?? rangeComp[0];
    var config = {
      method: 'GET',
      url: comparison
        ? `${import.meta.env.VITE_API_ANALYTICS_URL}/top-results?start=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&end=${format(_range.endDate, 'yyyy-MM-dd')}&startComp=${format(
            _rangeComp.startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(
            _rangeComp.endDate,
            'yyyy-MM-dd'
          )}&flag=${false}&start_row=${start_row}&end_row=${end_row}`
        : `${import.meta.env.VITE_API_ANALYTICS_URL}/top-results?start=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&end=${format(_range.endDate, 'yyyy-MM-dd')}&startComp=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(
            _range.endDate,
            'yyyy-MM-dd'
          )}&start_row=${start_row}&end_row=${end_row}`
    };
    let response;
    try {
      response = await axios(config);
    } catch (e) {
      console.log(e);
    }

    return {
      data: response?.data?.topResults ?? [],
      totalRecords: response.data.totalRecords ?? 1000
    };
  };

  const fetchZSR = async (state, page = 1) => {
    const start_row = Math.floor((page - 1) * pageSize);
    const end_row = Math.floor((page - 1) * pageSize + pageSize - 1);
    const _range = state.external.range ?? range[0];
    const _rangeComp = state.external.rangeComp ?? rangeComp[0];
    var config = {
      method: 'GET',
      url: comparison
        ? `${import.meta.env.VITE_API_ANALYTICS_URL}/zsr?start=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&end=${format(_range.endDate, 'yyyy-MM-dd')}&startComp=${format(
            _rangeComp.startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(
            _rangeComp.endDate,
            'yyyy-MM-dd'
          )}&flag=${false}&start_row=${start_row}&end_row=${end_row}`
        : `${import.meta.env.VITE_API_ANALYTICS_URL}/zsr?start=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&end=${format(_range.endDate, 'yyyy-MM-dd')}&startComp=${format(
            _range.startDate,
            'yyyy-MM-dd'
          )}&endComp=${format(
            _range.endDate,
            'yyyy-MM-dd'
          )}&flag=${false}&start_row=${start_row}&end_row=${end_row}`
    };
    let response;
    try {
      response = await axios(config);
    } catch (e) {
      console.log(e);
    }

    return {
      data: response?.data?.zsr ?? [],
      totalRecords: response.data.totalRecords ?? 1000
    };
  };

  useEffect(() => {
    setTableStateSearchHistory((_tableStateSearchHistory) => ({
      ..._tableStateSearchHistory,
      columns: {
        ..._tableStateSearchHistory.columns,
        hiddenColumns: comparison ? [] : ['Compared to']
      }
    }));
    setTableStateTopProducts((_tableStateTopProducts) => ({
      ..._tableStateTopProducts,
      columns: {
        ..._tableStateTopProducts.columns,
        hiddenColumns: comparison ? [] : ['Compared to']
      }
    }));
    setTableStateZSR((_tableStateZSR) => ({
      ..._tableStateZSR,
      columns: {
        ..._tableStateZSR.columns,
        hiddenColumns: comparison ? [] : ['Compared to']
      }
    }));
  }, [comparison]);

  const config = {
    maxHeight: '600px',
    rows: {
      rowDatakey: 'query'
    },
    columns: {
      headers: [
        {
          title: 'Query',
          dataIndex: 'query',
          colSpan: 3,
          info: 'The query entered by a user to initiate search'
        },
        {
          title: 'Count',
          dataIndex: 'count',
          colSpan: 1,
          info: 'Total number of searches for a given query initiated by users',
          transformer: ({ value, row }) => {
            return (
              <Flex alignItems="center" gap="5px">
                <Text>{value}</Text>
                <Spacer />
                {comparison ? (
                  <Text
                    mx={1}
                    p="5px 10px"
                    borderRadius={'4px'}
                    bg={
                      isValueInPerPositive(String(row.perChange))
                        ? theme.colors.green.dirtylight
                        : theme.colors.red.dirtylight
                    }
                    // color={

                    // }
                  >
                    {' '}
                    {row.perChange}%
                  </Text>
                ) : null}
              </Flex>
            );
          }
        },
        {
          title: 'Compared to',
          dataIndex: 'count_comp',
          colSpan: 3,
          info: 'The query entered by a user to initiate search'
        }
      ],
      defaultHiddenColumns: ['Compared to']
    },
    topMenu: {
      hideMenu: true,
      hideFilters: true,
      hideSearch: true
    },
    pagination: {
      infiniteScroll: true,
      allowPagination: true,
      defaultPageNumber: 1,
      defaultPageSize: 20,
      defaultFetchSize: 100,
      pageSizeOptions: [10, 20, 50, 100]
    }
  };
  const configSearchHistory = {
    ...config,
    pagination: {
      ...config.pagination,
      fetch: fetchSearchHistory
    }
  };
  const configTopProducts = {
    ...config,
    pagination: {
      ...config.pagination,
      fetch: fetchTopProducts
    }
  };

  const configZSR = {
    ...config,
    columns: {
      ...config.columns,
      headers: [
        {
          title: 'Query',
          dataIndex: 'query',
          colSpan: 3,
          info: 'The query entered by a user to initiate search'
        },
        {
          title: 'Count',
          dataIndex: 'count',
          colSpan: 1,
          info: 'Total number of searches for a given query initiated by users',
          transformer: ({ value, row }) => {
            return (
              <Flex alignItems="center" gap="5px">
                <Text>{value}</Text>
                <Spacer />
                {comparison ? (
                  <Text
                    mx={1}
                    p="5px 10px"
                    borderRadius={'4px'}
                    bg={
                      isValueInPerPositive(String(row.perChangeCount))
                        ? theme.colors.green.dirtylight
                        : theme.colors.red.dirtylight
                    }
                    // color={

                    // }
                  >
                    {' '}
                    {row.perChangeCount}%
                  </Text>
                ) : null}
              </Flex>
            );
          }
        },
        {
          title: 'Compared to',
          dataIndex: 'count_comp',
          colSpan: 3,
          info: 'The query entered by a user to initiate search'
        }
      ]
    },
    pagination: {
      ...config.pagination,
      fetch: fetchZSR
    }
  };

  const { state: tableStateSearchHistory, setState: setTableStateSearchHistory } =
    useXTableState(configSearchHistory);
  const { state: tableStateTopProducts, setState: setTableStateTopProducts } =
    useXTableState(configTopProducts);
  const { state: tableStateZSR, setState: setTableStateZSR } = useXTableState(configZSR);
  useEffect(() => {
    // if (!range || !rangeComp) return;
    console.log('x external chhhhhhhhanfed', range, rangeComp);
    setTableStateSearchHistory((_tableStateSearchHistory) => ({
      ..._tableStateSearchHistory,
      external: {
        ..._tableStateSearchHistory.external,

        range: { ...range[0] },
        rangeComp: { ...rangeComp[0] }
      }
    }));
    setTableStateTopProducts({
      ...tableStateTopProducts,
      external: {
        ...tableStateTopProducts.external,
        range: { ...range[0] },
        rangeComp: { ...rangeComp[0] }
      }
    });
    setTableStateZSR({
      ...tableStateZSR,
      external: {
        ...tableStateZSR.external,
        range: { ...range[0] },
        rangeComp: { ...rangeComp[0] }
      }
    });
  }, [range, rangeComp]);

  const handleSearchesRedirect = () => {
    navigate(`${import.meta.env.VITE_ROUTE_PREFIX}/analytics/query-search`, {
      state: { range: range, rangeComp: rangeComp }
    });
  };

  const handleZSRRedirect = () => {
    navigate(`${import.meta.env.VITE_ROUTE_PREFIX}/analytics/zsr`, {
      state: { range: range, rangeComp: rangeComp }
    });
  };

  return (
    <Flex direction="row" gap={'20px'} mt={4}>
      <Flex flex="1">
        <AnalyticsTableIndi
          title={'User search history'}
          info={'Popular search queries initiated by users'}
          handleRedirect={handleSearchesRedirect}
          overflow="auto">
          <XTable
            state={tableStateSearchHistory}
            setState={setTableStateSearchHistory}
            config={configSearchHistory}
          />
        </AnalyticsTableIndi>
      </Flex>
      <Flex flex="1">
        <AnalyticsTableIndi
          title={'Top interacted products'}
          info={'Popular products interacted by users'}
          overflow={'auto'}>
          <XTable
            state={tableStateTopProducts}
            setState={setTableStateTopProducts}
            config={configTopProducts}
          />
        </AnalyticsTableIndi>
      </Flex>
      <Flex flex="1">
        <AnalyticsTableIndi
          title={'Zero-result search'}
          info={'Popular search queries that yielded no results'}
          overflow="auto"
          handleRedirect={handleZSRRedirect}>
          <XTable state={tableStateZSR} setState={setTableStateZSR} config={configZSR} />
        </AnalyticsTableIndi>
      </Flex>
    </Flex>
  );
};

export default AnalyticsTable;
