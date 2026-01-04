import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Icon,
  Button,
  useToast,
  SimpleGrid,
  Flex,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const Settings = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleSaveSettings = () => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
    
    // Update document direction for RTL/LTR
    document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = selectedLanguage;

    toast({
      title: selectedLanguage === 'ar' ? 'تم حفظ الإعدادات' : 'Settings Saved',
      description: selectedLanguage === 'ar' ? 'تم تغيير اللغة بنجاح' : 'Language changed successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const languages = [
    {
      code: 'ar',
      name: 'العربية',
      nativeName: 'Arabic',
      flag: '🇸🇦',
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'الإنجليزية',
      flag: '🇬🇧',
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header with Gradient */}
        <Box
          bgGradient="linear(to-r, brand.primary, blue.600)"
          p={8}
          borderRadius="2xl"
          color="white"
          position="relative"
          overflow="hidden"
        >
          <Box position="relative" zIndex={1}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="xl" mb={2}>
                  {t('common.settings') || 'Settings'}
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  {t('settings.subtitle') || 'Manage your application preferences'}
                </Text>
              </Box>
              <Box
                p={4}
                borderRadius="xl"
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
              >
                <Icon as={SettingsIcon} boxSize={10} />
              </Box>
            </Flex>
          </Box>
          <Box
            position="absolute"
            top="-50%"
            right="-10%"
            w="400px"
            h="400px"
            borderRadius="full"
            bg="whiteAlpha.100"
            filter="blur(60px)"
          />
        </Box>

        {/* Language Settings */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          shadow="lg"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <CardBody p={8}>
            <Flex align="center" mb={6}>
              <Box
                p={3}
                borderRadius="xl"
                bgGradient="linear(to-br, blue.400, blue.600)"
                color="white"
                mr={4}
              >
                <Icon as={Globe} boxSize={7} />
              </Box>
              <Box>
                <Heading size="md" color="brand.primary" mb={1}>
                  {t('settings.languageSettings') || 'Language Settings'}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {t('settings.languageDesc') || 'Choose your preferred language for the application'}
                </Text>
              </Box>
            </Flex>

            <RadioGroup value={selectedLanguage} onChange={handleLanguageChange}>
              <Stack spacing={4}>
                {languages.map((language) => (
                  <Box
                    key={language.code}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={selectedLanguage === language.code ? 'blue.500' : 'gray.200'}
                    bg={selectedLanguage === language.code ? 'blue.50' : 'white'}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'blue.400',
                      shadow: 'md',
                    }}
                    onClick={() => handleLanguageChange(language.code)}
                  >
                    <Radio value={language.code} colorScheme="blue">
                      <HStack spacing={4} ml={2}>
                        <Text fontSize="2xl">{language.flag}</Text>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="lg" color="gray.800">
                            {language.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {language.nativeName}
                          </Text>
                        </VStack>
                      </HStack>
                    </Radio>
                  </Box>
                ))}
              </Stack>
            </RadioGroup>

            {/* Save Button */}
            <Box mt={8}>
              <Button
                leftIcon={<Save size={20} />}
                colorScheme="blue"
                size="lg"
                onClick={handleSaveSettings}
                isDisabled={selectedLanguage === i18n.language}
                px={10}
                borderRadius="lg"
                shadow="md"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                {t('settings.saveSettings') || 'Save Settings'}
              </Button>
            </Box>
          </CardBody>
        </MotionCard>

        {/* Current Language Info */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          shadow="lg"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
        >
          <CardBody p={6}>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  {t('settings.currentLanguage') || 'Current Language'}:
                </Text>
                <HStack>
                  <Text fontSize="xl">
                    {languages.find(l => l.code === i18n.language)?.flag}
                  </Text>
                  <Text fontWeight="bold" color="gray.800">
                    {languages.find(l => l.code === i18n.language)?.name}
                  </Text>
                </HStack>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  {t('settings.textDirection') || 'Text Direction'}:
                </Text>
                <Text fontWeight="bold" color="gray.800">
                  {i18n.language === 'ar' ? 'RTL (Right to Left)' : 'LTR (Left to Right)'}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Info Message */}
        <Box
          p={4}
          borderRadius="lg"
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
        >
          <HStack spacing={3}>
            <Icon as={Globe} color="blue.600" boxSize={5} />
            <Text color="blue.700" fontSize="sm">
              {t('settings.languageInfo') || 'The application will automatically adjust the layout and text direction based on your selected language.'}
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Settings;
