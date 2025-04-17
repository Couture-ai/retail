/* eslint-disable no-unused-vars */
import {
  Button,
  Flex,
  IconButton,
  Input,
  Spacer,
  Text,
  useTheme,
  useToast,
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Heading,
  Stack,
  Card,
  CardBody,
  SimpleGrid,
  Divider,
  Select,
  Skeleton
} from '@chakra-ui/react';
import {
  Check,
  Close,
  CodeOutlined,
  ContentCopyOutlined,
  DeleteOutlineOutlined,
  DoDisturbAltOutlined,
  FilterAltOutlined,
  FormatOverlineOutlined,
  JoinFullOutlined,
  JoinInnerOutlined,
  LaunchOutlined,
  LockOutlined,
  PushPinOutlined,
  QuestionMarkOutlined,
  RocketLaunchOutlined,
  SearchOutlined,
  SubdirectoryArrowRightOutlined,
  SyncAltOutlined,
  TextFormatOutlined,
  TroubleshootOutlined,
  TuneOutlined,
  UnfoldLessOutlined,
  VisibilityOffOutlined,
  BarChartOutlined,
  ShowChartOutlined,
  LocationOnOutlined,
  ViewTimelineOutlined
} from '@mui/icons-material';

import React, { useContext, useState, useEffect } from 'react';
import { Autocomplete, createTheme, TextField, ThemeProvider } from '@mui/material';
import { CheckIcon } from '@chakra-ui/icons';
import { AppContext } from '../../Contexts/AppContext';
import { AuthContext } from '../../Contexts/AuthContext';
import LearnMoreButton from './Components/LearnMore';
import CopyText from './Components/CopyTextIcon';
import { getForecastMetrics, getForecastFilterOptions } from '../../repositories/forecast';

const roundNumber = (number, decimals = 2) => {
  return number ? Number(number.toFixed(decimals)) : 0;
};

const formatNumber = (number, decimals = 2) => {
  if (number === undefined || number === null) return '0';
  
  if (number >= 1000000) {
    return `${roundNumber(number / 1000000, decimals)}M`;
  } else if (number >= 1000) {
    return `${roundNumber(number / 1000, decimals)}k`;
  }
  
  return roundNumber(number, decimals).toString();
};

