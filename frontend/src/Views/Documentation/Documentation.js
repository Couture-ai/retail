/* eslint-disable no-unused-vars */
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
  Input,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
  useTheme
} from '@chakra-ui/react';
import couturelogo from '../../Static/images/couturelogo.png';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Container from '../../Components/Container/Container';
import doc from './document';
import { CheckCircleIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import MarkdownViewer from './content/Markdown';

const VITE_ROUTE_PREFIX = import.meta.env.VITE_ROUTE_PREFIX || '';
const Section = ({ section, content, selected, setSelected, i }) => {
  const [expanded, setExpanded] = useState(i == selected[0] ? true : false);
  const Icon = content.icon;
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Flex direction="column" w="100%">
      <Flex
        // borderLeft={selected[0] == i && !expanded ? `2px solid ${theme.colors.highlightBorder.main}` : 'none'}
        bg={selected[0] == i && !expanded ? theme.colors.tertiary.hover : null}
        cursor="pointer"
        _hover={{ backgroundColor: theme.colors.tertiary.hover }}
        onClick={() => {
          setExpanded(!expanded);
        }}
        p=" 4px 10px"
        fontWeight={'bold'}
        color={theme.colors.secondary.colorGray}
        w="100%"
        gap="10px"
        alignItems={'center'}>
        <Icon style={{ fontSize: '14px', width: '20px' }} />
        <Text fontSize={'14px'}>{section}</Text>
        <Spacer />
        {!expanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
      </Flex>
      <Flex direction="column" display={expanded ? 'block' : 'none'}>
        {content.sections.map((e, index) => {
          return (
            <Flex
              //   borderLeft={
              //     selected[0] == i && expanded && selected[1] == index ? `2px solid ${theme.colors.highlightBorder.main}` : 'none'
              //   }
              w="100%"
              key={index}
              onClick={() => {
                setSelected([i, index]);
                navigate(`${VITE_ROUTE_PREFIX}/documentation/${content.url}/${e.url}`);
              }}
              gap="10px"
              color={selected[0] == i && expanded && selected[1] == index ? '#2A51E8' : null}
              p="0px 10px"
              cursor="pointer"
              _hover={{ backgroundColor: theme.colors.tertiary.hover }}>
              <Flex w="20px" minW="20px" justifyContent={'center'}>
                <Box
                  w="2px"
                  bg={
                    selected[0] == i && expanded && selected[1] == index ? '#2A51E8' : '#bbb'
                  }></Box>
              </Flex>
              <Text
                p="4px 0px"
                fontSize={'14px'}
                fontWeight={selected[0] == i && expanded && selected[1] == index ? 'bold' : null}>
                {e.name}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

const Documentation = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  console.log('xxx', useParams());
  const { headingName, sectionName } = useParams();
  const firstHeading = doc.sections[0].url;
  const headingIndex = doc.sections.findIndex((e) => e.url == headingName);
  const firstSection = doc.sections[0].sections[0].url;
  const sectionIndex =
    headingIndex == -1
      ? -1
      : doc.sections[headingIndex].sections.findIndex((e) => e.url == sectionName);

  if (!headingName || !sectionName || headingIndex == -1 || sectionIndex == -1) {
    navigate(`${VITE_ROUTE_PREFIX}/documentation/${firstHeading}/${firstSection}`);
  }

  const [input, setInput] = useState('');
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

  function findContextualStrings(text, input, numChars) {
    const result = [];
    text = text.toString();
    const inputLength = input.length;

    // Regular expression to find all occurrences of the input string (case-insensitive)
    const regex = new RegExp(input, 'gi'); // 'g' for global search, 'i' for case-insensitive

    let match;

    // Find all occurrences of the input string
    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = match.index + inputLength;

      // Get 'numChars' characters before and '2 * numChars' characters after the input match
      const start = Math.max(0, matchStart - numChars);
      const end = Math.min(text.length, matchEnd + 2 * numChars);

      // Slice the context around the match
      let context = text.slice(start, end);

      // If the context length is greater than the set number of characters, add ellipsis (...)
      if (start > 0) {
        context = '...' + context.slice(3); // Add ellipsis at the start
      }
      if (end < text.length) {
        context = context.slice(0, context.length - 3) + '...'; // Add ellipsis at the end
      }

      // Add the context string to the result
      result.push({ match: context, index: match.index });
    }

    // Now, merge the results if two occurrences are within '2 * numChars' characters of each other
    const mergedResults = [];
    let lastAdded = null;

    result.forEach((current) => {
      if (lastAdded && current.index - lastAdded.index < 2 * numChars) {
        // Merge the current match with the last one
        mergedResults[mergedResults.length - 1].match =
          mergedResults[mergedResults.length - 1].match + current.match.slice(inputLength);
      } else {
        // Otherwise, just add the current match to the result
        mergedResults.push(current);
      }
      lastAdded = current;
    });

    return mergedResults.map((item) => item.match);
  }

  const inputRef = useRef();
  const handleKeyDown = (event) => {
    if (event.key === '/') {
      // Focus on the input element when '/' is pressed
      inputRef.current?.focus();
      //do not put the '/' in the input
      event.preventDefault();
    }
  };
  useEffect(() => {
    // Add keydown event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const [selected, setSelected] = useState([
    doc.sections.findIndex((e) => e.url == (headingName ?? firstHeading)),
    doc.sections
      .find((e) => e.url == (headingName ?? firstHeading))
      .sections.findIndex((e) => e.url == (sectionName ?? firstSection))
  ]);
  console.log('selected xxx', selected);
  return (
    <Container
      minH={`${window.innerHeight}px`}
      style={{ padding: '0px 0px 0px 0px' }}
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}>
      <Flex
        w="100%"
        h="60px"
        bg={theme.colors.primary.background}
        borderBottom={`1px solid ${theme.colors.tertiary.border}`}
        direction="column">
        <Flex p="10px 20px 10px 25px" gap="10px" h="100%" alignItems={'center'}>
          <Image
            src={couturelogo}
            w="40px"
            h="40px"
            cursor="pointer"
            onClick={() => {
              navigate(`${VITE_ROUTE_PREFIX}/`);
            }}
          />
          <Flex gap="5px" alignItems={'center'} justifyContent={'center'} fontWeight={'600'}>
            Couture Search Docs
          </Flex>
          <Spacer />
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              if (e.target.value && e.target.value[0] == '/') {
                setInput(e.target.value.slice(1));
              } else setInput(e.target.value);
            }}
            bg={theme.colors.tertiary.background}
            _focus={{
              backgroundColor: `${theme.colors.tertiary.background} !important`
            }}
            _hover={{
              backgroundColor: `${theme.colors.tertiary.background} !important`
            }}
            border={`1px solid ${theme.colors.inputBorder.main}`}
            borderRadius={'5px'}
            h="40px"
            w="300px"
            placeholder="Search in Docs (/)"
            fontSize={'14px'}
            variant="filled"
          />
        </Flex>
      </Flex>
      {input.trim() == '' && (
        <Flex w="100%" h={`${window.innerHeight - 60}px`}>
          <Flex
            bg={theme.colors.tertiary.background}
            pl="20px"
            pr="10px"
            pt="20px"
            w="330px"
            minW={'330px'}
            h="100%"
            direction={'column'}
            style={{
              borderRight: `1px solid ${theme.colors.tertiary.border}`
            }}>
            {doc.sections.map((e, index) => {
              return (
                <Section
                  key={index}
                  i={index}
                  setSelected={setSelected}
                  selected={selected}
                  section={e.name}
                  content={e}
                />
              );
            })}
          </Flex>
          <Flex
            w="100%"
            direction="column"
            pt="60px"
            pl="80px"
            pr="80px"
            gap="40px"
            pb="50px"
            overflowY="scroll"
            id="scrollable-container"
            h={`${window.innerHeight - 60}px`}>
            <Flex direction="column" gap="10px">
              {' '}
              <Text fontWeight={'bold'} fontSize={'30px'}>
                {doc.sections[selected[0]].sections[selected[1]].name}
              </Text>
              <Text fontSize={'18px'} color={theme.colors.secondary.colorGray} mb="30px">
                {' '}
                {doc.sections[selected[0]].sections[selected[1]].description}
              </Text>
            </Flex>
            {doc.sections[selected[0]].sections[selected[1]].headings.map((e, index) => {
              return (
                <Flex key={e.content} direction="column" gap="10px">
                  <Text
                    fontWeight={'bold'}
                    fontSize={'24px'}
                    color={theme.colors.tertiary.color}
                    id={`heading${index}`}>
                    {e.name}
                  </Text>
                  <Divider borderColor={theme.colors.tertiary.border} />
                  {/* <Text fontSize={'16px'} color={theme.colors.secondary.colorGray}>
                    {e.content}
                  </Text> */}
                  <MarkdownViewer
                    path={`${
                      import.meta.env.VITE_ROUTE_PREFIX == ''
                        ? ''
                        : `/${import.meta.env.VITE_ROUTE_PREFIX}`
                    }/content${e.content}`}
                  />
                </Flex>
              );
            })}
          </Flex>
          <Flex pl="20px" pr="100px" pt="60px" minW="350px" h="100%" direction={'column'} gap="5px">
            <Text
              p="5px 10px"
              color={theme.colors.tertiary.color}
              fontSize={'13px'}
              fontWeight={'bold'}>
              In This Article
            </Text>
            {doc.sections[selected[0]].sections[selected[1]].headings.map((e, index) => {
              return (
                <Text
                  borderRadius={'2px'}
                  p="5px 10px"
                  _hover={{
                    backgroundColor: `${theme.colors.tertiary.background} !important`
                  }}
                  key={index}
                  fontSize={'14px'}
                  color={theme.colors.secondary.colorGray}
                  cursor="pointer"
                  onClick={() => {
                    const container = document.getElementById('scrollable-container'); // Replace with your container's id
                    const element = document.getElementById(`heading${index}`);

                    if (container && element) {
                      const offset = 30; // Adjust this value for the desired top offset
                      const elementRect = element.getBoundingClientRect();
                      const containerRect = container.getBoundingClientRect();

                      const elementTop = elementRect.top - containerRect.top + container.scrollTop;

                      container.scrollTo({
                        top: elementTop - offset,
                        behavior: 'smooth'
                      });
                    }
                  }}>
                  {e.name}
                </Text>
              );
            })}
          </Flex>
        </Flex>
      )}
      {input.trim() != '' && (
        <Flex p="60px 400px" direction="column" gap="20px">
          {
            <Text fontSize={'20px'} fontWeight={'bold'} color="#999">
              Search Results for <span style={{ color: '#444' }}>&quot;{input}&quot;</span>
            </Text>
          }
          {
            // if no results found
            doc.sections.some((e) => {
              return e.sections.some((section) => {
                return section.headings.some(
                  (heading) =>
                    heading?.content?.toString().toLowerCase().includes(input.toLowerCase()) ??
                    false
                );
              });
            }) == false && (
              <Flex direction="column" gap="20px">
                <Text fontSize={'16px'} color="#444">
                  No results found
                </Text>
              </Flex>
            )
          }
          {doc.sections?.map((e, index1) => {
            return (
              <>
                {e.sections.map((section, index) => {
                  // whethe to display it=?
                  const should = section.headings.some((heading) =>
                    heading?.content?.toString().toLowerCase().includes(input.toLowerCase())
                  );
                  if (!should) return null;
                  return (
                    <Flex key={index} direction="column">
                      {section.headings.map((heading, index) => {
                        const _should = heading.content
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase());
                        if (!_should) return null;
                        return (
                          <Flex key={index} direction="column" gap="10px" mt="20px">
                            <Flex direction={'column'} gap="5px">
                              <Text fontSize={'12px'} color="#999">
                                In <span style={{ color: '#666' }}>{section.name}</span>
                              </Text>
                              <Text fontSize={'16px'} fontWeight={'bold'}>
                                {heading.name}
                              </Text>
                            </Flex>
                            {findContextualStrings(heading.content, input.toLowerCase(), 40).map(
                              (estr, index2) => {
                                return (
                                  <Flex
                                    onClick={() => {
                                      // set selection
                                      // setSelected([index1, index]);
                                      navigate(
                                        `${VITE_ROUTE_PREFIX}/documentation/${e.url}/${section.url}`
                                      );
                                      // clear the input
                                      setInput('');

                                      // scroll to the heading
                                      setTimeout(() => {
                                        document.getElementById(`heading${index}`).scrollIntoView({
                                          behavior: 'smooth',
                                          block: 'start',
                                          inline: 'nearest'
                                        });
                                      }, 100);

                                      // document.getElementById(`heading${index}`).scrollIntoView({
                                      //   behavior: 'smooth',
                                      //   block: 'start',
                                      //   inline: 'nearest'
                                      // });
                                    }}
                                    cursor="pointer"
                                    bg={theme.colors.tertiary.background}
                                    w="100%"
                                    p="10px"
                                    key={index2}
                                    direction="column"
                                    gap="10px">
                                    <Text fontSize={'14px'}>
                                      {highlight(estr, input.toLowerCase(), theme.colors.link.bg)}
                                    </Text>
                                  </Flex>
                                );
                              }
                            )}
                          </Flex>
                        );
                      })}
                    </Flex>
                  );
                })}
              </>
            );
          })}
        </Flex>
      )}
    </Container>
  );
};

export default Documentation;
