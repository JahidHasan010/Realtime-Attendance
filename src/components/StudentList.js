import React, { useState, useEffect } from 'react';
import { Table, Tag, Avatar, Space, Typography, Spin, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import adminAPI from '../api/admin';

const { Title } = Typography;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch student list');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div className="font-bold">{record.full_name}</div>
            <div className="text-xs text-gray-400">{record.student_id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      key: 'faculty',
    },
    {
      title: 'Enrolled Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => (
        <div className="flex flex-wrap gap-1">
          {subjects?.map((subject) => (
            <Tag key={subject} color="blue">
              {subject}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Student Registry</Title>
      
      {error && (
        <Card className="mb-6">
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      <Table
        loading={loading}
        dataSource={students}
        columns={columns}
        rowKey="student_id"
        className="shadow-sm"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default StudentList;