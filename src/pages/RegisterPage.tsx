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
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  useDisclosure,
  FormHelperText,
  Divider,
  Badge,
  Select,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Building2, Package, Upload, FileText, CheckCircle, User, Mail, Phone, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactSelect, { StylesConfig } from 'react-select';
import { sendOTP } from '../api/auth';
import { submitRegistration } from '../api/registration';
import OTPDialog from '../components/OTPDialog';
import Navigation from '../components/Navigation';
import StepIndicator from '../components/StepIndicator';
import { RegistrationData, FormErrors } from '../types';
import mainPattern from '../assets/patterns/main.svg';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);

interface CityOption {
  value: string;
  label: string;
}

interface RegistrationFormData {
  companyName: string;
  country: string;
  city: string;
  commercialLicenseNumber: string;
  website: string;
  commercialLicenseFile: File | null;
  taxLicenseFile: File | null;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  password: string;
  retryPassword: string;
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [registrationType, setRegistrationType] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [otpRequesterToken, setOtpRequesterToken] = useState<string>('');
  const [otpSuccessToken, setOtpSuccessToken] = useState<string>('');

  const [formData, setFormData] = useState<RegistrationFormData>({
    companyName: '',
    country: 'المملكة العربية السعودية',
    city: '',
    commercialLicenseNumber: '',
    website: '',
    commercialLicenseFile: null,
    taxLicenseFile: null,
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phoneNumber: '',
    password: '',
    retryPassword: '',
  });

