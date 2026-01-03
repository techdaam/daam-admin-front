import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  useToast,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  Image,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import {
  getRegistrationRequestById,
  approveRegistrationRequest,
  denyRegistrationRequest,
} from '../../api/registrationRequests';
import { RegistrationRequestDetail, RegistrationStatus, RegisterationType, FileDownload } from '../../types';
import CustomPDFViewer from '../../tools/FilePreviewer';

const RegistrationRequestDetailPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [request, setRequest] = useState<RegistrationRequestDetail | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; fileName: string; extension: string } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (id) {
      fetchRequestDetail();
    }
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await getRegistrationRequestById(id!);
      setRequest(response);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/admin/registration-requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      await approveRegistrationRequest(id!);
      toast({
        title: 'Success',
        description: 'Registration request approved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin/registration-requests');
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async () => {
    try {
      setProcessing(true);
      await denyRegistrationRequest(id!);
      toast({
        title: 'Success',
        description: 'Registration request denied',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin/registration-requests');
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.Requested:
        return <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>Requested</Badge>;
      case RegistrationStatus.Accepted:
        return <Badge colorScheme="green" fontSize="md" px={3} py={1}>Accepted</Badge>;
      case RegistrationStatus.Declined:
        return <Badge colorScheme="red" fontSize="md" px={3} py={1}>Declined</Badge>;
      default:
        return <Badge fontSize="md" px={3} py={1}>Unknown</Badge>;
    }
  };

  const getTypeLabel = (type: RegisterationType) => {
    return type === RegisterationType.AsContractors ? 'Contractor' : 'Supplier';
  };

  const getFileExtension = (fileName: string | null): string => {
    if (!fileName) return '';
    const parts = fileName.toLowerCase().split('.');
    return parts[parts.length - 1];
  };

  const handlePreview = (url: string, fileName: string) => {
    const extension = getFileExtension(fileName);
    setPreviewFile({ url, fileName, extension });
    onOpen();
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDocumentCard = (fileDownload: FileDownload, title: string, fileId: string) => {
    if (!fileDownload.presignedUrl || !fileDownload.fileName) {
      return (
        <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md" bg="gray.50">
          <VStack align="start" spacing={2}>
            <Text fontSize="md" fontWeight="semibold" color="gray.700">{title}</Text>
            <Text fontSize="sm" color="gray.500">File not available</Text>
          </VStack>
        </Box>
      );
    }

    const extension = getFileExtension(fileDownload.fileName);
    const url = fileDownload.presignedUrl;
    const fileSizeKB = (fileDownload.fileSize / 1024).toFixed(2);
    
    return (
      <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
        {/* File Info Header */}
        <Box p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
          <VStack align="start" spacing={2}>
            <Text fontSize="md" fontWeight="semibold" color="gray.700">{title}</Text>
            <HStack spacing={4} fontSize="sm" color="gray.600">
              <Text>{fileDownload.fileName}</Text>
              <Text>•</Text>
              <Text>{fileSizeKB} KB</Text>
              <Text>•</Text>
              <Text textTransform="uppercase">{extension}</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Box p={4} bg="white">
          <HStack spacing={3}>
            <Button
              leftIcon={<Eye size={18} />}
              colorScheme="blue"
              size="md"
              onClick={() => handlePreview(url, fileDownload.fileName!)}
              flex={1}
            >
              Preview
            </Button>
            <Button
              leftIcon={<Download size={18} />}
              colorScheme="green"
              variant="outline"
              size="md"
              onClick={() => handleDownload(url, fileDownload.fileName!)}
              flex={1}
            >
              Download
            </Button>
          </HStack>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="brand.primary" thickness="4px" />
      </Box>
    );
  }

  if (!request) {
    return null;
  }

  return (
    <>
      {/* Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{previewFile?.fileName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {previewFile && (
              <Box>
                {['jpg', 'jpeg', 'png'].includes(previewFile.extension) ? (
                  <Box textAlign="center">
                    <Image
                      src={previewFile.url}
                      alt={previewFile.fileName}
                      maxH="70vh"
                      maxW="100%"
                      objectFit="contain"
                      mx="auto"
                    />
                  </Box>
                ) : previewFile.extension === 'pdf' ? (
                  <Box
                    w="full"
                    h="70vh"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    {/* <iframe
                      src={previewFile.url}
                      width="100%"
                      height="100%"
                      title={previewFile.fileName}
                      style={{ border: 'none' }}
                    /> */}
                    <CustomPDFViewer presignedUrl={previewFile.url}  ></CustomPDFViewer>
                  </Box>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.600" mb={4}>Preview not available for this file type</Text>
                    <Button
                      as="a"
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      colorScheme="blue"
                    >
                      Open in New Tab
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <HStack>
            <Button
              leftIcon={<ArrowLeft size={20} />}
              variant="ghost"
              onClick={() => navigate('/admin/registration-requests')}
            >
              Back
            </Button>
            <Heading size="lg" color="brand.primary">
              Registration Request Details
            </Heading>
          </HStack>
          {getStatusBadge(request.currentStatus)}
        </HStack>

        {/* Company Information */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <Heading size="md" mb={4} color="brand.primary">
              Company Information
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Company Name</Text>
                <Text fontWeight="semibold">{request.companyName}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Type</Text>
                <Text fontWeight="semibold">{getTypeLabel(request.type)}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Country</Text>
                <Text fontWeight="semibold">{request.country}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>City</Text>
                <Text fontWeight="semibold">{request.city}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Commercial License Number</Text>
                <Text fontWeight="semibold">{request.commercialLicenseNumber}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Website</Text>
                <Text fontWeight="semibold">{request.website || 'N/A'}</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <Heading size="md" mb={4} color="brand.primary">
              Contact Information
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>First Name</Text>
                <Text fontWeight="semibold">{request.firstName}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Last Name</Text>
                <Text fontWeight="semibold">{request.lastName}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Job Title</Text>
                <Text fontWeight="semibold">{request.jobTitle}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Email</Text>
                <Text fontWeight="semibold">{request.email}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Phone Number</Text>
                <Text fontWeight="semibold">{request.phoneNumber}</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Documents */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <Heading size="md" mb={4} color="brand.primary">
              Documents
            </Heading>
            <VStack spacing={4} align="stretch">
              {request.commercialLicenseUrl && renderDocumentCard(request.commercialLicenseUrl, 'Commercial License', 'commercial')}
              {request.taxLicenseUrl && renderDocumentCard(request.taxLicenseUrl, 'Tax License', 'tax')}
            </VStack>
          </CardBody>
        </Card>

        {/* Metadata */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Created At</Text>
                <Text fontWeight="semibold">{new Date(request.createdAt).toLocaleString()}</Text>
              </Box>
              {request.updatedAt && (
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Updated At</Text>
                  <Text fontWeight="semibold">{new Date(request.updatedAt).toLocaleString()}</Text>
                </Box>
              )}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Actions */}
        {request.currentStatus === RegistrationStatus.Requested && (
          <Card shadow="md" borderRadius="xl" bg="gray.50">
            <CardBody>
              <HStack justify="center" spacing={4}>
                <Button
                  leftIcon={<CheckCircle size={20} />}
                  colorScheme="green"
                  size="lg"
                  onClick={handleApprove}
                  isLoading={processing}
                >
                  Approve Request
                </Button>
                <Button
                  leftIcon={<XCircle size={20} />}
                  colorScheme="red"
                  size="lg"
                  onClick={handleDeny}
                  isLoading={processing}
                >
                  Deny Request
                </Button>
              </HStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
    </>
  );
};

export default RegistrationRequestDetailPage;
