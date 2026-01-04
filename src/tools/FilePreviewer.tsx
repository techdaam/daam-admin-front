import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  IconButton,
  Input,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  useToast,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Modern Worker Configuration (Optimized for Vite/Webpack)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Import CSS for text layer and annotation styles
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface CustomPDFViewerProps {
  presignedUrl?: string;
}

const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({ presignedUrl }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('1');
  const toast = useToast();

  // Memoize the file object
  const file = useMemo(() => presignedUrl ? ({ 
    url: presignedUrl,
    withCredentials: false 
  }) : null, [presignedUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF Load Error:', err);
    setError(t('pdfViewer.loadError'));
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    } else {
      setPageInput(pageNumber.toString());
      toast({
        title: t('pdfViewer.invalidPage'),
        description: t('pdfViewer.pageRangeError', { max: numPages }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownload = () => {
    if (presignedUrl) {
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: t('pdfViewer.downloadStarted'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  if (!presignedUrl) {
    return (
      <Box p={8} textAlign="center">
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <AlertDescription>{t('pdfViewer.noDocument')}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <VStack
      spacing={4}
      w="full"
      h={isFullscreen ? '100vh' : 'auto'}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      position={isFullscreen ? 'fixed' : 'relative'}
      top={isFullscreen ? 0 : 'auto'}
      left={isFullscreen ? 0 : 'auto'}
      zIndex={isFullscreen ? 9999 : 'auto'}
    >
      {/* Toolbar */}
      <Flex
        w="full"
        justify="space-between"
        align="center"
        bg="white"
        p={4}
        borderRadius="xl"
        shadow="md"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* Left Controls */}
        <HStack spacing={2}>
          <Tooltip label={t('pdfViewer.zoomOut')}>
            <IconButton
              aria-label={t('pdfViewer.zoomOut')}
              icon={<ZoomOut size={18} />}
              onClick={handleZoomOut}
              isDisabled={scale <= 0.5}
              size="sm"
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            colorScheme="blue"
            fontSize="sm"
            fontWeight="semibold"
          >
            {Math.round(scale * 100)}%
          </Badge>
          <Tooltip label={t('pdfViewer.zoomIn')}>
            <IconButton
              aria-label={t('pdfViewer.zoomIn')}
              icon={<ZoomIn size={18} />}
              onClick={handleZoomIn}
              isDisabled={scale >= 3.0}
              size="sm"
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>

          <Box w="1px" h="30px" bg="gray.300" mx={2} />

          <Tooltip label={t('pdfViewer.rotate')}>
            <IconButton
              aria-label={t('pdfViewer.rotate')}
              icon={<RotateCw size={18} />}
              onClick={handleRotate}
              size="sm"
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>
        </HStack>

        {/* Center - Page Navigation */}
        {numPages && (
          <HStack spacing={3}>
            <Tooltip label={t('pdfViewer.previousPage')}>
              <IconButton
                aria-label={t('pdfViewer.previousPage')}
                icon={<ChevronLeft size={18} />}
                onClick={() => handlePageChange(pageNumber - 1)}
                isDisabled={pageNumber <= 1}
                size="sm"
                colorScheme="blue"
                variant="outline"
              />
            </Tooltip>

            <HStack spacing={2}>
              <Input
                value={pageInput}
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                onKeyPress={(e) => e.key === 'Enter' && handlePageInputSubmit()}
                size="sm"
                w="50px"
                textAlign="center"
                fontWeight="semibold"
                borderRadius="lg"
              />
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                / {numPages}
              </Text>
            </HStack>

            <Tooltip label={t('pdfViewer.nextPage')}>
              <IconButton
                aria-label={t('pdfViewer.nextPage')}
                icon={<ChevronRight size={18} />}
                onClick={() => handlePageChange(pageNumber + 1)}
                isDisabled={pageNumber >= (numPages || 0)}
                size="sm"
                colorScheme="blue"
                variant="outline"
              />
            </Tooltip>
          </HStack>
        )}

        {/* Right Controls */}
        <HStack spacing={2}>
          <Tooltip label={t('pdfViewer.download')}>
            <Button
              leftIcon={<Download size={18} />}
              onClick={handleDownload}
              size="sm"
              colorScheme="green"
              variant="outline"
            >
              {t('pdfViewer.download')}
            </Button>
          </Tooltip>

          <Tooltip label={isFullscreen ? t('pdfViewer.exitFullscreen') : t('pdfViewer.fullscreen')}>
            <IconButton
              aria-label={t('pdfViewer.toggleFullscreen')}
              icon={isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              onClick={toggleFullscreen}
              size="sm"
              variant="ghost"
              colorScheme="blue"
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Error Display */}
      {error && (
        <Alert status="error" borderRadius="lg" shadow="md">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* PDF Document */}
      <Box
        flex={1}
        w="full"
        overflow="auto"
        bg="gray.100"
        borderRadius="xl"
        border="2px solid"
        borderColor="gray.200"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        p={4}
        maxH={isFullscreen ? 'calc(100vh - 120px)' : '70vh'}
      >
        <Box
          shadow="2xl"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <VStack spacing={4} py={20}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
                <Text color="gray.600" fontWeight="medium">
                  {t('pdfViewer.loading')}
                </Text>
              </VStack>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              scale={scale}
              rotate={rotation}
            />
          </Document>
        </Box>
      </Box>

      {/* Bottom Info Bar */}
      {numPages && (
        <Flex
          w="full"
          justify="center"
          align="center"
          bg="white"
          p={3}
          borderRadius="xl"
          shadow="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack spacing={4} fontSize="sm" color="gray.600">
            <HStack>
              <Text fontWeight="medium">{t('pdfViewer.page')}:</Text>
              <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                {pageNumber} / {numPages}
              </Badge>
            </HStack>
            <Box w="1px" h="20px" bg="gray.300" />
            <HStack>
              <Text fontWeight="medium">{t('pdfViewer.zoom')}:</Text>
              <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                {Math.round(scale * 100)}%
              </Badge>
            </HStack>
            {rotation > 0 && (
              <>
                <Box w="1px" h="20px" bg="gray.300" />
                <HStack>
                  <Text fontWeight="medium">{t('pdfViewer.rotation')}:</Text>
                  <Badge colorScheme="purple" px={2} py={1} borderRadius="md">
                    {rotation}°
                  </Badge>
                </HStack>
              </>
            )}
          </HStack>
        </Flex>
      )}
    </VStack>
  );
};

export default CustomPDFViewer;
