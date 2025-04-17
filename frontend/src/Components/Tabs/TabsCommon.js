import { Tab, TabList, TabPanels, Tabs, useTheme } from '@chakra-ui/react';
import React from 'react';

const TabsCommon = (props) => {
  const theme = useTheme();
  return (
    <Tabs colorScheme={'black'} {...props}>
      <TabList>
        {props.tabList &&
          props.tabList.map((tab) => {
            return (
              <Tab
                key={tab.name}
                _selected={{
                  fontWeight: '700',
                  color: `${theme.colors.black[1000]}`,
                  borderBottom: '2px solid black'
                }}>
                {tab.name}
              </Tab>
            );
          })}
      </TabList>
      <TabPanels>{props.children}</TabPanels>
    </Tabs>
  );
};

export default TabsCommon;
