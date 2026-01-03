import { Button, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = (): void => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <MotionButton
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      color="brand.primary"
      fontWeight="bold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      _hover={{
        bg: 'whiteAlpha.500',
      }}
    >
      <HStack spacing={1}>
        <Text>{i18n.language === 'ar' ? 'EN' : 'ع'}</Text>
      </HStack>
    </MotionButton>
  );
}
