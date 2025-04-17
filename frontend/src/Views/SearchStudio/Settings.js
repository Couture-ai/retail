/* eslint-disable no-unused-vars */
import { Flex, Text, useTheme } from '@chakra-ui/react';
import {
  AudiotrackOutlined,
  AvTimerOutlined,
  DataObjectOutlined,
  QuestionAnswerOutlined,
  QuestionMarkOutlined,
  ReorderOutlined
} from '@mui/icons-material';

import React, { useState } from 'react';

import { Route, Routes, useNavigate, useParams } from 'react-router-dom';

import ExpConfig from './Settings/ExperimentationConfig';

const SearchStudioSettings = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();
  const { appName } = useParams();

  const _groups = [
    {
      name: 'Core',
      children: [
        {
          name: 'Experimentation Config',
          icon: DataObjectOutlined,
          url: 'exp'
        }
      ]
    }
  ];
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const type = pathname.split('settings')[1];
  const tab = type.length > 0 && type[0] == '/' ? type.split('/').slice(1).join('/') : '';
  const foundGroup = _groups.find(
    (_group) => _group.children.findIndex((_tab) => _tab.url == tab) != -1
  );
  const [selected, setSelected] = useState(
    foundGroup == undefined
      ? { name: 'Basic Settings' }
      : foundGroup.children.find((e) => e.url == tab)
  );
  return (
    <Flex
      w="100%"
      p="40px 10px 20px 10px"
      minH={`${window.innerHeight - 100}px`}
      bg={theme.colors.secondary.background}
      color={theme.colors.secondary.color}>
      <Flex flex="1" direction={'column'} pt="0px" pl="50px" gap="10px">
        <Flex
          p="5px 10px"
          alignItems={'center'}
          gap="10px"
          cursor="pointer"
          onClick={(e) => {
            setSelected({
              name: 'Basic Settings'
            });
            navigate(`${import.meta.env.VITE_ROUTE_PREFIX}/retail-studio/${appName}/settings/`);
          }}
          borderLeft={
            selected.name == 'Basic Settings'
              ? `2px solid ${theme.colors.highlightBorder.main}`
              : null
          }
          bg={selected.name == 'Basic Settings' ? theme.colors.tertiary.background : null}>
          <AvTimerOutlined
            style={{
              fontSize: '18px',
              color: theme.colors.secondary.colorGray
            }}
          />
          <Text fontSize={'14px'} fontWeight={'500'}>
            {'Basic Settings'}
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
                      onClick={(e) => {
                        setSelected(item);
                        navigate(
                          `${import.meta.env.VITE_ROUTE_PREFIX}/retail-studio/${appName}/settings/${
                            item.url
                          }`
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
        <Flex w="100%" gap="10px" alignItems={'center'}>
          <Text fontSize={'20px'} fontWeight={'bold'}>
            {selected.name}
          </Text>
        </Flex>

        <Routes>
          <Route path={`exp`} element={<ExpConfig isCollapsed={isCollapsed} />} />
        </Routes>
      </Flex>
    </Flex>
  );
};

export default SearchStudioSettings;
