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
  Icon,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Eye, Download, Building2, Mail, Phone, MapPin, Globe, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getRegistrationRequestById,
  approveRegistrationRequest,
  denyRegistrationRequest,
} from '../../api/registrationRequests';
import { RegistrationRequestDetail, RegistrationStatus, RegisterationType, FileDownload } from '../../types';
import CustomPDFViewer from '../../tools/FilePreviewer';

const MotionCard = motion(Card);

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
        return <Badge colorScheme="gray" fontSize="md" px={4} py={2} borderRadius="full" fontWeight="semibold">Requested</Badge>;
      case RegistrationStatus.Accepted:
        return <Badge colorScheme="green" fontSize="md" px={4} py={2} borderRadius="full" fontWeight="semibold">Accepted</Badge>;
      case RegistrationStatus.Declined:
        return <Badge colorScheme="red" fontSize="md" px={4} py={2} borderRadius="full" fontWeight="semibold">Declined</Badge>;
      default:
        return <Badge fontSize="md" px={4} py={2} borderRadius="full" fontWeight="semibold">Unknown</Badge>;
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
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="xl"
          bg="gray.50"
        >
          <CardBody p={6}>
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={FileText} boxSize={6} color="gray.400" />
                <Text fontSize="lg" fontWeight="bold" color="gray.600">{title}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">File not available</Text>
            </VStack>
          </CardBody>
        </MotionCard>
      );
    }

    const extension = getFileExtension(fileDownload.fileName);
    const url = fileDownload.presignedUrl;
    const fileSizeKB = (fileDownload.fileSize / 1024).toFixed(2);
    
    return (
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        overflow="hidden"
        shadow="sm"
        _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      >
        {/* File Info Header */}
        <Box
          p={6}
          bg="gray.50"
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <VStack align="start" spacing={3}>
            <HStack>
              <Box
                p={3}
                borderRadius="lg"
                bg="gray.100"
              >
                <Icon as={FileText} boxSize={6} color="brand.primary" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">{title}</Text>
                <HStack spacing={2} fontSize="sm" color="gray.600">
                  <Text>{fileDownload.fileName}</Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack spacing={4} fontSize="sm" color="gray.700" fontWeight="medium">
              <HStack>
                <Text>Size:</Text>
                <Text fontWeight="bold">{fileSizeKB} KB</Text>
              </HStack>
              <Text>•</Text>
              <HStack>
                <Text>Format:</Text>
                <Text fontWeight="bold" textTransform="uppercase">{extension}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <CardBody p={6} bg="white">
          <HStack spacing={3}>
            <Button
              leftIcon={<Eye size={18} />}
              colorScheme="blue"
              size="md"
              onClick={() => handlePreview(url, fileDownload.fileName!)}
              flex={1}
              borderRadius="lg"
            >
              Preview
            </Button>
            <Button
              leftIcon={<Download size={18} />}
              colorScheme="blue"
              variant="outline"
              size="md"
              onClick={() => handleDownload(url, fileDownload.fileName!)}
              flex={1}
              borderRadius="lg"
            >
              Download
            </Button>
          </HStack>
        </CardBody>
      </MotionCard>
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
        <ModalContent borderRadius="2xl">
          <ModalHeader borderBottom="1px solid" borderColor="gray.200">
            {previewFile?.fileName}
          </ModalHeader>
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
                      borderRadius="lg"
                    />
                  </Box>
                ) : previewFile.extension === 'pdf' ? (
                  <Box
                    w="full"
                    h="70vh"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <CustomPDFViewer presignedUrl={previewFile.url} />
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
                      borderRadius="lg"
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
          <Box
            bg="brand.primary"
            p={8}
            borderRadius="xl"
            color="white"
          >
            <HStack justify="space-between" mb={4}>
              <Button
                leftIcon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={() => navigate('/admin/registration-requests')}
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                borderRadius="lg"
              >
                Back to Requests
              </Button>
              {getStatusBadge(request.currentStatus)}
            </HStack>
            <Heading size="xl">Registration Request Details</Heading>
            <Text fontSize="lg" opacity={0.9} mt={2}>
              {request.companyName}
            </Text>
          </Box>

          {/* Company Information */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            shadow="sm"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
          >
            <CardBody p={8}>
              <Flex align="center" mb={6}>
                <Box
                  p={3}
                  borderRadius="xl"
                  bg="gray.50"
                  mr={4}
                >
                  <Icon as={Building2} boxSize={7} color="brand.primary" />
                </Box>
                <Heading size="md" color="gray.800">
                  Company Information
                </Heading>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <HStack mb={2}>
                    <Icon as={Building2} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Company Name</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.companyName}</Text>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={FileText} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Type</Text>
                  </HStack>
                  <Badge
                    colorScheme="blue"
                    fontSize="md"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontWeight="semibold"
                  >
                    {getTypeLabel(request.type)}
                  </Badge>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={MapPin} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Country</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.country}</Text>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={MapPin} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">City</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.city}</Text>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={FileText} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Commercial License Number</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.commercialLicenseNumber}</Text>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={Globe} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Website</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.website || 'N/A'}</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </MotionCard>

          {/* Contact Information */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            shadow="sm"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
          >
            <CardBody p={8}>
              <Flex align="center" mb={6}>
                <Box
                  p={3}
                  borderRadius="xl"
                  bg="gray.50"
                  mr={4}
                >
                  <Icon as={Mail} boxSize={7} color="brand.primary" />
                </Box>
                <Heading size="md" color="gray.800">
                  Contact Information
                </Heading>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={2}>First Name</Text>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.firstName}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={2}>Last Name</Text>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.lastName}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={2}>Job Title</Text>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.jobTitle}</Text>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={Mail} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Email</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.email}</Text>
                </Box>
                <Box>
                  <HStack mb={2}>
                    <Icon as={Phone} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Phone Number</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">{request.phoneNumber}</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </MotionCard>

          {/* Documents */}
          <Box>
            <Heading size="md" mb={6} color="gray.800">
              Documents
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {request.commercialLicenseUrl && renderDocumentCard(request.commercialLicenseUrl, 'Commercial License', 'commercial')}
              {request.taxLicenseUrl && renderDocumentCard(request.taxLicenseUrl, 'Tax License', 'tax')}
            </SimpleGrid>
          </Box>

          {/* Metadata */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            shadow="sm"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
          >
            <CardBody p={8}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <HStack mb={2}>
                    <Icon as={Calendar} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Created At</Text>
                  </HStack>
                  <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                    {new Date(request.createdAt).toLocaleString()}
                  </Text>
                </Box>
                {request.updatedAt && (
                  <Box>
                    <HStack mb={2}>
                      <Icon as={Calendar} color="gray.500" boxSize={4} />
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">Updated At</Text>
                    </HStack>
                    <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                      {new Date(request.updatedAt).toLocaleString()}
                    </Text>
                  </Box>
                )}
              </SimpleGrid>
            </CardBody>
          </MotionCard>

          {/* Actions */}
          {request.currentStatus === RegistrationStatus.Requested && (
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              shadow="sm"
              borderRadius="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
            >
              <CardBody p={8}>
                <VStack spacing={4}>
                  <Heading size="md" color="gray.800">
                    Review Actions
                  </Heading>
                  <Text color="gray.600" textAlign="center">
                    Please review all the information above before making a decision
                  </Text>
                  <HStack justify="center" spacing={4} pt={4}>
                    <Button
                      leftIcon={<CheckCircle size={20} />}
                      colorScheme="green"
                      size="lg"
                      onClick={handleApprove}
                      isLoading={processing}
                      borderRadius="lg"
                      px={10}
                      shadow="sm"
                      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                    >
                      Approve Request
                    </Button>
                    <Button
                      leftIcon={<XCircle size={20} />}
                      colorScheme="red"
                      size="lg"
                      onClick={handleDeny}
                      isLoading={processing}
                      borderRadius="lg"
                      px={10}
                      shadow="sm"
                      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                    >
                      Deny Request
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default RegistrationRequestDetailPage;
