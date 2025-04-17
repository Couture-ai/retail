import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  useTheme
} from '@chakra-ui/react';
import dino from '../../Static/images/dino.png';
import {
  AcUnit,
  AdsClickOutlined,
  AnalyticsOutlined,
  ArrowRightAlt,
  BugReportOutlined,
  ChevronRight,
  ExpandMoreOutlined,
  ExploreOutlined,
  FilterAltOutlined,
  GroupOutlined,
  LogoutOutlined,
  Mouse,
  NightsStayOutlined,
  QuestionAnswer,
  QuestionMark,
  Reorder,
  SearchOutlined,
  SettingsOutlined,
  Troubleshoot,
  Tune,
  WbSunnyOutlined
} from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import analytics3 from '../../Static/images/anal.png';
import couturelogo from '../../Static/images/couturelogo.png';
import curate3 from '../../Static/images/widg.png';
import vm3 from '../../Static/images/retail.png';
import vmdark from '../../Static/images/retail_dark.png';
import './app.css';
import { AuthContext } from '../../Contexts/AuthContext';
import { ThemeContext } from '../../Contexts/ThemeContext';
const VITE_ROUTE_PREFIX = import.meta.env.VITE_ROUTE_PREFIX || '';
const Home = (props) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const vm = themeMode === 'dark' ? vmdark : vm3;

  const [cardHovered, setCardHovered] = useState('');
  const navigate = useNavigate();
  const supersetDashboards = {
    'Analytics Details': {
      link: `${VITE_ROUTE_PREFIX}/analytics/analytics-details`,
      description:
        'Analyze search data with our comprehensive dashboard for all your data insights.',
      icon: <AnalyticsOutlined />
    },
    'Search Query Analytics': {
      link: `${VITE_ROUTE_PREFIX}/analytics/query-search`,
      description: 'Analyze all the queries searched by users across the world.',
      icon: <SearchOutlined />
    },
    'Zero Search Results': {
      link: `${VITE_ROUTE_PREFIX}/analytics/zsr`,
      description: 'Analyze queries that do not return any results.',
      icon: <Mouse />
    },
    'Zero Click Results': {
      link: `${VITE_ROUTE_PREFIX}/analytics/zcr`,
      description: 'Analyze queries which have no products clicks.',
      icon: <AdsClickOutlined />
    },
    'Faceted Search Results': {
      link: `${VITE_ROUTE_PREFIX}/analytics/group-search`,
      description: 'Analyze facets applied on different queries most frequently.',
      icon: <GroupOutlined />
    }
  };
  const merchandiserDashboards = {
    'Search Explorer': {
      link:
        props.role == 'jiomart'
          ? `${VITE_ROUTE_PREFIX}/vm/visual-merchandiser-jiomart`
          : `${VITE_ROUTE_PREFIX}/vm/visual-merchandiser-ajio`,
      description:
        'An interactive platform to showcase the capabilities of our search functionality.',
      icon: <ExploreOutlined style={{ height: 32, width: 32 }} />
    },
    'Business Rules': {
      link: `${VITE_ROUTE_PREFIX}/vm/curate-query`,
      description: 'Customizable rules to refine results according to your specific requirements.',
      icon: <Tune style={{ height: 32, width: 32 }} />
    },
    Configuration: {
      link: `${VITE_ROUTE_PREFIX}/vm/configuration`,
      description: 'Configure the search engine according to your business requirements.',
      icon: <SettingsOutlined style={{ height: 32, width: 32 }} />
    },
    Experimentation: {
      link: `${VITE_ROUTE_PREFIX}/vm/experimentation`,
      description: 'Test your search engine with different configurations and rules.',
      icon: <BugReportOutlined style={{ height: 32, width: 32 }} />
    }
    // 'All Curated Queries': {
    //   link: `${VITE_ROUTE_PREFIX}/vm/curated-queries`,
    //   description:
    //     'List of all the curated queries and their corresponding rules that have been applied.',
    //   icon: <Rule style={{ height: 32, width: 32 }} />
    // }
  };
  const widgetsDashboards = {
    'Query Suggestion': {
      link: `${VITE_ROUTE_PREFIX}/widgets/query-suggestion`,
      description:
        'Explore relevant "People Also Searched For" suggestions for more comprehensive insights based on the query.',
      icon: <QuestionAnswer style={{ height: 32, width: 32 }} />
    },
    'Auto Completion': {
      link: `${VITE_ROUTE_PREFIX}/widgets/auto-suggestion`,
      description:
        'Incomplete query will be auto completed with the most relevant queries and the results will be ranked based on relevance.',
      icon: <Reorder style={{ height: 32, width: 32 }} />
    },
    'Did You Mean': {
      link: `${VITE_ROUTE_PREFIX}/widgets/did-you-mean`,
      description:
        'Based on the query, the relevant corrected suggestion will be shown accurately tailored to your query.',
      icon: <QuestionMark style={{ height: 32, width: 32 }} />
    },
    'Audio Search': {
      link: `${VITE_ROUTE_PREFIX}/widgets/audio-search`,
      description:
        'Search for products using voice commands and get the most relevant results for your query.',
      icon: <AcUnit style={{ height: 32, width: 32 }} />
    }
  };

  const cards = {
    'Search Explorer': [
      'An interactive platform to showcase the capabilities of our search functionality.',

      `${VITE_ROUTE_PREFIX}/retail-studio/explorer`,
      vm
    ],
    'Analytics Details': [
      'Streamline your analytics with a comprehensive dashboard for all your data insights.',
      `${VITE_ROUTE_PREFIX}/retail-studio/analytics`,
      analytics3
    ],
    'Search Add-Ons': [
      'Brand Substitution, Query Suggestion, Auto Completion, Did You Mean.',
      `${VITE_ROUTE_PREFIX}/retail-studio/addons`,
      curate3
    ]
  };
  const featureCards = [
    {
      name: 'AI Powered Forecast',
      description: 'AI powered forecast to provide the most relevant results.',
      icon: <Troubleshoot />
    },
    {
      name: 'Curate Queries',
      description:
        'Apply rules to specific queries which can be triggered when certain conditions are met to customize results.',
      icon: <FilterAltOutlined />
    },
    {
      name: 'Search Suggestions',
      description: 'Get suggestions for your search queries.',
      icon: <SearchOutlined />
    },
    {
      name: 'Search Analytics',
      description: 'Analyze your search data for insights.',
      icon: <AnalyticsOutlined />
    }
  ];

  const { role, setRole } = useContext(AuthContext);

  return (
    <Flex
      w="100%"
      direction={'column'}
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}>
      <Flex
        h="70px"
        gap="5px"
        w="100%"
        alignItems={'center'}
        p="0px 20px 0px 20px"
        bg={theme.colors.secondary.background}>
        <Image src={couturelogo} h="45px" />
        <Spacer />
        {!role ? (
          <Button
            border={`1px solid ${theme.colors.tertiary.border}`}
            fontSize={'14px'}
            _hover={{
              backgroundColor: `${theme.colors.tertiary.hover} !important`
            }}
            p="5px 10px"
            borderRadius={'5px'}
            onClick={() => {
              navigate(`${VITE_ROUTE_PREFIX}/login`);
            }}>
            Sign In
          </Button>
        ) : (
          <Popover placement="top-start">
            <PopoverTrigger>
              <Image
                cursor="pointer"
                src={dino}
                w="40px"
                h="40px"
                borderRadius="50%"
                border="1px solid #aaa"
              />
            </PopoverTrigger>
            <PopoverContent minW="300px" zIndex="1000" bg="white">
              {/* <PopoverHeader fontWeight="semibold">Popover placement</PopoverHeader> */}
              <PopoverArrow />
              {/* <PopoverCloseButton /> */}
              <PopoverBody
                color={theme.colors.tertiary.color}
                bg={theme.colors.tertiary.background}>
                <Flex
                  direction={'column'}
                  // h="400px"
                  w="100%"
                  gap="10px"
                  alignItems={'center'}
                  p="10px">
                  <Image src={dino} objectFit={'cover'} w="100px" h="100px" borderRadius="50%" />
                  <Text
                    fontSize="15px"
                    // fontWeight={'bold'}
                    color={theme.colors.tertiary.color}>
                    <span
                      style={{
                        // italics
                        // fontStyle: 'italic',
                        color: '#aaa',
                        marginRight: '1px'
                      }}>
                      @role://
                    </span>
                    {role}
                  </Text>
                  <Spacer />
                  <Divider />
                  <Flex
                    borderRadius={'5px'}
                    cursor={'pointer'}
                    w="100%"
                    gap="20px"
                    p="10px"
                    onClick={() => {
                      setRole(null);
                      localStorage.removeItem('role');
                      setRole(null);
                      localStorage.removeItem('role');
                      localStorage.removeItem('roles');
                      localStorage.removeItem('resources');
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('token');
                    }}
                    alignItems={'center'}
                    _hover={{
                      backgroundColor: theme.colors.tertiary.hover
                    }}>
                    <LogoutOutlined style={{ color: '#bbb', fontSize: '20px' }} />
                    <Text
                      fontSize={'14px'}
                      color={theme.colors.secondary.color}
                      textOverflow={'none'}
                      wordBreak={'none'}>
                      Sign Out
                    </Text>
                  </Flex>
                  <Flex
                    borderRadius={'5px'}
                    cursor={'pointer'}
                    w="100%"
                    gap="20px"
                    p="10px"
                    onClick={() => {
                      if (themeMode === 'light') {
                        setThemeMode('dark');
                        localStorage.setItem('theme', 'dark');
                      } else {
                        setThemeMode('light');
                        localStorage.setItem('theme', 'light');
                      }
                    }}
                    alignItems={'center'}
                    _hover={{
                      backgroundColor: theme.colors.tertiary.hover
                    }}>
                    {themeMode == 'dark' ? (
                      <NightsStayOutlined style={{ color: '#bbb', fontSize: '20px' }} />
                    ) : (
                      <WbSunnyOutlined style={{ color: '#bbb', fontSize: '20px' }} />
                    )}

                    <Text
                      fontSize={'14px'}
                      color={theme.colors.secondary.color}
                      textOverflow={'none'}
                      wordBreak={'none'}>
                      Switch Theme
                    </Text>
                  </Flex>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
        {/* {role ? (
          <Text color="#666" fontSize={'14px'}>
            Signed In as <span style={{ fontWeight: 'bold', color: 'black' }}>{role}</span> user.
          </Text>
        ) : null}
        {role ? (
          <Button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('role');
              // reload the page
              window.location.reload();
            }}
            
            color="#999"
            fontWeight={'600'}
            fontSize="14px">
            Log Out.
          </Button>
        ) : null} */}
      </Flex>
      <Flex
        // bg={theme.colors.blue.bg}
        pl="40px"
        pt="100px"
        direction="column"
        alignItems="center"
        pr="40px"
        h="100vh"
        w="100% "
        justifyContent={'flex-start'}>
        <Flex ml={7} direction="column" alignItems={'center'}>
          <Text
            style={{
              fontSize: '50px',
              fontWeight: '800',

              marginTop: '10px',
              color: theme.colors.secondary.colorGray,
              alignItems: 'center'
            }}>
            A platform to manage all your retail needs
          </Text>
          <div
            style={{
              fontSize: '50px',
              fontWeight: '800',

              color: theme.colors.secondary.color,
              alignItems: 'center'
            }}>
            {' '}
            Couture Retail Studio
          </div>
          <Text
            w="600px"
            textAlign={'center'}
            style={{ color: `${theme.colors.secondary.colorGray}` }}
            // color="primary.lighter"
            fontWeight={'regular'}
            fontSize={18}>
            A platform to manage all your retail needs
          </Text>
          <Flex gap="10px">
            <Button
              borderRadius={'30px'}
              fontSize={15}
              // w="200px"

              fontWeight={600}
              rightIcon={<ExpandMoreOutlined />}
              padding="10px 30px"
              mt="20px"
              onClick={() => {
                // scroll to the id "overview"
                document.getElementById('overview').scrollIntoView({ behavior: 'smooth' });
              }}
              bg={theme.colors.actionButton.main}
              // rightIcon={<Launch fontSize="20px" />}
              color={theme.colors.white}>
              Get Started
            </Button>
            <Button
              borderRadius={'30px'}
              fontSize={15}
              // w="200px"

              fontWeight={600}
              alignItems={'center'}
              // rightIcon={<ArrowDropDownCircleOutlined />}
              padding="10px 30px"
              mt="20px"
              onClick={() => {
                // scroll to the id "overview"
                navigate(`${VITE_ROUTE_PREFIX}/retail-studio/`);
              }}
              color={theme.colors.actionButton.main}
              borderColor={theme.colors.actionButton.main}
              borderWidth={'1px'}
              borderStyle={'solid'}
              rightIcon={<ChevronRight style={{ fontSize: '18px' }} />}
              bg={theme.colors.white}>
              Go To Console
            </Button>
          </Flex>
        </Flex>
        <Flex
          position="relative"
          w="100%"
          mt="100px"
          alignItems={'center'}
          justifyContent={'center'}
          direction="column">
          {/* <Image
            mt="20px"
            src={heroimg2}
            height="40vh"
            position="absolute"
            left="0"
            top="-40px"
            borderRadius={'20px'}
            boxShadow={'0 0 40px 0 #ddd'}
          /> */}
          <Flex
            height="82vh"
            width={`${parseInt(window.innerHeight * 0.8 * (1433 / 835)) + 20}px`}
            position="absolute"
            // w="85%"
            mt="15px"
            boxShadow={`0 0 80px 20px ${theme.colors.purple.shadow}`}
            bg={theme.colors.purple.primary}
            border="3px solid #fff"
            borderRadius={'28px'}
            zIndex={0}></Flex>
          <Image
            borderRadius={'20px'}
            zIndex="1"
            mt="20px"
            // boxShadow={'0 0 100px 0px #E0DDFB'}
            src={vm}
            height="80vh"
            width={`${parseInt(window.innerHeight * 0.8 * (1433 / 835))}px`}
          />
          {/* <Image
            borderRadius={'20px'}
            mt="20px"
            position={'absolute'}
            bottom={'-20px'}
            right={0}
            boxShadow={'0 0 40px 0px #ddd'}
            src={linechartpng}
            width="800px"
          /> */}
        </Flex>
      </Flex>
      <Flex id="overview" p="10px 100px" justifyContent={'space-between'} mt={'400px'} mb={5}>
        {Object.keys(cards).map((e) => (
          <Flex
            onMouseEnter={() => setCardHovered(e)}
            onMouseLeave={() => setCardHovered('')}
            cursor={'pointer'}
            onClick={() => {
              navigate(cards[e][1]);
            }}
            direction="column"
            className="parent"
            style={{
              backgroundColor: theme.colors.tertiary.background,
              transform: cardHovered === e ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.4s ease-in-out',
              // height: '230px',
              fontSize: '40px',
              border: `1px solid ${theme.colors.secondary.borderColor}`,
              // boxShadow: `${theme.colors.gray.hover} 0px 0px 40px 0px`,
              borderRadius: '10px'
            }}
            _hover={{
              backgroundColor: `${theme.colors.white}`
            }}
            key={e}
            w="32%">
            <Flex p={2} w="100%">
              <Image h="300px" objectFit={'cover'} src={cards[e][2]} borderRadius={'10px'} />
            </Flex>
            <Flex p={5} gap={3} direction="column" justifyContent={'flex-start'} w="90%">
              <Text fontWeight={'600'} fontSize={22}>
                {e}
              </Text>
              <Text color={theme.colors.secondary.colorGray} fontWeight={'regular'} fontSize={16}>
                {cards[e][0]}
              </Text>
              <Spacer />
              <Link to={cards[e][1]}>
                <a href={cards[e][1]} className="get-started-button">
                  <span className="icon">
                    <ArrowForwardIcon />
                  </span>
                  <span className="text">Get Started</span>
                </a>
              </Link>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Flex
        h="380px"
        w="100%"
        gap="10px"
        style={{
          // border: `1px solid ${theme.colors.tertiary.border}`,
          backgroundColor: `${theme.colors.tertiary.background}`,
          // borderRadius: '20px'
          padding: '50px 60px'
        }}>
        <Flex
          w="19%"
          direction={'column'}
          style={{
            // backgroundColor: `#fbfbfb`,
            fontSize: '40px',
            // border: `1px solid ${theme.colors.tertiary.border}`,
            // borderRadius: '10px',
            padding: '20px'
          }}>
          <Text
            style={{
              fontSize: '40px',
              fontWeight: '900'
            }}>
            Get Best Results With
          </Text>
          <ArrowRightAlt />
        </Flex>
        {featureCards.map((e) => {
          const Icon = e.icon;
          return (
            <Flex
              p="10px"
              direction="column"
              alignItems="center"
              style={{
                backgroundColor: theme.colors.secondary.background,
                fontSize: '40px',
                border: `1px solid ${theme.colors.secondary.borderColor}`,
                borderRadius: '10px'
              }}
              _hover={{
                backgroundColor: `${theme.colors.white}`
              }}
              key={e.name}
              w="20%">
              <Flex p={2} w="100%" mb="20px">
                <IconButton
                  cursor="default"
                  icon={Icon}
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '5px',
                    borderRadius: '5px'
                  }}
                />
              </Flex>
              <Flex
                p={5}
                pt="5px"
                pl={2}
                gap={3}
                direction="column"
                justifyContent={'flex-start'}
                w="100%">
                <Text fontWeight={'600'} fontSize={22}>
                  {e.name}
                </Text>
                <Text color={theme.colors.secondary.colorGray} fontWeight={'regular'} fontSize={16}>
                  {e.description}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      <Flex
        id=""
        bg={theme.colors.tertiary.background}
        direction="column"
        style={{ marginTop: '50px' }}
        w="100%"
        justifyContent={'center'}
        alignItems={'center'}
        pb={7}>
        <Flex
          mt="30px"
          justifyContent={'center'}
          alignItems="center"
          w="100%"
          mb="30px"
          direction="column">
          <Text color={theme.colors.tertiary.color} fontWeight={'bold'} fontSize={32}>
            Search Studio
          </Text>
          <Box w="200px" h="4px" borderRadius={'2px'} backgroundColor={theme.colors.orange.main} />
          <Text
            mt="20px"
            maxWidth={'800px'}
            color={theme.colors.secondary.colorGray}
            fontWeight={'regular'}
            textAlign={'center'}
            fontSize={18}>
            Examine the outcomes and implement tailored rules to enhance their relevance.
          </Text>
        </Flex>

        <Flex
          direction="row"
          alignItems="center"
          justifyContent={'center'}
          w="100%"
          h="100%"
          mb="100px"
          style={{ padding: '35px 50px 35px 50px', margin: '0px 0px 100px 0px' }}>
          <Flex direction={'column'} w="50%">
            <Flex
              // as={motion.div}
              alignItems="center"
              justifyContent="center"
              style={{
                fontSize: '24px',
                // backgroundColor: `${theme.colors.white}`,
                borderRadius: '0px',
                // boxShadow: '-2px -2px 50px #00000008, 2px 2px 50px #00000008',
                // borderBottom: '1px solid #D6D6E7',
                padding: '10px'
              }}>
              <Accordion allowToggle p={2} w="100%">
                {Object.keys(merchandiserDashboards).map((e) => {
                  const merch = merchandiserDashboards[e];
                  return (
                    <AccordionItem
                      _hover={{
                        backgroundColor: `${theme.colors.tertiary.hover} !important`
                      }}
                      key={e}
                      justifyContent={'center'}
                      alignItems={'center'}
                      style={{
                        fontSize: '24px',
                        // backgroundColor: `${theme.colors.white}`,
                        borderRadius: '0px',
                        // boxShadow: '-2px -2px 50px #00000008, 2px 2px 50px #00000008',
                        borderBottom: `1px solid ${theme.colors.gray.light}`,
                        padding: '25px'
                      }}>
                      <h2>
                        <AccordionButton _expanded={{ padding: '2' }}>
                          <Flex
                            flex="1"
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            direction="row"
                            fontSize={22}>
                            <IconButton
                              style={{
                                height: 50,
                                width: 50,
                                marginRight: 20,
                                color: `${theme.colors.primary.main}`
                              }}
                              aria-label="Merchandiser">
                              {merch.icon}
                            </IconButton>
                            <Text style={{ fontWeight: '600' }}>
                              {e.split(' ').map((e) => {
                                return e.charAt(0).toUpperCase() + e.slice(1) + ' ';
                              })}
                            </Text>
                          </Flex>
                          <AccordionIcon color={theme.colors.primary.main} />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel p="5px 20px 5px 80px">
                        <Text
                          style={{
                            fontSize: '18px',
                            color: `${theme.colors.secondary.colorGray}`
                          }}>
                          {merch.description}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Flex>
          </Flex>
          <Flex p={2} w="50%" justifyContent={'center'} alignItems={'center'}>
            <Image h="50vh" src={vm} borderRadius={'10px'} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
