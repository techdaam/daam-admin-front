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
  Progress,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
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
      color: 'blue',
      gradient: 'linear(to-br, blue.400, blue.600)',
      helpText: `+12% ${t('admin.dashboard.lastMonth')}`,
      change: '+12%',
    },
    {
      label: t('admin.dashboard.pendingRequests'),
      value: stats.pendingRequests,
      icon: FileText,
      color: 'orange',
      gradient: 'linear(to-br, orange.400, orange.600)',
      helpText: t('admin.dashboard.awaitingApproval'),
      change: '+5',
    },
    {
      label: t('admin.dashboard.totalOrders'),
      value: stats.totalOrders,
      icon: Package,
      color: 'green',
      gradient: 'linear(to-br, green.400, green.600)',
      helpText: `+8% ${t('admin.dashboard.lastMonth')}`,
      change: '+8%',
    },
    {
      label: t('admin.dashboard.activeUsers'),
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'purple',
      gradient: 'linear(to-br, purple.400, purple.600)',
      helpText: t('admin.dashboard.currentlyOnline'),
      change: '890',
    },
  ];

  const quickActions = [
    {
      title: t('admin.dashboard.reviewRegistrations'),
      description: t('admin.dashboard.reviewRegistrationsDesc'),
      icon: FileText,
      color: 'blue',
      gradient: 'linear(to-br, blue.50, blue.100)',
      borderColor: 'blue.200',
      onClick: () => navigate('/admin/registration-requests'),
    },
    {
      title: t('admin.dashboard.manageUsers'),
      description: t('admin.dashboard.manageUsersDesc'),
      icon: Users,
      color: 'green',
      gradient: 'linear(to-br, green.50, green.100)',
      borderColor: 'green.200',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: t('admin.dashboard.viewOrders'),
      description: t('admin.dashboard.viewOrdersDesc'),
      icon: Package,
      color: 'purple',
      gradient: 'linear(to-br, purple.50, purple.100)',
      borderColor: 'purple.200',
      onClick: () => navigate('/admin/orders'),
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
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
            <Heading size="xl" mb={2}>
              {t('admin.dashboard.title')}
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              {t('admin.dashboard.welcome')}
            </Text>
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

        {/* Stats Grid with Enhanced Design */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {statCards.map((stat, index) => (
            <MotionCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              shadow="lg"
              _hover={{ shadow: '2xl' }}
              borderRadius="2xl"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.100"
              bg="white"
            >
              <CardBody p={6}>
                <Stat>
                  <Flex justify="space-between" align="start" mb={4}>
                    <Box
                      p={4}
                      borderRadius="xl"
                      bgGradient={stat.gradient}
                      shadow="md"
                    >
                      <Icon as={stat.icon} boxSize={7} color="white" />
                    </Box>
                    <Box
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg={`${stat.color}.50`}
                      color={`${stat.color}.700`}
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      {stat.change}
                    </Box>
                  </Flex>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium" mb={2}>
                    {stat.label}
                  </StatLabel>
                  <StatNumber fontSize="4xl" fontWeight="bold" color="gray.800" mb={2}>
                    {stat.value.toLocaleString()}
                  </StatNumber>
                  <StatHelpText color="gray.500" fontSize="sm" mb={3}>
                    {stat.helpText}
                  </StatHelpText>
                  <Progress
                    value={75}
                    size="sm"
                    colorScheme={stat.color}
                    borderRadius="full"
                  />
                </Stat>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        {/* Quick Actions with Enhanced Design */}
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <CardBody p={8}>
            <Heading size="md" mb={6} color="brand.primary">
              {t('admin.dashboard.quickActions')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {quickActions.map((action, index) => (
                <MotionCard
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  bgGradient={action.gradient}
                  p={6}
                  borderRadius="xl"
                  cursor="pointer"
                  onClick={action.onClick}
                  border="2px solid"
                  borderColor={action.borderColor}
                  shadow="md"
                  _hover={{ shadow: 'xl' }}
                >
                  <VStack align="start" spacing={4}>
                    <Flex justify="space-between" align="start" w="full">
                      <Box
                        p={3}
                        borderRadius="lg"
                        bg="white"
                        shadow="sm"
                      >
                        <Icon as={action.icon} color={`${action.color}.600`} boxSize={6} />
                      </Box>
                      <Icon as={ArrowUpRight} color={`${action.color}.600`} boxSize={5} />
                    </Flex>
                    <Box>
                      <Text fontWeight="bold" color={`${action.color}.900`} fontSize="lg" mb={1}>
                        {action.title}
                      </Text>
                      <Text fontSize="sm" color={`${action.color}.700`}>
                        {action.description}
                      </Text>
                    </Box>
                  </VStack>
                </MotionCard>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Recent Activity Section */}
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <CardBody p={8}>
            <Heading size="md" mb={6} color="brand.primary">
              {t('admin.dashboard.recentActivity')}
            </Heading>
            <VStack spacing={4} align="stretch">
              <Box
                p={4}
                borderRadius="lg"
                bg="gray.50"
                borderLeft="4px solid"
                borderLeftColor="blue.500"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {t('admin.dashboard.newRegistrationRequest')}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      ABC Construction Company
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="gray.500">{t('admin.dashboard.hoursAgo', { hours: 2 })}</Text>
                </HStack>
              </Box>
              <Box
                p={4}
                borderRadius="lg"
                bg="gray.50"
                borderLeft="4px solid"
                borderLeftColor="green.500"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {t('admin.dashboard.userActivated')}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      john.doe@example.com
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="gray.500">{t('admin.dashboard.hoursAgo', { hours: 5 })}</Text>
                </HStack>
              </Box>
              <Box
                p={4}
                borderRadius="lg"
                bg="gray.50"
                borderLeft="4px solid"
                borderLeftColor="purple.500"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {t('admin.dashboard.newOrderCreated')}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Order #12345
                    </Text>
                  </VStack>
                  <Text fontSize="sm" color="gray.500">{t('admin.dashboard.daysAgo', { days: 1 })}</Text>
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
