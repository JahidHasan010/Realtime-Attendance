// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Card, 
//   Input, 
//   Button, 
//   List, 
//   Tag, 
//   Space, 
//   Avatar, 
//   Typography, 
//   Badge,
//   Alert,
//   Spin 
// } from 'antd';
// import { 
//   VideoCameraOutlined, 
//   FileTextOutlined, 
//   StopOutlined, 
//   PlayCircleOutlined,
//   UserOutlined,
//   SyncOutlined 
// } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import sessionAPI from '../api/sessions';
// import attendanceAPI from '../api/attendance';

// const { Title, Text } = Typography;

// const LiveSession = () => {
//   const [active, setActive] = useState(false);
//   const [subject, setSubject] = useState('');
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sessionLoading, setSessionLoading] = useState(true);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   // Check for active session on component mount
//   useEffect(() => {
//     checkActiveSession();
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);

//   const checkActiveSession = async () => {
//     try {
//       setSessionLoading(true);
//       const data = await sessionAPI.getActiveSession();
//       if (data.is_active && data.session) {
//         setActive(true);
//         setSubject(data.session.subject);
//       }
//     } catch (error) {
//       console.error('Error checking active session:', error);
//     } finally {
//       setSessionLoading(false);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { width: 640, height: 480 } 
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//       }
//     } catch (err) {
//       console.error("Camera access denied:", err);
//       Alert.error('Failed to access camera. Please check permissions.');
//     }
//   };

//   useEffect(() => {
//     if (active) {
//       startCamera();
//       const interval = setInterval(captureFrame, 3000);
//       return () => clearInterval(interval);
//     } else {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//         streamRef.current = null;
//       }
//     }
//   }, [active]);

//   const captureFrame = () => {
//     if (videoRef.current && canvasRef.current) {
//       const context = canvasRef.current.getContext('2d');
//       context.drawImage(videoRef.current, 0, 0, 640, 480);
//       const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
//       processFrame(imageData);
//     }
//   };

//   const processFrame = async (frameData) => {
//     try {
//       const result = await attendanceAPI.recognizeFace(frameData);
//       if (result.marked && result.marked.length > 0) {
//         const newLogs = result.marked.map(item => ({
//           ...item,
//           timestamp: new Date().toISOString(),
//           id: `${item.student_id}_${Date.now()}`
//         }));
//         setLogs(prev => [...newLogs, ...prev].slice(0, 10));
//       }
//     } catch (error) {
//       console.error('Error processing frame:', error);
//     }
//   };

//   const toggleSession = async () => {
//     setLoading(true);
//     try {
//       if (!active) {
//         await sessionAPI.startSession(subject);
//         setActive(true);
//       } else {
//         await sessionAPI.stopSession();
//         setActive(false);
//         setLogs([]);
//       }
//     } catch (error) {
//       Alert.error(error.response?.data?.detail || 'Failed to toggle session');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (sessionLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-6">
//       <Card 
//         title={
//           <span className="flex items-center">
//             <VideoCameraOutlined className="mr-2" />
//             Camera Feed
//           </span>
//         } 
//         className="flex-grow shadow-lg"
//         style={{ flex: 2 }}
//       >
//         <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
//           <video 
//             ref={videoRef} 
//             autoPlay 
//             playsInline 
//             muted 
//             className="w-full h-full object-cover"
//           />
//           <canvas ref={canvasRef} width="640" height="480" className="hidden" />
          
//           {!active && (
//             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center">
//               <VideoCameraOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
//               <Text className="text-white/80">
//                 Camera is ready. {!subject ? 'Enter subject and ' : ''}start session to begin attendance tracking.
//               </Text>
//             </div>
//           )}
          
//           {active && (
//             <div className="absolute top-4 right-4">
//               <Badge 
//                 status="processing" 
//                 text={
//                   <span className="text-white font-bold bg-red-600 px-3 py-1 rounded shadow">
//                     LIVE REC
//                   </span>
//                 } 
//               />
//             </div>
//           )}
//         </div>

