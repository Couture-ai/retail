/* eslint-disable no-unused-vars */
import {
  Button,
  CircularProgress,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useTheme,
  useToast
} from '@chakra-ui/react';
import {
  AddOutlined,
  ArrowDropDown,
  DataObjectOutlined,
  DownloadOutlined,
  FileUploadOutlined,
  NoteAddOutlined,
  OpenInNewOutlined,
  ViewColumnOutlined
} from '@mui/icons-material';

const ExportButton = ({ data, filename, loading }) => {
  const theme = useTheme();
  const toast = useToast();

  const downloadFile = (fileName, fileType, generateContent) => {
    // Generate file content
    const content = generateContent();
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);

    // Trigger download automatically
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    // Show success toast
    toast({
      position: 'bottom-left',
      duration: 20000, // Toast will close after 5 seconds
      render: ({ onClose }) => (
        <Flex
          alignItems="center"
          gap="10px"
          bg={theme.colors.tertiary.background}
          color={theme.colors.tertiary.color}
          p="10px"
          borderRadius="5px"
          border={`1px solid ${theme.colors.tertiary.border}`}>
          <Text fontSize="14px" fontWeight="bold">
            File{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => window.open(url, '_blank')}>
              {fileName} preview <OpenInNewOutlined style={{ fontSize: '13px' }} />
            </span>{' '}
            downloaded successfully!
          </Text>
          <Button
            bg={theme.colors.tertiary.hover}
            _hover={{
              bg: `${theme.colors.tertiary.hover} !important`
            }}
            color={theme.colors.tertiary.color}
            size="sm"
            onClick={() => {
              URL.revokeObjectURL(url); // Revoke Object URL when "Close" button is clicked
              onClose();
            }}>
            Close
          </Button>
        </Flex>
      ),
      onCloseComplete: () => {
        // Revoke Object URL when the toast closes automatically
        URL.revokeObjectURL(url);
      }
    });
  };

  const exportAsCSV = () => {
    downloadFile(`${filename}.csv`, 'text/plain', () => {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map((row) =>
          headers
            .map((h) => (typeof row[h] == 'object' ? JSON.stringify(row[h]) : row[h]))
            .join(',')
        )
      ];
      return csvRows.join('\n');
    });
  };

  const exportAsJSON = () => {
    downloadFile(`${filename}.json`, 'application/json', () => JSON.stringify(data, null, 2));
  };

  return (
    <Menu closeOnSelect={false}>
      {({ onClose }) => (
        <>
          <MenuButton
            isDisabled={loading ? true : false}
            gap={'5px'}
            variant="outline"
            border="1px solid #bbb"
            borderRadius={'5px'}
            as={Button}
            size={'md'}
            style={{
              height: '30px',
              border: `1px solid ${theme.colors.sleekButton.border}`,
              color: theme.colors.sleekButton.text,
              backgroundColor: theme.colors.tertiary.background,
              fontSize: '13px',
              boxShadow: 'none',
              fontWeight: '600'
            }}
            rightIcon={
              loading ? (
                <CircularProgress isIndeterminate size="13px" />
              ) : (
                <ArrowDropDown
                  style={{
                    color: '#5B646A',
                    fontSize: '20px'
                  }}
                />
              )
            }
            leftIcon={
              <DownloadOutlined
                style={{
                  color: '#5B646A',
                  fontSize: '14px'
                }}
              />
            }
            aria-label="Options">
            Export
          </MenuButton>
          <MenuList
            gap="5px"
            padding="5px 5px"
            border={`1px solid ${theme.colors.tertiary.border}`}
            bg={theme.colors.secondary.background}
            color={theme.colors.secondary.color}
            minWidth={'300px'}>
            <MenuItem
              padding="10px 10px"
              borderRadius="5px"
              _hover={{
                bg: `${theme.colors.tertiary.hover} !important`
              }}
              color={theme.colors.tertiary.color}
              bg={theme.colors.tertiary.background}
              onClick={exportAsCSV}
              gap="10px">
              <ViewColumnOutlined style={{ fontSize: '15px' }} />
              <Text ml="10px" fontSize="13px">
                Export as CSV
              </Text>
              <Spacer />
            </MenuItem>
            <MenuItem
              padding="10px 10px"
              borderRadius="5px"
              _hover={{
                bg: `${theme.colors.tertiary.hover} !important`
              }}
              bg={theme.colors.tertiary.background}
              color={theme.colors.tertiary.color}
              onClick={exportAsJSON}
              gap="10px">
              <DataObjectOutlined style={{ fontSize: '15px' }} />
              <Text ml="10px" fontSize="13px">
                Export as JSON
              </Text>
              <Spacer />
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default ExportButton;
