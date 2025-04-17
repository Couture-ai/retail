/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Skeleton,
  Flex,
  ChakraProvider,
  Text,
  Container,
  Image,
  Select,
  Table,
  Thead,
  Td,
  Tbody,
  Th,
  Tr,
  CircularProgress,
  Button
} from '@chakra-ui/react';
import jew1 from './Static/images/jew1.webp';
import jew2 from './Static/images/jew2.webp';
import jew3 from './Static/images/jew3.webp';
import jew4 from './Static/images/jew4.webp';
// import jew5 from './Static/images/jew5.webp';
// import jew6 from './Static/images/jew6.webp';
// import jew7 from './Static/images/jew7.webp';
// import jew8 from './Static/images/jew8.webp';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme from './theme';
// import { ArrowForwardIcon } from '@chakra-ui/icons';
import ImagesUpload from './Views/Upload/ImageUpload';
import { Warning } from '@mui/icons-material';
import Pagination from './Pagination';
const jewUrls = [
  './Static/images/jew1.webp',
  './Static/images/jew2.webp',
  './Static/images/jew3.webp',
  './Static/images/jew4.webp'
  // './Static/images/jew5.webp',
  // './Static/images/jew6.webp',
  // './Static/images/jew7.webp',
  // './Static/images/jew8.webp'
];
const sample = {
  color: [
    ['red', 0.45],
    ['maroon', 0.34]
  ],
  sleevelength: [['full sleeves', 0.93]],
  pattern: [['check', 0.67]],
  fabric: [['cotton', 0.98]],
  neckshape: [['vneck', 0.67]]
};

