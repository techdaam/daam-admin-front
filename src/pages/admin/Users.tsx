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
  Avatar,
  Flex,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, CheckCircle, XCircle, Trash2, Filter, Users as UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUsers, activateUser, deactivateUser, deleteUser } from '../../api/users';
import { UserListItem } from '../../types';

const MotionBox = motion(Box);

const Users = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure();
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
                  Users Management
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  Manage all registered users in the system
                </Text>
              </Box>
              <Box
                p={4}
                borderRadius="xl"
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
              >
                <Icon as={UsersIcon} boxSize={10} />
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
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <CardBody p={6}>
            <HStack spacing={8} justify="space-around">
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  {users.length}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Users</Text>
              </VStack>
              <Box h="50px" w="1px" bg="gray.200" />
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">
                  {users.filter(u => u.enabled).length}
                </Text>
                <Text fontSize="sm" color="gray.600">Active</Text>
              </VStack>
              <Box h="50px" w="1px" bg="gray.200" />
              <VStack>
                <Text fontSize="3xl" fontWeight="bold" color="red.600">
                  {users.filter(u => !u.enabled).length}
                </Text>
                <Text fontSize="sm" color="gray.600">Inactive</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Filters Section */}
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <HStack spacing={4} flex={1}>
                  <InputGroup maxW="500px">
                    <InputLeftElement>
                      <Icon as={Search} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by email"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      borderRadius="lg"
                      bg="white"
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
                      setSearchFilter('');
                      setPage(1);
                      fetchUsers();
                    }}
                    borderRadius="lg"
                  >
                    Clear
                  </Button>
                </HStack>

                <Button
                  leftIcon={<Filter size={18} />}
                  variant="outline"
                  onClick={onFilterToggle}
                  borderRadius="lg"
                >
                  Filters
                </Button>
              </Flex>

              <Collapse in={isFilterOpen} animateOpacity>
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text color="gray.600" fontSize="sm">
                    Additional filters will be available here
                  </Text>
                </Box>
              </Collapse>
            </VStack>
          </CardBody>
        </Card>

        {/* Table */}
        <Card shadow="lg" borderRadius="2xl" overflow="hidden" border="1px solid" borderColor="gray.100">
          <CardBody p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.50" borderBottom="2px solid" borderColor="gray.200">
                  <Tr>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">User</Th>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Company</Th>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">City</Th>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">User Class</Th>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Status</Th>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Created At</Th>
                    <Th py={4} fontSize="xs" textTransform="uppercase" color="gray.600" fontWeight="bold">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user, index) => (
                    <MotionBox
                      as={Tr}
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      _hover={{ bg: 'blue.50' }}
                      cursor="pointer"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      <Td py={4}>
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={`${user.firstName} ${user.lastName}`}
                            bg="blue.500"
                            color="white"
                            fontWeight="bold"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold" color="gray.800">
                              {user.firstName} {user.lastName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {user.email}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td py={4}>
                        <Text fontWeight="medium" color="gray.700">{user.companyName}</Text>
                      </Td>
                      <Td py={4}>
                        <Text color="gray.600">{user.city}</Text>
                      </Td>
                      <Td py={4}>
                        <Badge
                          colorScheme={user.userClass.includes('Contractor') ? 'blue' : 'orange'}
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="semibold"
                        >
                          {user.userClass}
                        </Badge>
                      </Td>
                      <Td py={4}>
                        {user.enabled ? (
                          <Badge
                            colorScheme="green"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="semibold"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            colorScheme="red"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="semibold"
                          >
                            Inactive
                          </Badge>
                        )}
                      </Td>
                      <Td py={4}>
                        <Text color="gray.600" fontSize="sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td py={4}>
                        <Menu>
                          <MenuButton
                            as={Button}
                            size="sm"
                            variant="ghost"
                            isLoading={processing === user.id}
                            _hover={{ bg: 'gray.100' }}
                            borderRadius="lg"
                          >
                            <MoreVertical size={16} />
                          </MenuButton>
                          <MenuList shadow="lg" borderRadius="lg" border="1px solid" borderColor="gray.200">
                            {user.enabled ? (
                              <MenuItem
                                icon={<XCircle size={16} />}
                                onClick={() => handleDeactivate(user.id)}
                                _hover={{ bg: 'orange.50', color: 'orange.700' }}
                              >
                                Deactivate
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<CheckCircle size={16} />}
                                onClick={() => handleActivate(user.id)}
                                _hover={{ bg: 'green.50', color: 'green.700' }}
                              >
                                Activate
                              </MenuItem>
                            )}
                            <MenuItem
                              icon={<Trash2 size={16} />}
                              onClick={() => handleDelete(user.id)}
                              color="red.500"
                              _hover={{ bg: 'red.50', color: 'red.700' }}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </MotionBox>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {users.length === 0 && (
              <Box py={20} textAlign="center">
                <VStack spacing={4}>
                  <Box
                    p={6}
                    borderRadius="full"
                    bg="gray.100"
                  >
                    <Icon as={UsersIcon} boxSize={12} color="gray.400" />
                  </Box>
                  <Heading size="md" color="gray.600">No Users Found</Heading>
                  <Text color="gray.500" maxW="md">
                    There are no users matching your search criteria. Try adjusting your filters.
                  </Text>
                </VStack>
              </Box>
            )}
          </CardBody>
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
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      size="md"
                      onClick={() => setPage(i + 1)}
                      colorScheme={page === i + 1 ? 'blue' : 'gray'}
                      variant={page === i + 1 ? 'solid' : 'outline'}
                      borderRadius="lg"
                      minW="40px"
                    >
                      {i + 1}
                    </Button>
                  ))}
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

export default Users;
