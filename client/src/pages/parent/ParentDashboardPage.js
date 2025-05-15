import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/constants";
import { useAuth } from "../../contexts/AuthContext";

const ParentDashboardPage = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentClasses, setStudentClasses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const { user } = useAuth();

  // Messaging state
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiver: "",
    content: "",
    messageType: "normal"
  });
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchMessages();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/users/${user.id}`);
      const allStudents = response.data.children || [];
      setStudents(allStudents);

      if (allStudents.length > 0) {
        setSelectedStudent(allStudents[0]);
        fetchStudentData(allStudents[0]._id);
      }

      setError("");
    } catch (err) {
      setError("فشل في جلب بيانات الطلاب");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentData = async (studentId) => {
    try {
      const studentResponse = await axios.get(`${API_URL}/api/users/${studentId}`);
      const studentData = studentResponse.data;

      const classroomsResponse = await axios.get(`${API_URL}/api/classrooms`);
      const allClassrooms = classroomsResponse.data;

      const classes = allClassrooms.filter((classroom) =>
        classroom.students.some((student) => student._id === studentId || student === studentId)
      );

      setStudentClasses(classes);

      const coursesResponse = await axios.get(`${API_URL}/api/courses`);
      const allCourses = coursesResponse.data;

      const classIds = classes.map((cls) => cls._id);
      const courses = allCourses.filter((course) => classIds.includes(course.classroom));

      setStudentCourses(courses);
    } catch (err) {
      console.error("فشل في جلب بيانات الطالب", err);
    }
  };

  // Messaging functions
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messages/user/${user.id}`);
      setMessages(response.data);
      
      const unread = await axios.get(`${API_URL}/api/messages/unread/${user.id}`);
      setUnreadCount(unread.data.count);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post(`${API_URL}/api/messages`, {
        ...newMessage,
        sender: user.id
      });
      setShowMessageModal(false);
      setNewMessage({ receiver: "", content: "", messageType: "normal" });
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`${API_URL}/api/messages/read/${messageId}`);
      fetchMessages();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const respondToInvitation = async (messageId, status) => {
    try {
      await axios.put(`${API_URL}/api/messages/invitation/${messageId}`, { status });
      fetchMessages();
      fetchStudents(); // Refresh student list if invitation was accepted
    } catch (err) {
      console.error("Failed to respond to invitation", err);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    fetchStudentData(student._id);
  };

  const getArabicDay = (englishDay) => {
    const arabicDays = {
      Monday: "الإثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
    };
    return arabicDays[englishDay] || englishDay;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div>
      {/* Messages notification bell */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowMessageModal(true)}
          className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">متابعة الأبناء</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">قائمة الأبناء</h2>
              </div>
              <div className="p-4">
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li key={student._id} className="py-2">
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className={`w-full text-right px-3 py-2 rounded ${
                            selectedStudent?._id === student._id ? "bg-emerald-100 text-emerald-800" : "hover:bg-gray-100"
                          }`}
                        >
                          {student.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 py-4">لا يوجد أبناء مسجلين</p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                    >
                      إضافة ابن
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages sidebar */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">الرسائل</h2>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                {messages.length > 0 ? (
                  <ul className="space-y-2">
                    {messages.slice(0, 3).map((message) => (
                      <li 
                        key={message._id} 
                        className={`p-2 rounded ${!message.isRead ? "bg-gray-100" : ""}`}
                        onClick={() => {
                          markAsRead(message._id);
                          if (message.messageType === 'invitation') {
                            setShowMessageModal(true);
                          }
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {message.sender?.name || "النظام"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        {message.messageType === 'invitation' ? (
                          <div className="text-sm">
                            دعوة لإضافة ابن/ابنة
                            {message.invitation?.status === 'pending' && (
                              <div className="flex gap-2 mt-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    respondToInvitation(message._id, 'accepted');
                                  }}
                                  className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                                >
                                  قبول
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    respondToInvitation(message._id, 'rejected');
                                  }}
                                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                                >
                                  رفض
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 truncate">{message.content}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد رسائل</p>
                )}
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                >
                  عرض جميع الرسائل
                </button>
              </div>
            </div>
          </div>

          {/* Rest of your existing parent dashboard UI */}
          <div className="w-full md:w-3/4">
            {/* ... existing student details, attendance, classes, and courses sections ... */}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">الرسائل</h2>
              <button onClick={() => setShowMessageModal(false)} className="text-white">
                &times;
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {messages.length > 0 ? (
                <ul className="space-y-4">
                  {messages.map((message) => (
                    <li 
                      key={message._id} 
                      className={`border-b pb-4 last:border-0 ${!message.isRead ? "bg-gray-50" : ""}`}
                      onClick={() => markAsRead(message._id)}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">
                          {message.sender?.name || "النظام"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      
                      {message.messageType === 'invitation' ? (
                        <div>
                          <p className="text-gray-700 mb-2">
                            تم إرسال دعوة لإضافة {message.invitation?.childId?.name} كابن/ابنة
                          </p>
                          {message.invitation?.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => respondToInvitation(message._id, 'accepted')}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                              >
                                قبول الدعوة
                              </button>
                              <button 
                                onClick={() => respondToInvitation(message._id, 'rejected')}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                              >
                                رفض الدعوة
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              الحالة: {message.invitation?.status === 'accepted' ? 'تم القبول' : 'تم الرفض'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">{message.content}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد رسائل</p>
              )}
            </div>
            <div className="p-4 border-t">
              <h3 className="font-bold mb-2">إرسال رسالة جديدة</h3>
              <select
                value={newMessage.receiver}
                onChange={(e) => setNewMessage({...newMessage, receiver: e.target.value})}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">اختر المستقبل</option>
                {selectedStudent && (
                  <option value={selectedStudent._id}>معلم {selectedStudent.name}</option>
                )}
                <option value="admin">الإدارة</option>
              </select>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                className="w-full p-2 border rounded mb-2 h-24"
                placeholder="اكتب رسالتك هنا..."
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.receiver || !newMessage.content}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Child Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">إضافة ابن/ابنة</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-white">
                &times;
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4 text-gray-700">
                لربط ابن/ابنة بحسابك، يرجى التوجه إلى الإدارة لتسجيل الطلب
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboardPage;