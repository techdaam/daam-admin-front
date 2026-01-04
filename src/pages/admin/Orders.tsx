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
  Button,
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
      color: 'blue',
    },
    {
      icon: TrendingUp,
      title: t('admin.orders.analyticsReports'),
      description: t('admin.orders.analyticsReportsDesc'),
      color: 'green',
    },
    {
      icon: Clock,
      title: t('admin.orders.realtimeUpdates'),
      description: t('admin.orders.realtimeUpdatesDesc'),
      color: 'orange',
    },
    {
      icon: CheckCircle,
      title: t('admin.orders.orderFulfillment'),
      description: t('admin.orders.orderFulfillmentDesc'),
      color: 'purple',
    },
  ];

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
                  {t('admin.orders.title')}
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  {t('admin.orders.subtitle')}
                </Text>
              </Box>
              <Box
                p={4}
                borderRadius="xl"
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
              >
                <Icon as={Package} boxSize={10} />
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

        {/* Coming Soon Card */}
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <CardBody p={12}>
            <VStack spacing={6}>
              <Box
                p={8}
                borderRadius="2xl"
                bgGradient="linear(to-br, blue.50, purple.50)"
                border="2px solid"
                borderColor="blue.200"
              >
                <Icon as={Package} boxSize={20} color="blue.500" />
              </Box>
              <Heading size="xl" color="gray.700" textAlign="center">
                {t('admin.orders.comingSoon')}
              </Heading>
              <Text color="gray.600" textAlign="center" maxW="2xl" fontSize="lg">
                {t('admin.orders.description')}
              </Text>

              {/* Features Grid */}
              <Box w="full" pt={8}>
                <Heading size="md" mb={6} color="brand.primary" textAlign="center">
                  {t('admin.orders.upcomingFeatures')}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {features.map((feature, index) => (
                    <MotionCard
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      p={6}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="white"
                      _hover={{ shadow: 'lg', borderColor: `${feature.color}.300` }}
                    >
                      <HStack spacing={4} align="start">
                        <Box
                          p={3}
                          borderRadius="lg"
                          bgGradient={`linear(to-br, ${feature.color}.400, ${feature.color}.600)`}
                          color="white"
                        >
                          <Icon as={feature.icon} boxSize={6} />
                        </Box>
                        <VStack align="start" spacing={2} flex={1}>
                          <Text fontWeight="bold" color="gray.800" fontSize="lg">
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
                bg="blue.50"
                border="2px solid"
                borderColor="blue.200"
              >
                <HStack spacing={3}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg="blue.500"
                    animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  />
                  <Text color="blue.700" fontWeight="semibold" fontSize="sm">
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
        <Card shadow="lg" borderRadius="2xl" border="1px solid" borderColor="gray.100">
          <CardBody p={8}>
            <Heading size="md" mb={6} color="brand.primary">
              {t('admin.orders.whatToExpect')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box
                p={6}
                borderRadius="xl"
                bgGradient="linear(to-br, blue.50, blue.100)"
                border="1px solid"
                borderColor="blue.200"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                    {t('admin.orders.realtime')}
                  </Text>
                  <Text color="blue.700" fontWeight="medium">
                    {t('admin.orders.orderTracking')}
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    {t('admin.orders.monitorOrders')}
                  </Text>
                </VStack>
              </Box>

              <Box
                p={6}
                borderRadius="xl"
                bgGradient="linear(to-br, green.50, green.100)"
                border="1px solid"
                borderColor="green.200"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">
                    {t('admin.orders.advanced')}
                  </Text>
                  <Text color="green.700" fontWeight="medium">
                    {t('admin.orders.filteringSearch')}
                  </Text>
                  <Text fontSize="sm" color="green.600">
                    {t('admin.orders.findAnyOrder')}
                  </Text>
                </VStack>
              </Box>

              <Box
                p={6}
                borderRadius="xl"
                bgGradient="linear(to-br, purple.50, purple.100)"
                border="1px solid"
                borderColor="purple.200"
              >
                <VStack align="start" spacing={3}>
                  <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                    {t('admin.orders.detailed')}
                  </Text>
                  <Text color="purple.700" fontWeight="medium">
                    {t('admin.orders.analyticsDashboard')}
                  </Text>
                  <Text fontSize="sm" color="purple.600">
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
