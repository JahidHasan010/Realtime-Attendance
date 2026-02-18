
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Button,
//   Table,
//   Tag,
//   DatePicker,
//   Typography,
//   Select,
//   Space,
//   Alert,
//   message,
// } from 'antd';
// import { SyncOutlined, DownloadOutlined } from '@ant-design/icons';

// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// dayjs.extend(utc);

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// import reportsAPI from '../api/reports';
// import adminAPI from '../api/admin';

// const { Title } = Typography;
// const { Option } = Select;

// const Reports = () => {
//   const [data, setData] = useState([]);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [fetchingSubjects, setFetchingSubjects] = useState(false);

//   // --------------------------------
//   // Fetch Subjects (SAFE)
//   // --------------------------------
//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       setFetchingSubjects(true);

//       const students = await adminAPI.getStudents() || [];

//       const uniqueSubjects = [
//         ...new Set(students.flatMap(s => s.subjects || [])),
//       ];

//       setSubjects(uniqueSubjects);
//     } catch (error) {
//       console.error(error);
//       message.error('Failed to load subjects');
//     } finally {
//       setFetchingSubjects(false);
//     }
//   };

//   // --------------------------------
//   // Generate Attendance Report (PRODUCTION SAFE)
//   // --------------------------------
//   const fetchReport = async () => {
//     if (!subject) {
//       message.warning('Please select a subject');
//       return;
//     }

//     // 🔒 SNAPSHOT STATE (prevents stale React state bug)
//     const selectedSubject = subject;
//     const selectedDate = date;

//     setLoading(true);

//     try {
//       // Parallel fetch
//       const [studentsResponse, presentRecordsResponse] = await Promise.all([
//         adminAPI.getStudents(),
//         reportsAPI.getAttendanceReport(selectedSubject, selectedDate),
//       ]);

//       const students = studentsResponse || [];
//       const presentRecords = Array.isArray(presentRecordsResponse)
//         ? presentRecordsResponse
//         : [];

//       // Filter subject students
//       const subjectStudents = students.filter(student =>
//         (student.subjects || []).includes(selectedSubject)
//       );

//       // Build present lookup map (string-safe)
//       const presentMap = {};
//       presentRecords.forEach(record => {
//         if (record && record.student_id !== undefined) {
//           presentMap[String(record.student_id)] = record;
//         }
//       });

//       // Merge PRESENT / ABSENT
//       const mergedReport = subjectStudents.map(student => {
//         const present = presentMap[String(student.student_id)];

//         return {
//           student_id: student.student_id,
//           full_name: student.full_name,
//           status: present ? 'PRESENT' : 'ABSENT',
//           first_detected_at: present?.first_detected_at || null,
//         };
//       });

//       setData(mergedReport);

//       if (mergedReport.length === 0) {
//         message.info('No students enrolled in this subject');
//       } else {
//         message.success(`Report generated (${mergedReport.length} students)`);
//       }

//     } catch (error) {
//       console.error(error);
//       message.error('Failed to generate attendance report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------
//   // Export PDF (Stable)
//   // --------------------------------
//   const exportToPDF = () => {
//     if (data.length === 0) {
//       message.warning('No data to export');
//       return;
//     }

//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text('Lincoln University College, Malaysia', 105, 15, { align: 'center' });

//     doc.setFontSize(11);
//     doc.text(`Subject : ${subject}`, 14, 30);
//     doc.text(`Date : ${date}`, 150, 30);

//     autoTable(doc, {
//       startY: 40,
//       theme: 'grid',
//       head: [['Student Name', 'Student ID', 'Detected At', 'Status']],
//       body: data.map(item => [
//         item.full_name,
//         item.student_id,
//         item.first_detected_at
//           ? dayjs.utc(item.first_detected_at).local().format('HH:mm:ss')
//           : '—',
//         item.status,
//       ]),
//       headStyles: { fillColor: [22, 119, 255], textColor: 255 },
//       styles: { fontSize: 10 },
//     });

//     const pageHeight = doc.internal.pageSize.height;

//     doc.line(14, pageHeight - 20, 65, pageHeight - 20);
//     doc.text('Instructor Signature', 14, pageHeight - 14);

//     doc.setFontSize(9);
//     doc.text(
//       'Generated by Lincoln Attendance Management System',
//       105,
//       pageHeight - 5,
//       { align: 'center' }
//     );

//     doc.save(`attendance_${subject}_${date}.pdf`);
//   };

