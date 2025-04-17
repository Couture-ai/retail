import { Flex, Text, useTheme } from '@chakra-ui/react';
import {
  AllInclusiveOutlined,
  ApiOutlined,
  AvTimerOutlined,
  DoDisturbAltOutlined,
  GroupWorkOutlined,
  KeyboardOptionKeyOutlined,
  SyncAltOutlined,
  TranslateOutlined,
  TroubleshootOutlined,
  TuneOutlined
} from '@mui/icons-material';

import React, { useState } from 'react';
import StopWords from './Configuration/StopWords';
import AttributesList from './Configuration/Attributes';
import AddableAttributesList from './Configuration/AddableAttributesList';
import Synonyms from './Configuration/SynonymsConfig';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import ConfigOverview from './Configuration/Overview';

const IndexConfiguration = () => {
  const { appName } = useParams();
  const theme = useTheme();

  const _groups = [
    {
      name: 'Core',
      children: [
        {
          name: 'All Attributes',
          icon: AllInclusiveOutlined,
          url: 'attributes/all'
        },
        {
          name: 'Searchable Attributes',
          icon: TroubleshootOutlined,
          url: 'attributes/searchable'
        },
        {
          name: 'Retrievable Attributes',
          icon: ApiOutlined,
          url: 'attributes/retrievable'
        },

        {
          name: 'Filterable Attributes',
          icon: TuneOutlined,
          url: 'attributes/filterable'
        },
        {
          name: 'Facetable Attributes',
          icon: GroupWorkOutlined,
          url: 'attributes/facetable'
        }
      ]
    },
    {
      name: 'Optimizations',
      children: [
        {
          name: 'Synonyms',
          icon: SyncAltOutlined,
          url: 'synonyms'
        },
        {
          name: 'Stop Words',
          icon: DoDisturbAltOutlined,
          url: 'stopwords'
        },
        {
          name: 'Optional Words',
          icon: KeyboardOptionKeyOutlined,
          url: 'optional'
        }
      ]
    }
   
  ];
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  // const { app, _apps } = useContext(AppContext);
  // const { role } = useContext(AuthContext);
  // const appName = _apps.find((e) => e.name == app).roleName;
  const type = pathname.split('configuration')[1];
  const tab = type.length > 0 && type[0] == '/' ? type.split('/').slice(1).join('/') : '';
  const foundGroup = _groups.find(
    (_group) => _group.children.findIndex((_tab) => _tab.url == tab) != -1
  );
  const [selected, setSelected] = useState(
    foundGroup == undefined ? { name: 'Overview' } : foundGroup.children.find((e) => e.url == tab)
  );
  return (
    <Flex
      w="100%"
      p="40px 100px 20px 100px"
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}
      minH={`${window.innerHeight - 100}px`}>
      <Flex flex="1" direction={'column'} pt="0px" pl="50px" gap="10px">
        <Flex
          p="5px 10px"
          alignItems={'center'}
          gap="10px"
          cursor="pointer"
          onClick={() => {
            setSelected({
              name: 'Overview'
            });
            navigate(
              `${import.meta.env.VITE_ROUTE_PREFIX}/retail-studio/${appName}/configuration/`
            );
          }}
          borderLeft={
            selected.name == 'Overview' ? `2px solid ${theme.colors.highlightBorder.main}` : null
          }
          bg={selected.name == 'Overview' ? theme.colors.tertiary.background : null}>
          <AvTimerOutlined
            style={{
              fontSize: '18px',
              color: theme.colors.secondary.colorGray
            }}
          />
          <Text fontSize={'14px'} fontWeight={'500'}>
            {'Overview'}
          </Text>
        </Flex>
        {_groups.map((e) => {
          return (
            <Flex
              pt="5px"
              key={e.name}
              direction="column"
              borderTop={`1px solid ${theme.colors.tertiary.border}`}>
              <Flex p="5px 10px">
                <Text fontWeight="bold" fontSize={'13px'}>
                  {e.name}
                </Text>
              </Flex>
              <Flex direction="column" gap="10px">
                {e.children.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Flex
                      borderRadius={'0px'}
                      cursor="pointer"
                      _hover={{
                        bg: `${theme.colors.tertiary.hover} !important`
                      }}
                      onClick={() => {
                        setSelected(item);
                        navigate(
                          `${
                            import.meta.env.VITE_ROUTE_PREFIX
                          }/retail-studio/${appName}/configuration/${item.url}`
                        );
                      }}
                      borderLeft={
                        selected.name == item.name
                          ? `2px solid ${theme.colors.highlightBorder.main}`
                          : null
                      }
                      bg={selected.name == item.name ? theme.colors.tertiary.hover : null}
                      p="5px 10px"
                      key={item.name}
                      alignItems={'center'}
                      gap="10px">
                      <Icon
                        style={{
                          fontSize: '18px',
                          color: theme.colors.secondary.colorGray
                        }}
                      />
                      <Text fontSize={'14px'} fontWeight={'500'}>
                        {item.name}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      <Flex flex="6" p="0px 20px" direction="column" gap="20px">
        <Text fontSize={'20px'} fontWeight={'bold'}>
          {selected.name}
        </Text>
        <Routes>
          <Route path="attributes/all" element={<AttributesList />} />
          <Route path="" element={<ConfigOverview />} />
          <Route
            path="attributes/retrievable"
            element={
              <AddableAttributesList
                pid="fetchable"
                name="Retrievable Attributes"
                description="Define attributes which needs to be fetched from the catalogue."
              />
            }
          />
          <Route
            path="attributes/searchable"
            element={
              <AddableAttributesList
                pid="searchable"
                name="Searchable Attributes"
                description={
                  'Define attributes which needs to be searched upon and will be factored in generating the search results. E.g. Brand Name, Product Name, etc. Attributes like image url, non-essential tags, etc. should not be marked as searchable.'
                }
              />
            }
          />{' '}
          <Route
            path="attributes/filterable"
            element={
              <AddableAttributesList
                pid="filterable"
                name="Filterable Attributes"
                description={
                  'Define attributes which can be used as filters to refine search results in the search request.'
                }
              />
            }
          />
          <Route
            path="attributes/facetable"
            element={
              <AddableAttributesList
                pid="facetable"
                name="Facetable Attributes"
                description={
                  'Define atrtibutes on which aggregation will be performed to generate the facet options.'
                }
              />
            }
          />
          <Route path="synonyms" element={<Synonyms />} />
          <Route
            path="optional"
            element={
              <StopWords
                name={'optional'}
                description="Optional words enhance search flexibility by including beneficial terms that aren’t mandatory for matching. This ensures broader, more relevant results while accommodating varied phrasing and user intent seamlessly."
              />
            }
          />
          <Route
            path="stopwords"
            element={
              <StopWords
                name="stop"
                description="Stop words refine search precision by excluding non-essential terms like 'and,' 'the,' or 'of.' This streamlines queries, eliminates noise, and ensures results focus on meaningful and relevant keywords."
              />
            }
          />
        </Routes>
      </Flex>
    </Flex>
  );
};

export default IndexConfiguration;
