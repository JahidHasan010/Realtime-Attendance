import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, ConfigProvider, Avatar, Badge, Typography, Space, Dropdown, Button, Divider } from 'antd';
import {
  DashboardOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LiveSession from './components/LiveSession';
import StudentList from './components/StudentList';
import Reports from './components/Reports';
import { authAPI } from './api/auth';

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/live',
      icon: <VideoCameraOutlined />,
      label: 'Live Session',
    },
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: 'Student Registry',
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'Attendance Reports',
    },
  ];

  const handleLogout = () => {
    authAPI.logout();
    window.location.reload();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const currentPage = menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={260}
        className="shadow-2xl z-10"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          transition: 'all 0.2s',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black">LP</span>
            </div>
            {!collapsed && (
              <Title level={4} style={{ color: 'white', margin: 0, fontSize: '16px' }}>
                Lincoln Presence™
              </Title>
            )}
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="flex-grow px-2"
            style={{ borderRight: 0 }}
          />
          
          {!collapsed && (
            <div className="p-4 m-4 bg-gray-800/50 rounded-xl">
              <Text className="text-gray-400 text-xs block mb-1">System Version</Text>
              <Text className="text-white text-xs font-bold">v1.2.0-stable</Text>
            </div>
          )}
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s', background: '#f8fafc' }}>
        <Header
          style={{
            padding: '0 32px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex items-center">
            <Text strong className="text-xl tracking-tight">
              {currentPage}
            </Text>
          </div>

          <Space size="large">
            <Badge count={2} size="small" offset={[-2, 2]}>
              <Button type="text" icon={<BellOutlined className="text-lg text-gray-500" />} />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                <Avatar
                  shape="circle"
                  style={{ backgroundColor: '#1d4ed8' }}
                  icon={<UserOutlined />}
                />
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <Text strong className="text-sm">{authAPI.getCurrentUser()}</Text>
                  <Text type="secondary" style={{ fontSize: '10px' }}>Administrator</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px', minHeight: 280 }}>
          <div
            style={{
              padding: 0,
              minHeight: 'calc(100vh - 180px)',
            }}
          >
            {children}
          </div>
        </Content>

        <footer className="text-center py-6 text-gray-400 text-xs bg-white border-t">
          <Space split={<Divider type="vertical" />}>
            <span>Lincoln Presence™ v1.2.0</span>
            <span>Lincoln University College, Malaysia</span>
            <span>Support: support@lincoln.edu.my</span>
          </Space>
        </footer>
      </Layout>
    </Layout>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1d4ed8', // A deeper, more professional blue
          borderRadius: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            bodyBg: '#f8fafc',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#1d4ed8',
            itemSelectedColor: '#ffffff',
          }
        },
      }}
    >
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <AppLayout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<LiveSession />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      )}
    </ConfigProvider>
  );
};

export default App;