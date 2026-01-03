import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
  useToast,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { FormErrors } from '../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface LoginFormData {
  email: string;
  password: string;
  keepLoggedIn: boolean;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    keepLoggedIn: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = t('validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.email');
    }

    if (!formData.password) {
      newErrors.password = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await login(formData.email, formData.password, formData.keepLoggedIn);

      toast({
        title: t('common.success'),
        description: t('login.loginButton'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Route to admin dashboard
      navigate('/admin/dashboard');
    } catch (err: any) {
      const errorCode = err.response?.data?.code;
      const errorDetail = err.response?.data?.detail;

      if (errorCode === 'Users.UserNameOrPassowrdIsNotCorrect') {
        setErrors({ email: t('login.invalidCredentials') });
      } else {
        toast({
          title: t('common.error'),
          description: errorDetail || t('common.error'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Navigation */}
      <Navigation />

      {/* Background with decorative elements */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-br, rgba(30, 58, 138, 0.03), rgba(245, 158, 11, 0.03))"
        zIndex="0"
      />

      {/* Decorative blobs */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bgGradient="radial(circle, rgba(30, 58, 138, 0.1) 0%, transparent 70%)"
        filter="blur(80px)"
        zIndex="0"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-5%"
        w="500px"
        h="500px"
        bgGradient="radial(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)"
        filter="blur(100px)"
        zIndex="0"
      />

      {/* Main Content */}
      <Container maxW="7xl" position="relative" zIndex="1" pt={{ base: '100px', md: '120px' }} pb={8}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="center" minH="calc(100vh - 140px)">
          {/* Left Side - Logo and Branding */}
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={{ base: 8, md: 12 }}
          >
            <VStack spacing={6} align="center">
              <MotionBox
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/logo.png"
                  alt="دعم"
                  h={{ base: '120px', md: '180px' }}
                  objectFit="contain"
                  filter="drop-shadow(0 4px 16px rgba(30, 58, 138, 0.2))"
                />
              </MotionBox>
              <VStack spacing={2}>
                <Heading
                  size={{ base: 'xl', md: '2xl' }}
                  bgGradient="linear(to-r, brand.primary, brand.accent)"
                  bgClip="text"
                  textAlign="center"
                >
                  {t('common.platformName')}
                </Heading>
                <Text
                  color="gray.600"
                  fontSize={{ base: 'md', md: 'lg' }}
                  textAlign="center"
                  maxW="md"
                >
                  {t('common.platformDescription')}
                </Text>
              </VStack>
            </VStack>
          </MotionBox>

          {/* Right Side - Login Form */}
          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            display="flex"
            justifyContent="center"
          >
            <Box w="full" maxW="md">
              <VStack spacing={6} align="stretch">
                {/* Header */}
                <VStack spacing={3} align="start">
                  <Heading size="lg" color="brand.primary">
                    {t('login.title')}
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {t('login.subtitle')}
                  </Text>
                </VStack>

                {/* Login Form Card */}
                <MotionCard
                  shadow="2xl"
                  borderRadius="2xl"
                  overflow="hidden"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  border="1px"
                  borderColor="gray.100"
                >
                  <CardBody p={8}>
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={5}>
                        <FormControl isInvalid={!!errors.email}>
                          <FormLabel fontWeight="600" color="gray.700">
                            {t('common.email')}
                          </FormLabel>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t('login.emailPlaceholder')}
                            size="lg"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{
                              bg: 'white',
                              borderColor: 'brand.primary',
                              shadow: 'md',
                            }}
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password}>
                          <FormLabel fontWeight="600" color="gray.700">
                            {t('common.password')}
                          </FormLabel>
                          <InputGroup size="lg">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder={t('login.passwordPlaceholder')}
                              bg="gray.50"
                              border="1px"
                              borderColor="gray.200"
                              _hover={{ borderColor: 'brand.primary' }}
                              _focus={{
                                bg: 'white',
                                borderColor: 'brand.primary',
                                shadow: 'md',
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <HStack justify="space-between" w="full">
                          <Checkbox
                            name="keepLoggedIn"
                            isChecked={formData.keepLoggedIn}
                            onChange={handleInputChange}
                            colorScheme="blue"
                          >
                            <Text fontSize="sm">{t('login.keepLoggedIn')}</Text>
                          </Checkbox>
                          <Button
                            variant="link"
                            colorScheme="blue"
                            size="sm"
                            onClick={() => navigate('/reset-password')}
                          >
                            {t('login.forgotPassword')}
                          </Button>
                        </HStack>

                        <Button
                          type="submit"
                          bg="brand.primary"
                          color="white"
                          size="lg"
                          w="full"
                          isLoading={isSubmitting}
                          loadingText={t('common.loading')}
                          _hover={{
                            bg: 'brand.primary-dark',
                            transform: 'translateY(-2px)',
                            shadow: 'lg',
                          }}
                          _active={{
                            transform: 'translateY(0)',
                          }}
                          transition="all 0.2s"
                        >
                          {t('login.loginButton')}
                        </Button>
                      </VStack>
                    </form>
                  </CardBody>
                </MotionCard>

              </VStack>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LoginPage;
