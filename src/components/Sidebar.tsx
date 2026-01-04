import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Image,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  group: string;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Admin navigation items
  const adminNavItems: NavItem[] = [
    { name: t('admin.dashboard.title'), path: '/admin/dashboard', icon: LayoutDashboard, group: 'main' },
    { name: t('admin.registrationRequests.title'), path: '/admin/registration-requests', icon: FileText, group: 'main' },
    { name: t('admin.users.title'), path: '/admin/users', icon: Users, group: 'main' },
    { name: t('admin.orders.title'), path: '/admin/orders', icon: Package, group: 'main' },
    { name: t('common.settings'), path: '/admin/settings', icon: Settings, group: 'other' },
  ];

  const navItems = adminNavItems;

  // Group items
  const groupedItems = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const glassEffect = {
    backdropFilter: 'blur(20px) saturate(180%)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRight: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
  };

  return (
    <Box
      w={isOpen ? '280px' : '80px'}
      h="100vh"
      position="relative"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      {...glassEffect}
      overflow="hidden"
    >
      {/* Header - Logo & Toggle */}
      <Box
        p={isOpen ? 6 : 4}
        borderBottom="1px solid"
        borderColor="rgba(0,0,0,0.06)"
        position="relative"
      >
        <HStack justify={isOpen ? 'space-between' : 'center'} spacing={isOpen ? 3 : 0}>
          {isOpen && (
            <HStack spacing={3} opacity={isOpen ? 1 : 0} transition="opacity 0.3s">
              <Image src="/logo.png" alt="دعم" h="36px" />
              <Text
                fontSize="2xl"
                fontWeight="800"
                bgGradient="linear(to-r, brand.primary, brand.accent)"
                bgClip="text"
                letterSpacing="-0.5px"
              >
                دعم Admin
              </Text>
            </HStack>
          )}
          
          <Box
            as="button"
            onClick={onToggle}
            w="40px"
            h="40px"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(30, 58, 138, 0.08)"
            color="brand.primary"
            cursor="pointer"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: 'brand.primary',
              color: 'white',
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
            }}
            _active={{
              transform: 'scale(0.95)',
            }}
          >
            <Icon as={isOpen ? ChevronRight : ChevronLeft} boxSize={5} />
          </Box>
        </HStack>
      </Box>

      {/* User Profile Section */}
      <Box
        p={isOpen ? 5 : 3}
        borderBottom="1px solid"
        borderColor="rgba(0,0,0,0.06)"
      >
        <Menu placement="left-start">
          <MenuButton w="full">
            <HStack
              spacing={3}
              p={isOpen ? 3 : 2}
              borderRadius="16px"
              cursor="pointer"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              position="relative"
              justify={isOpen ? 'start' : 'center'}
              _hover={{
                bg: 'rgba(30, 58, 138, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box position="relative">
                <Avatar
                  size={isOpen ? 'md' : 'sm'}
                  name="Admin"
                  bg="brand.primary"
                  border="3px solid"
                  borderColor="brand.primary"
                  boxShadow="0 0 20px rgba(30, 58, 138, 0.4)"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  right="0"
                  w="12px"
                  h="12px"
                  bg="green.400"
                  borderRadius="full"
                  border="2px solid white"
                  boxShadow="0 0 8px rgba(72, 187, 120, 0.6)"
                />
              </Box>

              {isOpen && (
                <VStack
                  align="start"
                  spacing={0.5}
                  flex="1"
                  opacity={isOpen ? 1 : 0}
                  transition="opacity 0.3s"
                >
                  <Text fontSize="sm" fontWeight="700" color="gray.800" noOfLines={1}>
                    {t('common.admin') || 'Admin'}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {t('common.platformName')}
                  </Text>
                  <Badge
                    mt={1}
                    colorScheme="purple"
                    fontSize="10px"
                    px={2}
                    py={0.5}
                    borderRadius="6px"
                    fontWeight="600"
                  >
                    {t('common.administrator') || 'Administrator'}
                  </Badge>
                </VStack>
              )}
            </HStack>
          </MenuButton>

          <MenuList
            borderRadius="16px"
            border="1px solid"
            borderColor="rgba(0,0,0,0.08)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
            p={2}
            minW="200px"
          >
            <MenuItem
              icon={<User size={16} />}
              borderRadius="10px"
              _hover={{ bg: 'rgba(30, 58, 138, 0.08)' }}
              fontWeight="500"
              onClick={() => navigate('/admin/profile')}
            >
              {t('profile.title')}
            </MenuItem>
            <MenuItem
              icon={<Settings size={16} />}
              borderRadius="10px"
              _hover={{ bg: 'rgba(30, 58, 138, 0.08)' }}
              fontWeight="500"
              onClick={() => navigate('/admin/settings')}
            >
              {t('common.settings')}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<LogOut size={16} />}
              borderRadius="10px"
              _hover={{ bg: 'rgba(220, 38, 38, 0.08)' }}
              color="red.500"
              fontWeight="600"
              onClick={() => logout()}
            >
              {t('common.logout') || 'Logout'}
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* Navigation Items */}
      <VStack
        spacing={1}
        align="stretch"
        p={isOpen ? 4 : 2}
        overflowY="auto"
        h="calc(100vh - 280px)"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '3px',
          },
        }}
      >
        {Object.entries(groupedItems).map(([group, items], groupIndex) => (
          <Box key={group}>
            {groupIndex > 0 && (
              <Box
                h="1px"
                bg="rgba(0,0,0,0.06)"
                my={3}
                mx={isOpen ? 3 : 1}
              />
            )}
            
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <Tooltip
                    label={item.name}
                    placement="left"
                    isDisabled={isOpen}
                    hasArrow
                    bg="gray.800"
                    color="white"
                    fontSize="sm"
                    px={3}
                    py={2}
                    borderRadius="8px"
                  >
                    <HStack
                      px={isOpen ? 4 : 3}
                      py={3}
                      borderRadius="14px"
                      position="relative"
                      overflow="hidden"
                      cursor="pointer"
                      justify={isOpen ? 'start' : 'center'}
                      spacing={isOpen ? 3 : 0}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                      bg={isActive 
                        ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(30, 58, 138, 0.08) 100%)'
                        : 'transparent'
                      }
                      color={isActive ? 'brand.primary' : 'gray.600'}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      transform={hoveredItem === item.path ? 'translateX(-4px) scale(1.02)' : 'translateX(0) scale(1)'}
                      _hover={{
                        bg: isActive
                          ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(30, 58, 138, 0.12) 100%)'
                          : 'rgba(0, 0, 0, 0.04)',
                        boxShadow: isActive 
                          ? '0 4px 16px rgba(30, 58, 138, 0.15)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.06)',
                      }}
                      boxShadow={isActive ? '0 2px 12px rgba(30, 58, 138, 0.12)' : 'none'}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <Box
                          position="absolute"
                          right="0"
                          top="0"
                          bottom="0"
                          w="4px"
                          bg="brand.primary"
                          borderTopLeftRadius="4px"
                          borderBottomLeftRadius="4px"
                          boxShadow="0 0 12px rgba(30, 58, 138, 0.6)"
                        />
                      )}

                      <Icon
                        as={item.icon}
                        boxSize={isOpen ? 5 : 6}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        transform={hoveredItem === item.path ? 'scale(1.15) rotate(5deg)' : 'scale(1) rotate(0deg)'}
                        filter={isActive ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' : 'none'}
                      />

                      {isOpen && (
                        <Text
                          fontSize="sm"
                          fontWeight={isActive ? '700' : '500'}
                          noOfLines={1}
                          opacity={isOpen ? 1 : 0}
                          transition="opacity 0.3s"
                        >
                          {item.name}
                        </Text>
                      )}
                    </HStack>
                  </Tooltip>
                )}
              </NavLink>
            ))}
          </Box>
        ))}
      </VStack>

      {/* Decorative gradient overlay at bottom */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="60px"
        bgGradient="linear(to-t, rgba(255,255,255,0.8), transparent)"
        pointerEvents="none"
      />
    </Box>
  );
};

export default Sidebar;
