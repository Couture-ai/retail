import { extendTheme } from '@chakra-ui/react';
import components from './components';
import foundations from './foundations';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`
};

const themeDark = extendTheme({
  config,
  ...foundations,
  components,
  fonts
});

export default themeDark;
