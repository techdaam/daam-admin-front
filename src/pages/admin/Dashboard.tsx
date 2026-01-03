import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Icon,
  VStack,
  HStack,
  Text,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Users, FileText, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface DashboardStats {
  totalUsers: number;
  pendingRequests: number;
  totalOrders: number;
  activeUsers: number;
}

const AdminDashboard = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingRequests: 0,
    totalOrders: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // TODO: Fetch actual stats from API
        // For now, using mock data
        setStats({
          totalUsers: 1234,
          pendingRequests: 45,
          totalOrders: 678,
          activeUsers: 890,
        });
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

    fetchDashboardStats();
  }, [toast, t]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="brand.primary" thickness="4px" />
      </Box>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue.500',
      helpText: 'All registered users',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: FileText,
      color: 'orange.500',
      helpText: 'Awaiting approval',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'green.500',
      helpText: 'All time orders',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'purple.500',
      helpText: 'Currently active',
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color="brand.primary" mb={2}>
            Admin Dashboard
          </Heading>
          <Text color="gray.600">Welcome to the DANAAM Admin Panel</Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {statCards.map((stat, index) => (
            <MotionCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              shadow="md"
              _hover={{ shadow: 'xl' }}
              borderRadius="xl"
              overflow="hidden"
            >
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={4}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg={`${stat.color.split('.')[0]}.50`}
                    >
                      <Icon as={stat.icon} boxSize={6} color={stat.color} />
                    </Box>
                  </HStack>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    {stat.label}
                  </StatLabel>
                  <StatNumber fontSize="3xl" fontWeight="bold" color="gray.800">
                    {stat.value.toLocaleString()}
                  </StatNumber>
                  <StatHelpText color="gray.500" fontSize="xs">
                    {stat.helpText}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <Heading size="md" mb={4} color="brand.primary">
              Quick Actions
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box
                p={4}
                borderRadius="lg"
                bg="blue.50"
                cursor="pointer"
                _hover={{ bg: 'blue.100' }}
                transition="all 0.2s"
              >
                <HStack>
                  <Icon as={FileText} color="blue.600" boxSize={5} />
                  <Text fontWeight="semibold" color="blue.800">
                    Review Registration Requests
                  </Text>
                </HStack>
              </Box>
              <Box
                p={4}
                borderRadius="lg"
                bg="green.50"
                cursor="pointer"
                _hover={{ bg: 'green.100' }}
                transition="all 0.2s"
              >
                <HStack>
                  <Icon as={Users} color="green.600" boxSize={5} />
                  <Text fontWeight="semibold" color="green.800">
                    Manage Users
                  </Text>
                </HStack>
              </Box>
              <Box
                p={4}
                borderRadius="lg"
                bg="purple.50"
                cursor="pointer"
                _hover={{ bg: 'purple.100' }}
                transition="all 0.2s"
              >
                <HStack>
                  <Icon as={Package} color="purple.600" boxSize={5} />
                  <Text fontWeight="semibold" color="purple.800">
                    View Orders
                  </Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default AdminDashboard;
