import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  HStack,
  VStack,
  Text,
  Spinner,
  useToast,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, CheckCircle, XCircle, FileText, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRegistrationRequests, approveRegistrationRequest, denyRegistrationRequest } from '../../api/registrationRequests';
import { RegistrationRequestListItem, RegistrationStatus, RegisterationType } from '../../types';

const MotionBox = motion(Box);

const RegistrationRequests = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<RegistrationRequestListItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [emailFilter, setEmailFilter] = useState<string>('');
  const [processing, setProcessing] = useState<string | null>(null);

  const getStatusForTab = (tabIndex: number): RegistrationStatus => {
    switch (tabIndex) {
      case 0:
        return RegistrationStatus.Requested;
      case 1:
        return RegistrationStatus.Accepted;
      case 2:
        return RegistrationStatus.Declined;
      default:
        return RegistrationStatus.Requested;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const filters: any = {
        status: getStatusForTab(activeTab),
      };
      if (emailFilter) {
        filters.email = emailFilter;
      }

      const response = await getRegistrationRequests(page, pageSize, filters);
      setRequests(response.items);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setPage(1);
    setEmailFilter('');
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.Requested:
        return <Badge colorScheme="yellow" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold">Requested</Badge>;
      case RegistrationStatus.Accepted:
        return <Badge colorScheme="green" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold">Accepted</Badge>;
      case RegistrationStatus.Declined:
        return <Badge colorScheme="red" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold">Declined</Badge>;
      default:
        return <Badge px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: RegisterationType) => {
    if (type === RegisterationType.AsContractors) {
      return <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold">Contractor</Badge>;
    } else {
      return <Badge colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold">Supplier</Badge>;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      await approveRegistrationRequest(id);
      toast({
        title: 'Success',
        description: 'Registration request approved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchRequests();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleDeny = async (id: string) => {
    try {
      setProcessing(id);
      await denyRegistrationRequest(id);
      toast({
        title: 'Success',
        description: 'Registration request declined',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchRequests();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchRequests();
  };

  if (loading && requests.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="brand.primary" thickness="4px" />
      </Box>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header with Gradient */}
        <Box
          bgGradient="linear(to-r, brand.primary, blue.600)"
          p={8}
          borderRadius="2xl"
          color="white"
          position="relative"
          overflow="hidden"
        >
          <Box position="relative" zIndex={1}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="xl" mb={2}>
                  Registration Requests
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  Review and manage registration requests
                </Text>
              </Box>
              <Box
                p={4}
                borderRadius="xl"
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
              >
                <Icon as={FileText} boxSize={10} />
              </Box>
            </Flex>
          </Box>
          <Box
            position="absolute"
            top="-50%"
            right="-10%"
            w="400px"
            h="400px"
            borderRadius="full"
            bg="whiteAlpha.100"
            filter="blur(60px)"
          />
        </Box>

        {/* Stats Summary */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  p={4}
                  borderRadius="xl"
                  bgGradient="linear(to-br, yellow.400, yellow.600)"
                  color="white"
                >
                  <Icon as={Clock} boxSize={8} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="yellow.600">
                    {activeTab === 0 ? requests.length : '-'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Pending Requests</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  p={4}
                  borderRadius="xl"
                  bgGradient="linear(to-br, green.400, green.600)"
                  color="white"
                >
                  <Icon as={ThumbsUp} boxSize={8} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">
                    {activeTab === 1 ? requests.length : '-'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Accepted</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  p={4}
                  borderRadius="xl"
                  bgGradient="linear(to-br, red.400, red.600)"
                  color="white"
                >
                  <Icon as={ThumbsDown} boxSize={8} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="3xl" fontWeight="bold" color="red.600">
                    {activeTab === 2 ? requests.length : '-'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Declined</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Tabs */}
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">
          <Tabs index={activeTab} onChange={handleTabChange} colorScheme="blue">
            <Box bg="gray.50" px={6} pt={6} borderBottom="2px solid" borderColor="gray.200">
              <TabList border="none">
                <Tab
                  _selected={{ color: 'yellow.600', borderColor: 'yellow.600', borderBottomWidth: '3px' }}
                  fontWeight="semibold"
                  fontSize="md"
                  pb={4}
                >
                  <HStack spacing={2}>
                    <Icon as={Clock} boxSize={4} />
                    <Text>Pending</Text>
                    <Badge colorScheme="yellow" borderRadius="full">
                      {activeTab === 0 ? requests.length : ''}
                    </Badge>
                  </HStack>
                </Tab>
                <Tab
                  _selected={{ color: 'green.600', borderColor: 'green.600', borderBottomWidth: '3px' }}
                  fontWeight="semibold"
                  fontSize="md"
                  pb={4}
                >
                  <HStack spacing={2}>
                    <Icon as={CheckCircle} boxSize={4} />
                    <Text>Accepted</Text>
                    <Badge colorScheme="green" borderRadius="full">
                      {activeTab === 1 ? requests.length : ''}
                    </Badge>
                  </HStack>
                </Tab>
                <Tab
                  _selected={{ color: 'red.600', borderColor: 'red.600', borderBottomWidth: '3px' }}
                  fontWeight="semibold"
                  fontSize="md"
                  pb={4}
                >
                  <HStack spacing={2}>
                    <Icon as={XCircle} boxSize={4} />
                    <Text>Declined</Text>
                    <Badge colorScheme="red" borderRadius="full">
                      {activeTab === 2 ? requests.length : ''}
                    </Badge>
                  </HStack>
                </Tab>
              </TabList>
            </Box>

            <TabPanels>
              {[0, 1, 2].map((tabIndex) => (
                <TabPanel key={tabIndex} p={0}>
                  <Box p={6}>
                    {/* Search */}
                    <Card shadow="md" borderRadius="xl" border="1px solid" borderColor="gray.200" mb={6}>
                      <CardBody p={4}>
                        <HStack spacing={4}>
                          <InputGroup maxW="500px">
                            <InputLeftElement>
                              <Icon as={Search} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              placeholder="Search by email"
                              value={emailFilter}
                              onChange={(e) => setEmailFilter(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                              borderRadius="lg"
                              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                            />
                          </InputGroup>

                          <Button
                            colorScheme="blue"
                            onClick={handleSearch}
                            px={8}
                            borderRadius="lg"
                          >
                            Search
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => {
                              setEmailFilter('');
                              setPage(1);
                              fetchRequests();
                            }}
                            borderRadius="lg"
                          >
                            Clear
                          </Button>
                        </HStack>
                      </CardBody>
                    </Card>

                    {/* Table */}
                    <Box overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.200">
                      <Table variant="simple">
                        <Thead bg="gray.50" borderBottom="2px solid" borderColor="gray.200">
                          <Tr>
                            <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Company Name</Th>
                            <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Email</Th>
                            <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Type</Th>
                            {tabIndex === 0 && <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Status</Th>}
                            <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">
                              {tabIndex === 0 ? 'Created At' : tabIndex === 1 ? 'Accepted At' : 'Declined At'}
                            </Th>
                            <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {requests.map((request, index) => (
                            <MotionBox
                              as={Tr}
                              key={request.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              _hover={{ bg: 'blue.50' }}
                              borderBottom="1px solid"
                              borderColor="gray.100"
                            >
                              <Td py={4} fontWeight="semibold" color="gray.800">{request.companyName}</Td>
                              <Td py={4} color="gray.600">{request.email}</Td>
                              <Td py={4}>{getTypeBadge(request.type)}</Td>
                              {tabIndex === 0 && <Td py={4}>{getStatusBadge(request.currentStatus)}</Td>}
                              <Td py={4}>
                                <Text color="gray.600" fontSize="sm">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </Text>
                              </Td>
                              <Td py={4}>
                                <HStack spacing={2}>
                                  <Button
                                    size="sm"
                                    leftIcon={<Eye size={16} />}
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={() => navigate(`/admin/registration-requests/${request.id}`)}
                                    borderRadius="lg"
                                  >
                                    View
                                  </Button>
                                  {request.currentStatus === RegistrationStatus.Requested && (
                                    <>
                                      <Button
                                        size="sm"
                                        leftIcon={<CheckCircle size={14} />}
                                        colorScheme="green"
                                        onClick={() => handleApprove(request.id)}
                                        isLoading={processing === request.id}
                                        borderRadius="lg"
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        leftIcon={<XCircle size={14} />}
                                        colorScheme="red"
                                        onClick={() => handleDeny(request.id)}
                                        isLoading={processing === request.id}
                                        borderRadius="lg"
                                      >
                                        Deny
                                      </Button>
                                    </>
                                  )}
                                </HStack>
                              </Td>
                            </MotionBox>
                          ))}
                        </Tbody>
                      </Table>

                      {requests.length === 0 && (
                        <Box py={20} textAlign="center">
                          <VStack spacing={4}>
                            <Box p={6} borderRadius="full" bg="gray.100">
                              <Icon as={FileText} boxSize={12} color="gray.400" />
                            </Box>
                            <Heading size="md" color="gray.600">No Requests Found</Heading>
                            <Text color="gray.500" maxW="md">
                              {tabIndex === 0 && 'No pending registration requests at the moment.'}
                              {tabIndex === 1 && 'No accepted registration requests found.'}
                              {tabIndex === 2 && 'No declined registration requests found.'}
                            </Text>
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
            <CardBody>
              <HStack justify="center" spacing={4}>
                <Button
                  size="md"
                  onClick={() => setPage(page - 1)}
                  isDisabled={page === 1}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="lg"
                >
                  Previous
                </Button>
                <HStack spacing={2}>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        size="md"
                        onClick={() => setPage(pageNum)}
                        colorScheme={page === pageNum ? 'blue' : 'gray'}
                        variant={page === pageNum ? 'solid' : 'outline'}
                        borderRadius="lg"
                        minW="40px"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </HStack>
                <Button
                  size="md"
                  onClick={() => setPage(page + 1)}
                  isDisabled={page === totalPages}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="lg"
                >
                  Next
                </Button>
              </HStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default RegistrationRequests;
