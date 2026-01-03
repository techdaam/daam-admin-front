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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { getRegistrationRequests, approveRegistrationRequest, denyRegistrationRequest } from '../../api/registrationRequests';
import { RegistrationRequestListItem, RegistrationStatus, RegisterationType } from '../../types';

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
        return <Badge colorScheme="yellow">Requested</Badge>;
      case RegistrationStatus.Accepted:
        return <Badge colorScheme="green">Accepted</Badge>;
      case RegistrationStatus.Declined:
        return <Badge colorScheme="red">Declined</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: RegisterationType) => {
    if (type === RegisterationType.AsContractors) {
      return <Badge colorScheme="blue">Contractor</Badge>;
    } else {
      return <Badge colorScheme="orange">Supplier</Badge>;
    }
  };

  const handleApprove = async (id: string) => {
    try {
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
    }
  };

  const handleDeny = async (id: string) => {
    try {
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
        {/* Header */}
        <Box>
          <Heading size="lg" color="brand.primary" mb={2}>
            Registration Requests
          </Heading>
          <Text color="gray.600">Review and manage registration requests</Text>
        </Box>

        {/* Tabs */}
        <Tabs index={activeTab} onChange={handleTabChange} colorScheme="blue">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Text>Pending</Text>
                <Badge colorScheme="yellow" borderRadius="full">
                  {activeTab === 0 ? requests.length : ''}
                </Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Text>Accepted</Text>
                <Badge colorScheme="green" borderRadius="full">
                  {activeTab === 1 ? requests.length : ''}
                </Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Text>Declined</Text>
                <Badge colorScheme="red" borderRadius="full">
                  {activeTab === 2 ? requests.length : ''}
                </Badge>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {/* Search for Pending */}
              <Card shadow="md" borderRadius="xl" mb={4}>
                <CardBody>
                  <HStack spacing={4}>
                    <InputGroup maxW="400px">
                      <InputLeftElement>
                        <Icon as={Search} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                      />
                    </InputGroup>

                    <Button colorScheme="blue" onClick={handleSearch}>
                      Search
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailFilter('');
                        setPage(1);
                        fetchRequests();
                      }}
                    >
                      Clear
                    </Button>
                  </HStack>
                </CardBody>
              </Card>

              <Card shadow="md" borderRadius="xl" overflow="hidden">
          <CardBody p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Company Name</Th>
                    <Th>Email</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests.map((request) => (
                    <Tr key={request.id} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="semibold">{request.companyName}</Td>
                      <Td>{request.email}</Td>
                      <Td>{getTypeBadge(request.type)}</Td>
                      <Td>{getStatusBadge(request.currentStatus)}</Td>
                      <Td>{new Date(request.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            leftIcon={<Eye size={16} />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => navigate(`/admin/registration-requests/${request.id}`)}
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
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                leftIcon={<XCircle size={14} />}
                                colorScheme="red"
                                onClick={() => handleDeny(request.id)}
                              >
                                Deny
                              </Button>
                            </>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {requests.length === 0 && (
              <Box py={8} textAlign="center">
                <Text color="gray.500">No registration requests found</Text>
              </Box>
            )}
              </CardBody>
            </Card>
            </TabPanel>

            <TabPanel px={0}>
              {/* Search for Accepted */}
              <Card shadow="md" borderRadius="xl" mb={4}>
                <CardBody>
                  <HStack spacing={4}>
                    <InputGroup maxW="400px">
                      <InputLeftElement>
                        <Icon as={Search} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                      />
                    </InputGroup>

                    <Button colorScheme="blue" onClick={handleSearch}>
                      Search
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailFilter('');
                        setPage(1);
                        fetchRequests();
                      }}
                    >
                      Clear
                    </Button>
                  </HStack>
                </CardBody>
              </Card>

              <Card shadow="md" borderRadius="xl" overflow="hidden">
                <CardBody p={0}>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Company Name</Th>
                          <Th>Email</Th>
                          <Th>Type</Th>
                          <Th>Accepted At</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {requests.map((request) => (
                          <Tr key={request.id} _hover={{ bg: 'gray.50' }}>
                            <Td fontWeight="semibold">{request.companyName}</Td>
                            <Td>{request.email}</Td>
                            <Td>{getTypeBadge(request.type)}</Td>
                            <Td>{new Date(request.createdAt).toLocaleDateString()}</Td>
                            <Td>
                              <Button
                                size="sm"
                                leftIcon={<Eye size={16} />}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => navigate(`/admin/registration-requests/${request.id}`)}
                              >
                                View
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>

                  {requests.length === 0 && (
                    <Box py={8} textAlign="center">
                      <Text color="gray.500">No accepted requests found</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel px={0}>
              {/* Search for Declined */}
              <Card shadow="md" borderRadius="xl" mb={4}>
                <CardBody>
                  <HStack spacing={4}>
                    <InputGroup maxW="400px">
                      <InputLeftElement>
                        <Icon as={Search} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                      />
                    </InputGroup>

                    <Button colorScheme="blue" onClick={handleSearch}>
                      Search
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailFilter('');
                        setPage(1);
                        fetchRequests();
                      }}
                    >
                      Clear
                    </Button>
                  </HStack>
                </CardBody>
              </Card>

              <Card shadow="md" borderRadius="xl" overflow="hidden">
                <CardBody p={0}>
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Company Name</Th>
                          <Th>Email</Th>
                          <Th>Type</Th>
                          <Th>Declined At</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {requests.map((request) => (
                          <Tr key={request.id} _hover={{ bg: 'gray.50' }}>
                            <Td fontWeight="semibold">{request.companyName}</Td>
                            <Td>{request.email}</Td>
                            <Td>{getTypeBadge(request.type)}</Td>
                            <Td>{new Date(request.createdAt).toLocaleDateString()}</Td>
                            <Td>
                              <Button
                                size="sm"
                                leftIcon={<Eye size={16} />}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => navigate(`/admin/registration-requests/${request.id}`)}
                              >
                                View
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>

                  {requests.length === 0 && (
                    <Box py={8} textAlign="center">
                      <Text color="gray.500">No declined requests found</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <HStack justify="center" spacing={2}>
            <Button
              size="sm"
              onClick={() => setPage(page - 1)}
              isDisabled={page === 1}
            >
              Previous
            </Button>
            <Text fontSize="sm">
              Page {page} of {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setPage(page + 1)}
              isDisabled={page === totalPages}
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
};

export default RegistrationRequests;