const MetricCard = ({ title, value, improvement, helpText, color, isLoading }) => {
  const theme = useTheme();
  
  return (
    <Card 
      variant="outline" 
      borderColor={theme.colors.tertiary.border}
      boxShadow="sm"
      borderRadius="lg"
      overflow="hidden"
      bg={theme.colors.secondary.background}
    >
      <CardBody>
        <Skeleton isLoaded={!isLoading} fadeDuration={1}>
          <Stack spacing={2}>
            <Text fontSize="sm" color={theme.colors.secondary.colorGray} fontWeight="medium">
              {title}
            </Text>
            <Heading size="md" color={color || theme.colors.tertiary.color}>
              {value}
            </Heading>
            {improvement && (
              <StatHelpText mb={0}>
                <StatArrow type={improvement > 0 ? "increase" : "decrease"} />
                {Math.abs(improvement)}%
              </StatHelpText>
            )}
            {helpText && (
              <Text fontSize="xs" color={theme.colors.secondary.colorGray}>
                {helpText}
              </Text>
            )}
          </Stack>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

const Overview = () => {
  const theme = useTheme();
  const toast = useToast();
  const { app, _apps } = useContext(AppContext);
  const { role } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      // Fetch metrics without any filters
      const data = await getForecastMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: 'Error fetching metrics',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const modelImprovement = metrics 
    ? roundNumber(
        ((metrics.baseline_percentage_error - metrics.model_percentage_error) / 
        metrics.baseline_percentage_error) * 100, 
        1
      )
    : 0;

  return (
    <Flex
      minH="100vh"
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}
      w="100%"
      p={{ base: "20px", md: "30px", lg: "50px 50px 20px 50px", xl: "50px 300px 20px 230px" }}
      direction={'column'}>
      <Flex alignItems={'center'} gap="5px" mb="5px">
        <RocketLaunchOutlined
          style={{
            fontSize: '25px',
            color: '#bbb'
          }}
        />
        <Text fontWeight={'bold'} fontSize="25px">
          Forecast Overview
        </Text>
      </Flex>
      <Text fontSize="13px" color={theme.colors.tertiary.colorGray} mb="30px">
        Welcome to Retail Studio! Our demand forecast and assortment optimization tools help you predict demand and optimize your inventory.
      </Text>
      
      {/* Metrics Overview Card */}
      <Card 
        mb="6" 
        variant="outline" 
        borderColor={theme.colors.tertiary.border}
        boxShadow="sm"
        bg={theme.colors.primary.bg}
      >
        <CardBody>
          <Stack spacing="4">
            <Box>
              <Flex align="center" mb="2">
                <ShowChartOutlined style={{ color: theme.colors.secondary.colorGray, marginRight: '8px' }} />
                <Heading size="md">Forecast Performance</Heading>
              </Flex>
              <Text fontSize="sm" color={theme.colors.secondary.colorGray}>
                Compare model forecast accuracy against baseline consensus to see improvement
              </Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="4">
              <MetricCard 
                title="Model Error (%)" 
                value={metrics ? `${roundNumber(metrics.model_percentage_error)}%` : '-'} 
                helpText="Mean Average Percentage Error"
                color={theme.colors.green.main}
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Baseline Error (%)" 
                value={metrics ? `${roundNumber(metrics.baseline_percentage_error)}%` : '-'} 
                helpText="Consensus Forecast MAPE"
                color={theme.colors.orange.main}
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Error Reduction" 
                value={`${modelImprovement}%`} 
                helpText="Model vs Baseline Improvement" 
                color={modelImprovement > 0 ? theme.colors.green.main : theme.colors.red.main}
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Total Units Sold" 
                value={metrics ? formatNumber(metrics.total_qty_sold) : '-'}
                helpText="Actual units sold in period"
                isLoading={isLoading}
              />
            </SimpleGrid>
            
            {/* Advanced Metrics */}
            <Divider />
            
            <Box>
              <Flex align="center" mb="2">
                <TuneOutlined style={{ color: theme.colors.secondary.colorGray, marginRight: '8px' }} />
                <Heading size="sm">Advanced Metrics</Heading>
              </Flex>
            </Box>
            
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="4">
              <MetricCard 
                title="Model RMSE" 
                value={metrics ? roundNumber(metrics.model_rmse) : '-'} 
                helpText="Root Mean Square Error"
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Baseline RMSE" 
                value={metrics ? roundNumber(metrics.baseline_rmse) : '-'} 
                helpText="Consensus Forecast RMSE"
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Model Absolute Error" 
                value={metrics ? formatNumber(metrics.model_absolute_error) : '-'} 
                helpText="Sum of absolute errors"
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Baseline Absolute Error" 
                value={metrics ? formatNumber(metrics.baseline_absolute_error) : '-'} 
                helpText="Sum of absolute errors"
                isLoading={isLoading}
              />
            </SimpleGrid>
            
            {/* Volume Metrics */}
            <Divider />
            
            <Box>
              <Flex align="center" mb="2">
                <BarChartOutlined style={{ color: theme.colors.secondary.colorGray, marginRight: '8px' }} />
                <Heading size="sm">Volume Metrics</Heading>
              </Flex>
            </Box>
            
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing="4">
              <MetricCard 
                title="Units Sold" 
                value={metrics ? formatNumber(metrics.total_qty_sold) : '-'} 
                helpText="Actual sales volume"
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Model Forecast" 
                value={metrics ? formatNumber(metrics.total_qty_predicted) : '-'} 
                helpText="Model predicted volume"
                isLoading={isLoading}
              />
              
              <MetricCard 
                title="Baseline Forecast" 
                value={metrics ? formatNumber(metrics.total_qty_baseline) : '-'} 
                helpText="Consensus predicted volume"
                isLoading={isLoading}
              />
            </SimpleGrid>
          </Stack>
        </CardBody>
      </Card>
      
      {/* Help Section */}
      <Card 
        variant="outline" 
        borderColor={theme.colors.tertiary.border}
        boxShadow="sm"
      >
        <CardBody>
          <Flex gap="3" align="flex-start">
            <Box 
              p="2"
              borderRadius="md"
              bg={theme.colors.link.bg}
              color={theme.colors.link.text}
            >
              <QuestionMarkOutlined />
            </Box>
            <Box>
              <Heading size="sm" mb="1">Understanding Metrics</Heading>
              <Text fontSize="sm" color={theme.colors.secondary.colorGray}>
                The model forecast is compared against the baseline consensus forecast. Lower error percentages and RMSE values indicate more accurate predictions. The Error Reduction metric shows how much our model improves over the baseline.
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Overview;
