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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getUsers, activateUser, deactivateUser, deleteUser } from '../../api/users';
import { UserListItem } from '../../types';

const Users = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (searchFilter) {
        filters.emailSearch = searchFilter;
      }

      const response = await getUsers(page, pageSize, filters);
      setUsers(response.items);
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

  const handleActivate = async (userId: string) => {
    try {
      setProcessing(userId);
      await activateUser(userId);
      toast({
        title: 'Success',
        description: 'User activated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
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

  const handleDeactivate = async (userId: string) => {
    try {
      setProcessing(userId);
      await deactivateUser(userId);
      toast({
        title: 'Success',
        description: 'User deactivated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
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

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setProcessing(userId);
      await deleteUser(userId);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
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
    fetchUsers();
  };

  if (loading && users.length === 0) {
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
            Users Management
          </Heading>
          <Text color="gray.600">Manage all registered users</Text>
        </Box>

        {/* Filters */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <HStack spacing={4}>
              <InputGroup maxW="400px">
                <InputLeftElement>
                  <Icon as={Search} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by email"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </InputGroup>

              <Button colorScheme="blue" onClick={handleSearch}>
                Search
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchFilter('');
                  setPage(1);
                  fetchUsers();
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
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Company</Th>
                    <Th>City</Th>
                    <Th>User Class</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="semibold">
                        {user.firstName} {user.lastName}
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>{user.companyName}</Td>
                      <Td>{user.city}</Td>
                      <Td>{user.userClass}</Td>
                      <Td>
                        {user.enabled ? (
                          <Badge colorScheme="green">Active</Badge>
                        ) : (
                          <Badge colorScheme="red">Inactive</Badge>
                        )}
                      </Td>
                      <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            size="sm"
                            variant="ghost"
                            isLoading={processing === user.id}
                          >
                            <MoreVertical size={16} />
                          </MenuButton>
                          <MenuList>
                            {user.enabled ? (
                              <MenuItem
                                icon={<XCircle size={16} />}
                                onClick={() => handleDeactivate(user.id)}
                              >
                                Deactivate
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<CheckCircle size={16} />}
                                onClick={() => handleActivate(user.id)}
                              >
                                Activate
                              </MenuItem>
                            )}
                            <MenuItem
                              icon={<Trash2 size={16} />}
                              onClick={() => handleDelete(user.id)}
                              color="red.500"
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {users.length === 0 && (
              <Box py={8} textAlign="center">
                <Text color="gray.500">No users found</Text>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <HStack justify="center" spacing={2}>
            <Button size="sm" onClick={() => setPage(page - 1)} isDisabled={page === 1}>
              Previous
            </Button>
            <Text fontSize="sm">
              Page {page} of {totalPages}
            </Text>
            <Button size="sm" onClick={() => setPage(page + 1)} isDisabled={page === totalPages}>
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
};

export default Users;
