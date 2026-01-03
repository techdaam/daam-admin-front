import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { LogOut, Settings, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <Flex h="100vh" bg="gray.50" overflow="hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Top Navigation Bar */}
        <Box
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          px={6}
          py={4}
          shadow="sm"
        >
          <Flex justify="space-between" align="center">
            {/* Left: Welcome */}
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Welcome, Admin
              </Text>
              <Text fontSize="sm" color="gray.600">
                DANAAM Admin Panel
              </Text>
            </VStack>

            {/* Right: User Menu */}
            <Menu>
              <MenuButton>
                <HStack spacing={3} cursor="pointer">
                  <VStack align="end" spacing={0}>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                      Admin
                    </Text>
                    <Badge colorScheme="purple" fontSize="xs">
                      Administrator
                    </Badge>
                  </VStack>
                  <Avatar
                    size="md"
                    name="Admin"
                    bg="brand.primary"
                  />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<User size={16} />} onClick={() => navigate('/admin/profile')}>
                  Profile
                </MenuItem>
                <MenuItem icon={<Settings size={16} />} onClick={() => navigate('/admin/settings')}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<LogOut size={16} />} onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>

        {/* Main Content */}
        <Box flex="1" overflow="auto" p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
