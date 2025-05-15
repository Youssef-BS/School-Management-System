import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/constants";
import { useAuth } from "../../contexts/AuthContext";

const TeacherClassesPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    studentId: "",
    status: "present",
    note: "",
  });

  // Messaging state
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiver: "",
    receiverType: "parent", // 'parent' or 'student'
    content: "",
    messageType: "normal"
  });
  const [availableParents, setAvailableParents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchTeacherClasses();
      fetchMessages();
    }
  }, [user]);

  const fetchTeacherClasses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/classrooms/my-classes/${user.id}`);
      setClasses(response.data);
      
      // Extract all unique students from all classes
      const allStudents = response.data.flatMap(cls => cls.students || []);
      const uniqueStudents = Array.from(new Set(allStudents.map(s => s._id)))
        .map(id => allStudents.find(s => s._id === id));
      setAvailableStudents(uniqueStudents);
      
      setError("");
    } catch (err) {
      setError("فشل في جلب بيانات الفصول");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParentsForStudent = async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/parents/${studentId}`);
      setAvailableParents(response.data);
    } catch (err) {
      console.error("Failed to fetch parents", err);
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
      setNewMessage({ 
        receiver: "", 
        receiverType: "parent",
        content: "", 
        messageType: "normal" 
      });
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

  const handleSelectClass = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleOpenAttendanceModal = (student) => {
    setAttendanceData({
      studentId: student._id,
      status: "present",
      note: "",
    });
    setShowAttendanceModal(true);
  };

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
  };

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users/${attendanceData.studentId}/attendance`, {
        status: attendanceData.status,
        note: attendanceData.note,
      });
      handleCloseAttendanceModal();
      fetchTeacherClasses();
    } catch (err) {
      setError("فشل في تسجيل الحضور");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
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

  return (
    <div className="relative">
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

      <h1 className="text-2xl font-bold mb-6">فصولي الدراسية</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-1/3 space-y-4">
            {/* Classes list */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">قائمة الفصول</h2>
              </div>
              <div className="p-4">
                {classes.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {classes.map((classItem) => (
                      <li key={classItem._id} className="py-2">
                        <button
                          onClick={() => handleSelectClass(classItem)}
                          className={`w-full text-right px-3 py-2 rounded ${
                            selectedClass?._id === classItem._id 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {classItem.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد فصول دراسية</p>
                )}
              </div>
            </div>

            {/* Messages sidebar */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2">
                <h2 className="text-lg font-bold">الرسائل</h2>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                {messages.length > 0 ? (
                  <ul className="space-y-2">
                    {messages.slice(0, 3).map((message) => (
                      <li 
                        key={message._id} 
                        className={`p-2 rounded cursor-pointer ${!message.isRead ? "bg-gray-100" : ""}`}
                        onClick={() => {
                          markAsRead(message._id);
                          setShowMessageModal(true);
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
                        <p className="text-sm text-gray-600 truncate">
                          {message.content || "رسالة نظام"}
                        </p>
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

          {/* Main content */}
          <div className="w-full md:w-2/3">
            {selectedClass ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-emerald-600 text-white px-4 py-2">
                  <h2 className="text-lg font-bold">{selectedClass.name}</h2>
                </div>
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-2">الجدول الدراسي:</h3>
                    {selectedClass.schedule && selectedClass.schedule.length > 0 ? (
                      <ul className="bg-gray-50 rounded p-3">
                        {selectedClass.schedule.map((item, index) => (
                          <li key={index} className="mb-1 text-gray-600">
                            {getArabicDay(item.day)}: {item.startTime} - {item.endTime}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">لا يوجد جدول</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-2">المواد الدراسية:</h3>
                    {selectedClass.courses && selectedClass.courses.length > 0 ? (
                      <ul className="bg-gray-50 rounded p-3 divide-y divide-gray-200">
                        {selectedClass.courses.map((course) => (
                          <li key={course._id} className="py-2">
                            <h4 className="font-bold">{course.title}</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              تاريخ الإضافة: {formatDate(course.createdAt)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">لا توجد مواد دراسية</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-700">الطلاب:</h3>
                      <button
                        onClick={() => {
                          setNewMessage({
                            receiver: "",
                            receiverType: "parent",
                            content: "",
                            messageType: "normal"
                          });
                          setShowMessageModal(true);
                        }}
                        className="bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                      >
                        إرسال رسالة
                      </button>
                    </div>
                    
                    {selectedClass.students && selectedClass.students.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الاسم
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                البريد الإلكتروني
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedClass.students.map((student) => (
                              <tr key={student._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{student.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <button
                                    onClick={() => handleOpenAttendanceModal(student)}
                                    className="text-emerald-600 hover:text-emerald-900"
                                  >
                                    تسجيل الحضور
                                  </button>
                                  <button
                                    onClick={() => {
                                      setNewMessage({
                                        receiver: student._id,
                                        receiverType: "student",
                                        content: "",
                                        messageType: "normal"
                                      });
                                      setShowMessageModal(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    رسالة
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">لا يوجد طلاب</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">الرجاء اختيار فصل من القائمة</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">إرسال رسالة</h2>
              <button 
                onClick={() => setShowMessageModal(false)} 
                className="text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  نوع المستقبل
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="receiverType"
                      value="parent"
                      checked={newMessage.receiverType === "parent"}
                      onChange={() => {
                        setNewMessage({
                          ...newMessage,
                          receiverType: "parent",
                          receiver: ""
                        });
                        if (newMessage.receiver) {
                          fetchParentsForStudent(newMessage.receiver);
                        }
                      }}
                    />
                    <span className="mr-2">ولي أمر</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="receiverType"
                      value="student"
                      checked={newMessage.receiverType === "student"}
                      onChange={() => setNewMessage({
                        ...newMessage,
                        receiverType: "student",
                        receiver: ""
                      })}
                    />
                    <span className="mr-2">طالب</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  {newMessage.receiverType === "parent" ? "ولي الأمر" : "الطالب"}
                </label>
                <select
                  value={newMessage.receiver}
                  onChange={(e) => {
                    const receiverId = e.target.value;
                    setNewMessage({
                      ...newMessage,
                      receiver: receiverId
                    });
                    if (newMessage.receiverType === "parent" && receiverId) {
                      fetchParentsForStudent(receiverId);
                    }
                  }}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">اختر {newMessage.receiverType === "parent" ? "الطالب" : "الطالب"}</option>
                  {availableStudents.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {newMessage.receiverType === "parent" && newMessage.receiver && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    ولي الأمر
                  </label>
                  <select
                    value={newMessage.receiver}
                    onChange={(e) => setNewMessage({
                      ...newMessage,
                      receiver: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">اختر ولي الأمر</option>
                    {availableParents.map(parent => (
                      <option key={parent._id} value={parent._id}>
                        {parent.name} ({parent.relationship || 'ولي أمر'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  الرسالة
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({
                    ...newMessage,
                    content: e.target.value
                  })}
                  className="w-full p-2 border rounded h-32"
                  placeholder="اكتب رسالتك هنا..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
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
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-bold">تسجيل الحضور</h2>
              <button 
                onClick={handleCloseAttendanceModal} 
                className="text-white"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmitAttendance} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  الحالة
                </label>
                <select
                  name="status"
                  value={attendanceData.status}
                  onChange={handleAttendanceChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="present">حاضر</option>
                  <option value="absent">غائب</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  ملاحظات
                </label>
                <textarea
                  name="note"
                  value={attendanceData.note}
                  onChange={handleAttendanceChange}
                  className="w-full p-2 border rounded h-24"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseAttendanceModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassesPage;