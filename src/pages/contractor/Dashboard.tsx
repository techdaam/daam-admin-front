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
import { FileText, Inbox, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockRequests, mockBids } from '../../data/mockData';
import { Request } from '../../types';

const ContractorDashboard = () => {
  const navigate = useNavigate();

  // Calculate stats
  const activeRequests: number = mockRequests.filter((r: Request) => r.status === 'open').length;
  const pendingBids: number = mockBids.filter((b) => b.status === 'pending').length;
  const totalSpent: number = 250000; // Mock value

  // Get recent requests (last 3)
  const recentRequests: Request[] = mockRequests.slice(0, 3);

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="xl" color="brand.primary">
          لوحة التحكم
        </Heading>
        <Text color="gray.600">نظرة عامة على طلباتك والعروض</Text>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card shadow="md" borderTop="4px" borderColor="blue.500">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FileText} color="blue.500" />
                  <Text>الطلبات النشطة</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="blue.600">
                {activeRequests}
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
                  <Icon as={Inbox} color="orange.500" />
                  <Text>العروض المعلقة</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="orange.600">
                {pendingBids}
              </StatNumber>
              <StatHelpText>بانتظار المراجعة</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card shadow="md" borderTop="4px" borderColor="green.500">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={TrendingUp} color="green.500" />
                  <Text>إجمالي المصروفات</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="green.600">
                {totalSpent.toLocaleString()} ر.س
              </StatNumber>
              <StatHelpText>الصفقات المكتملة</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Requests Table */}
      <Card shadow="md">
        <CardBody>
          <HStack justify="space-between" mb={6}>
            <Heading size="md" color="gray.700">
              آخر الطلبات
            </Heading>
            <Button
              variant="link"
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/my-requests')}
            >
              عرض الكل
            </Button>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>عنوان الطلب</Th>
                <Th>تاريخ الإنشاء</Th>
                <Th>الحالة</Th>
                <Th>عدد العروض</Th>
                <Th>الإجراءات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentRequests.map((request: Request) => (
                <Tr key={request.id}>
                  <Td fontWeight="600">{request.title}</Td>
                  <Td color="gray.600">{request.createdAt}</Td>
                  <Td>
                    <Badge colorScheme={request.status === 'open' ? 'green' : 'gray'}>
                      {request.status === 'open' ? 'مفتوح' : 'مغلق'}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue">{request.bidsCount} عروض</Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => navigate(`/view-bids/${request.id}`)}
                    >
                      عرض العروض
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

export default ContractorDashboard;