//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <Space.Compact style={{ width: '100%' }}>
//             <Input
//               size="large"
//               placeholder="Enter Subject Code (e.g., CS101)"
//               value={subject}
//               onChange={e => setSubject(e.target.value)}
//               disabled={active}
//               prefix={<FileTextOutlined className="text-gray-400" />}
//             />
//             <Button
//               size="large"
//               type={active ? "primary" : "default"}
//               danger={active}
//               onClick={toggleSession}
//               loading={loading}
//               icon={active ? <StopOutlined /> : <PlayCircleOutlined />}
//               disabled={!subject && !active}
//             >
//               {active ? "Stop Session" : "Start Session"}
//             </Button>
//           </Space.Compact>
          
//           {active && (
//             <Alert
//               message="Session Active"
//               description={`Subject: ${subject} - Started at ${dayjs().format('HH:mm:ss')}`}
//               type="success"
//               showIcon
//               className="mt-4"
//             />
//           )}
//         </div>
//       </Card>

//       <Card
//         title={
//           <span className="flex items-center">
//             <SyncOutlined spin={active} className="mr-2" />
//             Recent Detections
//           </span>
//         }
//         className="shadow-lg"
//         style={{ flex: 1, minWidth: 300 }}
//       >
//         <List
//           locale={{ 
//             emptyText: active 
//               ? 'Waiting for student detection...' 
//               : 'No active session' 
//           }}
//           dataSource={logs}
//           renderItem={item => (
//             <List.Item className="border-b last:border-b-0 px-0 py-3">
//               <List.Item.Meta
//                 avatar={
//                   <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
//                 }
//                 title={<Text strong>{item.full_name}</Text>}
//                 description={
//                   <div className="flex flex-col">
//                     <Text type="secondary" size="small">
//                       ID: {item.student_id}
//                     </Text>
//                     <Text type="secondary" className="text-xs">
//                       {dayjs(item.timestamp || item.first_detected_at).format('HH:mm:ss A')}
//                     </Text>
//                   </div>
//                 }
//               />
//               <Tag color="green" className="m-0">PRESENT</Tag>
//             </List.Item>
//           )}
//         />
//       </Card>
//     </div>
//   );
// };

// export default LiveSession;




// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Card, 
//   Input, 
//   Button, 
//   List, 
//   Tag, 
//   Space, 
//   Avatar, 
//   Typography, 
//   Badge,
//   Alert,
//   Spin,
//   Select
// } from 'antd';
// import { 
//   VideoCameraOutlined, 
//   FileTextOutlined, 
//   StopOutlined, 
//   PlayCircleOutlined,
//   UserOutlined,
//   SyncOutlined 
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// import sessionAPI from '../api/sessions';
// import attendanceAPI from '../api/attendance';
// import adminAPI from '../api/admin';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const LiveSession = () => {
//   const [active, setActive] = useState(false);
//   const [subject, setSubject] = useState('');
//   const [subjectsList, setSubjectsList] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sessionLoading, setSessionLoading] = useState(true);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   // ------------------------------------
//   // INIT
//   // ------------------------------------
//   useEffect(() => {
//     fetchSubjects();
//     checkActiveSession();

//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);

//   // ------------------------------------
//   // FETCH SUBJECTS (SAME AS REPORTS)
//   // ------------------------------------
//   const fetchSubjects = async () => {
//     try {
//       const students = await adminAPI.getStudents();

//       const allSubjects = [
//         ...new Set(
//           students.flatMap(student => student.subjects || [])
//         )
//       ];

//       setSubjectsList(allSubjects);

//       if (!subject && allSubjects.length > 0) {
//         setSubject(allSubjects[0]);
//       }
//     } catch (err) {
//       console.error('Failed to fetch subjects', err);
//     }
//   };

//   // ------------------------------------
//   // CHECK ACTIVE SESSION
//   // ------------------------------------
//   const checkActiveSession = async () => {
//     try {
//       setSessionLoading(true);
//       const data = await sessionAPI.getActiveSession();

