import { Input, InputGroup, InputLeftElement, useTheme } from '@chakra-ui/react';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

const GlobalSearch = (props) => {
  const theme = useTheme();
  return props.isSearchIcon ? (
    <InputGroup
      size={props.size}
      w={props.boxW ? props.boxW : null}
      borderRadius={'20px'}
      backgroundColor={theme.colors.gray.light}>
      <InputLeftElement
        pointerEvents={'none'}
        color={props.leftElementColor ? props.leftElementColor : `${theme.colors.primary.main}`}>
        {props.isSearchIcon ? <SearchIcon /> : null}
      </InputLeftElement>
      <Input
        variant={props.variant ? props.variant : null}
        {...props}
        _placeholder={{ color: `${theme.colors.gray.light}` }}
        placeholder={props.placeholder ? props.placeholder : null}
      />
    </InputGroup>
  ) : (
    <Input
      variant={props.variant ? props.variant : null}
      {...props}
      _placeholder={{ color: `${theme.colors.gray.light}` }}
      placeholder={props.placeholder ? props.placeholder : null}
    />
  );
};

export default GlobalSearch;
