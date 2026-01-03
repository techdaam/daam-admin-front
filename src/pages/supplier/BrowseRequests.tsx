import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  HStack,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { Calendar, MapPin, FileText, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockRequests } from '../../data/mockData';
import { Request } from '../../types';

const BrowseRequests = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Filter only open requests
  const openRequests: Request[] = mockRequests.filter((r: Request) => r.status === 'open');

  const handleViewDetails = (request: Request): void => {
    setSelectedRequest(request);
    onOpen();
  };

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="xl" color="brand.accent">
          تصفح الطلبات
        </Heading>
        <Text color="gray.600">جميع الطلبات المتاحة للتقديم</Text>
      </VStack>

      {/* Requests Table */}
      <Card shadow="md">
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>عنوان الطلب</Th>
                <Th>المقاول</Th>
                <Th>تاريخ النشر</Th>
                <Th>آخر موعد</Th>
                <Th>الموقع</Th>
                <Th>عدد المواد</Th>
                <Th>الإجراءات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {openRequests.map((request: Request) => (
                <Tr key={request.id}>
                  <Td fontWeight="600" color="gray.800">
                    {request.title}
                  </Td>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="500">
                        {request.contractorName}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {request.contractorCompany}
                      </Text>
                    </VStack>
                  </Td>
                  <Td color="gray.600">{request.createdAt}</Td>
                  <Td>
                    <Badge colorScheme="red">{request.deadline}</Badge>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={MapPin} boxSize={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        {request.deliveryLocation}
                      </Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue">{request.items.length} مادة</Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleViewDetails(request)}
                      >
                        التفاصيل
                      </Button>
                      <Button
                        size="sm"
                        bg="brand.accent"
                        color="white"
                        _hover={{ bg: 'brand.accent-dark' }}
                        onClick={() => navigate(`/submit-bid/${request.id}`)}
                      >
                        تقديم عرض
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Request Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>تفاصيل الطلب</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedRequest && (
              <VStack spacing={6} align="stretch">
                {/* Title */}
                <Heading size="md" color="brand.primary">
                  {selectedRequest.title}
                </Heading>

                {/* Info Grid */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack>
                    <Icon as={Calendar} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">
                        تاريخ التسليم
                      </Text>
                      <Text fontWeight="600">{selectedRequest.deliveryDate}</Text>
                    </VStack>
                  </HStack>

                  <HStack>
                    <Icon as={MapPin} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">
                        موقع التسليم
                      </Text>
                      <Text fontWeight="600">{selectedRequest.deliveryLocation}</Text>
                    </VStack>
                  </HStack>

                  <HStack>
                    <Icon as={FileText} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">
                        آخر موعد للعروض
                      </Text>
                      <Text fontWeight="600">{selectedRequest.deadline}</Text>
                    </VStack>
                  </HStack>

                  <HStack>
                    <Icon as={Package} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">
                        عدد العروض المقدمة
                      </Text>
                      <Text fontWeight="600">{selectedRequest.bidsCount} عروض</Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>

                <Divider />

                {/* Items List */}
                <Box>
                  <Heading size="sm" mb={4}>
                    المواد المطلوبة
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {selectedRequest.items.map((item, index) => (
                      <Card key={item.id} variant="outline" bg="gray.50">
                        <CardBody>
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="600" color="gray.800">
                                {index + 1}. {item.name}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {item.specifications}
                              </Text>
                            </VStack>
                            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                              {item.quantity} {item.unit}
                            </Badge>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </Box>

                {/* Notes */}
                {selectedRequest.notes && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="sm" mb={2}>
                        ملاحظات إضافية
                      </Heading>
                      <Text color="gray.700">{selectedRequest.notes}</Text>
                    </Box>
                  </>
                )}

                {/* Action Button */}
                <Button
                  bg="brand.accent"
                  color="white"
                  size="lg"
                  w="full"
                  _hover={{ bg: 'brand.accent-dark' }}
                  onClick={() => {
                    onClose();
                    navigate(`/submit-bid/${selectedRequest.id}`);
                  }}
                >
                  تقديم عرض سعر
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BrowseRequests;