//   // --------------------------------
//   // Table Columns
//   // --------------------------------
//   const columns = [
//     { title: 'Student ID', dataIndex: 'student_id', width: 120 },
//     { title: 'Student Name', dataIndex: 'full_name' },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: status => (
//         <Tag color={status === 'PRESENT' ? 'green' : 'red'}>
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Detected At',
//       dataIndex: 'first_detected_at',
//       render: value =>
//         value ? dayjs.utc(value).local().format('HH:mm:ss') : '—',
//     },
//   ];

//   // --------------------------------
//   // UI
//   // --------------------------------
//   return (
//     <div>
//       <Title level={3}>Attendance Reports</Title>

//       <Card className="mb-6">
//         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//           <div className="flex flex-wrap gap-4">

//             <Select
//               style={{ width: 220 }}
//               placeholder="Select Subject"
//               value={subject}
//               onChange={setSubject}
//               loading={fetchingSubjects}
//               allowClear
//             >
//               {subjects.map(subj => (
//                 <Option key={subj} value={subj}>{subj}</Option>
//               ))}
//             </Select>

//             <DatePicker
//               style={{ width: 200 }}
//               value={dayjs(date)}
//               onChange={(d, ds) => setDate(ds)}
//               format="YYYY-MM-DD"
//             />

//             <Button
//               type="primary"
//               icon={<SyncOutlined />}
//               loading={loading}
//               onClick={fetchReport}
//             >
//               Generate Report
//             </Button>

//             {data.length > 0 && (
//               <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
//                 Export PDF
//               </Button>
//             )}
//           </div>

//           <Alert
//             type="info"
//             showIcon
//             message="Instructions"
//             description="Select a subject and date. Undetected students are marked as ABSENT."
//           />
//         </Space>
//       </Card>

//       <Table
//         rowKey="student_id"
//         dataSource={data}
//         columns={columns}
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
// };

// export default Reports;





