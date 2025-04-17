import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  MenuItemOption,
  Box,
  Portal,
  Menu,
  MenuList,
  MenuOptionGroup,
  Flex,
  MenuButton
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';

const BreadCrumb = (props) => {
  return (
    <Breadcrumb>
      {props.itemList &&
        props.itemList.map((item) => {
          if (item.isPortal && item.isPortal) {
            return (
              <BreadcrumbItem key={item.name}>
                <Flex gap={1} alignItems="center">
                  <Menu>
                    <MenuButton>
                      <Flex alignItems="center">
                        <Box>{item.name}</Box>
                        <KeyboardArrowDownRounded />
                      </Flex>
                    </MenuButton>
                    <Portal>
                      <MenuList zIndex="999">
                        <MenuOptionGroup defaultValue={props.defaultValue}>
                          {props.portalList &&
                            props.portalList.map((portalItem) => {
                              return (
                                <MenuItemOption
                                  value={portalItem.onClickParameter}
                                  key={portalItem.name}
                                  onClick={() =>
                                    props.handleMenuClick(portalItem.onClickParameter)
                                  }>
                                  {portalItem.name}
                                </MenuItemOption>
                              );
                            })}
                        </MenuOptionGroup>
                      </MenuList>
                    </Portal>
                  </Menu>
                </Flex>
              </BreadcrumbItem>
            );
          } else {
            return (
              <BreadcrumbItem key={item.name}>
                <BreadcrumbLink
                  _hover={{ textDecoration: 'none' }}
                  as={item.asLink ? Link : null}
                  to={item.toLink}>
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          }
        })}
    </Breadcrumb>
  );
};

export default BreadCrumb;
