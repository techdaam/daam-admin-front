import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Card,
  CardBody,
  Icon,
} from '@chakra-ui/react';
import { Package } from 'lucide-react';

const Orders = () => {
  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color="brand.primary" mb={2}>
            Orders Management
          </Heading>
          <Text color="gray.600">Manage all orders (Coming Soon)</Text>
        </Box>

        {/* Placeholder */}
        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <VStack spacing={4} py={12}>
              <Icon as={Package} boxSize={16} color="gray.400" />
              <Heading size="md" color="gray.600">
                Orders Management
              </Heading>
              <Text color="gray.500" textAlign="center" maxW="md">
                Orders management functionality will be available soon. This section will allow you to view, track, and manage all orders in the system.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Orders;