// below code is frontend 3 code 

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  DatePicker,
  Typography,
  Select,
  Space,
  Alert,
  message,
} from 'antd';
import { SyncOutlined, DownloadOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import reportsAPI from '../api/reports';
import adminAPI from '../api/admin';

const { Title } = Typography;
const { Option } = Select;

const Reports = () => {
  const [data, setData] = useState([]);
  const [subject, setSubject] = useState(null);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);

  // --------------------------------
  // Fetch Subjects
  // --------------------------------
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setFetchingSubjects(true);
      const students = await adminAPI.getStudents();

      const uniqueSubjects = [
        ...new Set(students.flatMap(s => s.subjects || [])),
      ];

      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error(error);
      message.error('Failed to load subjects');
    } finally {
      setFetchingSubjects(false);
    }
  };

  // --------------------------------
  // Generate Attendance Report
  // --------------------------------
  const fetchReport = async () => {
    if (!subject) {
      message.warning('Please select a subject');
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Fetch all students
      const studentsData = await adminAPI.getStudents();
      const students = Array.isArray(studentsData) ? studentsData : (studentsData?.data || []);

      // 2️⃣ Filter students for selected subject (Trim & Case-Insensitive)
      const selectedSub = String(subject).trim().toLowerCase();
      const subjectStudents = students.filter(student =>
        (student.subjects || []).some(s => String(s).trim().toLowerCase() === selectedSub)
      );

      // 3️⃣ Fetch records (Current and Previous UTC day)
      const prevDate = dayjs(date).subtract(1, 'day').format('YYYY-MM-DD');
      
      const [recordsToday, recordsPrev] = await Promise.all([
        reportsAPI.getAttendanceReport(subject, date),
        reportsAPI.getAttendanceReport(subject, prevDate)
      ]);

      const allRecords = [
        ...(Array.isArray(recordsToday) ? recordsToday : (recordsToday?.data || [])),
        ...(Array.isArray(recordsPrev) ? recordsPrev : (recordsPrev?.data || []))
      ];

      // 4️⃣ Filter records that fall on the selected Malaysia local date
      const targetDateStr = String(date).trim();
      const presentRecords = allRecords.filter(record => {
        const timestamp = record.first_detected_at || record.timestamp;
        if (!timestamp) return false;
        
        const localDate = dayjs.utc(timestamp).add(8, 'hour').format('YYYY-MM-DD');
        return localDate === targetDateStr;
      });

      // 5️⃣ Create lookup map (Trim & String-safe)
      const presentMap = {};
      presentRecords.forEach(record => {
        const id = record.student_id || record.id;
        if (id) {
          presentMap[String(id).trim()] = record;
        }
      });

      // 6️⃣ Merge → PRESENT / ABSENT
      const mergedReport = subjectStudents.map(student => {
        const studentIdStr = String(student.student_id).trim();
        const present = presentMap[studentIdStr];

        return {
          student_id: student.student_id,
          full_name: student.full_name,
          status: present ? 'PRESENT' : 'ABSENT',
          first_detected_at: present?.first_detected_at || present?.timestamp || null,
        };
      });

      setData(mergedReport);
      if (mergedReport.length > 0) {
        message.success(`Report generated for ${date}`);
      } else {
        message.info('No students found for this subject.');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to generate attendance report');
    } finally {
      setLoading(false);
    }
  };



  // --------------------------------
// Export PDF
// --------------------------------
const exportToPDF = () => {
  if (data.length === 0) {
    message.warning('No data to export');
    return;
  }

  const doc = new jsPDF();

  // -----------------------------
  // Header
  // -----------------------------
  doc.setFontSize(16);
  doc.text(
    'Lincoln University College, Malaysia',
    105,
    15,
    { align: 'center' }
  );

  doc.setFontSize(11);
  doc.text(`Subject : ${subject}`, 14, 30);
  doc.text(`Date : ${date}`, 150, 30);

  // -----------------------------
  // Attendance Table
  // -----------------------------
  autoTable(doc, {
    startY: 40,
    theme: 'grid',
    head: [[
      'Student Name',
      'Student ID',
      'Detected At',
      'Status',
    ]],
    body: data.map(item => [
      item.full_name,
      item.student_id,
      item.first_detected_at
        ? dayjs.utc(item.first_detected_at).local().format('HH:mm:ss')
        : '—',
      item.status,
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 119, 255],
      textColor: 255,
    },
  });

  // -----------------------------
  // Footer: Instructor Signature + Generated By
  // -----------------------------
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20; // space from bottom

  // Horizontal line for signature (bottom left)
  const lineStartX = 14;
  const lineEndX = 65;
  const lineY = pageHeight - marginBottom;
  doc.setLineWidth(0.5);
  doc.line(lineStartX, lineY, lineEndX, lineY);

  // Signature text below the line
  doc.setFontSize(10);
  doc.text('Instructor Signature', lineStartX, lineY + 6);

  // "Generated by" text (centered above bottom margin)
  doc.setFontSize(9);
  doc.text(
    'Generated by Lincoln Attendance Management System',
    105,
    pageHeight - 10,
    { align: 'center' }
  );

  // -----------------------------
  // Save PDF
  // -----------------------------
  doc.save(`attendance_${subject}_${date}.pdf`);
};


  // --------------------------------
  // Table Columns
  // --------------------------------
  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      width: 120,
    },
    {
      title: 'Student Name',
      dataIndex: 'full_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <Tag color={status === 'PRESENT' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Detected At',
      dataIndex: 'first_detected_at',
      render: value =>
        value
          ? dayjs.utc(value).local().format('HH:mm:ss')
          : '—',
    },
  ];

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <div>
      <Title level={3}>Attendance Reports</Title>

      <Card className="mb-6">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="flex flex-wrap gap-4">
            <Select
              style={{ width: 220 }}
              placeholder="Select Subject"
              value={subject}
              onChange={setSubject}
              loading={fetchingSubjects}
              allowClear
            >
              {subjects.map(subj => (
                <Option key={subj} value={subj}>
                  {subj}
                </Option>
              ))}
            </Select>

            <DatePicker
              style={{ width: 200 }}
              value={dayjs(date)}
              onChange={(d, ds) => setDate(ds)}
              format="YYYY-MM-DD"
            />

            <Button
              type="primary"
              icon={<SyncOutlined />}
              loading={loading}
              onClick={fetchReport}
            >
              Generate Report
            </Button>

            {data.length > 0 && (
              <>
                
                <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
                  Export PDF
                </Button>
              </>
            )}
          </div>

          <Alert
            type="info"
            showIcon
            message="Instructions"
            description="Select a subject and date. Undetected students are marked as ABSENT."
          />
        </Space>
      </Card>

      <Table
        rowKey="student_id"
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        summary={pageData => {
          const total = pageData.length;
          const present = pageData.filter(i => i.status === 'PRESENT').length;
          const absent = total - present;

          return (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>
                  <strong>Summary</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Tag color="green">Present: {present}</Tag>
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    Absent: {absent}
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <strong>Total: {total}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default Reports;

