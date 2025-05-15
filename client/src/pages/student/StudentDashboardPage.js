import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/constants";
import { useAuth } from "../../contexts/AuthContext";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Messaging state
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiver: "",
    content: "",
    messageType: "normal"
  });

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
      fetchMessages();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      const userResponse = await axios.get(`${API_URL}/api/users/${user.id}`);
      const userData = userResponse.data;

      setAbsences(userData.absences || []);

      const classroomsResponse = await axios.get(`${API_URL}/api/classrooms`);
      const studentClasses = classroomsResponse.data.filter((classroom) =>
        classroom.students.some((student) => student._id === user.id || student === user.id)
      );
      setClasses(studentClasses);

      const coursesResponse = await axios.get(`${API_URL}/api/courses`);
      const studentClassIds = studentClasses.map((cls) => cls._id);
      const studentCourses = coursesResponse.data.filter((course) =>
        studentClassIds.includes(course.classroom)
      );
      setCourses(studentCourses);

      setError("");
    } catch (err) {
      console.error(err);
      setError("فشل في جلب البيانات");
    } finally {
      setIsLoading(false);
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

  const getArabicDay = (day) => {
    const days = {
      Monday: "الإثنين",
      Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء",
      Thursday: "الخميس",
      Friday: "الجمعة",
      Saturday: "السبت",
      Sunday: "الأحد",
    };
    return days[day] || day;
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
    <div className="p-6">
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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">لوحة الطالب</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-lg text-gray-600">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b pb-2">فصولي الدراسية</h2>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <div key={cls._id} className="mb-4 border-b last:border-0 pb-4">
                  <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-semibold">المعلمين:</p>
                    <ul className="list-disc list-inside">
                      {cls.teachers?.map((teacher) => (
                        <li key={teacher._id}>{teacher.name}</li>
                      ))}
                    </ul>
                    <p className="font-semibold mt-2">الجدول:</p>
                    {cls.schedule?.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {cls.schedule.map((item, idx) => (
                          <li key={idx}>
                            {getArabicDay(item.day)}: {item.startTime} - {item.endTime}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">لا يوجد جدول</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد فصول دراسية</p>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b pb-2">المواد الدراسية</h2>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="mb-4 border-b last:border-0 pb-4">
                  <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <p className="text-xs text-gray-500 mt-1">تم الإضافة بواسطة: {course.createdBy?.name || "غير معروف"}</p>
                  <p className="text-xs text-gray-500">تاريخ الإضافة: {formatDate(course.createdAt)}</p>

                  {course.files?.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-sm text-gray-700">الملفات:</p>
                      <ul className="space-y-1 mt-1">
                        {course.files.map((file, index) => (
                          <li key={index}>
                            <a
                              href={`${API_URL}${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline text-sm flex items-center"
                            >
                              📄 ملف {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">لا توجد مواد دراسية</p>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b pb-2">الحضور والغياب</h2>
            {absences.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {absences.map((absence) => (
                  <li key={absence._id} className="py-3">
                    <p className="text-sm text-gray-700">التاريخ: {formatDate(absence.date)}</p>
                    <p
                      className={`text-sm font-bold ${
                        absence.status === "absent" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      الحالة: {absence.status === "absent" ? "غائب" : "حاضر"}
                    </p>
                    {absence.note && (
                      <p className="text-xs text-gray-500 mt-1">ملاحظة: {absence.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">لا توجد سجلات حضور أو غياب</p>
            )}
          </section>
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
                      <p className="text-gray-600">{message.content || "رسالة نظام"}</p>
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
                {classes.map((classItem) => (
                  classItem.teachers?.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      المعلم {teacher.name}
                    </option>
                  ))
                ))}
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
    </div>
  );
};

export default StudentDashboardPage;