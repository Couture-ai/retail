import { Image, Select } from '@chakra-ui/react';
import React from 'react';

const OptionBox = (props) => {
  return (
    <Select fontWeight={600} borderRadius={8} {...props}>
      {props.optionList &&
        props.optionList.map((option) => {
          return (
            <option value={option.value} key={option.name}>
              {option.imageSrc ? <Image src={option.imageSrc} /> : null}
              {option.name}
            </option>
          );
        })}
      {props.children}
    </Select>
  );
};

export default OptionBox;
