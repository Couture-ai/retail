import { ThemeProvider, Tooltip as TooltipMui, createTheme } from '@mui/material';

const Tooltip = ({ children, text, followCursor, disabled }) => {
  if (disabled) return children;
  return (
    <ThemeProvider theme={createTheme()}>
      <TooltipMui title={text} followCursor={followCursor} arrow placement="bottom">
        {children}
      </TooltipMui>
    </ThemeProvider>
  );
};

export default Tooltip;
