"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-600 shadow-md z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-white md:hidden mr-4"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="text-xl font-semibold text-white tracking-wide">
              المدرسة الإعدادية شنني
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-white">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-md text-sm font-medium transition backdrop-blur-sm"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-emerald-200 transition text-sm"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-md text-sm font-medium transition backdrop-blur-sm"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {isAuthenticated && (
          <aside
            className={`bg-white/80 backdrop-blur-lg border-r border-gray-200 fixed md:static top-0 left-0 h-[80vh] w-64 pt-20 z-30 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
            } md:translate-x-0 md:shadow-none`}
          >
            <nav className="px-4 py-6">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    لوحة التحكم
                  </Link>
                </li>

                {user?.role === "admin" && (
                  <>
                    <li>
                      <Link
                        to="/users"
                        className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        إدارة المستخدمين
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/classrooms"
                        className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        إدارة الفصول
                      </Link>
                    </li>
                  </>
                )}

                {user?.role === "teacher" && (
                  <>
                    <li>
                      <Link
                        to="/teacher/classes"
                        className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        فصولي الدراسية
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/courses"
                        className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        المواد الدراسية
                      </Link>
                    </li>
                  </>
                )}

                {user?.role === "student" && (
                  <>
                    <li>
                      <Link
                        to="/student/dashboard"
                        className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        لوحة الطالب
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/courses"
                        className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        المواد الدراسية
                      </Link>
                    </li>
                  </>
                )}

                {user?.role === "parent" && (
                  <li>
                    <Link
                      to="/parent/dashboard"
                      className="flex items-center text-gray-700 hover:text-emerald-600 px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium transition group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      متابعة الأبناء
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium">
                  {user?.name?.charAt(0)}
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        <main className={`flex-1 p-6 transition-all duration-300 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}

export default MainLayout