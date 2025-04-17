/* eslint-disable no-unused-vars */
import {
  Button,
  Divider,
  Flex,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import couturelogo from '../../Static/images/couturelogo.png';
import __roleAppMap from './_metadata';
import {
  // AccessTimeOutlined,
  ArrowDropDown,
  BugReportOutlined,
  ConstructionOutlined,
  Inventory2Outlined,
  // DoubleArrowOutlined,
  GavelOutlined,
  GridViewOutlined,
  InfoOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuOutlined,
  NightsStayOutlined,
  RocketLaunchOutlined,
  SearchOutlined,
  SettingsOutlined,
  TimelineOutlined,
  WbSunnyOutlined,
  WidgetsOutlined,
  BarChartOutlined
} from '@mui/icons-material';
import dino from '../../Static/images/dino.png';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Container from '../../Components/Container/Container';
import { CheckIcon } from '@chakra-ui/icons';
import IndexConfiguration from './Configuration';
import Overview from './Overview';
import { AuthContext } from '../../Contexts/AuthContext';
import { AppContext } from '../../Contexts/AppContext';
import { ThemeContext } from '../../Contexts/ThemeContext';
import SearchStudioSettings from './Settings';
import Forecast from './Forecast';
const VITE_ROUTE_PREFIX = import.meta.env.VITE_ROUTE_PREFIX || '';
const SearchStudio = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { role, setRole } = useContext(AuthContext);
  console.log('appname', useParams());
  const { appName } = useParams();
  const _apps =  __roleAppMap[role];

  const _tabs = [
    {
      name: 'Get Started',
      value: 'des',
      icon: RocketLaunchOutlined,
      head: 'Getting Started',
      // text under the heading for popup
      popover: 'Upload your data and get integration details',
      url: ''
    },
    {
      name: 'Forecast',
      head: 'Forecast Dashboard',
      popover: 'View and analyze forecast data',
      value: 'forecast',
      url: 'forecast',
      icon: BarChartOutlined
    },
    {
      name: 'Inventory',
      popover: 'View inventory',
      value: 'inventory',
      url: 'inventory',
      icon: Inventory2Outlined,
      locked: true
    },
    {
      name: 'Settings',
      head: 'Console Settings',
      popover: 'Configure how the console behaves.',
      value: 'settings',
      url: 'settings',
      icon: SettingsOutlined
    }
  ];
  const pathvar = window.location.pathname.toString().split('retail-studio')[1];
  const _val = pathvar[0] == '/' ? pathvar.slice(1) : pathvar;
  const val = _val.split('/')[1];
  const [currentTab, setCurrentTab] = useState(_tabs.findIndex((e) => e.url == val));

  useEffect(() => {
    console.log('THE PATH IS:', window.location.pathname);
    console.log('THE ROLE IS:', role);
    console.log('CURRENT TAB:', currentTab);
    if (_apps.findIndex((e) => e.roleName == appName) == -1) {
      // check if appname is actually a _tabs url
      if (_tabs.findIndex((e) => e.url == val) != -1) {
        navigate(`${VITE_ROUTE_PREFIX}/retail-studio/${_apps[0].roleName}/${appName}`);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.log('CAME HERE BECAUSE OF INVALID TAB');
        navigate(
          `${VITE_ROUTE_PREFIX}/retail-studio/${_apps[0].roleName}/${
            currentTab != -1 && currentTab == 0 ? _tabs[currentTab].url : ''
          }`
        );
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } else {
      if (_tabs.findIndex((e) => e.url == val) == -1) {
        navigate(`${VITE_ROUTE_PREFIX}/retail-studio/${appName}/${_tabs[0].url}`);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  }, []);
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const [app, setApp] = useState(
    appName && _apps.findIndex((e) => e.roleName == appName) != -1
      ? _apps.find((e) => e.roleName == appName).name
      : _apps[0].name
  );

  const highlight = (text, highlight, color = '#E4EFFF') => {
    // split the text by the highlight text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => (
          <span
            key={index}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: color, color: '#0C3DEC', fontWeight: 'bold' }
                : {}
            }>
            {part}
          </span>
        ))}
      </span>
    );
  };
  const { onOpen } = useDisclosure();
  const btnRef = React.useRef();
  // const [indexSearch, setIndexSearch] = useState('');
  // const [index, setIndex] = useState(_apps.find((e) => e.name == app).indices[0].name);
  return (
    <AppContext.Provider value={{ app, setApp, _apps, appName }}>
      {/* <LeftDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} btnRef={btnRef} /> */}
      <Container style={{ padding: '0px 0px 0px 0px' }} bg={theme.colors.white}>
        <Flex
          w="100%"
          h="100px"
          bg={theme.colors.primary.background}
          color={theme.colors.secondary.color}
          borderBottom={`1px solid ${theme.colors.tertiary.border}`}
          direction="column">
          <Flex p="10px 20px 10px 25px" gap="10px" alignItems={'center'}>
            <IconButton
              border={`1px solid ${theme.colors.tertiary.border}`}
              bg={theme.colors.tertiary.background}
              _hover={{
                backgroundColor: `${theme.colors.tertiary.hover} !important`
              }}
              icon={<MenuOutlined style={{ fontSize: '16px', color: '#5A6368' }} />}
              color={theme.colors.secondary.colorGray}
              ref={btnRef}
              onClick={onOpen}
              size={'35px'}
              boxSize={'35px'}
              w="35px !important"
              h="35px !important"
              p="0"
              boxShadow={'none'}
            />
            <Flex
              gap="5px"
              alignItems={'center'}
              cursor={'pointer'}
              mr="20px"
              onClick={() => {
                navigate(`${VITE_ROUTE_PREFIX}/`);
              }}>
              <Image src={couturelogo} w="40px" h="40px" />
              <Text fontWeight={'800'}>Retail Operations</Text>
            </Flex>
            <Flex gap="5px" alignItems={'center'} justifyContent={'center'}>
              {/* <Text  fontWeight={'400'} fontSize={'15px'} color={'#55636C'}>
              Applications
            </Text> */}
              {/* <Text  fontWeight={'400'} fontSize={'15px'} color={'#55636C'}>
              /
            </Text> */}
              {/* <NavigateNextOutlined
              style={{
                color: '#55636C',
                fontSize: '14px'
              }}
            /> */}
              <Menu closeOnSelect={false}>
                {() => {
                  return (
                    <>
                      {/* <Tooltip hasArrow placement="bottom" label="Change View"> */}
                      <MenuButton
                        variant="outline"
                        //   size="sm"
                        border="1px solid #bbb"
                        borderRadius={'50%'}
                        icon={<GridViewOutlined style={{ color: '#7b7aa5', fontSize: '20px' }} />}
                        //   variant="outline"
                        as={Button}
                        size={'md'}
                        style={{
                          height: '30px',
                          borderRadius: '5px',
                          border: `1px solid ${theme.colors.tertiary.border}`,
                          color: theme.colors.sleekButton.text,
                          backgroundColor: theme.colors.tertiary.background,
                          fontSize: '13px',

                          boxShadow: 'none',
                          fontWeight: '600'
                        }}
                        rightIcon={
                          <ArrowDropDown
                            style={{
                              color: '#5B646A',
                              fontSize: '20px'
                            }}
                          />
                        }
                        leftIcon={
                          <Flex
                            w="20px"
                            fontSize={'8px'}
                            color={theme.colors.tertiary.color}
                            h="20px"
                            borderRadius={'2px'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            bg={theme.colors.tertiary.border}>
                            {_apps.find((e) => e.name == app).sf}
                          </Flex>
                        }
                        aria-label="Options">
                        {app}
                      </MenuButton>
                      {/* </Tooltip> */}

                      <MenuList
                        gap="5px"
                        padding="5px 5px"
                        borderColor={theme.colors.tertiary.border}
                        bg={theme.colors.secondary.background}
                        color={theme.colors.secondary.color}
                        minWidth={'300px'}>
                        {_apps.map((key) => (
                          <MenuItem
                            padding="10px 10px"
                            borderBottom={`1px solid ${theme.colors.tertiary.border}`}
                            mb="5px"
                            _hover={{
                              bg: theme.colors.tertiary.hover
                            }}
                            bg={key.name == app ? theme.colors.tertiary.background : ''}
                            onClick={() => {
                              setApp(key.name);

                              // setIndex(key.indices[0].name);
                              navigate(
                                `${VITE_ROUTE_PREFIX}/retail-studio/${key.roleName}/${
                                  _tabs[currentTab].url
                                }${window.location.pathname.split(_tabs[currentTab].url)[1]}`,
                                { replace: false }
                              );
                              setTimeout(() => {
                                window.location.reload();
                              }, 100);
                              // onClose();
                            }}
                            gap="10px"
                            key={key.name}>
                            <Flex
                              w="30px"
                              fontSize={'14px'}
                              color="white"
                              h="30px"
                              borderRadius={'5px'}
                              p="5px"
                              alignItems={'center'}
                              justifyContent={'center'}
                              bg="#333">
                              {key.sf}
                            </Flex>
                            <Text ml="10px" fontSize="13px" fontWeight={'bold'}>
                              {key.name}
                            </Text>
                            <Spacer />
                            {key.name == app ? (
                              <CheckIcon style={{ color: '#158939', fontSize: '15px' }} />
                            ) : null}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </>
                  );
                }}
              </Menu>
              {/* <Menu closeOnSelect={false}>
                {() => {
                  return (
                    <>
                      <MenuButton
                        variant="outline"
                        //   size="sm"
                        border="1px solid #bbb"
                        borderRadius={'50%'}
                        icon={<GridViewOutlined style={{ color: '#7b7aa5', fontSize: '20px' }} />}
                        //   variant="outline"
                        as={Button}
                        size={'md'}
                        style={{
                          height: '30px',
                          borderRadius: '5px',
                          border: `1px solid ${theme.colors.tertiary.border}`,
                          color: theme.colors.sleekButton.text,
                          backgroundColor: theme.colors.tertiary.background,
                          fontSize: '13px',

                          boxShadow: 'none',
                          fontWeight: '600'
                        }}
                        rightIcon={
                          <ArrowDropDown
                            style={{
                              color: '#5B646A',
                              fontSize: '20px'
                            }}
                          />
                        }
                        leftIcon={<Text>#</Text>}
                        aria-label="Options">
                        {index}
                      </MenuButton>

                      <MenuList
                        gap="5px"
                        padding="10px 10px"
                        borderColor={theme.colors.tertiary.border}
                        bg={theme.colors.secondary.background}
                        color={theme.colors.secondary.color}
                        minWidth={'300px'}>
                        <Input
                          borderRadius={'2px'}
                          borderColor={theme.colors.tertiary.border}
                          bg={theme.colors.tertiary.background}
                          color={theme.colors.tertiary.color}
                          value={indexSearch}
                          onChange={(e) => {
                            setIndexSearch(e.target.value);
                          }}
                          w="100%"
                          _focus={{
                            border: '1px solid blue'
                          }}
                          mt="5px"
                          placeholder={'Search Indices'}
                          variant={'outline'}
                          mb="5px"
                        />
                        {_apps
                          .find((e) => e.name == app)
                          .indices.filter((e) =>
                            e.name.toLowerCase().includes(indexSearch.toLowerCase())
                          )
                          .map((key) => (
                            <MenuItem
                              padding="10px 10px"
                              borderBottom={`1px solid ${theme.colors.tertiary.border}`}
                              borderRadius="5px"
                              _hover={{
                                bg: theme.colors.tertiary.hover
                              }}
                              mb="5px"
                              bg={key.name == index ? theme.colors.tertiary.background : ''}
                              onClick={() => {
                                setIndex(key.name);
                                // onClose();
                              }}
                              gap="10px"
                              key={key.name}>
                              <Flex
                                w="30px"
                                fontSize={'14px'}
                                h="30px"
                                borderRadius={'5px'}
                                p="5px"
                                alignItems={'center'}
                                justifyContent={'center'}
                                bg="transparent">
                                #
                              </Flex>
                              <Text ml="10px" fontSize="13px" fontWeight={'bold'}>
                                {indexSearch
                                  ? highlight(key.name, indexSearch, '#E4EFFF')
                                  : key.name}
                              </Text>
                              <Spacer />
                              {key.name == index ? (
                                <CheckIcon style={{ color: '#158939', fontSize: '15px' }} />
                              ) : null}
                            </MenuItem>
                          ))}
                      </MenuList>
                    </>
                  );
                }}
              </Menu> */}
            </Flex>
            <Spacer />
            <Button
              mr="20px"
              _hover={{
                backgroundColor: `${theme.colors.link.bg} !important`,

                borderRadius: '0px'
              }}
              onClick={() => {
                navigate(`${VITE_ROUTE_PREFIX}/documentation`);
              }}
              rightIcon={
                <InfoOutlined
                  style={{
                    fontSize: '14px',
                    color: theme.colors.link.text
                  }}
                />
              }
              variant="ghost"
              style={{
                color: theme.colors.link.text,
                fontWeight: 'bold',
                fontSize: '12px',

                backgroundColor: 'transparent',
                boxShadow: 'none',
                padding: '5px 10px'
              }}>
              DOCUMENTATION
            </Button>
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
              <PopoverContent>
                {/* <PopoverHeader fontWeight="semibold">Popover placement</PopoverHeader> */}
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody
                  borderRadius={'5px'}
                  color={theme.colors.tertiary.color}
                  bg={theme.colors.tertiary.background}>
                  <Flex
                    direction={'column'}
                    // h="400px"
                    w="100%"
                    gap="5px"
                    alignItems={'center'}
                    p="10px">
                    <Image src={dino} objectFit={'cover'} w="100px" h="100px" borderRadius="50%" />
                    {localStorage.getItem('user') ? (
                      <Text fontSize="15px" fontWeight={'bold'} color={theme.colors.tertiary.color}>
                        {localStorage.getItem('user')}
                      </Text>
                    ) : null}
                    <Text
                      fontSize="13px"
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
                    <Divider borderColor={theme.colors.tertiary.border} />
                    <Flex
                      borderRadius={'5px'}
                      cursor={'pointer'}
                      w="100%"
                      gap="20px"
                      p="10px"
                      onClick={() => {
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
          </Flex>
          <Spacer />
          <Tabs
            variant={'unstyled'}
            borderColor={'rgba(0,0,0,0)'}
            index={currentTab}
            w="100%"
            onChange={(index) => {
              setCurrentTab(index);
            }}>
            <TabList p="0 20px">
              {_tabs.map((tab, ind) => {
                const IconComponent = tab.icon;
                return (
                  <Popover key={tab.name} placement="bottom-start" trigger="hover">
                    {() => (
                      <>
                        <PopoverTrigger>
                          <Tab
                            isDisabled={tab.locked}
                            borderBottom={
                              currentTab == ind
                                ? `2px solid ${theme.colors.highlightBorder.main}`
                                : null
                            }
                            onClick={() => {
                              navigate(
                                `${VITE_ROUTE_PREFIX}/retail-studio/${
                                  appName ?? _apps.find((e) => e.name == app).roleName
                                }/${tab.url}`
                              );
                            }}
                            _hover={{
                              backgroundColor: tab.locked ? null : theme.colors.secondary.hover
                            }}
                            key={tab.name}
                            value={ind}>
                            <Flex gap="5px" alignItems={'center'}>
                              <IconComponent
                                style={{
                                  fontSize: '14px',
                                  color: theme.colors.secondary.colorGray
                                }}
                              />
                              <Text
                                fontSize={'14px'}
                                color={theme.colors.tertiary.color}
                                textOverflow={'none'}
                                fontWeight={currentTab == ind ? 'bold' : null}
                                wordBreak={'none'}>
                                {tab.name}
                              </Text>
                              {tab.locked ? (
                                <LockOutlined style={{ color: '#bbb', fontSize: '14px' }} />
                              ) : null}
                            </Flex>
                          </Tab>
                        </PopoverTrigger>
                        <PopoverContent
                          bg="rgba(0,0,0,0.8)"
                          p="10px 10px"
                          color="white"
                          border="0px solid transparent"
                          maxW="150px"
                          borderRadius={'5px'}>
                          <Flex direction={'column'} gap="5px" w="100%" alignItems={'flex-start'}>
                            <Text fontSize="12px" fontWeight="bold">
                              {tab.head}
                            </Text>
                            <Text fontSize="12px" fontWeight="normal">
                              {tab.popover}
                            </Text>
                          </Flex>
                        </PopoverContent>
                      </>
                    )}
                  </Popover>
                );
              })}
            </TabList>
            {/* <TabIndicator mt="-1.5px" height="2px" bg="#E0846E" borderRadius="1px" /> */}
          </Tabs>
        </Flex>
        <Flex w="100%">
          <Routes>
            <Route path={``} element={<Overview />} />
            <Route path={`configuration/*`} element={<IndexConfiguration />} />
            <Route path={`forecast/*`} element={<Forecast />} />
            <Route path={`settings/*`} element={<SearchStudioSettings />} />
          </Routes>
        </Flex>
      </Container>
    </AppContext.Provider>
  );
};

export default SearchStudio;
