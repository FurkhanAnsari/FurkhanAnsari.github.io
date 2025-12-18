import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard,
  ClipboardList,
  BookOpen,
  CalendarCheck,
  X,
  LogOut
} from 'lucide-react';

const navigationConfig = {
  admin: [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
    { name: 'Fee Management', path: '/admin/fees', icon: CreditCard },
  ],
  teacher: [
    { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { name: 'My Students', path: '/teacher/students', icon: Users },
    { name: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
  ],
  student: [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'My Grades', path: '/student/grades', icon: BookOpen },
    { name: 'Fee Payment', path: '/student/fees', icon: CreditCard },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navigation = navigationConfig[user?.role] || [];

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 
        bg-dark-900 border-r border-dark-800
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-white">EduPro</h1>
              <p className="text-xs text-dark-400 capitalize">{user?.role} Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 mt-4 rounded-xl glass-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== `/${user?.role}` && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-500/10 text-primary-500 shadow-glow-sm' 
                    : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
              text-dark-300 hover:text-red-400 hover:bg-red-500/10 
              font-medium transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