//       if (data?.is_active && data.session) {
//         setActive(true);
//         setSubject(data.session.subject);
//       }
//     } catch (error) {
//       console.error('Error checking active session:', error);
//     } finally {
//       setSessionLoading(false);
//     }
//   };

//   // ------------------------------------
//   // CAMERA
//   // ------------------------------------
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { width: 640, height: 480 } 
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//       }
//     } catch (err) {
//       console.error('Camera access denied:', err);
//     }
//   };

//   useEffect(() => {
//     if (active) {
//       startCamera();
//       const interval = setInterval(captureFrame, 3000);
//       return () => clearInterval(interval);
//     } else {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//         streamRef.current = null;
//       }
//     }
//   }, [active]);

//   // ------------------------------------
//   // FRAME CAPTURE
//   // ------------------------------------
//   const captureFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const ctx = canvasRef.current.getContext('2d');
//     ctx.drawImage(videoRef.current, 0, 0, 640, 480);

//     const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
//     processFrame(imageData);
//   };

//   // ------------------------------------
//   // FACE RECOGNITION
//   // ------------------------------------
//   const processFrame = async (frameData) => {
//     try {
//       const result = await attendanceAPI.recognizeFace(frameData);

//       if (result?.marked?.length) {
//         const newLogs = result.marked.map(item => ({
//           ...item,
//           timestamp: new Date().toISOString(),
//           id: `${item.student_id}_${Date.now()}`
//         }));

//         setLogs(prev => [...newLogs, ...prev].slice(0, 10));
//       }
//     } catch (error) {
//       console.error('Error processing frame:', error);
//     }
//   };

//   // ------------------------------------
//   // START / STOP SESSION
//   // ------------------------------------
//   const toggleSession = async () => {
//     if (!subject && !active) {
//       Alert.error('Please select a subject');
//       return;
//     }

//     setLoading(true);
//     try {
//       if (!active) {
//         await sessionAPI.startSession(subject);
//         setLogs([]);
//         setActive(true);
//       } else {
//         await sessionAPI.stopSession();
//         setActive(false);
//         setLogs([]);
//         setSubject('');
//       }
//     } catch (error) {
//       Alert.error(error.response?.data?.detail || 'Session error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (sessionLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-6">
//       {/* CAMERA */}
//       <Card title={<><VideoCameraOutlined /> Camera Feed</>} style={{ flex: 2 }}>
//         <div className="relative bg-black aspect-video rounded overflow-hidden">
//           <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
//           <canvas ref={canvasRef} width="640" height="480" className="hidden" />

//           {!active && (
//             <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60">
//               <Text className="text-white">
//                 Select subject and start session
//               </Text>
//             </div>
//           )}

//           {active && (
//             <div className="absolute top-4 right-4">
//               <Badge status="processing" text="LIVE" />
//             </div>
//           )}
//         </div>

//         <div className="mt-4">
//           <Space.Compact style={{ width: '100%' }}>
//             {!active ? (
//               <Select
//                 size="large"
//                 value={subject}
//                 onChange={setSubject}
//                 style={{ width: '100%' }}
//                 showSearch
//               >
//                 {subjectsList.map(subj => (
//                   <Option key={subj} value={subj}>
//                     {subj}
//                   </Option>
//                 ))}
//               </Select>
//             ) : (
//               <Input size="large" value={subject} disabled />
//             )}

//             <Button
//               size="large"
//               danger={active}
//               loading={loading}
//               icon={active ? <StopOutlined /> : <PlayCircleOutlined />}
//               onClick={toggleSession}
//             >
//               {active ? 'Stop Session' : 'Start Session'}
//             </Button>
//           </Space.Compact>
//         </div>
//       </Card>

