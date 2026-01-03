import { useState, useEffect, ChangeEvent } from 'react';
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
  CardHeader,
  SimpleGrid,
  Divider,
  Skeleton,
  Badge,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Edit2, Save, X, User, Briefcase, MapPin, Mail, Phone, Globe, Building2, CheckCircle2, XCircle, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProfile, updateProfile } from '../api/profile';
import { ProfileResponse, UpdateProfileRequest, FormErrors } from '../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface InfoFieldProps {
  icon: LucideIcon;
  label: string;
  value?: string;
}

interface EditableFieldProps {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  icon: LucideIcon;
  isEditing: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InfoField = ({ icon, label, value }: InfoFieldProps) => (
  <HStack spacing={2} p={3} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.100">
    <Flex
      w="32px"
      h="32px"
      borderRadius="md"
      bgGradient="linear(to-br, brand.primary, brand.accent)"
      align="center"
      justify="center"
    >
      <Icon as={icon} color="white" boxSize={4} />
    </Flex>
    <VStack align="start" spacing={0} flex={1}>
      <Text fontSize="xs" color="gray.500" fontWeight="600">
        {label}
      </Text>
      <Text fontSize="md" color="gray.900" fontWeight="500">
        {value || '-'}
      </Text>
    </VStack>
  </HStack>
);

const EditableField = ({ name, label, value, placeholder, error, icon, isEditing, onChange }: EditableFieldProps) => (
  <FormControl isInvalid={!!error}>
    <FormLabel fontWeight="600" color="gray.700" fontSize="sm">
      <HStack spacing={2}>
        <Icon as={icon} boxSize={4} color="brand.primary" />
        <Text>{label}</Text>
      </HStack>
    </FormLabel>
    {isEditing ? (
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        size="lg"
        bg="white"
        border="1px"
        borderColor="gray.200"
        isReadOnly={false}
        isDisabled={false}
        _hover={{ borderColor: 'brand.primary' }}
        _focus={{
          borderColor: 'brand.primary',
          shadow: 'md',
        }}
      />
    ) : (
      <Box
        p={3}
        bg="gray.50"
        borderRadius="lg"
        border="1px"
        borderColor="gray.100"
      >
        <Text fontSize="md" color="gray.900" fontWeight="500">
          {value || '-'}
        </Text>
      </Box>
    )}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

const Profile = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    city: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        city: data.city || '',
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('profile.loadError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = t('validation.required');
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      city: profile?.city || '',
    });
    setErrors({});
  };

  const handleSave = async (): Promise<void> => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.city,
      });

      // Update localStorage with new firstName and lastName
      localStorage.setItem('firstName', formData.firstName || '');
      localStorage.setItem('lastName', formData.lastName || '');

      toast({
        title: t('common.success'),
        description: t('profile.updateSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('profile.updateError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="6xl" py={8}>
          <VStack spacing={6} align="stretch">
            <Skeleton height="80px" borderRadius="xl" />
            <Skeleton height="500px" borderRadius="xl" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="6xl" py={8}>
          <Card shadow="lg">
            <CardBody>
              <VStack spacing={4} py={8}>
                <Icon as={XCircle} boxSize={16} color="red.400" />
                <Text fontSize="lg" color="gray.600">{t('profile.loadError')}</Text>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="6xl" py={6}>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              shadow="lg"
              borderRadius="xl"
              overflow="hidden"
              bgGradient="linear(to-r, brand.primary, brand.accent)"
              color="white"
            >
              <CardBody p={6}>
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Icon as={User} boxSize={6} />
                      <Heading size="lg">{t('profile.title')}</Heading>
                    </HStack>
                    <Text fontSize="sm" opacity={0.9}>
                      {t('profile.subtitle')}
                    </Text>
                  </VStack>
                  {!isEditing ? (
                    <Button
                      leftIcon={<Edit2 size={18} />}
                      colorScheme="whiteAlpha"
                      bg="whiteAlpha.300"
                      _hover={{ bg: 'whiteAlpha.400' }}
                      onClick={handleEdit}
                      size="lg"
                    >
                      {t('profile.editProfile')}
                    </Button>
                  ) : (
                    <HStack>
                      <Button
                        leftIcon={<X size={18} />}
                        variant="outline"
                        borderColor="whiteAlpha.400"
                        color="white"
                        _hover={{ bg: 'whiteAlpha.200' }}
                        onClick={handleCancel}
                        size="lg"
                      >
                        {t('profile.cancel')}
                      </Button>
                      <Button
                        leftIcon={<Save size={18} />}
                        bg="white"
                        color="brand.primary"
                        _hover={{ bg: 'gray.100' }}
                        onClick={handleSave}
                        isLoading={isSaving}
                        size="lg"
                      >
                        {t('profile.saveChanges')}
                      </Button>
                    </HStack>
                  )}
                </Flex>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Personal Information */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            shadow="md"
            borderRadius="xl"
            overflow="hidden"
          >
            <CardHeader bgGradient="linear(to-r, rgba(30, 58, 138, 0.05), rgba(245, 158, 11, 0.05))" py={3} px={5}>
              <HStack>
                <Icon as={User} color="brand.primary" boxSize={5} />
                <Heading size="sm" color="brand.primary">
                  {t('profile.personalInfo')}
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <EditableField
                  name="firstName"
                  label={t('profile.firstName')}
                  value={formData.firstName || ''}
                  placeholder={t('profile.firstNamePlaceholder')}
                  error={errors.firstName}
                  icon={User}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
                <EditableField
                  name="lastName"
                  label={t('profile.lastName')}
                  value={formData.lastName || ''}
                  placeholder={t('profile.lastNamePlaceholder')}
                  error={errors.lastName}
                  icon={User}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
                <EditableField
                  name="city"
                  label={t('profile.city')}
                  value={formData.city || ''}
                  placeholder={t('profile.cityPlaceholder')}
                  error={errors.city}
                  icon={MapPin}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />
              </SimpleGrid>
            </CardBody>
          </MotionCard>

          {/* Contact Information */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            shadow="md"
            borderRadius="xl"
            overflow="hidden"
          >
            <CardHeader bgGradient="linear(to-r, rgba(30, 58, 138, 0.05), rgba(245, 158, 11, 0.05))" py={3} px={5}>
              <HStack>
                <Icon as={Mail} color="brand.accent" boxSize={5} />
                <Heading size="sm" color="brand.primary">
                  {t('profile.accountInfo')}
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <InfoField
                  icon={Mail}
                  label={t('profile.email')}
                  value={profile.email}
                />
                <InfoField
                  icon={Phone}
                  label={t('profile.phoneNumber')}
                  value={profile.phoneNumber}
                />
              </SimpleGrid>
            </CardBody>
          </MotionCard>

          {/* Company Information */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            shadow="md"
            borderRadius="xl"
            overflow="hidden"
          >
            <CardHeader bgGradient="linear(to-r, rgba(30, 58, 138, 0.05), rgba(245, 158, 11, 0.05))" py={3} px={5}>
              <HStack>
                <Icon as={Briefcase} color="brand.accent" boxSize={5} />
                <Heading size="sm" color="brand.primary">
                  {t('profile.companyInfo')}
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody p={5}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <InfoField
                  icon={Building2}
                  label={t('profile.companyName')}
                  value={profile.companyName}
                />
                <InfoField
                  icon={MapPin}
                  label={t('profile.country')}
                  value={profile.country}
                />
                <InfoField
                  icon={Briefcase}
                  label={t('profile.commercialLicense')}
                  value={profile.commercialLicenseNumber}
                />
                <InfoField
                  icon={Globe}
                  label={t('profile.website')}
                  value={profile.website}
                />
              </SimpleGrid>
            </CardBody>
          </MotionCard>

          {/* Account Details */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            shadow="md"
            borderRadius="xl"
            overflow="hidden"
          >
            <CardBody p={5}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                <VStack align="start" spacing={1} p={3} bg="gray.50" borderRadius="lg">
                  <Text fontSize="xs" color="gray.500" fontWeight="600">
                    {t('profile.role')}
                  </Text>
                  <Badge colorScheme="blue" fontSize="sm">
                    {profile.role === 'Contractor' ? 'مقاول' : profile.role === 'Supplier' ? 'مورد' : profile.role}
                  </Badge>
                </VStack>
                <VStack align="start" spacing={1} p={3} bg="gray.50" borderRadius="lg">
                  <Text fontSize="xs" color="gray.500" fontWeight="600">
                    {t('profile.accountCreated')}
                  </Text>
                  <Text fontSize="xs" color="gray.900" fontWeight="500">
                    {formatDate(profile.createdAt)}
                  </Text>
                </VStack>
                <VStack align="start" spacing={1} p={3} bg="gray.50" borderRadius="lg">
                  <Text fontSize="xs" color="gray.500" fontWeight="600">
                    {t('profile.lastUpdated')}
                  </Text>
                  <Text fontSize="xs" color="gray.900" fontWeight="500">
                    {formatDate(profile.updatedAt)}
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </MotionCard>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;