  // Saudi Arabian cities for react-select
  const saudiCities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
    'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'نجران', 'الجبيل', 'ينبع',
    'أبها', 'القطيف', 'الأحساء', 'عنيزة', 'عرعر', 'سكاكا', 'جيزان', 'القريات',
    'الباحة', 'رابغ', 'حفر الباطن', 'الدوادمي', 'صبيا', 'بيشة', 'الرس'
  ];

  // Convert cities to react-select format
  const cityOptions: CityOption[] = saudiCities.map(city => ({
    value: city,
    label: city
  }));

  // Custom styles for react-select to match Chakra UI design
  const customSelectStyles: StylesConfig<CityOption, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f7fafc',
      borderWidth: '2px',
      borderColor: state.isFocused ? '#1e3a8a' : (errors.city ? '#fc8181' : '#e2e8f0'),
      borderRadius: '0.375rem',
      minHeight: '40px',
      boxShadow: state.isFocused ? '0 4px 6px -1px rgba(30, 58, 138, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#1e3a8a',
      },
      transition: 'all 0.2s',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '2px 12px',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a0aec0',
      fontSize: '0.875rem',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#2d3748',
      fontSize: '0.875rem',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '2px solid #e2e8f0',
      marginTop: '4px',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '250px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#1e3a8a' 
        : state.isFocused 
        ? 'rgba(30, 58, 138, 0.1)' 
        : 'white',
      color: state.isSelected ? 'white' : '#2d3748',
      borderRadius: '0.375rem',
      padding: '10px 12px',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:active': {
        backgroundColor: '#1e3a8a',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#1e3a8a' : '#a0aec0',
      '&:hover': {
        color: '#1e3a8a',
      },
      transition: 'all 0.2s',
    }),
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const handleRegistrationTypeSelect = (type: string): void => {
    setRegistrationType(type);
    setCurrentStep(1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.companyName) newErrors.companyName = t('validation.required');
      if (!formData.country) newErrors.country = t('validation.required');
      if (!formData.city) newErrors.city = t('validation.required');
      if (!formData.commercialLicenseNumber) newErrors.commercialLicenseNumber = t('validation.required');
      if (!formData.commercialLicenseFile) newErrors.commercialLicenseFile = t('validation.required');
    } else if (step === 2) {
      if (!formData.firstName) newErrors.firstName = t('validation.required');
      if (!formData.lastName) newErrors.lastName = t('validation.required');
      if (!formData.jobTitle) newErrors.jobTitle = t('validation.required');
      if (!formData.email) {
        newErrors.email = t('validation.required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('validation.email');
      }
      if (!formData.phoneNumber) newErrors.phoneNumber = t('validation.required');
    } else if (step === 3) {
      if (!formData.password) {
        newErrors.password = t('validation.required');
      } else if (formData.password.length < 8) {
        newErrors.password = t('validation.minLength', { min: 8 });
      }
      if (!formData.retryPassword) {
        newErrors.retryPassword = t('validation.required');
      } else if (formData.password !== formData.retryPassword) {
        newErrors.retryPassword = t('registration.passwordMismatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (): Promise<void> => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 2) {
      try {
        setIsSubmitting(true);
        const response = await sendOTP(formData.email, 'Registration');
        setOtpRequesterToken(response.otpRequesterToken);
        onOpen();
      } catch (err: any) {
        toast({
          title: t('common.error'),
          description: err.response?.data?.detail || t('common.error'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleOTPSuccess = (successToken: string): void => {
    setOtpSuccessToken(successToken);
    setCurrentStep(3);
    onClose();
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      data.append('companyName', formData.companyName);
      data.append('country', formData.country);
      data.append('city', formData.city);
      data.append('commercialLicenseNumber', formData.commercialLicenseNumber);
      if (formData.commercialLicenseFile) {
        data.append('commercialLicenseFile', formData.commercialLicenseFile);
      }
      if (formData.taxLicenseFile) {
        data.append('taxLicenseFile', formData.taxLicenseFile);
      }
      if (formData.website) {
        data.append('website', formData.website);
      }
      
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('jobTitle', formData.jobTitle);
      data.append('email', formData.email);
      data.append('phoneNumber', formData.phoneNumber);
      
      data.append('password', formData.password);
      data.append('retryPassword', formData.retryPassword);
      data.append('registerationSuccessToken', otpSuccessToken);
      data.append('type', registrationType);

      await submitRegistration(data);

      toast({
        title: t('common.success'),
        description: t('registration.registrationSuccess'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      const errorErrors = err.response?.data?.errors;
      
      if (errorErrors) {
        const newErrors: FormErrors = {};
        Object.keys(errorErrors).forEach((key) => {
          newErrors[key.charAt(0).toLowerCase() + key.slice(1)] = errorErrors[key][0];
        });
        setErrors(newErrors);
      }
      
      toast({
        title: t('common.error'),
        description: errorDetail || t('common.error'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { label: t('registration.step1') },
    { label: t('registration.step2') },
    { label: t('registration.step3') },
    { label: t('registration.step4') },
  ];

  return (
    <Box minH="100vh" position="relative" overflow="hidden" bg="#FFFFFF">
      {/* Navigation */}
      <Navigation />

      {/* SVG Pattern Overlay - Left Side */}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        w="35%"
        h="100%"
        opacity={0.08}
        backgroundImage={`url(${mainPattern})`}
        backgroundRepeat="repeat-y"
        backgroundSize="auto"
        backgroundPosition="left center"
        zIndex={5}
        pointerEvents="none"
        userSelect="none"
      />

      {/* Blur Effect - Left */}
      <Box
        position="absolute"
        top="50%"
        left={0}
        transform="translateY(-50%)"
        w="40%"
        h="50%"
        bg="rgba(30, 58, 138, 0.3)"
        filter="blur(120px)"
        zIndex={4}
        pointerEvents="none"
      />

      {/* Main Content */}
      <Container maxW="7xl" position="relative" zIndex="10" pt={{ base: '100px', md: '120px' }} pb={12}>
        {/* Registration Type Selection */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Improved Header - Only on Selection Page */}
              <VStack spacing={4} mb={12} textAlign="center">
                <Heading 
                  as="h1"
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  bgGradient="linear(to-r, brand.primary, brand.accent)"
                  bgClip="text"
                  fontWeight="800"
                  letterSpacing="tight"
                  lineHeight="1.2"
                >
                  {t('registration.title')}
                </Heading>
                <Text 
                  color="gray.600" 
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight="500" 
                  maxW="3xl"
                  lineHeight="tall"
                >
                  {t('registration.selectYourRole')}
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} maxW="6xl" mx="auto">
                {/* Contractor Card */}
                <MotionCard
                  cursor="pointer"
                  onClick={() => handleRegistrationTypeSelect('AsContractors')}
                  whileHover={{ y: -12, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  shadow="2xl"
                  borderWidth={3}
                  borderColor="transparent"
                  _hover={{
                    borderColor: 'brand.primary',
                    shadow: '0 30px 60px -15px rgba(30, 58, 138, 0.35)',
                  }}
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  position="relative"
                  h={{ base: 'auto', lg: '450px' }}
                >
                  {/* Gradient Background Overlay */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="180px"
                    bgGradient="linear(to-br, brand.primary, #2563eb)"
                    opacity="0.95"
                  />
                  
                  {/* Pattern Overlay on Gradient */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="180px"
                    backgroundImage={`url(${mainPattern})`}
                    backgroundSize="150px"
                    opacity="0.1"
                  />

                  <CardBody position="relative" p={0}>
                    <VStack spacing={0} align="stretch">
                      {/* Icon Section */}
                      <Box h="180px" display="flex" alignItems="center" justifyContent="center" position="relative">
                        <MotionBox
                          p={5}
                          borderRadius="2xl"
                          bg="white"
                          shadow="2xl"
                          whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon as={Building2} boxSize={16} color="brand.primary" />
                        </MotionBox>
                      </Box>

                      {/* Content Section */}
                      <VStack spacing={4} p={8} align="start" flex="1">
                        <VStack spacing={1} align="start" w="full">
                          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
                            {t('registration.forContractors')}
                          </Badge>
                          <Heading size="xl" color="brand.primary">
                            {t('registration.asContractor')}
                          </Heading>
                          <Text color="gray.600" fontSize="sm" lineHeight="tall">
                            {t('registration.contractorDescription')}
                          </Text>
                        </VStack>

                        {/* Features List */}
                        <VStack spacing={3} align="start" pt={3} w="full">
                          <HStack spacing={3}>
                            <Box w="6px" h="6px" borderRadius="full" bg="brand.primary" />
                            <Text fontSize="sm" color="gray.600">{t('registration.createMaterialRequests')}</Text>
                          </HStack>
                          <HStack spacing={3}>
                            <Box w="6px" h="6px" borderRadius="full" bg="brand.primary" />
                            <Text fontSize="sm" color="gray.600">{t('registration.receiveBids')}</Text>
                          </HStack>
                          <HStack spacing={3}>
                            <Box w="6px" h="6px" borderRadius="full" bg="brand.primary" />
                            <Text fontSize="sm" color="gray.600">{t('registration.manageProjects')}</Text>
                          </HStack>
                        </VStack>

                        {/* CTA Button */}
                        {/* <Button
                          w="full"
                          size="lg"
                          bg="brand.primary"
                          color="white"
                          mt={4}
                          _hover={{
                            bg: 'brand.primary-dark',
                            transform: 'translateY(-2px)',
                            shadow: 'lg',
                          }}
                          _active={{
                            transform: 'translateY(0)',
                          }}
                          rightIcon={<Icon as={Building2} />}
                        >
                          {t('registration.continueAsContractor')}
                        </Button> */}
                      </VStack>
                    </VStack>
                  </CardBody>
                </MotionCard>

                {/* Supplier Card */}
                <MotionCard
                  cursor="pointer"
                  onClick={() => handleRegistrationTypeSelect('AsSuppliers')}
                  whileHover={{ y: -12, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  shadow="2xl"
                  borderWidth={3}
                  borderColor="transparent"
                  _hover={{
                    borderColor: 'brand.accent',
                    shadow: '0 30px 60px -15px rgba(245, 158, 11, 0.35)',
                  }}
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  position="relative"
                  h={{ base: 'auto', lg: '450px' }}
                >
                  {/* Gradient Background Overlay */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="180px"
                    bgGradient="linear(to-br, brand.accent, #f97316)"
                    opacity="0.95"
                  />
                  
                  {/* Pattern Overlay on Gradient */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="180px"
                    backgroundImage={`url(${mainPattern})`}
                    backgroundSize="150px"
                    opacity="0.1"
                  />

                  <CardBody position="relative" p={0}>
                    <VStack spacing={0} align="stretch">
                      {/* Icon Section */}
                      <Box h="180px" display="flex" alignItems="center" justifyContent="center" position="relative">
                        <MotionBox
                          p={5}
                          borderRadius="2xl"
                          bg="white"
                          shadow="2xl"
                          whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon as={Package} boxSize={16} color="brand.accent" />
                        </MotionBox>
                      </Box>

                      {/* Content Section */}
                      <VStack spacing={4} p={8} align="start" flex="1">
                        <VStack spacing={1} align="start" w="full">
                          <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full">
                            {t('registration.forSuppliers')}
                          </Badge>
                          <Heading size="xl" color="brand.accent">
                            {t('registration.asSupplier')}
                          </Heading>
                          <Text color="gray.600" fontSize="sm" lineHeight="tall">
                            {t('registration.supplierDescription')}
                          </Text>
                        </VStack>

                        {/* Features List */}
                        <VStack spacing={3} align="start" pt={3} w="full">
                          <HStack spacing={3}>
                            <Box w="6px" h="6px" borderRadius="full" bg="brand.accent" />
                            <Text fontSize="sm" color="gray.600">{t('registration.browseRequests')}</Text>
                          </HStack>
                          <HStack spacing={3}>
                            <Box w="6px" h="6px" borderRadius="full" bg="brand.accent" />
                            <Text fontSize="sm" color="gray.600">{t('registration.submitBids')}</Text>
                          </HStack>
                          <HStack spacing={3}>
                            <Box w="6px" h="6px" borderRadius="full" bg="brand.accent" />
                            <Text fontSize="sm" color="gray.600">{t('registration.growBusiness')}</Text>
                          </HStack>
                        </VStack>

                        {/* CTA Button */}
                        {/* <Button
                          w="full"
                          size="lg"
                          bg="brand.accent"
                          color="white"
                          mt={4}
                          _hover={{
                            bg: 'brand.accent-dark',
                            transform: 'translateY(-2px)',
                            shadow: 'lg',
                          }}
                          _active={{
                            transform: 'translateY(0)',
                          }}
                          rightIcon={<Icon as={Package} />}
                        >
                          {t('registration.continueAsSupplier')}
                        </Button> */}
                      </VStack>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </SimpleGrid>

              {/* Decorative element and help text */}
              <VStack spacing={4} mt={12}>
                <HStack justify="center" spacing={8} opacity="0.3">
                  <Box w="60px" h="1px" bg="gray.400" />
                  <Icon as={CheckCircle} color="gray.400" />
                  <Box w="60px" h="1px" bg="gray.400" />
                </HStack>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  {t('registration.accountTypeHelp')}
                </Text>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Form Steps - Truncated for brevity, rest of JSX remains the same */}
        <AnimatePresence mode="wait">
          {currentStep > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              maxW="7xl"
              mx="auto"
            >
              {/* Step Indicator */}
              <StepIndicator steps={steps} currentStep={currentStep} />

              {/* Form Card */}
              <MotionCard
                shadow="2xl"
                border="2px"
                borderColor="gray.50"
                bg="white"
                borderRadius="3xl"
                overflow="hidden"
              >
                <CardBody p={{ base: 6, md: 10 }}>
                  <VStack spacing={6} align="stretch">
                    {/* Step 1: Company Details */}
                    {currentStep === 1 && (
                      <MotionVStack
                        spacing={5}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FormControl isInvalid={!!errors.companyName}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.companyName')}</FormLabel>
                          <Input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            maxLength={40}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.country}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.country')}</FormLabel>
                          <Select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          >
                            <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                          </Select>
                          <FormErrorMessage>{errors.country}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.city}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.city')}</FormLabel>
                          <ReactSelect
                            options={cityOptions}
                            value={cityOptions.find(option => option.value === formData.city)}
                            onChange={(selectedOption) => {
                              handleInputChange({
                                target: {
                                  name: 'city',
                                  value: selectedOption ? selectedOption.value : ''
                                }
                              } as any);
                            }}
                            placeholder={t('registration.searchCity')}
                            styles={customSelectStyles}
                            isSearchable
                            isClearable
                            noOptionsMessage={() => t('registration.noResults')}
                          />
                          <FormErrorMessage>{errors.city}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.commercialLicenseNumber}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.commercialLicenseNumber')}</FormLabel>
                          <Input
                            name="commercialLicenseNumber"
                            value={formData.commercialLicenseNumber}
                            onChange={handleInputChange}
                            maxLength={40}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.commercialLicenseNumber}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.website}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.website')}</FormLabel>
                          <Input
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            maxLength={200}
                            placeholder="https://example.com"
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormHelperText fontSize="xs">{t('common.optional')}</FormHelperText>
                          <FormErrorMessage>{errors.website}</FormErrorMessage>
                        </FormControl>

                        <Divider my={2} />

                        {/* File Uploads - At the End */}
                        <Heading size="sm" color="brand.primary" mt={2}>{t('registration.requiredDocuments')}</Heading>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                          <FormControl isInvalid={!!errors.commercialLicenseFile}>
                            <FormLabel fontSize="sm" fontWeight="600">
                              <HStack>
                                <Icon as={FileText} boxSize={4} />
                                <Text fontSize="sm">{t('registration.commercialLicenseFile')}</Text>
                              </HStack>
                            </FormLabel>
                            <Box
                              border="2px dashed"
                              borderColor={errors.commercialLicenseFile ? 'red.500' : 'gray.300'}
                              borderRadius="lg"
                              p={5}
                              bg="gray.50"
                              _hover={{ borderColor: 'brand.primary', bg: 'white', shadow: 'sm' }}
                              transition="all 0.3s"
                              cursor="pointer"
                              position="relative"
                            >
                              <Input
                                type="file"
                                name="commercialLicenseFile"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                position="absolute"
                                top="0"
                                left="0"
                                w="full"
                                h="full"
                                opacity="0"
                                cursor="pointer"
                              />
                              <VStack spacing={2}>
                                <Icon as={Upload} boxSize={7} color="brand.primary" />
                                <Text fontSize="xs" fontWeight="600" color="gray.700" textAlign="center">
                                  {formData.commercialLicenseFile?.name || t('registration.uploadFile')}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  PDF, JPG, PNG
                                </Text>
                              </VStack>
                            </Box>
                            <FormErrorMessage>{errors.commercialLicenseFile}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.taxLicenseFile}>
                            <FormLabel fontSize="sm" fontWeight="600">
                              <HStack>
                                <Icon as={FileText} boxSize={4} />
                                <Text fontSize="sm">{t('registration.taxLicenseFile')}</Text>
                              </HStack>
                            </FormLabel>
                            <Box
                              border="2px dashed"
                              borderColor="gray.300"
                              borderRadius="lg"
                              p={5}
                              bg="gray.50"
                              _hover={{ borderColor: 'brand.primary', bg: 'white', shadow: 'sm' }}
                              transition="all 0.3s"
                              cursor="pointer"
                              position="relative"
                            >
                              <Input
                                type="file"
                                name="taxLicenseFile"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                position="absolute"
                                top="0"
                                left="0"
                                w="full"
                                h="full"
                                opacity="0"
                                cursor="pointer"
                              />
                              <VStack spacing={2}>
                                <Icon as={Upload} boxSize={7} color="gray.400" />
                                <Text fontSize="xs" fontWeight="600" color="gray.700" textAlign="center">
                                  {formData.taxLicenseFile?.name || t('registration.uploadFileOptional')}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  PDF, JPG, PNG
                                </Text>
                              </VStack>
                            </Box>
                            <FormErrorMessage>{errors.taxLicenseFile}</FormErrorMessage>
                          </FormControl>
                        </SimpleGrid>
                      </MotionVStack>
                    )}

                    {/* Step 2: Contact Info */}
                    {currentStep === 2 && (
                      <MotionVStack
                        spacing={5}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FormControl isInvalid={!!errors.firstName}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.firstName')}</FormLabel>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            maxLength={20}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.lastName}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.lastName')}</FormLabel>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            maxLength={20}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.jobTitle}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.jobTitle')}</FormLabel>
                          <Input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            maxLength={30}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.jobTitle}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.email}>
                          <FormLabel fontSize="sm" fontWeight="600">
                            <HStack>
                              <Icon as={Mail} boxSize={4} />
                              <Text>{t('common.email')}</Text>
                            </HStack>
                          </FormLabel>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            maxLength={40}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.phoneNumber}>
                          <FormLabel fontSize="sm" fontWeight="600">
                            <HStack>
                              <Icon as={Phone} boxSize={4} />
                              <Text>{t('registration.phoneNumber')}</Text>
                            </HStack>
                          </FormLabel>
                          <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            maxLength={11}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                        </FormControl>
                      </MotionVStack>
                    )}

                    {/* Step 3: Credentials */}
                    {currentStep === 3 && (
                      <MotionVStack
                        spacing={5}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FormControl isInvalid={!!errors.password}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('common.password')}</FormLabel>
                          <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            maxLength={30}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormHelperText fontSize="xs">{t('registration.passwordRequirement')}</FormHelperText>
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.retryPassword}>
                          <FormLabel fontSize="sm" fontWeight="600">{t('registration.retryPassword')}</FormLabel>
                          <Input
                            type="password"
                            name="retryPassword"
                            value={formData.retryPassword}
                            onChange={handleInputChange}
                            maxLength={30}
                            size="md"
                            bg="gray.50"
                            borderWidth="2px"
                            _hover={{ borderColor: 'brand.primary' }}
                            _focus={{ bg: 'white', borderColor: 'brand.primary', shadow: 'md' }}
                          />
                          <FormErrorMessage>{errors.retryPassword}</FormErrorMessage>
                        </FormControl>
                      </MotionVStack>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                      <MotionVStack
                        spacing={5}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <VStack spacing={6} align="stretch" w="full">
                          {/* Company Details Review */}
                          <Box>
                            <HStack mb={4}>
                              <Icon as={Building2} color="brand.primary" />
                              <Heading size="md" color="brand.primary">{t('registration.companyData')}</Heading>
                            </HStack>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.companyName')}</Text>
                                <Text fontWeight="600">{formData.companyName}</Text>
                              </Box>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.country')}</Text>
                                <Text fontWeight="600">{formData.country}</Text>
                              </Box>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.city')}</Text>
                                <Text fontWeight="600">{formData.city}</Text>
                              </Box>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.commercialLicenseNumber')}</Text>
                                <Text fontWeight="600">{formData.commercialLicenseNumber}</Text>
                              </Box>
                              {formData.website && (
                                <Box p={4} bg="gray.50" borderRadius="lg">
                                  <Text fontSize="sm" color="gray.600">{t('registration.websiteUrl')}</Text>
                                  <Text fontWeight="600">{formData.website}</Text>
                                </Box>
                              )}
                            </SimpleGrid>
                          </Box>

                          <Divider />

                          {/* Contact Info Review */}
                          <Box>
                            <HStack mb={4}>
                              <Icon as={User} color="brand.primary" />
                              <Heading size="md" color="brand.primary">{t('registration.contactInfo')}</Heading>
                            </HStack>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.fullName')}</Text>
                                <Text fontWeight="600">{formData.firstName} {formData.lastName}</Text>
                              </Box>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.jobTitle')}</Text>
                                <Text fontWeight="600">{formData.jobTitle}</Text>
                              </Box>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.emailAddress')}</Text>
                                <Text fontWeight="600">{formData.email}</Text>
                              </Box>
                              <Box p={4} bg="gray.50" borderRadius="lg">
                                <Text fontSize="sm" color="gray.600">{t('registration.phone')}</Text>
                                <Text fontWeight="600">{formData.phoneNumber}</Text>
                              </Box>
                            </SimpleGrid>
                          </Box>

                          <Divider />

                          {/* Files Review */}
                          <Box>
                            <HStack mb={4}>
                              <Icon as={FileText} color="brand.primary" />
                              <Heading size="md" color="brand.primary">{t('registration.documents')}</Heading>
                            </HStack>
                            <VStack spacing={3} align="stretch">
                              <HStack p={4} bg="green.50" borderRadius="lg" justify="space-between">
                                <Text fontWeight="600">{t('registration.commercialLicense')}</Text>
                                <Badge colorScheme="green">{formData.commercialLicenseFile?.name}</Badge>
                              </HStack>
                              {formData.taxLicenseFile && (
                                <HStack p={4} bg="green.50" borderRadius="lg" justify="space-between">
                                  <Text fontWeight="600">{t('registration.taxLicense')}</Text>
                                  <Badge colorScheme="green">{formData.taxLicenseFile?.name}</Badge>
                                </HStack>
                              )}
                            </VStack>
                          </Box>
                        </VStack>
                      </MotionVStack>
                    )}

                    {/* Navigation Buttons */}
                    <HStack justify="space-between" pt={6}>
                      {currentStep > 1 && (
                        <Button
                          onClick={handlePrevious}
                          variant="outline"
                          size="lg"
                          colorScheme="gray"
                          px={10}
                          borderWidth="2px"
                        >
                          {t('common.previous')}
                        </Button>
                      )}
                      
                      {currentStep < 4 ? (
                        <Button
                          bg="brand.primary"
                          color="white"
                          onClick={handleNext}
                          ml="auto"
                          isLoading={isSubmitting}
                          size="lg"
                          px={14}
                          _hover={{
                            bg: 'brand.primary-dark',
                            transform: 'translateY(-2px)',
                            shadow: 'xl',
                          }}
                          transition="all 0.3s"
                        >
                          {t('common.next')}
                        </Button>
                      ) : (
                        <Button
                          bg="brand.accent"
                          color="white"
                          onClick={handleSubmit}
                          ml="auto"
                          isLoading={isSubmitting}
                          size="lg"
                          px={14}
                          _hover={{
                            bg: '#d97706',
                            transform: 'translateY(-2px)',
                            shadow: 'xl',
                          }}
                          transition="all 0.3s"
                        >
                          {t('common.finish')}
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Already Registered Link */}
              <HStack justify="center" mt={10} spacing={2}>
                <Text color="gray.600" fontSize="lg">{t('registration.alreadyRegistered')}</Text>
                <Button
                  variant="link"
                  colorScheme="blue"
                  fontWeight="bold"
                  fontSize="lg"
                  onClick={() => navigate('/login')}
                >
                  {t('registration.loginHere')}
                </Button>
              </HStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </Container>

      {/* OTP Dialog */}
      <OTPDialog
        isOpen={isOpen}
        onClose={onClose}
        email={formData.email}
        otpRequesterToken={otpRequesterToken}
        purpose="Registration"
        onSuccess={handleOTPSuccess}
      />
    </Box>
  );
};

export default RegisterPage;
