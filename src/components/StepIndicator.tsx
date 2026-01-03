import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

// Wrap Chakra components with motion
const MotionBox = motion(Box);

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={{ base: 6, md: 4 }}
      shadow="0 4px 20px rgba(0, 0, 0, 0.06)"
      w="full"
      maxW="1000px"
      mx="auto"
      mb={8}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Box position="relative" w="full">
        {/* Steps Container */}
        <HStack spacing={0} justify="space-between" position="relative" w="full">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <VStack
                key={index}
                spacing={3}
                flex="0 0 auto"
                align="center"
                position="relative"
                zIndex={2}
              >
                {/* Step Circle */}
                <MotionBox
                  w={{ base: '38px', md: '46px' }}
                  h={{ base: '38px', md: '46px' }}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted
                      ? '#1e3a8a'
                      : isCurrent
                      ? '#ffffff'
                      : '#e5e7eb',
                    borderColor: isCurrent ? '#f59e0b' : isCompleted ? '#1e3a8a' : '#e5e7eb',
                    borderWidth: isCurrent ? '3px' : '0px',
                    boxShadow: isCurrent
                      ? '0 4px 16px rgba(245, 158, 11, 0.25), 0 0 0 4px rgba(245, 158, 11, 0.1)'
                      : isCompleted
                      ? '0 2px 8px rgba(30, 58, 138, 0.15)'
                      : '0 1px 3px rgba(0, 0, 0, 0.08)',
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  color={
                    isCompleted
                      ? 'white'
                      : isCurrent
                      ? '#f59e0b'
                      : '#9ca3af'
                  }
                  fontWeight="bold"
                  fontSize={{ base: 'lg', md: 'xl' }}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Check size={24} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {stepNumber}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MotionBox>

                {/* Step Label */}
                <MotionBox
                  initial={false}
                  animate={{
                    color: isCurrent
                      ? '#1e3a8a'
                      : isCompleted
                      ? '#1e3a8a'
                      : '#9ca3af',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    textAlign="center"
                    lineHeight="1.5"
                    maxW={{ base: '80px', md: '120px' }}
                    noOfLines={2}
                    fontWeight="500"
                  >
                    {step.label}
                  </Text>
                </MotionBox>
              </VStack>
            );
          })}
        </HStack>

        {/* Connecting Lines */}
        <Box
          position="absolute"
          top={{ base: '25px', md: '20px' }}
          left={{ base: '24px', md: '28px' }}
          right={{ base: '24px', md: '28px' }}
          h="3px"
          zIndex={1}
        >
          <HStack spacing={0} justify="space-between" h="full" w="full">
            {steps.map((_, index) => {
              if (index === steps.length - 1) return null;

              const stepNumber = index + 1;
              const isLineCompleted = stepNumber < currentStep;
              const isLineActive = stepNumber === currentStep - 1;
              const isLineUpcoming = stepNumber >= currentStep;

              return (
                <Box
                  key={`line-${index}`}
                  flex={1}
                  h="full"
                  position="relative"
                  overflow="hidden"
                  borderRadius="full"
                >
                  {/* Base line */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="full"
                    bg="#e5e7eb"
                    borderRadius="full"
                  />
                  
                  {/* Animated colored line */}
                  <MotionBox
                    position="absolute"
                    top="0"
                    {...(isRTL ? { right: '0' } : { left: '0' })}
                    h="full"
                    borderRadius="full"
                    initial={false}
                    animate={{
                      width: isLineCompleted ? '100%' : isLineActive ? '100%' : '0%',
                      backgroundColor: isLineCompleted ? '#1e3a8a' : isLineActive ? '#f59e0b' : '#e5e7eb',
                    }}
                    transition={{
                      width: {
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1],
                        delay: isLineCompleted || isLineActive ? 0.2 : 0,
                      },
                      backgroundColor: {
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    }}
                  />
                </Box>
              );
            })}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
