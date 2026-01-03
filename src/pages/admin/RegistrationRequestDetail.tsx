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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import {
  getRegistrationRequestById,
  approveRegistrationRequest,
  denyRegistrationRequest,
} from '../../api/registrationRequests';
import { RegistrationRequestDetail, RegistrationStatus, RegisterationType } from '../../types';

const RegistrationRequestDetailPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [request, setRequest] = useState<RegistrationRequestDetail | null>(null);

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
    console.log(typeof status);
    
    
    switch (status) {
      case RegistrationStatus.requested:
        return <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>Requested</Badge>;
      case RegistrationStatus.accepted:
        return <Badge colorScheme="green" fontSize="md" px={3} py={1}>Accepted</Badge>;
      case RegistrationStatus.declined:
        return <Badge colorScheme="red" fontSize="md" px={3} py={1}>Declined</Badge>;
      default:
        return <Badge fontSize="md" px={3} py={1}>Unknown</Badge>;
    }
  };

  const getTypeLabel = (type: RegisterationType) => {
    return type === RegisterationType.AsContractors ? 'Contractor' : 'Supplier';
  };

  const getFileExtension = (url: string): string => {
    const parts = url.toLowerCase().split('.');
    return parts[parts.length - 1].split('?')[0];
  };

  const renderDocumentPreview = (url: string, title: string) => {
    const extension = getFileExtension(url);
    
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return (
        <VStack align="start" spacing={2} w="full">
          <Text fontSize="sm" color="gray.600" mb={2}>{title}</Text>
          <Image
            src={url}
            alt={title}
            maxH="300px"
            objectFit="contain"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            cursor="pointer"
            onClick={() => window.open(url, '_blank')}
          />
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="blue"
            size="sm"
            variant="outline"
          >
            Open in New Tab
          </Button>
        </VStack>
      );
    } else if (extension === 'pdf') {
      return (
        <VStack align="start" spacing={2} w="full">
          <Text fontSize="sm" color="gray.600" mb={2}>{title}</Text>
          <Box
            w="full"
            h="400px"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            overflow="hidden"
          >
            <iframe
              src={url}
              width="100%"
              height="100%"
              title={title}
              style={{ border: 'none' }}
            />
          </Box>
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="blue"
            size="sm"
          >
            Open in New Tab
          </Button>
        </VStack>
      );
    } else {
      return (
        <VStack align="start" spacing={2}>
          <Text fontSize="sm" color="gray.600" mb={2}>{title}</Text>
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="blue"
            size="sm"
          >
            View Document
          </Button>
        </VStack>
      );
    }
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
            <SimpleGrid columns={{ base: 1 }} spacing={6}>
              {request.commercialLicenseUrl && renderDocumentPreview(request.commercialLicenseUrl, 'Commercial License')}
              {request.taxLicenseUrl && renderDocumentPreview(request.taxLicenseUrl, 'Tax License')}
            </SimpleGrid>
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
        {request.currentStatus === RegistrationStatus.requested && (
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
  );
};

export default RegistrationRequestDetailPage;
