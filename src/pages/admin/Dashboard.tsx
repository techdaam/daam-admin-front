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
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Package, TrendingUp, ArrowRight } from 'lucide-react';
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
  const navigate = useNavigate();
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
      label: t('admin.dashboard.totalUsers'),
      value: stats.totalUsers,
      icon: Users,
      helpText: `+12% ${t('admin.dashboard.lastMonth')}`,
    },
    {
      label: t('admin.dashboard.pendingRequests'),
      value: stats.pendingRequests,
      icon: FileText,
      helpText: t('admin.dashboard.awaitingApproval'),
    },
    {
      label: t('admin.dashboard.totalOrders'),
      value: stats.totalOrders,
      icon: Package,
      helpText: `+8% ${t('admin.dashboard.lastMonth')}`,
    },
    {
      label: t('admin.dashboard.activeUsers'),
      value: stats.activeUsers,
      icon: TrendingUp,
      helpText: t('admin.dashboard.currentlyOnline'),
    },
  ];

  const quickActions = [
    {
      title: t('admin.dashboard.reviewRegistrations'),
      description: t('admin.dashboard.reviewRegistrationsDesc'),
      icon: FileText,
      onClick: () => navigate('/admin/registration-requests'),
    },
    {
      title: t('admin.dashboard.manageUsers'),
      description: t('admin.dashboard.manageUsersDesc'),
      icon: Users,
      onClick: () => navigate('/admin/users'),
    },
    {
      title: t('admin.dashboard.viewOrders'),
      description: t('admin.dashboard.viewOrdersDesc'),
      icon: Package,
      onClick: () => navigate('/admin/orders'),
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box
          bg="brand.primary"
          p={8}
          borderRadius="xl"
          color="white"
        >
          <Heading size="xl" mb={2}>
            {t('admin.dashboard.title')}
          </Heading>
          <Text fontSize="lg" opacity={0.9}>
            {t('admin.dashboard.welcome')}
          </Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {statCards.map((stat, index) => (
            <MotionCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              shadow="sm"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              _hover={{ shadow: 'md', borderColor: 'blue.200' }}
            >
              <CardBody p={6}>
                <Stat>
                  <Flex justify="space-between" align="start" mb={4}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg="gray.50"
                    >
                      <Icon as={stat.icon} boxSize={6} color="brand.primary" />
                    </Box>
                  </Flex>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium" mb={2}>
                    {stat.label}
                  </StatLabel>
                  <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900" mb={1}>
                    {stat.value.toLocaleString()}
                  </StatNumber>
                  <StatHelpText color="gray.500" fontSize="sm">
                    {stat.helpText}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Card shadow="sm" borderRadius="xl" border="1px solid" borderColor="gray.200">
          <CardBody p={8}>
            <Heading size="md" mb={6} color="gray.800">
              {t('admin.dashboard.quickActions')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {quickActions.map((action, index) => (
                <Box
                  key={action.title}
                  p={6}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  bg="white"
                  cursor="pointer"
                  onClick={action.onClick}
                  transition="all 0.2s"
                  _hover={{
                    borderColor: 'blue.300',
                    shadow: 'sm',
                    transform: 'translateY(-2px)',
                  }}
                >
                  <VStack align="start" spacing={3}>
                    <Flex justify="space-between" align="center" w="full">
                      <Box
                        p={2}
                        borderRadius="md"
                        bg="gray.50"
                      >
                        <Icon as={action.icon} color="brand.primary" boxSize={5} />
                      </Box>
                      <Icon as={ArrowRight} color="gray.400" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" fontSize="md" mb={1}>
                        {action.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {action.description}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card shadow="sm" borderRadius="xl" border="1px solid" borderColor="gray.200">
          <CardBody p={8}>
            <Heading size="md" mb={6} color="gray.800">
              {t('admin.dashboard.recentActivity')}
            </Heading>
            <VStack spacing={3} align="stretch">
              <Box
                p={4}
                borderRadius="lg"
                bg="gray.50"
                borderLeft="3px solid"
                borderLeftColor="brand.primary"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" color="gray.800" fontSize="sm">
                      {t('admin.dashboard.newRegistrationRequest')}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      ABC Construction Company
                    </Text>
                  </VStack>
                  <Text fontSize="xs" color="gray.500">{t('admin.dashboard.hoursAgo', { hours: 2 })}</Text>
                </HStack>
              </Box>
              <Box
                p={4}
                borderRadius="lg"
                bg="gray.50"
                borderLeft="3px solid"
                borderLeftColor="brand.primary"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" color="gray.800" fontSize="sm">
                      {t('admin.dashboard.userActivated')}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      john.doe@example.com
                    </Text>
                  </VStack>
                  <Text fontSize="xs" color="gray.500">{t('admin.dashboard.hoursAgo', { hours: 5 })}</Text>
                </HStack>
              </Box>
              <Box
                p={4}
                borderRadius="lg"
                bg="gray.50"
                borderLeft="3px solid"
                borderLeftColor="brand.primary"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" color="gray.800" fontSize="sm">
                      {t('admin.dashboard.newOrderCreated')}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Order #12345
                    </Text>
                  </VStack>
                  <Text fontSize="xs" color="gray.500">{t('admin.dashboard.daysAgo', { days: 1 })}</Text>
                </HStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default AdminDashboard;
