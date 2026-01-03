import { Box, Flex, HStack, Button, Image, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="white"
      shadow="sm"
      zIndex={1000}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        <HStack spacing={8}>
          <HStack
            spacing={3}
            cursor="pointer"
            onClick={() => navigate('/')}
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          >
            <Image src="/logo.png" alt="دعم" h="36px" />
            <Text
              fontSize="2xl"
              fontWeight="800"
              bgGradient="linear(to-r, brand.primary, brand.accent)"
              bgClip="text"
              letterSpacing="-0.5px"
            >
              {t('common.platformName')}
            </Text>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <LanguageSwitcher />
          {!isLoginPage && (
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              colorScheme="blue"
            >
              {t('common.login')}
            </Button>
          )}
          {!isRegisterPage && (
            <Button
              onClick={() => navigate('/register')}
              colorScheme="blue"
              bgGradient="linear(to-r, brand.primary, brand.accent)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, brand.primary-dark, brand.accent-dark)',
              }}
            >
              {t('common.register')}
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
