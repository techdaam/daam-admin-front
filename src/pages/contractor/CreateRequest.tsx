import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  IconButton,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  title: string;
  deliveryLocation: string;
  deliveryDate: string;
  deadline: string;
  notes: string;
}

interface Item {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  specifications: string;
}

const CreateRequest = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    deliveryLocation: '',
    deliveryDate: '',
    deadline: '',
    notes: '',
  });

  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '', quantity: '', unit: '', specifications: '' },
  ]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (id: number, field: keyof Omit<Item, 'id'>, value: string): void => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = (): void => {
    setItems([...items, { id: Date.now(), name: '', quantity: '', unit: '', specifications: '' }]);
  };

  const removeItem = (id: number): void => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    
    // Mock submission
    console.log('Submitting request:', { ...formData, items });
    
    toast({
      title: 'تم إنشاء الطلب بنجاح',
      description: 'تم نشر طلبك وسيراه الموردون قريباً',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    navigate('/my-requests');
  };

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="xl" color="brand.primary">
          إنشاء طلب جديد
        </Heading>
        <Text color="gray.600">أنشئ طلب للحصول على عروض من الموردين</Text>
      </VStack>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card shadow="md">
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <Heading size="md" color="gray.700">
                معلومات الطلب
              </Heading>

              <FormControl isRequired>
                <FormLabel>عنوان الطلب</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="مثال: مواد بناء لمشروع برج الرياض"
                  size="lg"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>موقع التسليم</FormLabel>
                  <Input
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    placeholder="الرياض، حي النخيل"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>تاريخ التسليم المطلوب</FormLabel>
                  <Input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>آخر موعد لتقديم العروض</FormLabel>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  size="lg"
                />
              </FormControl>

              <Divider />

              {/* Items List */}
              <HStack justify="space-between">
                <Heading size="md" color="gray.700">
                  المواد المطلوبة
                </Heading>
                <Button
                  leftIcon={<Plus size={16} />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={addItem}
                  size="sm"
                >
                  إضافة مادة
                </Button>
              </HStack>

              {items.map((item, index) => (
                <Card key={item.id} variant="outline" bg="gray.50">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontWeight="600" color="gray.700">
                          المادة #{index + 1}
                        </Text>
                        {items.length > 1 && (
                          <IconButton
                            icon={<Trash2 size={16} />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            aria-label="حذف المادة"
                          />
                        )}
                      </HStack>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm">اسم المادة</FormLabel>
                          <Input
                            value={item.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'name', e.target.value)}
                            placeholder="مثال: أسمنت"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">الكمية</FormLabel>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'quantity', e.target.value)}
                            placeholder="500"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">الوحدة</FormLabel>
                          <Input
                            value={item.unit}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'unit', e.target.value)}
                            placeholder="كيس / طن / متر مكعب"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">المواصفات</FormLabel>
                          <Input
                            value={item.specifications}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemChange(item.id, 'specifications', e.target.value)}
                            placeholder="مواصفات إضافية (اختياري)"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              ))}

              <Divider />

              {/* Additional Notes */}
              <FormControl>
                <FormLabel>ملاحظات إضافية</FormLabel>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="أي معلومات إضافية تود إضافتها..."
                  rows={4}
                />
              </FormControl>

              {/* Submit Button */}
              <HStack justify="end" pt={4}>
                <Button
                  variant="outline"
                  onClick={() => navigate('/my-requests')}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  bg="brand.primary"
                  color="white"
                  size="lg"
                  px={12}
                  _hover={{ bg: 'brand.primary-dark' }}
                >
                  نشر الطلب
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </form>
    </Box>
  );
};

export default CreateRequest;
