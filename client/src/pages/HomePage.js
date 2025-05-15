import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BookOpen, Users, UserCheck, Shield, Clock, Award } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col w-fully">
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">منصة المدرسة الإعدادية شنني التعليمية المتكاملة</h1>
                <p className="text-xl mb-8">
                  نربط بين الطلاب والمعلمين وأولياء الأمور والإدارة في بيئة تعليمية تفاعلية متكاملة.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold text-lg"
                  >
                    ابدأ الآن مجاناً
                  </Link>
                  <Link
                    to="/about"
                    className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-bold text-lg"
                  >
                    تعرف علينا
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg?w=2000"
                  alt="المدرسة الإعدادية شنني Platform"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">مميزات منصة المدرسة الإعدادية شنني</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                توفر منصتنا مجموعة متكاملة من الأدوات والميزات لتحسين العملية التعليمية وتسهيل التواصل بين جميع الأطراف.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <BookOpen />, title: "إدارة المواد الدراسية", text: "إمكانية رفع وتنظيم المواد الدراسية والواجبات والاختبارات بطريقة سهلة وفعالة." },
                { icon: <Users />, title: "التواصل الفعال", text: "تواصل مباشر بين المعلمين والطلاب وأولياء الأمور من خلال نظام رسائل متكامل." },
                { icon: <UserCheck />, title: "متابعة الحضور", text: "نظام متكامل لتسجيل ومتابعة حضور الطلاب وإشعار أولياء الأمور بشكل فوري." },
                { icon: <Shield />, title: "إدارة الصلاحيات", text: "نظام متطور لإدارة صلاحيات المستخدمين حسب أدوارهم في المنظومة التعليمية." },
                { icon: <Clock />, title: "جدولة الحصص", text: "إدارة جداول الحصص الدراسية وتنظيم المواعيد بشكل فعال ومرن." },
                { icon: <Award />, title: "تقارير الأداء", text: "تقارير تفصيلية عن أداء الطلاب ومستوى تقدمهم في المواد الدراسية المختلفة." }
              ].map(({ icon, title, text }, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-green-100 p-3 rounded-full w-fit mb-6 text-green-600 w-8 h-8">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">منصة لجميع أطراف العملية التعليمية</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                توفر المدرسة الإعدادية شنني واجهات مخصصة لكل مستخدم حسب دوره في المنظومة التعليمية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-b from-green-500 to-green-600 text-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4">المعلمون</h3>
                <ul className="space-y-2 mb-6">
                  {["إدارة المواد الدراسية", "تسجيل الحضور والغياب", "رفع الواجبات والاختبارات", "التواصل مع الطلاب وأولياء الأمور"].map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-bold"
                >
                  تسجيل كمعلم
                </Link>
              </div>

              <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 text-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4">الطلاب</h3>
                <ul className="space-y-2 mb-6">
                  {["الوصول للمواد الدراسية", "تسليم الواجبات", "متابعة الدرجات والتقييمات", "التواصل مع المعلمين"].map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-bold"
                >
                  تسجيل كطالب
                </Link>
              </div>

              {/* أولياء الأمور */}
              <div className="bg-gradient-to-b from-teal-500 to-teal-600 text-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4">أولياء الأمور</h3>
                <ul className="space-y-2 mb-6">
                  {["متابعة الحضور والغياب", "مراقبة أداء الطلاب", "التواصل مع المعلمين", "الاطلاع على الجداول والتقارير"].map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg font-bold"
                >
                  تسجيل كولي أمر
                </Link>
              </div>

              {/* الإدارة */}
              <div className="bg-gradient-to-b from-cyan-500 to-cyan-600 text-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-4">الإدارة</h3>
                <ul className="space-y-2 mb-6">
                  {["إدارة المستخدمين", "تخصيص الصلاحيات", "إصدار التقارير", "متابعة العملية التعليمية"].map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center bg-white text-cyan-600 hover:bg-cyan-50 px-4 py-2 rounded-lg font-bold"
                >
                  تسجيل كإداري
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
