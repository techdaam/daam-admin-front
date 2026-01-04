import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Icon,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MotionCard = motion(Card);

const Orders = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Package,
      title: t('admin.orders.orderManagement'),
      description: t('admin.orders.orderManagementDesc'),
    },
    {
      icon: TrendingUp,
      title: t('admin.orders.analyticsReports'),
      description: t('admin.orders.analyticsReportsDesc'),
    },
    {
      icon: Clock,
      title: t('admin.orders.realtimeUpdates'),
      description: t('admin.orders.realtimeUpdatesDesc'),
    },
    {
      icon: CheckCircle,
      title: t('admin.orders.orderFulfillment'),
      description: t('admin.orders.orderFulfillmentDesc'),
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box
          bg="brand.primary"
          p={8}
          borderRadius="xl"
          color="white"
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="xl" mb={2}>
                {t('admin.orders.title')}
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                {t('admin.orders.subtitle')}
              </Text>
            </Box>
            <Box
              p={4}
              borderRadius="lg"
              bg="whiteAlpha.200"
            >
              <Icon as={Package} boxSize={10} />
            </Box>
          </Flex>
        </Box>

        {/* Coming Soon Card */}
        <Card shadow="sm" borderRadius="xl" border="1px solid" borderColor="gray.200">
          <CardBody p={12}>
            <VStack spacing={6}>
              <Box
                p={8}
                borderRadius="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
              >
                <Icon as={Package} boxSize={20} color="brand.primary" />
              </Box>
              <Heading size="xl" color="gray.700" textAlign="center">
                {t('admin.orders.comingSoon')}
              </Heading>
              <Text color="gray.600" textAlign="center" maxW="2xl" fontSize="lg">
                {t('admin.orders.description')}
              </Text>

              {/* Features Grid */}
              <Box w="full" pt={8}>
                <Heading size="md" mb={6} color="gray.800" textAlign="center">
                  {t('admin.orders.upcomingFeatures')}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {features.map((feature, index) => (
                    <MotionCard
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      p={6}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      _hover={{ shadow: 'sm', borderColor: 'blue.200' }}
                    >
                      <HStack spacing={4} align="start">
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg="gray.50"
                        >
                          <Icon as={feature.icon} boxSize={6} color="brand.primary" />
                        </Box>
                        <VStack align="start" spacing={2} flex={1}>
                          <Text fontWeight="semibold" color="gray.800" fontSize="md">
                            {feature.title}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            {feature.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </MotionCard>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Status Badge */}
              <Box
                mt={8}
                px={6}
                py={3}
                borderRadius="full"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
              >
                <HStack spacing={3}>
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg="brand.primary"
                    animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  />
                  <Text color="gray.700" fontWeight="medium" fontSize="sm">
                    {t('admin.orders.developmentInProgress')}
                  </Text>
                </HStack>
              </Box>

              {/* CTA */}
              <Text color="gray.500" fontSize="sm" textAlign="center" maxW="md" mt={4}>
                {t('admin.orders.stayTuned')}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Stats Preview */}
        <Card shadow="sm" borderRadius="xl" border="1px solid" borderColor="gray.200">
          <CardBody p={8}>
            <Heading size="md" mb={6} color="gray.800">
              {t('admin.orders.whatToExpect')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box
                p={6}
                borderRadius="lg"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
                    {t('admin.orders.realtime')}
                  </Text>
                  <Text color="gray.800" fontWeight="medium">
                    {t('admin.orders.orderTracking')}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {t('admin.orders.monitorOrders')}
                  </Text>
                </VStack>
              </Box>

              <Box
                p={6}
                borderRadius="lg"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
                    {t('admin.orders.advanced')}
                  </Text>
                  <Text color="gray.800" fontWeight="medium">
                    {t('admin.orders.filteringSearch')}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {t('admin.orders.findAnyOrder')}
                  </Text>
                </VStack>
              </Box>

              <Box
                p={6}
                borderRadius="lg"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
                    {t('admin.orders.detailed')}
                  </Text>
                  <Text color="gray.800" fontWeight="medium">
                    {t('admin.orders.analyticsDashboard')}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {t('admin.orders.insightsAtFingertips')}
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Orders;
