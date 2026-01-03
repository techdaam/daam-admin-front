import {
  Box,
  SimpleGrid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FileText, Send, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockRequests, mockBids } from '../../data/mockData';
import { Request } from '../../types';

const SupplierDashboard = () => {
  const navigate = useNavigate();

  // Calculate stats
  const availableRequests: number = mockRequests.filter((r: Request) => r.status === 'open').length;
  const myBids: number = mockBids.length;
  const winRate: number = 65; // Mock value

  // Get recent requests (last 3 open)
  const recentRequests: Request[] = mockRequests.filter((r: Request) => r.status === 'open').slice(0, 3);

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="xl" color="brand.accent">
          لوحة التحكم
        </Heading>
        <Text color="gray.600">نظرة عامة على الطلبات والعروض</Text>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card shadow="md" borderTop="4px" borderColor="blue.500">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FileText} color="blue.500" />
                  <Text>الطلبات المتاحة</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="blue.600">
                {availableRequests}
              </StatNumber>
              <StatHelpText>طلبات مفتوحة للعروض</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card shadow="md" borderTop="4px" borderColor="orange.500">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={Send} color="orange.500" />
                  <Text>عروضي المقدمة</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="orange.600">
                {myBids}
              </StatNumber>
              <StatHelpText>إجمالي العروض المقدمة</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card shadow="md" borderTop="4px" borderColor="green.500">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={TrendingUp} color="green.500" />
                  <Text>معدل الفوز</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="green.600">
                {winRate}%
              </StatNumber>
              <StatHelpText>نسبة العروض الفائزة</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Requests Table */}
      <Card shadow="md">
        <CardBody>
          <HStack justify="space-between" mb={6}>
            <Heading size="md" color="gray.700">
              أحدث الطلبات المتاحة
            </Heading>
            <Button
              variant="link"
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/browse-requests')}
            >
              عرض الكل
            </Button>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>عنوان الطلب</Th>
                <Th>المقاول</Th>
                <Th>تاريخ النشر</Th>
                <Th>آخر موعد</Th>
                <Th>عدد المواد</Th>
                <Th>الإجراءات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentRequests.map((request: Request) => (
                <Tr key={request.id}>
                  <Td fontWeight="600">{request.title}</Td>
                  <Td color="gray.600">{request.contractorName}</Td>
                  <Td color="gray.600">{request.createdAt}</Td>
                  <Td>
                    <Badge colorScheme="red">{request.deadline}</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue">{request.items.length} مادة</Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      bg="brand.accent"
                      color="white"
                      _hover={{ bg: 'brand.accent-dark' }}
                      onClick={() => navigate(`/submit-bid/${request.id}`)}
                    >
                      تقديم عرض
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};

export default SupplierDashboard;