const TextForecast = () => {
  const [attributeMap, setAttributeMap] = useState({});
  const [attributeMaps, setAttributeMaps] = useState({});
  const [idoodMaps, setIdoodMaps] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOODLoading, setIsOODLoading] = useState(false);
  const [error, setError] = useState(false);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (files && files[0]) {
      // handleFilter();
      console.log('files', files);
      handleAll(files).then(() => {});
    }
  }, [files]);

  const handleFilter = async (index = 0) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', files[index]);

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_API_BASE_URL}/process-images`,
      data: formData
    };
    try {
      const res = await axios(config);
      console.log(res.data);
      setIsLoading(false);
      setAttributeMap(res.data);
      return res.data;
    } catch (e) {
      if (process.env.REACT_APP_ALLOW_MOCK_DATA == 'true') {
        setAttributeMap(sample);
        // setTotalProductsCount(res.data.length);
        // setUniqueProducts(res.data);
        setIsLoading(false);
      } else {
        setError(true);
        setIsLoading(false);
      }
    }
    // .then((res) => {
    //   setAttributeMap(res.data);

    //   // setTotalProductsCount(res.data.length);
    //   // setUniqueProducts(res.data);
    //   setIsLoading(false);
    // })
    // .catch(() => {
    //   if (process.env.REACT_APP_ALLOW_MOCK_DATA == 'true') {
    //     setAttributeMap(sample);
    //     // setTotalProductsCount(res.data.length);
    //     // setUniqueProducts(res.data);
    //     setIsLoading(false);
    //   } else {
    //     setError(true);
    //     setIsLoading(false);
    //   }
    // });
  };
  const attrList = ['color', 'pattern', 'print', 'neck', 'sleeve_length'];
  const downloadTableAsPDF = async () => {
    const pageHeight = 297; // A4 page height in mm
    const pageWidth = 220; // Increased page width (from 210mm to 220mm)

    // Create a new jsPDF document with custom page size
    const doc = new jsPDF({
      unit: 'mm', // Units in millimeters
      format: [pageWidth, pageHeight] // Custom page size [width, height]
    });

    let y = 10; // Start position on the PDF for content (same for image and text)
    const margin = 10; // Define a margin
    const maxWidth = pageWidth - margin * 2; // Calculate the usable width with margins
    const imgWidth = 50; // Image width
    const imgHeight = 50; // Image height
    const textMarginLeft = margin + imgWidth + 10; // Left margin for text next to the image

    // Reduce font size for the entire document
    doc.setFontSize(8); // Set smaller font size for better fit

    for (const [index, key] of Object.keys(attributeMaps).entries()) {
      const imgSrc = files[index].preview;
      const img = await fetch(imgSrc)
        .then((res) => res.blob())
        .then((blob) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        });

      // Check if there's enough space for the image and text on the current page
      if (y + imgHeight + 10 > pageHeight) {
        doc.addPage();
        y = 10; // Reset y-coordinate for the new page
      }

      // Add the image (aligned left)
      doc.addImage(img, 'JPEG', margin, y, imgWidth, imgHeight); // Image at y position

      // Set the starting position for text (align text with the top of the image)
      let x = textMarginLeft; // Leave space next to the image for text content

      // Add attribute data
      attrList.forEach((attr) => {
        const attrValues = attributeMaps[key][attr];
        const rowText = `${attrValues.map(([value, count]) => `${value} (${count})`).join(', ')}`;

        // Bold the attribute name and wrap the text
        doc.setFont('helvetica', 'bold');
        const wrappedText = doc.splitTextToSize(rowText, maxWidth); // Wrap text to fit width
        doc.text(`${attr}:`, x, y); // Add bold attribute label at y position (same as image)

        // Move to the next line for values, but keep y aligned with the top of the image
        y += 6; // Move down slightly for the value text (after the label)

        doc.setFont('helvetica', 'normal'); // Reset font to normal for the values
        doc.text(wrappedText, x, y); // Add wrapped text for attribute values

        // Adjust y-coordinate based on the number of lines of text
        y += wrappedText.length * 6; // Adjust for line height

        // Check if content overflows the page, if so, add a new page
        if (y + 10 > pageHeight) {
          doc.addPage();
          y = 10; // Reset y-coordinate for the new page
        }
      });

      // Leave some space after each image and its corresponding text
      y += 20;
    }

    // Save the PDF after all content is added
    doc.save('table.pdf');
  };

  const handleMultipleFilter = async () => {
    setIsLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    setIdoodMaps({});
    let _idoodMaps = {};

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_API_BASE_URL}/process-images`,
      data: formData
    };
    try {
      const res = await axios(config);
      console.log(res.data);
      setIsLoading(false);
      // setAttributeMap(res.data);
      const data = res.data.data;
      const _map = {};
      for (let i = 0; i < data.length; i++) {
        _map[i] = data[i];
      }
      setAttributeMaps(_map);
      setIsOODLoading(true);
      for (let index = 0; index < files.length; index++) {
        var fil = files[index];
        var _formdata = new FormData();
        _formdata.append('images', fil);
        var _config = {
          method: 'post',
          url: `${process.env.REACT_APP_API_BASE_URL}/process-images-id-ood`,
          data: _formdata
        };
        try {
          var _res = await axios(_config);
          const _data = _res.data.data[0];
          _map[index] = _data;
          setAttributeMaps(_map);
          _idoodMaps[index] = _data['id_ood_result'];
          setIdoodMaps({ ..._idoodMaps });
        } catch (e) {
          _map[index] = {
            ..._map[index],
            id_ood_result: { pattern: 'Unable to fetch', neck: 'Unable to fetch' }
          };
          _idoodMaps[index] = { pattern: 'Unable to fetch', neck: 'Unable to fetch' };
          setIdoodMaps({ ..._idoodMaps });
          setAttributeMaps(_map);
        }
      }
      setIsOODLoading(false);

      // return res.data;
    } catch (e) {
      if (process.env.REACT_APP_ALLOW_MOCK_DATA == 'true') {
        setAttributeMap(sample);
        // setTotalProductsCount(res.data.length);
        // setUniqueProducts(res.data);
        setIsLoading(false);
      } else {
        setError(true);
        setIsLoading(false);
      }
    }
    // .then((res) => {
    //   setAttributeMap(res.data);

    //   // setTotalProductsCount(res.data.length);
    //   // setUniqueProducts(res.data);
    //   setIsLoading(false);
    // })
    // .catch(() => {
    //   if (process.env.REACT_APP_ALLOW_MOCK_DATA == 'true') {
    //     setAttributeMap(sample);
    //     // setTotalProductsCount(res.data.length);
    //     // setUniqueProducts(res.data);
    //     setIsLoading(false);
    //   } else {
    //     setError(true);
    //     setIsLoading(false);
    //   }
    // });
  };
  const handleAll = async (files) => {
    // const _map = {};
    // for (let i = 0; i < files.length; i++) {
    //   const res = await handleFilter(i);
    //   _map[i] = res;
    // }
    // setAttributeMaps(_map);
    await handleMultipleFilter();
  };

  const navigate = useNavigate();

  const [selected, setSelected] = useState({
    category: null,
    metal_and_stone: null
  });

  useEffect(() => {
    if (files.length == 0) {
      // setUniqueProducts([]);
      setError(false);
      setIsLoading(false);
      setAttributeMap({});
      setAttributeMaps({});
      setPage(1);
    }
  }, [files]);
  const [page, setPage] = useState(1);

  return (
    <ChakraProvider theme={theme}>
      {/* <Container style={{ padding: '20px 40px 20px 40px' }}> */}
      <Flex w="100%" flexDir={'column'}>
        <Flex flexDir={'row'} w="100%">
          <Container
            mt="4"
            style={{
              width: '600px'
            }}>
            <ImagesUpload
              setAttributeMaps={setAttributeMaps}
              files={files}
              setFiles={setFiles}
              setError={setError}
            />
            {/* {uniqueProducts.length > 0 ? (
              <Container
                mt="20px"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E5E5E5',
                  padding: 0
                }}>
                <Box
                  p="10px"
                  style={{ display: 'flex', alignItems: 'center' }}
                  w="100%"
                  h={'5vh'}
                  variant="sideBarTitleSelected"
                  borderTopRightRadius={'8px'}
                  backgroundColor={'#fbfbfb'}>
                  <Flex
                    flexDir={'row'}
                    justifyContent={'space-between'}
                    justify={'space-evenly'}
                    alignItems={'center'}
                    w="100%">
                    <Box>
                      <Flex flexDir={'row'} alignItems={'center'}>
                        <Text
                          color={'#FB7185'}
                          fontSize={'20px'}
                          fontWeight={'bold'}
                          fontFamily={'Jost'}>
                          attributes.
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Container>
            ) : null} */}
          </Container>
          <Flex flexDir={'column'} mx={4} w="100%">
            <Text
              mb="20px"
              style={{
                fontSize: '30px',
                fontWeight: 'bold',
                fontFamily: 'Jost',
                marginTop: '20px'
              }}>
              {/* <span
                style={{
                  color: '#FB7185'
                }}>
                {' '}
                Jewellery{' '}
              </span> */}
              Image{' '}
              <span
                style={{
                  color: '#FB7185'
                }}>
                {' '}
                Taxonomy
              </span>
            </Text>
            {files.length == 0 ? (
              <Flex>
                {' '}
                <Flex direction="column">
                  <Text
                    mt={4}
                    fontFamily={'Jost'}
                    style={{ color: '#aaaaaa' }}
                    // color="primary.lighter"
                    fontWeight={'regular'}
                    fontSize={18}>
                    Upload an image to deduce the attributes.
                  </Text>
                  <Flex mt="40px" direction="column" p="2">
                    <Text
                      mb="1"
                      fontFamily={'Jost'}
                      style={{ color: 'primary.main' }}
                      // color="primary.lighter"
                      fontWeight={'regular'}
                      fontSize={18}>
                      Try one of these.
                    </Text>
                    <Flex
                      wrap="wrap"
                      gap="20px"
                      padding="20px"
                      style={{
                        maxWidth: '800px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px'
                      }}>
                      {[jew1, jew2, jew3, jew4].map((e, i) => {
                        return (
                          <Image
                            onClick={async () => {
                              //convert imported image to fil
                              const _url = require(`${jewUrls[i]}`);
                              const response = await fetch(_url);
                              const blob = await response.blob();
                              let file = new File([blob], 'my-image.jpg', { type: blob.type });
                              // file.preview = jewUrls[i];
                              file = Object.assign(file, { preview: URL.createObjectURL(file) });
                              setFiles([file]);
                            }}
                            key={e}
                            src={e}
                            _hover={{
                              cursor: 'pointer',
                              transform: 'scale(1.1)',
                              //smooth
                              transition: 'transform 0.5s'
                            }}
                            style={{
                              width: '150px',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                          />
                        );
                      })}
                    </Flex>
                  </Flex>
                </Flex>
                {/* <Image src={lady} style={{ width: '300px', height: '100%', objectFit: 'cover' }} /> */}
              </Flex>
            ) : null}

            {isLoading ? (
              <Flex
                flexDir="column"
                mt={2}
                h="100px"
                w="100%"
                alignItems={'center'}
                justifyContent={'center'}>
                <CircularProgress isIndeterminate w="40px" />
              </Flex>
            ) : files.length > 0 && !error ? (
              <>
                <Flex wrap="wrap" direction="column" gap="10px">
                  <Text fontSize={'15px'} color="#888">
                    Respective probablities are shown in the parantheses.
                  </Text>
                  <Button
                    w="200px"
                    bg="white"
                    border="1px solid #ddd"
                    borderRadius="5px"
                    fontWeight={'normal'}
                    boxShadow="none"
                    color="#333"
                    _hover={{
                      backgroundColor: '#f5f5f5'
                    }}
                    onClick={downloadTableAsPDF}>
                    Download as PDF
                  </Button>
                  <Pagination
                    page={page}
                    setPage={setPage}
                    totalProductsCount={files.length}
                    pageSize={5}
                  />
                  <Table>
                    <Thead>
                      <Th>Image</Th>
                      {attrList.map((e, index) => {
                        return <Th key={index}>{e}</Th>;
                      })}
                      <Th>Pattern ID OOD</Th>
                      <Th>Neck ID OOD</Th>
                    </Thead>
                    <Tbody>
                      {Object.keys(attributeMaps)
                        .slice((page - 1) * 5, page * 5)
                        .map((e1, index1) => {
                          const trueIndex = (page - 1) * 5 + index1;
                          return (
                            <Tr key={index1}>
                              <Td>
                                {' '}
                                <Image
                                  w="500px"
                                  src={files[(page - 1) * 5 + index1].preview}
                                />{' '}
                              </Td>
                              {attrList.map((e, index) => {
                                return (
                                  <Td key={index}>
                                    <Flex wrap="wrap" gap="5px">
                                      {attributeMaps[e1][e].map((_e, i) => {
                                        return (
                                          <Flex
                                            p="2px 10px"
                                            key={i}
                                            bg="#f5f5f5"
                                            borderRadius={'2px'}
                                            gap="5px">
                                            {_e[0]} <span style={{ color: '#999' }}>({_e[1]})</span>
                                          </Flex>
                                        );
                                      })}
                                    </Flex>
                                  </Td>
                                );
                              })}
                              <Td>
                                {idoodMaps[trueIndex]
                                  ? idoodMaps[trueIndex]?.pattern
                                  : isOODLoading
                                  ? 'Loading...'
                                  : 'Error'}
                              </Td>
                              <Td>
                                {idoodMaps[trueIndex]
                                  ? idoodMaps[trueIndex]?.neck
                                  : isOODLoading
                                  ? 'Loading...'
                                  : 'Error'}
                              </Td>
                            </Tr>
                          );
                        })}
                    </Tbody>
                  </Table>
                </Flex>
              </>
            ) : error ? (
              <Flex
                w="100%"
                gap="10px"
                h="500px"
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                bg="#fbfbfb">
                <Flex gap="10px" alignItems="center">
                  <Warning style={{ color: 'red', fontSize: '14px' }} />
                  <Text
                    alignItems={'center'}
                    style={{
                      color: 'red',
                      fontSize: '14px'
                    }}>
                    Error fetching data
                  </Text>
                </Flex>
                <Button
                  onClick={() => {
                    setError(false);
                    handleFilter();
                  }}
                  style={{ color: '#aaaaaa', backgroundColor: '#eeeeee' }}>
                  Retry
                </Button>
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
      {/* </Container> */}
    </ChakraProvider>
  );
};

export default TextForecast;
