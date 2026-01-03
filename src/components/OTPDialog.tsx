import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  PinInput,
  PinInputField,
  HStack,
  useToast,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { verifyOTP, resendOTP } from '../api/auth';
import { AxiosError } from 'axios';

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  otpRequesterToken: string;
  purpose: string;
  onSuccess: (token: string) => void;
}

interface OTPData {
  token: string;
  attemptsLeft: number;
  resendTimesLeft: number;
}

interface ErrorResponse {
  code?: string;
  detail?: string;
}

const OTPDialog = ({ 
  isOpen, 
  onClose, 
  email, 
  otpRequesterToken, 
  purpose, 
  onSuccess 
}: OTPDialogProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [otpData, setOtpData] = useState<OTPData>({
    token: otpRequesterToken,
    attemptsLeft: 5,
    resendTimesLeft: 3,
  });
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  // Sync otpRequesterToken prop with state
  useEffect(() => {
    if (otpRequesterToken) {
      setOtpData(prev => ({
        ...prev,
        token: otpRequesterToken,
      }));
    }
  }, [otpRequesterToken]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async (): Promise<void> => {
    if (otp.length !== 6) {
      setError(t('otp.invalidOtp'));
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await verifyOTP(otpData.token, purpose, otp);
      
      toast({
        title: t('common.success'),
        description: t('otp.title'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess(response.otpSuccessToken);
      onClose();
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const errorCode = error.response?.data?.code;
      const errorDetail = error.response?.data?.detail;
      
      if (errorCode === 'Auth.otp.OptNumberIsNotCorrect') {
        const attemptsMatch = errorDetail?.match(/Attemps Left: (\d+)/);
        const attemptsLeft = attemptsMatch ? parseInt(attemptsMatch[1]) : otpData.attemptsLeft - 1;
        setOtpData({ ...otpData, attemptsLeft });
        setError(`${t('otp.invalidOtp')}. ${t('otp.attemptsLeft')}: ${attemptsLeft}`);
      } else if (errorCode === 'Auth.otp.OTPAttemptLimitReached') {
        setError(t('otp.tooManyAttempts'));
      } else if (errorCode === 'Auth.otp.OtpTokenNotFound') {
        setError(t('otp.otpExpired'));
      } else {
        setError(errorDetail || t('common.error'));
      }
      
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (resendCountdown > 0) return;

    setIsResending(true);
    setError('');

    try {
      const response = await resendOTP(otpData.token, purpose);
      
      setOtpData({
        token: response.otpRequesterToken,
        attemptsLeft: 5, // Reset attempts on resend
        resendTimesLeft: otpData.resendTimesLeft - 1,
      });
      
      setResendCountdown(60); // 60 seconds countdown
      
      toast({
        title: t('common.success'),
        description: t('otp.resend'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setOtp('');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const errorDetail = error.response?.data?.detail;
      setError(errorDetail || t('common.error'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader textAlign="center">{t('otp.title')}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text textAlign="center" color="gray.600" fontSize="sm">
              {t('otp.subtitle')}
            </Text>
            <Text fontWeight="bold" color="brand.primary">
              {email}
            </Text>

            <Box>
              <HStack justify="center" spacing={2}>
                <PinInput
                  value={otp}
                  onChange={setOtp}
                  otp
                  size="lg"
                  placeholder="•"
                  autoFocus
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </Box>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">{error}</AlertDescription>
              </Alert>
            )}

            <VStack spacing={1} w="full">
              <Text fontSize="sm" color="gray.500">
                {t('otp.attemptsLeft')}: {otpData.attemptsLeft}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {t('otp.resendTimesLeft')}: {otpData.resendTimesLeft}
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter flexDirection="column" gap={3}>
          <Button
            colorScheme="blue"
            w="full"
            onClick={handleVerify}
            isLoading={isVerifying}
            loadingText={t('common.loading')}
            isDisabled={otp.length !== 6}
          >
            {t('otp.verify')}
          </Button>

          <Button
            variant="ghost"
            w="full"
            onClick={handleResend}
            isLoading={isResending}
            isDisabled={resendCountdown > 0 || otpData.resendTimesLeft === 0}
          >
            {resendCountdown > 0
              ? `${t('otp.resend')} (${resendCountdown}s)`
              : t('otp.resend')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OTPDialog;
