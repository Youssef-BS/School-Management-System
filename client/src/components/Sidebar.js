
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return [
          { path: "/admin/users", label: "Manage Users" },
          { path: "/admin/courses", label: "Manage Courses" },
        ]
      case "teacher":
        return [
          { path: "/teacher/courses", label: "My Courses" },
          { path: "/teacher/attendance", label: "Attendance" },
        ]
      case "parent":
        return [
          { path: "/parent/children", label: "My Children" },
          { path: "/parent/attendance", label: "Attendance Records" },
        ]
      case "student":
        return [
          { path: "/student/courses", label: "My Courses" },
          { path: "/student/attendance", label: "My Attendance" },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className="bg-dark text-white" style={{ minHeight: "calc(100vh - 56px)", width: "250px" }}>
      <div className="p-3 border-bottom border-secondary">
        <h5>{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Panel</h5>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === "/dashboard" ? "active bg-primary" : "text-white"}`}
          >
            Dashboard
          </Link>
        </li>
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active bg-primary" : "text-white"}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
