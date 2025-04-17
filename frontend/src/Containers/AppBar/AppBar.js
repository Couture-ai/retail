import { Box, Flex, Image, Spacer, useTheme } from '@chakra-ui/react';
// import Box from '@mui/material/Box';
import Container from '../../Components/Container/Container';
// import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import couturelogo from '../../Static/images/coutureai_logo.jpeg'; // import GlobalSearch from '../GlobalSearch/GlobalSearch';

const AppBar = (props) => {
  // const styles = useStyles();
  // const location = useLocation();
  // console.log(location.pathname);
  const theme = useTheme();

  return (
    <Container isCollapsed={props.isCollapsed} style={{ padding: '0px 0px 0px 50px' }}>
      <Box
        // position="static"
        color="primary"
        sx={{
          minHeight: '50px',
          paddingLeft: '30px',
          paddingBottom: '5px',
          padding: '20px 0px 20px 20px',
          // backgroundColor: '#f5f5f5',
          // borderBottom: '1px solid #ffffff',
          boxShadow: `0px 0px 10px 0px ${theme.colors.gray.hover}`,
          marginLeft: props.isCollapsed ? '30px' : '245px'
        }}
        // ml="-90px"
        elevation={3}>
        <Flex w={props.isCollapsed ? '95%' : '82%'} align="center" justifyContent={'space-between'}>
          <Link to={'/assortment/home'}>
            <Image src={couturelogo} pl={6} w="8vh" />
          </Link>
          <Link to={'/assortment/home'}>
            <div
              style={{
                fontSize: '20px',
                marginLeft: '20px',
                color: `${theme.colors.secondary.colorGray}`
              }}>
              <span style={{ fontWeight: 'bold', color: `${theme.colors.gray.dark}` }}>
                {props.name}
              </span>
            </div>
          </Link>
          <Spacer />
        </Flex>
      </Box>
    </Container>
  );
};

export default AppBar;