//       {/* LOGS */}
//       <Card title={<><SyncOutlined spin={active} /> Recent Detections</>} style={{ flex: 1 }}>
//         <List
//           dataSource={logs}
//           locale={{ emptyText: active ? 'Waiting for detection...' : 'No active session' }}
//           renderItem={item => (
//             <List.Item>
//               <List.Item.Meta
//                 avatar={<Avatar icon={<UserOutlined />} />}
//                 title={item.full_name}
//                 description={dayjs(item.timestamp).format('HH:mm:ss')}
//               />
//               <Tag color="green">PRESENT</Tag>
//             </List.Item>
//           )}
//         />
//       </Card>
//     </div>
//   );
// };

// export default LiveSession;





// it working perfectly below code


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Card, 
//   Input, 
//   Button, 
//   List, 
//   Tag, 
//   Space, 
//   Avatar, 
//   Typography, 
//   Badge,
//   Spin,
//   Select,
//   message
// } from 'antd';
// import { 
//   VideoCameraOutlined, 
//   FileTextOutlined, 
//   StopOutlined, 
//   PlayCircleOutlined,
//   UserOutlined,
//   SyncOutlined 
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// import sessionAPI from '../api/sessions';
// import attendanceAPI from '../api/attendance';
// import adminAPI from '../api/admin';

// const { Text } = Typography;
// const { Option } = Select;

// const LiveSession = () => {
//   const [active, setActive] = useState(false);
//   const [subject, setSubject] = useState('');
//   const [subjects, setSubjects] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sessionLoading, setSessionLoading] = useState(true);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const intervalRef = useRef(null);

//   // ----------------------------------
//   // FETCH SUBJECTS (SAME AS REPORTS)
//   // ----------------------------------
//   useEffect(() => {
//     fetchSubjects();
//     checkActiveSession();

//     return () => {
//       stopCamera();
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       const students = await adminAPI.getStudents();

//       const uniqueSubjects = [
//         ...new Set(
//           students.flatMap(s => s.subjects || [])
//         )
//       ];

//       setSubjects(uniqueSubjects);
//     } catch (err) {
//       console.error('Failed to fetch subjects', err);
//       message.error('Failed to load subjects');
//     }
//   };

//   // ----------------------------------
//   // CHECK ACTIVE SESSION
//   // ----------------------------------
//   const checkActiveSession = async () => {
//     try {
//       setSessionLoading(true);
//       const data = await sessionAPI.getActiveSession();

//       if (data?.is_active && data.session) {
//         setActive(true);
//         setSubject(data.session.subject);
//       }
//     } catch (err) {
//       console.error('Active session check failed', err);
//     } finally {
//       setSessionLoading(false);
//     }
//   };

//   // ----------------------------------
//   // CAMERA CONTROL
//   // ----------------------------------
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480 }
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//       }
//     } catch {
//       message.error('Camera access denied');
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(t => t.stop());
//       streamRef.current = null;
//     }
//   };

//   useEffect(() => {
//     if (active) {
//       startCamera();

//       intervalRef.current = setInterval(() => {
//         captureFrame();
//       }, 3000);
//     } else {
//       stopCamera();
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     }
//   }, [active]);

//   // ----------------------------------
//   // FRAME CAPTURE
//   // ----------------------------------
//   const captureFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const ctx = canvasRef.current.getContext('2d');
//     ctx.drawImage(videoRef.current, 0, 0, 640, 480);

//     const image = canvasRef.current.toDataURL('image/jpeg', 0.8);
//     processFrame(image);
//   };

//   const processFrame = async (frame) => {
//     try {
//       const res = await attendanceAPI.recognizeFace(frame);

//       if (res?.marked?.length) {
//         const newLogs = res.marked.map(item => ({
//           ...item,
//           id: `${item.student_id}_${Date.now()}`,
//           timestamp: new Date().toISOString()
//         }));

//         setLogs(prev => [...newLogs, ...prev].slice(0, 10));
//       }
//     } catch (err) {
//       console.error('Frame processing failed', err);
//     }
//   };

//   // ----------------------------------
//   // SESSION CONTROL (UNCHANGED)
//   // ----------------------------------
//   const toggleSession = async () => {
//     if (!active && !subject) {
//       message.error('Please select subject');
//       return;
//     }

