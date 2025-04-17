/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Image,
  Input,
  Text,
  useTheme,
  useToast
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';
import logo from '../../Static/images/couturelogo.png';
import { AuthContext } from '../../Contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserRepository from '../../repositories/auth';
const Login = () => {
  const theme = useTheme();
  const userRepository = new UserRepository(import.meta.env.VITE_API_STUDIO_URL + '/retailstudio');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const [email, setEmail] = useState('');
  const { role, setRole } = useContext(AuthContext);
  const VITE_ROUTE_PREFIX = import.meta.env.VITE_ROUTE_PREFIX || '';

  const location = useLocation();
  const login = async () => {
    userRepository
      .login({
        stateSetters: {
          setLoading,
          setError,
          setData: (data) => {}
        },
        data: {
          username: email,
          password
        }
      })
      .then((response) => {
        const redirectTo = location.state?.from?.pathname || `${VITE_ROUTE_PREFIX}/retail-studio`;
        navigate(redirectTo);
        window.location.reload();
      })
      .catch((error) => {
        toast({
          title: 'Invalid credentials.',
          status: 'error',
          duration: 1000,
          position: 'top',
          isClosable: true
        });
      });
  };
  useEffect(() => {
    // Check for SSO callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleSSOCallback(code);
    }
  }, []);
  const handleAuthenticationSuccess = (data) => {
    // Set authentication cookie
    document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400; secure; samesite=strict`;
    localStorage.setItem('access_token', data.access_token);

    // Store user info in localStorage if needed
    localStorage.setItem('user', data.decoded_token.email);
    localStorage.setItem('roles', data.decoded_token.groups);
    localStorage.setItem('resources', JSON.stringify(data.resources));
    localStorage.setItem('role', 'admin');
    setRole('admin');
    localStorage.setItem('auth_response', JSON.stringify(data));
    // Redirect to dashboard
    const redirectTo = location.state?.from?.pathname || `${VITE_ROUTE_PREFIX}/retail-studio`;
    navigate(redirectTo);
    window.location.reload();
  };
  const isAuthenticated = () => {
    return document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
  };

  const handleLogin = () => {
    if (
      !(
        (email === 'admin@couture.ai' && password === '@321Couture') ||
        (email === 'ajio@couture.ai' && password === 'Ajio@4321') ||
        (email === 'jiomart@couture.ai' && password === 'Jiomart@4321')
      )
    ) {
      toast({
        title: 'Invalid credentials.',
        status: 'error',
        duration: 1000,
        position: 'top',
        isClosable: true
      });
    } else {
      localStorage.setItem('isLoggedIn', 'true');
      if (email === 'admin@couture.ai') {
        localStorage.setItem('role', 'admin');
        setRole('admin');
      } else if (email === 'ajio@couture.ai') {
        localStorage.setItem('role', 'ajio');
        setRole('ajio');
      } else if (email === 'jiomart@couture.ai') {
        localStorage.setItem('role', 'jiomart');
        setRole('jiomart');
      }

      const redirectTo = location.state?.from?.pathname || `${VITE_ROUTE_PREFIX}/retail-studio`;
      navigate(redirectTo);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // handleLogin();
      login();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password]);
  if (role) {
    return <Navigate to={`${VITE_ROUTE_PREFIX}/retail-studio`} />;
  }

  const handleSSOCallback = async (code) => {
    try {
      const formData = new FormData();
      formData.append('code', code);
      formData.append('client_id', import.meta.env.VITE_SSO_CLIENT_ID);
      formData.append('client_secret', import.meta.env.VITE_SSO_CLIENT_SECRET);
      formData.append('redirect_uri', import.meta.env.VITE_SSO_REDIRECT_URI);
      formData.append('token_url', import.meta.env.VITE_SSO_TOKEN_URL);
      // const response = await axios.post(import.meta.env.VITE_SSO_TOKEN_URL, { code });
      setLoading(true);
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_STUDIO_URL + '/retailstudio/login', // Ensure this URL is correct
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data' // Correct content type for FormData
            }
          }
        );
        if (response.data.access_token) {
          handleAuthenticationSuccess(response.data);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        toast({
          title: 'Log in Failed.',
          status: 'error',
          duration: 1000,
          position: 'top',
          isClosable: true
        });
      }
    } catch (err) {
      setError('SSO authentication failed');
    }
  };
  const handleSSOLogin = () => {
    const ssoUrl = new URL(import.meta.env.VITE_SSO_PROVIDER_URL);
    ssoUrl.searchParams.append('client_id', import.meta.env.VITE_SSO_CLIENT_ID);
    ssoUrl.searchParams.append('redirect_uri', import.meta.env.VITE_SSO_REDIRECT_URI);
    ssoUrl.searchParams.append('response_type', 'code');
    ssoUrl.searchParams.append('scope', import.meta.env.VITE_SSO_SCOPE);

    // Add state parameter for security
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('sso_state', state);
    ssoUrl.searchParams.append('state', state);

    window.location.href = ssoUrl.toString();
  };

  return (
    <Flex
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}
      w="100%"
      h="100vh"
      gap="20px"
      alignItems={'center'}
      justifyContent={'center'}
      direction="column">
      {/* <Image src={couturelogin} w="300px" />{' '} */}
      <Flex w="100%">
        <Flex
          flex="1"
          h="100vh"
          position="relative"
          // bg="#fbfaff"
          justifyContent={'center'}>
          <Flex
            border={`1px solid`}
            borderColor={theme.colors.tertiary.border}
            borderRadius={'50px'}
            boxShadow={`0px 0px 40px 0px ${theme.colors.tertiary.hover}`}
            mt="150px"
            mb="200px"
            flex="1"
            maxW={'500px'}
            p="50px"
            style={{
              borderRadius: '5px'
              // border: `1px solid ${theme.colors.tertiary.border}`,
            }}>
            <Flex direction="column" alignItems={'center'} w={'100%'}>
              <Image
                src={logo}
                w="80px"
                cursor="pointer"
                onClick={() => {
                  navigate(`${VITE_ROUTE_PREFIX}/`);
                }}
              />
              <Text
                mb="50px"
                style={{
                  fontSize: '23px',
                  fontFamily: 'Jost',

                  fontWeight: '600',
                  color: theme.colors.secondary.color
                }}>
                Sign in to Retail Console
              </Text>

              <Box
                w="100%"
                id="loginForm"
                p="10px"
                borderRadius={'5px'}
                bg={theme.colors.tertiary.background}
                border={`1px solid ${theme.colors.tertiary.border}`}>
                <Flex direction="column" pb={'20px'} gap="5px" fontSize={'13px'}>
                  <Text>Email</Text>
                  <Input
                    value={email}
                    _focus={{
                      bg: theme.colors.tertiary.hover
                    }}
                    sx={{
                      '&:-webkit-autofill': {
                        backgroundColor: `${theme.colors.tertiary.hover} !important`,
                        boxShadow: `0 0 0px 1000px ${theme.colors.tertiary.hover} inset`,
                        '-webkit-text-fill-color': theme.colors.tertiary.color
                      }
                    }}
                    bg={`${theme.colors.tertiary.hover} !important`}
                    border={`1px solid ${theme.colors.tertiary.border}`}
                    fontSize={'13px'}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={'Email'}></Input>
                </Flex>
                <Flex direction="column" pb={'15px'} gap="5px" fontSize={'13px'}>
                  <Text>Password</Text>
                  <Input
                    _focus={{
                      bg: theme.colors.tertiary.hover
                    }}
                    sx={{
                      '&:-webkit-autofill': {
                        backgroundColor: `${theme.colors.tertiary.hover} !important`,
                        boxShadow: `0 0 0px 1000px ${theme.colors.tertiary.hover} inset`,
                        '-webkit-text-fill-color': theme.colors.tertiary.color
                      }
                    }}
                    border={`1px solid ${theme.colors.tertiary.border}`}
                    bg={`${theme.colors.tertiary.hover} !important`}
                    value={password}
                    fontSize={'13px'}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={'Password'}></Input>
                </Flex>
                {/* <Flex pb={'20px'}>
                  <Checkbox colorScheme="gray">Remember me</Checkbox>
                  <Spacer />
                  <Text>Forgot Password?</Text>
                </Flex> */}
                <Box pb={'20px'} mt="10px">
                  <Button
                    variant={'menuSolid'}
                    bg={'#7F7EFC'}
                    color={`${theme.colors.white}`}
                    w={'100%'}
                    _hover={{
                      backgroundColor: '#5f5dfc !important'
                    }}
                    onClick={login}>
                    <Text fontSize="md" fontWeight="400">
                      Log in
                    </Text>
                  </Button>
                </Box>
              </Box>
              <Flex
                w="100%"
                mt="20px"
                cursor="pointer"
                onClick={() => {
                  handleSSOLogin();
                }}
                bg={theme.colors.tertiary.background}
                _hover={{
                  bg: `${theme.colors.tertiary.hover} !important`
                }}
                borderRadius={'5px'}
                p="10px 20px"
                color={theme.colors.secondary.color}
                fontSize={'14px'}
                justifyContent={'center'}
                border={`1px solid ${theme.colors.tertiary.border}`}>
                Sign In With RIL Domain
              </Flex>
              <Flex
                color={theme.colors.secondary.colorGray}
                mt="30px"
                w={'100%'}
                justify={'center'}
                alignItems="center">
                <Text fontSize={'12px'}>{`Don't have an account?`}</Text>
                <Text
                  pl={'4px'}
                  fontSize={'12px'}
                  variant="body2semiBold">{`Talk to our team.`}</Text>
              </Flex>
            </Flex>
          </Flex>
          {loading ? (
            <Flex
              position="absolute"
              mt="150px"
              mb="200px"
              flex="1"
              h={`${window.innerHeight - 350}px`}
              maxW={'500px'}
              w="500px"
              alignItems={'center'}
              justifyContent={'center'}>
              <Flex
                h="150px"
                w="150px"
                gap="20px"
                direction="column"
                alignItems={'center'}
                justifyContent={'center'}
                borderRadius={'5px'}
                border="1px solid"
                borderColor={theme.colors.tertiary.border}
                backgroundColor={theme.colors.tertiary.background}>
                <CircularProgress isIndeterminate />
                <Text fontSize={'13px'} color={theme.colors.secondary.colorGray}>
                  Logging You In
                </Text>
              </Flex>
            </Flex>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
