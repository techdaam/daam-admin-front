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
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { getRegistrationRequests } from '../../api/registrationRequests';
import { RegistrationRequestListItem, RegistrationStatus } from '../../types';

const RegistrationRequests = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<RegistrationRequestListItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | undefined>(undefined);
  const [emailFilter, setEmailFilter] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== undefined) {
        filters.status = statusFilter;
      }
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

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.Pending:
        return <Badge colorScheme="yellow">Pending</Badge>;
      case RegistrationStatus.Approved:
        return <Badge colorScheme="green">Approved</Badge>;
      case RegistrationStatus.Denied:
        return <Badge colorScheme="red">Denied</Badge>;
      default:
        return <Badge>Unknown</Badge>;
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

        {/* Filters */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <HStack spacing={4}>
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) as RegistrationStatus : undefined)}
                maxW="200px"
              >
                <option value={RegistrationStatus.Pending}>Pending</option>
                <option value={RegistrationStatus.Approved}>Approved</option>
                <option value={RegistrationStatus.Denied}>Denied</option>
              </Select>

              <InputGroup maxW="300px">
                <InputLeftElement>
                  <Icon as={Search} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by email"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                />
              </InputGroup>

              <Button
                colorScheme="blue"
                onClick={handleSearch}
              >
                Search
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter(undefined);
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

        {/* Table */}
        <Card shadow="md" borderRadius="xl" overflow="hidden">
          <CardBody p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Company Name</Th>
                    <Th>Email</Th>
                    <Th>City</Th>
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
                      <Td>{request.city}</Td>
                      <Td>{getStatusBadge(request.currentStatus)}</Td>
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
                <Text color="gray.500">No registration requests found</Text>
              </Box>
            )}
          </CardBody>
        </Card>

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
