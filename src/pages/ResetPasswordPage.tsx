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
  Image,
  useDisclosure,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendOTP, resetPassword } from '../api/auth';
import OTPDialog from '../components/OTPDialog';
import Navigation from '../components/Navigation';
import { FormErrors } from '../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [step, setStep] = useState<number>(1); // 1: Email, 2: New Password
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otpRequesterToken, setOtpRequesterToken] = useState<string>('');
  const [otpSuccessToken, setOtpSuccessToken] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleEmailSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setErrors({ email: t('validation.required') });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: t('validation.email') });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendOTP(email, 'PasswordReset');
      setOtpRequesterToken(response.otpRequesterToken);
      onOpen();
    } catch (err: any) {
      const errorCode = err.response?.data?.code;
      const errorDetail = err.response?.data?.detail;

      if (errorCode === 'Users.UserNotFound') {
        setErrors({ email: t('resetPassword.userNotFound') });
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

  const handleOTPSuccess = (successToken: string): void => {
    setOtpSuccessToken(successToken);
    setStep(2);
    onClose();
  };

  const handlePasswordReset = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    // Validate passwords
    const newErrors: FormErrors = {};
    if (!newPassword) {
      newErrors.newPassword = t('validation.required');
    } else if (newPassword.length < 8) {
      newErrors.newPassword = t('validation.minLength', { min: 8 });
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation.required');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('registration.passwordMismatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(otpSuccessToken, newPassword);

      toast({
        title: t('common.success'),
        description: t('resetPassword.success'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorCode = err.response?.data?.code;
      const errorDetail = err.response?.data?.detail;

      if (errorCode === 'Users.InvalidOTPToken') {
        toast({
          title: t('common.error'),
          description: t('resetPassword.invalidToken'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setStep(1);
        setEmail('');
        setOtpSuccessToken('');
      } else if (errorCode === 'Users.PasswordTooWeak') {
        setErrors({ newPassword: t('validation.passwordStrength') });
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
                  alt={t('common.platformName')}
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

          {/* Right Side - Reset Password Form */}
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
                    {t('resetPassword.title')}
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {step === 1 ? t('resetPassword.subtitle') : t('resetPassword.newPasswordSubtitle')}
                  </Text>
                </VStack>

                {/* Reset Password Form Card */}
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
                    {step === 1 ? (
                      <form onSubmit={handleEmailSubmit}>
                        <VStack spacing={5}>
                          <FormControl isInvalid={!!errors.email}>
                            <FormLabel fontWeight="600" color="gray.700">
                              {t('common.email')}
                            </FormLabel>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setEmail(e.target.value);
                                setErrors({});
                              }}
                              placeholder={t('resetPassword.emailPlaceholder')}
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
                            {t('resetPassword.sendOTP')}
                          </Button>
                        </VStack>
                      </form>
                    ) : (
                      <form onSubmit={handlePasswordReset}>
                        <VStack spacing={5}>
                          <FormControl isInvalid={!!errors.newPassword}>
                            <FormLabel fontWeight="600" color="gray.700">
                              {t('resetPassword.newPassword')}
                            </FormLabel>
                            <InputGroup size="lg">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  setNewPassword(e.target.value);
                                  setErrors({ ...errors, newPassword: '' });
                                }}
                                placeholder={t('resetPassword.newPasswordPlaceholder')}
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
                            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel fontWeight="600" color="gray.700">
                              {t('resetPassword.confirmPassword')}
                            </FormLabel>
                            <InputGroup size="lg">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                  setConfirmPassword(e.target.value);
                                  setErrors({ ...errors, confirmPassword: '' });
                                }}
                                placeholder={t('resetPassword.confirmPasswordPlaceholder')}
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
                                  icon={showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  aria-label={showConfirmPassword ? t('common.hidePassword') : t('common.showPassword')}
                                  size="sm"
                                />
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                          </FormControl>

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
                            {t('resetPassword.resetButton')}
                          </Button>
                        </VStack>
                      </form>
                    )}
                  </CardBody>
                </MotionCard>

                {/* Back to Login Link */}
                <HStack justify="center" spacing={2}>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    leftIcon={<ArrowLeft size={16} />}
                    onClick={() => navigate('/login')}
                  >
                    {t('resetPassword.backToLogin')}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </Container>

      {/* OTP Dialog */}
      <OTPDialog
        isOpen={isOpen}
        onClose={onClose}
        email={email}
        otpRequesterToken={otpRequesterToken}
        purpose="PasswordReset"
        onSuccess={handleOTPSuccess}
      />
    </Box>
  );
};

export default ResetPasswordPage;