//     setLoading(true);
//     try {
//       if (!active) {
//         await sessionAPI.startSession(subject);
//         setLogs([]);
//         setActive(true);
//       } else {
//         await sessionAPI.stopSession();
//         setActive(false);
//         setLogs([]);
//         setSubject('');
//       }
//     } catch (err) {
//       message.error(err.response?.data?.detail || 'Session error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (sessionLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-6">
//       {/* CAMERA */}
//       <Card title={<><VideoCameraOutlined /> Camera Feed</>} style={{ flex: 2 }}>
//         <div className="relative bg-black aspect-video rounded overflow-hidden">
//           <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
//           <canvas ref={canvasRef} width="640" height="480" className="hidden" />

//           {!active && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
//               <Text className="text-white">Select subject and start session</Text>
//             </div>
//           )}

//           {active && (
//             <div className="absolute top-4 right-4">
//               <Badge status="processing" text="LIVE" />
//             </div>
//           )}
//         </div>

//         {/* SUBJECT SELECT */}
//         <div className="mt-4">
//           <Space.Compact style={{ width: '100%' }}>
//             {!active ? (
//               <Select
//                 size="large"
//                 placeholder="Select Subject"
//                 value={subject || undefined}
//                 onChange={setSubject}
//                 showSearch
//                 optionFilterProp="children"
//                 style={{ width: '100%' }}
//               >
//                 {subjects.map(sub => (
//                   <Option key={sub} value={sub}>
//                     {sub}
//                   </Option>
//                 ))}
//               </Select>
//             ) : (
//               <Input
//                 size="large"
//                 value={subject}
//                 disabled
//                 prefix={<FileTextOutlined />}
//               />
//             )}

//             <Button
//               size="large"
//               danger={active}
//               loading={loading}
//               icon={active ? <StopOutlined /> : <PlayCircleOutlined />}
//               onClick={toggleSession}
//             >
//               {active ? 'Stop Session' : 'Start Session'}
//             </Button>
//           </Space.Compact>
//         </div>
//       </Card>

//       {/* LOGS */}
//       <Card title={<><SyncOutlined spin={active} /> Recent Detections</>} style={{ flex: 1 }}>
//         <List
//           dataSource={logs}
//           locale={{ emptyText: active ? 'Waiting for detection...' : 'No active session' }}
//           renderItem={item => (
//             <List.Item>
//               <List.Item.Meta
//                 avatar={<Avatar icon={<UserOutlined />} />}
//                 title={item.full_name}
//                 description={dayjs(item.timestamp).format('HH:mm:ss')}
//               />
//               <Tag color="green">PRESENT</Tag>
//             </List.Item>
//           )}
//         />
//       </Card>
//     </div>
//   );
// };

// export default LiveSession;





// correct time zone dtected below code 


import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  List,
  Tag,
  Space,
  Avatar,
  Typography,
  Badge,
  Spin,
  Select,
  message,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  VideoCameraOutlined,
  FileTextOutlined,
  StopOutlined,
  PlayCircleOutlined,
  UserOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import sessionAPI from '../api/sessions';
import attendanceAPI from '../api/attendance';
import adminAPI from '../api/admin';
import reportsAPI from '../api/reports';

const { Text, Title } = Typography;
const { Option } = Select;

