import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";


const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${user.id}`);
        setProfileData(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: "",
          role: response.data.role
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const { name, email, password, role } = formData;
    const updatePayload = { name, email };
    if (password) updatePayload.password = password;
    if (user.role === "admin") updatePayload.role = role;

    const res = await axios.put(`http://localhost:3000/api/users/${user.id}`, updatePayload);
    setProfileData(res.data);
    setIsEditing(false);

    Swal.fire({
      icon: "success",
      title: "تم التحديث بنجاح",
      text: "تم حفظ تغييرات الملف الشخصي.",
      confirmButtonColor: "#10b981"
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    Swal.fire({
      icon: "error",
      title: "حدث خطأ",
      text: "فشل في تحديث الملف الشخصي. حاول مرة أخرى.",
      confirmButtonColor: "#ef4444"
    });
  }
};


  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6">الملف الشخصي</h2>

      {!profileData ? (
        <p className="text-gray-500">جاري تحميل البيانات...</p>
      ) : isEditing ? (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">الاسم الكامل</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">كلمة المرور الجديدة (اختياري)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            {user.role === "admin" && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">الدور</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  disabled
                >
                  <option value="admin">مدير</option>
                  <option value="teacher">أستاذ</option>
                  <option value="parent">ولي أمر</option>
                  <option value="student">تلميذ</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-center md:justify-end items-start">
            <div className="h-32 w-32 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p><span className="font-semibold text-gray-700">الاسم الكامل:</span> {profileData.name}</p>
            <p><span className="font-semibold text-gray-700">البريد الإلكتروني:</span> {profileData.email}</p>
            <p><span className="font-semibold text-gray-700">الدور:</span> {profileData.role}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md"
            >
              تعديل الملف الشخصي
            </button>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="h-32 w-32 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl font-bold">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
