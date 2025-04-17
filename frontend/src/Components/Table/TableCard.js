/* eslint-disable no-unused-vars */
import {
  Box,
  Divider,
  Flex,
  Heading,
  // useDisclosure
  // Input
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Text,
  useTheme
} from '@chakra-ui/react';
import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import React, { useState } from 'react';
import GlobalSearch from '../../Containers/GlobalSearch/GlobalSearch';
import DownloadButton from '../Button/DownloadButton';
import Card from '../Card/Card';
// import Dialog from '../Dialog/Dialog';
// import Papa from "papaparse";
import exportFromJSON from 'export-from-json';
// import OptionBox from '../Select/OptionBox';

const TableCard = (props) => {
  const theme = useTheme();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // eslint-disable-next-line no-unused-vars
  const [fileName, setFileName] = useState('data');
  // const [fileType, setFileType] = useState('csv');
  // const [data, setData] = useState(props.data);
  // console.log('data', props.data);

  // const handleFileTypeChange = (event) => {
  //   // console.log(setData);
  //   setFileType(event.target.value);
  // };

  const handleDownload = () => {
    let exportType = exportFromJSON.types.csv;
    // if (fileType === 'csv') {
    //   exportType = exportFromJSON.types.csv;
    // } else if (fileType === 'xls') {
    //   exportType = exportFromJSON.types.xls;
    // } else if (fileType === 'txt') {
    //   exportType = exportFromJSON.types.txt;
    // }
    exportFromJSON({ data: props.data, fileName, exportType });
  };

  // const fileTypeOptionList = [
  //   {
  //     name: 'csv',
  //     value: 'csv'
  //   },
  //   {
  //     name: 'xls',
  //     value: 'xls'
  //   },
  //   {
  //     name: 'txt',
  //     value: 'txt'
  //   }
  // ];

  return (
    <Card w="100%" mt={3} h={'60vh'} {...props}>
      {props.isGlobalSearch === false ? (
        <Flex flexBasis={'row'} w="100%" justifyContent={'flex-end'} align="center" my={1}>
          <Flex gap={2} onClick={handleDownload}>
            <DownloadButton />
          </Flex>
          {/* <Dialog
            open={isOpen}
            onClose={onClose}
            header={'Download As'}
            handleSubmit={handleDownload}
            isFooter={true}
            size="sm">
            <Flex flexDir={'row'} justifyContent="space-evenly">
              <Input
                bgColor={theme.colors.white}
                placeholder="Enter filename"
                onChange={(e) => setFileName(e.target.value)}
              />
              <Text variant={'body1'} style={{ fontSize: '20px' }} mx={3}>
                {' '}
                .{' '}
              </Text>
              <OptionBox optionList={fileTypeOptionList} onChange={handleFileTypeChange} />
            </Flex>
          </Dialog> */}
        </Flex>
      ) : (
        <Flex flexBasis={'row'} w="100%" justifyContent={'space-between'} align="center">
          <GlobalSearch
            variant={'outline'}
            isSearchIcon={true}
            placeholder={'Search For a Query'}
            size={'md'}
            boxW="25%"
            leftElementColor={`${theme.colors.gray.light}`}
            onChange={props.onChange ? props.onChange : null}
          />
          <Flex gap={2} onClick={handleDownload}>
            <DownloadButton />
          </Flex>
          {/* <Dialog
            open={isOpen}
            onClose={onClose}
            header={'Download As'}
            handleSubmit={handleDownload}
            isFooter={true}
            size="sm">
            <Flex flexDir={'row'} justifyContent="space-evenly">
              <OptionBox optionList={fileTypeOptionList} onChange={handleFileTypeChange} />
            </Flex>
          </Dialog> */}
        </Flex>
      )}
      <Box mx={'-16px'} h={'47vh'} maxH={'47vh'} overflow={'auto'}>
        {props.children}
      </Box>
      {props.data && props.data.length !== 0 && (
        <>
          <Divider />
          <Flex alignItems="center" ml={5} mt={3} maxH={'2vh'}>
            {`Showing  ${(props.page - 1) * props.pageSize + 1} to  ${
              props.data.length < props.pageSize * props.page
                ? props.data.length
                : props.pageSize && props.pageSize * props.page
            } of ${props.data.length} records`}
            <Spacer />
            <Flex justifyContent="flex-end" alignItems="center" mr={5}>
              <Text variant="Body2Regular">Display</Text>
              <NumberInput
                ml={2}
                mr={4}
                step={1}
                defaultValue={props.pageSize}
                min={1}
                max={30}
                w="70px"
                size="sm"
                borderRadius="8px"
                onChange={(e) => {
                  props.setPageSize(e);
                }}>
                <NumberInputField borderRadius="8px" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Text variant="Body2Regular">records</Text>
              <Box h="40px" mx={4}>
                <Divider orientation="vertical" />
              </Box>
              <IconButton
                onClick={() => props.setPage(props.page - 1)}
                isDisabled={props.page === 1}
                size="sm"
                variant="iconOutline">
                <ChevronLeftRounded />
              </IconButton>
              {props.totalData ? (
                <Heading size="sm" p={5}>
                  Page {props.page} of {Math.ceil(props.totalData.length / props.pageSize)}
                </Heading>
              ) : null}
              <IconButton
                variant="iconOutline"
                onClick={() => props.setPage(props.page + 1)}
                isDisabled={props.page === Math.ceil(props.data.length / props.pageSize)}
                size="sm">
                <ChevronRightRounded />
              </IconButton>
            </Flex>
          </Flex>
        </>
      )}
    </Card>
  );
};

export default TableCard;
