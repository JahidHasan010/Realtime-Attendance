import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Spin, 
  Alert, 
  Button, 
  Badge, 
  Divider, 
  Space,
  Avatar,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  VideoCameraOutlined,
  FileTextOutlined,
  TeamOutlined,
  BellOutlined,
  ArrowRightOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import adminAPI from '../api/admin';
import sessionAPI from '../api/sessions';
import { authAPI } from '../api/auth';

dayjs.extend(utc);

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(dayjs());
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, sessionData] = await Promise.all([
        adminAPI.getStats(),
        sessionAPI.getActiveSession()
      ]);
      
      setStats(statsData);
      setActiveSession(sessionData.is_active ? sessionData.session : null);
    } catch (err) {
      setError('System could not retrieve real-time data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Spin size="large" />
        <Text type="secondary" className="mt-4">Loading Lincoln Presence™ Intelligence...</Text>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="mb-1">Welcome back, {authAPI.getCurrentUser()}!</Title>
          <Text type="secondary">
            <ClockCircleOutlined className="mr-2" />
            {currentTime.format('dddd, MMMM D, YYYY • hh:mm:ss A')}
          </Text>
        </div>
        <div className="flex gap-2">
          <Button 
            icon={<SyncOutlined spin={loading} />} 
            onClick={fetchData}
            className="flex items-center"
          >
            Refresh
          </Button>
          <Badge dot offset={[-2, 2]}>
            <Button icon={<BellOutlined />} shape="circle" />
          </Badge>
        </div>
      </div>
      
      {error && (
        <Alert 
          message="Connection Issue" 
          description={error} 
          type="error" 
          showIcon 
          closable 
          className="mb-8 rounded-lg shadow-sm border-red-100" 
        />
      )}

      {/* KPI Row */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500 overflow-hidden">
            <div className="flex items-center">
              <div className="p-4 bg-blue-50 rounded-xl mr-4">
                <TeamOutlined className="text-2xl text-blue-500" />
              </div>
              <Statistic
                title={<Text strong type="secondary">TOTAL STUDENTS</Text>}
                value={stats?.total_students || 0}
                valueStyle={{ color: '#1d4ed8', fontWeight: 700 }}
              />
            </div>
            <div className="mt-4 pt-4 border-t text-xs text-gray-400">
              <ArrowRightOutlined className="mr-1" />
              Manage all registered students in registry
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className={`shadow-sm hover:shadow-md transition-all border-l-4 overflow-hidden ${activeSession ? 'border-green-500' : 'border-gray-300'}`}>
            <div className="flex items-center">
              <div className={`p-4 rounded-xl mr-4 ${activeSession ? 'bg-green-50' : 'bg-gray-50'}`}>
                <VideoCameraOutlined className={`text-2xl ${activeSession ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <Statistic
                title={<Text strong type="secondary">SESSION STATUS</Text>}
                value={activeSession ? 'ACTIVE' : 'IDLE'}
                valueStyle={{ color: activeSession ? '#15803d' : '#6b7280', fontWeight: 700 }}
              />
            </div>
            <div className="mt-4 pt-4 border-t text-xs">
              {activeSession ? (
                <Badge status="processing" color="green" text={<Text type="success">Live tracking {activeSession.subject}</Text>} />
              ) : (
                <Text type="secondary italic">System ready to start session</Text>
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-all border-l-4 border-indigo-500 overflow-hidden">
            <div className="flex items-center">
              <div className="p-4 bg-indigo-50 rounded-xl mr-4">
                <CheckCircleOutlined className="text-2xl text-indigo-500" />
              </div>
              <Statistic
                title={<Text strong type="secondary">SYSTEM HEALTH</Text>}
                value="OPTIMIZED"
                valueStyle={{ color: '#4338ca', fontWeight: 700 }}
              />
            </div>
            <div className="mt-4 pt-4 border-t text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Badge status="success" /> Recognition Engine: Online
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Main Content Area */}
        <Col xs={24} lg={16}>
          {activeSession ? (
            <Card 
              title={
                <Space>
                  <Badge status="processing" color="red" />
                  <span>Live Session Monitor</span>
                </Space>
              }
              extra={<Button type="link" onClick={() => navigate('/live')}>Open Monitor</Button>}
              className="shadow-md mb-8 border-t-2 border-red-500"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Subject Code</Text>
                  <Paragraph className="text-xl font-bold mt-1 text-blue-600">
                    {activeSession.subject}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Commenced At</Text>
                  <Paragraph className="text-lg mt-1 font-medium">
                    {dayjs.utc(activeSession.start_time).local().format('hh:mm:ss A')}
                  </Paragraph>
                </Col>
              </Row>
              <Divider className="my-4" />
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <SyncOutlined spin className="text-blue-600" />
                </div>
                <div>
                  <Text strong>AI Recognition in Progress</Text>
                  <br />
                  <Text type="secondary" size="small">
                    Capturing frames every 3 seconds. Attendance logs are being updated in real-time.
                  </Text>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="shadow-sm mb-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
              <div className="py-6 px-4">
                <Title level={3} style={{ color: 'white' }} className="mb-4">Begin Your Session</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)' }} className="text-lg mb-6">
                  Ready to track attendance? Launch the Lincoln Presence™ AI engine and start capturing student presence automatically.
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<VideoCameraOutlined />} 
                  className="bg-white text-blue-700 border-0 hover:bg-gray-100 h-auto py-3 px-8 font-bold"
                  onClick={() => navigate('/live')}
                >
                  START LIVE SESSION
                </Button>
              </div>
            </Card>
          )}

          <Card title="Recent Insights & Guidelines" className="shadow-sm">
            <Row gutter={[32, 32]}>
              <Col span={24} md={12}>
                <Title level={5}><FileTextOutlined className="mr-2" /> Documentation</Title>
                <Paragraph type="secondary">
                  The system uses Lincoln's specialized facial recognition model. Ensure your workspace has:
                </Paragraph>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                  <li>Adequate frontal lighting for students</li>
                  <li>Stable internet connection for API calls</li>
                  <li>High-resolution (720p+) camera feed</li>
                </ul>
              </Col>
              <Col span={24} md={12}>
                <Title level={5}><TeamOutlined className="mr-2" /> Data Management</Title>
                <Paragraph type="secondary" className="text-sm">
                  Daily reports are automatically archived at midnight. You can export PDF versions for University administration at any time via the Reports module.
                </Paragraph>
                <Button type="link" className="p-0" onClick={() => navigate('/reports')}>
                  View archive <ArrowRightOutlined />
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Quick Actions Column */}
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" className="shadow-sm mb-6">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button 
                block 
                size="large" 
                icon={<VideoCameraOutlined className="text-green-500" />} 
                className="text-left flex items-center h-14"
                onClick={() => navigate('/live')}
              >
                Launch AI Camera
              </Button>
              <Button 
                block 
                size="large" 
                icon={<TeamOutlined className="text-blue-500" />} 
                className="text-left flex items-center h-14"
                onClick={() => navigate('/students')}
              >
                Manage Students
              </Button>
              <Button 
                block 
                size="large" 
                icon={<FileTextOutlined className="text-orange-500" />} 
                className="text-left flex items-center h-14"
                onClick={() => navigate('/reports')}
              >
                Generate Reports
              </Button>
            </Space>
          </Card>

          <Card className="shadow-sm bg-gray-50 border-dashed">
            <div className="text-center py-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-blue-600 mb-4" />
              <Title level={5} className="mb-1">{authAPI.getCurrentUser()}</Title>
              <Text type="secondary" className="block mb-4">System Administrator</Text>
              <Divider className="my-3" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Last Login:</span>
                <span>Today, {currentTime.subtract(2, 'hour').format('hh:mm A')}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <footer className="text-center mt-12 mb-6 text-gray-400 text-xs">
        <Divider />
        <Text type="secondary" style={{ fontSize: '11px' }}>
          Lincoln Presence™ Intelligence Engine v1.2.0 • Secure Administration Portal
          <br />
          ©{new Date().getFullYear()} Lincoln University College, Malaysia. All Rights Reserved.
        </Text>
      </footer>
    </div>
  );
};

export default Dashboard;