const LiveSession = () => {
  const [active, setActive] = useState(false);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  // ----------------------------------
  // FETCH SUBJECTS + CHECK SESSION
  // ----------------------------------
  useEffect(() => {
    fetchSubjects();
    checkActiveSession();

    return () => {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchSubjects = async () => {
    try {
      const students = await adminAPI.getStudents();
      const uniqueSubjects = [
        ...new Set(students.flatMap(s => s.subjects || [])),
      ];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error(err);
      message.error('Failed to load subjects');
    }
  };

  // ----------------------------------
  // CHECK ACTIVE SESSION + FETCH INITIAL LOGS
  // ----------------------------------
  const checkActiveSession = async () => {
    try {
      setSessionLoading(true);
      const data = await sessionAPI.getActiveSession();

      if (data?.is_active && data.session) {
        setActive(true);
        setSubject(data.session.subject);
        setSessionStartedAt(data.session.start_time);
        
        // Fetch existing attendance for this subject/session
        await fetchInitialLogs(data.session.subject);
      }
    } catch (err) {
      console.error('Active session check failed', err);
    } finally {
      setSessionLoading(false);
    }
  };

  const fetchInitialLogs = async (subjectToFetch) => {
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

      // Fetch both days due to Malaysia (UTC+8) offset
      const [todayLogs, yesterdayLogs] = await Promise.all([
        reportsAPI.getAttendanceReport(subjectToFetch, today),
        reportsAPI.getAttendanceReport(subjectToFetch, yesterday)
      ]);

      const allRecords = [
        ...(Array.isArray(todayLogs) ? todayLogs : []),
        ...(Array.isArray(yesterdayLogs) ? yesterdayLogs : [])
      ];

      // Filter for records that happened TODAY in Malaysia time for THIS subject
      const filteredLogs = allRecords
        .filter(record => 
          dayjs.utc(record.first_detected_at).local().format('YYYY-MM-DD') === today
        )
        .map(record => ({
          ...record,
          id: `${record.student_id}_${new Date(record.first_detected_at).getTime()}`,
          timestamp: record.first_detected_at
        }))
        // Sort by time descending
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 20);

      setLogs(filteredLogs);
      setDetectionCount(filteredLogs.length);
    } catch (err) {
      console.error('Failed to fetch initial logs', err);
    }
  };

  // ----------------------------------
  // CAMERA CONTROL
  // ----------------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch {
      message.error('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (active) {
      startCamera();
      intervalRef.current = setInterval(captureFrame, 3000);
    } else {
      stopCamera();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [active]);

  // ----------------------------------
  // FRAME CAPTURE
  // ----------------------------------
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    const image = canvasRef.current.toDataURL('image/jpeg', 0.8);
    processFrame(image);
  };

  const processFrame = async frame => {
    try {
      const res = await attendanceAPI.recognizeFace(frame);

      if (res?.marked?.length) {
        const newLogs = res.marked.map(item => ({
          ...item,
          id: `${item.student_id}_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }));

        setLogs(prev => [...newLogs, ...prev].slice(0, 20));
        setDetectionCount(prev => prev + res.marked.length);
      }
    } catch (err) {
      console.error('Frame processing failed', err);
    }
  };

  // ----------------------------------
  // START / STOP SESSION
  // ----------------------------------
  const toggleSession = async () => {
    if (!active && !subject) {
      message.error('Please select subject');
      return;
    }

    setLoading(true);
    try {
      if (!active) {
        const res = await sessionAPI.startSession(subject);
        setLogs([]);
        setDetectionCount(0);
        setActive(true);
        setSessionStartedAt(res?.start_time || new Date().toISOString());

        // Fetch logs that were recorded earlier today for this subject (if any)
        await fetchInitialLogs(subject);
      } else {
        await sessionAPI.stopSession();
        setActive(false);
        setLogs([]);
        setSubject('');
        setSessionStartedAt(null);
        setDetectionCount(0);
      }
    } catch (err) {
      message.error(err.response?.data?.detail || 'Session error');
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Initializing AI Camera..." />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      <Row gutter={[24, 24]}>
        {/* CAMERA FEED */}
        <Col xs={24} lg={16}>
          <Card 
            className="shadow-md border-0 overflow-hidden"
            title={
              <Space>
                <VideoCameraOutlined className="text-blue-600" />
                <span>Live AI Recognition Feed</span>
              </Space>
            }
            extra={
              active && (
                <Badge status="processing" color="red" text={<Text strong className="text-red-600">LIVE</Text>} />
              )
            }
          >
            <div className="relative bg-slate-900 aspect-video rounded-xl overflow-hidden shadow-inner border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} width="640" height="480" className="hidden" />

              {!active && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white backdrop-blur-sm">
                  <div className="p-6 bg-white/10 rounded-full mb-4">
                    <VideoCameraOutlined style={{ fontSize: '48px', opacity: 0.8 }} />
                  </div>
                  <Title level={4} style={{ color: 'white' }} className="mb-2">Camera System Standby</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Select a subject and click 'Start Session' to begin tracking</Text>
                </div>
              )}

              {active && (
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded text-white text-xs border border-white/20">
                  <SyncOutlined spin className="mr-2" />
                  AI Model: Lincoln-v1.2.0 • Scanning for students...
                </div>
              )}
            </div>

            {/* CONTROL PANEL */}
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Row gutter={16} align="middle">
                <Col flex="auto">
                  {!active ? (
                    <Select
                      size="large"
                      placeholder="Select Subject for Attendance"
                      value={subject || undefined}
                      onChange={setSubject}
                      showSearch
                      style={{ width: '100%' }}
                      className="shadow-sm rounded-lg overflow-hidden"
                    >
                      {subjects.map(sub => (
                        <Option key={sub} value={sub}>
                          {sub}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileTextOutlined className="text-xl text-blue-600" />
                      </div>
                      <div>
                        <Text type="secondary" className="block text-xs uppercase font-bold tracking-wider">Currently Tracking</Text>
                        <Title level={4} className="m-0">{subject}</Title>
                      </div>
                    </div>
                  )}
                </Col>
                <Col>
                  <Button
                    size="large"
                    type={active ? "default" : "primary"}
                    danger={active}
                    loading={loading}
                    icon={active ? <StopOutlined /> : <PlayCircleOutlined />}
                    onClick={toggleSession}
                    className={`h-12 px-8 font-bold rounded-lg shadow-sm ${!active ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    {active ? 'END SESSION' : 'START SESSION'}
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>

          {active && (
            <Card className="mt-6 shadow-sm border-0 bg-blue-50">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic 
                    title="Started At" 
                    value={dayjs.utc(sessionStartedAt).local().format('hh:mm A')} 
                    prefix={<ClockCircleOutlined className="text-blue-400" />}
                    valueStyle={{ fontSize: '1.25rem', fontWeight: 600 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Total Detections" 
                    value={detectionCount} 
                    prefix={<UserOutlined className="text-blue-400" />}
                    valueStyle={{ fontSize: '1.25rem', fontWeight: 600 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="System Status" 
                    value="SECURE" 
                    prefix={<SafetyCertificateOutlined className="text-green-500" />}
                    valueStyle={{ fontSize: '1.25rem', fontWeight: 600, color: '#16a34a' }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </Col>

        {/* RECENT DETECTIONS */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <HistoryOutlined className="text-gray-500" />
                <span>Recent Detections</span>
              </Space>
            }
            className="shadow-md border-0 h-full"
            bodyStyle={{ padding: '0 24px' }}
          >
            <List
              dataSource={logs}
              locale={{
                emptyText: (
                  <div className="py-12 text-center">
                    <SyncOutlined spin={active} style={{ fontSize: 24, marginBottom: 16 }} className="text-gray-300" />
                    <br />
                    <Text type="secondary">
                      {active ? 'Waiting for face detection...' : 'Start a session to track students'}
                    </Text>
                  </div>
                ),
              }}
              renderItem={item => (
                <List.Item className="px-0 py-4 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-100">
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.full_name}&backgroundColor=1d4ed8`}
                        className="shadow-sm"
                      />
                    }
                    title={<Text strong className="text-blue-700">{item.full_name}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary" className="text-xs">ID: {item.student_id}</Text>
                        <Text type="secondary" style={{ fontSize: '10px' }}>
                          Detected at {dayjs.utc(item.timestamp).local().format('HH:mm:ss A')}
                        </Text>
                      </Space>
                    }
                  />
                  <Tag color="green" className="m-0 border-0 bg-green-100 text-green-700 font-bold">PRESENT</Tag>
                </List.Item>
              )}
              style={{ maxHeight: '600px', overflowY: 'auto' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LiveSession;

