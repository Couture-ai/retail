import { Box, Flex, Icon, Input, InputGroup, InputLeftElement, useTheme } from '@chakra-ui/react';
import { CalendarTodayOutlined } from '@mui/icons-material';
import format from 'date-fns/format';
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const CalendarComp = (props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const IconCalender = props.Icon ?? CalendarTodayOutlined;

  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', hideOnEscape, true);
    document.addEventListener('click', hideOnClickOutside, true);
  }, []);

  const hideOnEscape = (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (event) => {
    if (refOne.current && !refOne.current.contains(event.target)) {
      setOpen(false);
    }
  };

  return (
    <Flex position="relative" display={'inline-block'}>
      <InputGroup w="100%">
        <InputLeftElement pointerEvents="none" fontSize="1.2em">
          <Icon color={theme.colors.gray.dark}>
            <IconCalender style={{ color: theme.colors.secondary.colorGray }} />
          </Icon>
        </InputLeftElement>
        <Input
          style={{
            borderRadius: '20px',
            color: '#333333',
            fontWeight: 'bold',
            fontSize: '12px',
            width: '220px'
            // border: '1px solid #dddddd'
          }}
          value={`${format(props.range[0].startDate, 'dd/MM/yyyy')} | ${format(
            props.range[0].endDate,
            'dd/MM/yyyy'
          )}`}
          readOnly
          onClick={() => setOpen((open) => !open)}
        />
      </InputGroup>
      <Box
        ref={refOne}
        top={'50px'}
        position={'absolute'}
        left={'20%'}
        zIndex={999}
        boxShadow={'0 0 20px 0px #dddddd'}
        borderRadius={'20px'}>
        {open && props.isPreview && (
          <DateRangePicker
            onChange={
              props.handleChange
                ? (item) => props.handleChange(item)
                : (item) => {
                    props.setRange([item.selection]);
                  }
            }
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={props.range}
            months={1}
            direction={'vertical'}></DateRangePicker>
        )}
        {open && !props.isPreview && (
          <DateRangePicker
            onChange={
              props.handleChange
                ? (item) => props.handleChange(item)
                : (item) => {
                    props.setRange([item.selection]);
                  }
            }
            onRangeFocusChange={null}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={props.range}
            months={1}
            direction={'vertical'}></DateRangePicker>
        )}
      </Box>
    </Flex>
  );
};

export default CalendarComp;
