import { Box, Divider, Drawer, Flex, Image, ListItem, Text, useTheme } from '@chakra-ui/react';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import React from 'react';
import UserDrawer from '../../Containers/Team/UserDrawer';

const ListItemTeam = (props) => {
  const theme = useTheme();
  return (
    <ListItem>
      <Flex flexDir={'row'}>
        <Box flexBasis={80}>
          <Flex flexDir={'row'}>
            {props.value.imageUrl ? (
              <Box w="35px" h="35px" borderRadius={'20px'} ml={1}>
                <Image
                  src={props.value.imageUrl}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  style={{ borderRadius: '20px' }}
                />
              </Box>
            ) : (
              <AccountCircle style={{ fontSize: '40px' }} />
            )}
            <Flex flexDir={'column'} mx={2}>
              <Text
                variant={'body1'}
                style={{ fontSize: '15px' }}
                cursor="pointer"
                onClick={() => props.onClickKey(props.value.username)}>
                {props.value.username}
              </Text>
              <Drawer
                isOpen={props.isOpen}
                placement="right"
                onClose={props.onClose}
                finalFocusRef={props.btnRef}>
                <UserDrawer
                  isOpen={props.isOpen}
                  onClose={props.onClose}
                  finalFocusRef={props.btnRef}
                  drawerName={props.drawerName}
                  drawerEmail={props.drawerEmail}
                  drawerAccessLevel={props.drawerAccessLevel}
                  drawerAbout={props.drawerAbout}
                  drawerImageUrl={props.drawerImageUrl}
                />
              </Drawer>
              <Text variant={'body3regular'} style={{ fontSize: '10px' }}>
                {props.value.email}
              </Text>
            </Flex>
          </Flex>
        </Box>

        <Text flexBasis={40} ml={6} mt={2} style={{ fontSize: '15px' }}>
          {props.value.dateAdded}
        </Text>
        <Text flexBasis={40} ml={5} mt={2} style={{ fontSize: '15px' }}>
          {props.value.lastActive}
        </Text>
        <Text flexBasis={40} ml={5} mt={2} style={{ fontSize: '15px' }}>
          {props.value.accessLevel}
        </Text>
        <Box flexBasis={20} mt={2}>
          <DeleteOutline
            cursor="pointer"
            style={{ color: `${theme.colors.secondary.colorGray}` }}
            onClick={() => {
              props.handleDelete(props.value.id);
            }}
          />
        </Box>
        <Box flexBasis={20} mt={2}>
          <EditOutlined
            cursor="pointer"
            style={{ color: `${theme.colors.secondary.colorGray}` }}
            onClick={() => {
              props.onEdit(props.value.id);
            }}
          />
        </Box>
      </Flex>
      <Divider mt={2} />
    </ListItem>
  );
};

export default ListItemTeam;
