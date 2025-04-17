import { Box, Flex, Spacer, Spinner, Td, Text, Tr, useTheme } from '@chakra-ui/react';
import { SearchOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import TableCard from '../Table/TableCard';
import TableCommon from '../Table/TableCommon';
import Dialog from './Dialog';

const DialogBox = (props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedData, setPaginatedData] = useState(null);
  const [totalData, setTotalData] = useState(props.item);

  const paginate = () => {
    const data = props.item;

    const start = page * pageSize - pageSize;
    const end = page * pageSize;
    setPaginatedData(data.slice(start, end));
    setTotalData(data);
  };

  useEffect(() => {
    if (props.item) {
      paginate();
      if (props.item.length) {
        setTotalData(props.item);
      }
    }
  }, [props.item]);

  useEffect(() => {
    if (props.item) {
      if (pageSize) {
        paginate();
      }
    }
  }, [pageSize, page]);
  const theme = useTheme();

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      header={'Query Result'}
      handleSubmit={() => {
        console.log('hello world');
      }}
      isFooter={props.isFooter ? props.isFooter : false}>
      {props.isDialogData ? (
        <Flex flexDir={'column'}>
          <Flex flexDir={'row'}>
            <Card bgColor={theme.colors.gray.light} w="5%" h="7vh">
              <SearchOutlined />
            </Card>
            <Flex flexDir={'column'} mx={2} my={2}>
              <Text variant={'body1'}>{props.query}</Text>
              <Text variant={'body3regular'} fontSize="12px" color="primary.light">
                {`${props.searches} searches`}
              </Text>
            </Flex>
            <Spacer />
            <Flex flexDir={'column'} mx={6} my={2}>
              <Text variant={'body1'}>{props.avgClickCount}</Text>
              <Text variant={'body3regular'} fontSize="12px" color="primary.light">
                Avg. Click Count
              </Text>
            </Flex>
            <Flex flexDir={'column'} mx={6} my={2}>
              <Text variant={'body1'}>{props.ctr}</Text>
              <Text variant={'body3regular'} fontSize="12px" color="primary.light">
                CTR
              </Text>
            </Flex>
            <Flex flexDir={'column'} mx={6} my={2}>
              <Text variant={'body1'}>{props.conversion}</Text>
              <Text variant={'body3regular'} fontSize="12px" color="primary.light">
                Conversion
              </Text>
            </Flex>
          </Flex>
          {/* <Card w="100%" mt={4} h={'20vh'} style={{ border: `1px solid ${theme.colors.gray.light}` }}>
            <Flex flexDir={'row'} justifyContent={'space-between'}>
              <Flex flexDir={'column'}>
                <Text variant={'body1'}>Click Position</Text>
                <Text variant={'body3regular'} w={'40%'} style={{ fontSize: '10px' }}>
                  Average position of the clicks performed on the query. Smaller values are better.
                </Text>
              </Flex>
              <Flex alignContent={'end'} alignItems={'end'}>
                <Text variant={'body3regular'} style={{ fontSize: '10px', color: `${theme.colors.gray.light}` }}>
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
          <TableCard
            style={{ border: `1px solid ${theme.colors.gray.light}` }}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            isGlobalSearch={false}
            data={props.item}
            totalData={totalData}>
            <TableCommon header={props.modalHeader} mt={3}>
              {paginatedData &&
                paginatedData.map((element, index) => {
                  return (
                    <Tr key={index}>
                      <Td colSpan={3}>
                        <Text variant="body2">{element.id}</Text>
                      </Td>
                      <Td colSpan={1}>
                        <Flex>
                          <Text variant="body2">{element.impression}</Text>
                        </Flex>
                      </Td>
                      <Td colSpan={1}>{element.clicks}</Td>
                      <Td colSpan={1}>{element.conversion}</Td>
                    </Tr>
                  );
                })}
            </TableCommon>
          </TableCard>
        </Flex>
      ) : props.dialogDataError ? (
        <Box align={'center'} justifyContent={'center'}>
          <Text style={{ fontSize: '12px', color: `${theme.colors.gray.light}` }}>
            No Data Available for the Selected Query
          </Text>
        </Box>
      ) : (
        <Box align={'center'} justifyContent={'center'}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
    </Dialog>
  );
};

export default DialogBox;
