import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teacherAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Calendar,
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await teacherAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { teacher, assignedClasses, studentCounts, totalStudents, schedule } = dashboardData || {};

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
            Hello, {teacher?.name?.split(' ')[0]}! 📚
          </h1>
          <p className="text-dark-400 mt-1">Welcome to your teaching portal</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-dark-400">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents || 0}
          icon={Users}
          subtitle="in your classes"
        />
        <StatCard
          title="Assigned Classes"
          value={assignedClasses?.length || 0}
          icon={BookOpen}
        />
        <StatCard
          title="Subjects"
          value={teacher?.subjects?.length || 0}
          icon={Calendar}
        />
        <StatCard
          title="Monthly Salary"
          value={formatCurrency(teacher?.salary)}
          icon={CheckCircle}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Classes */}
        <Card className="lg:col-span-2">
          <CardHeader
            action={
              <Link 
                to="/teacher/students" 
                className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            }
          >
            <CardTitle>Your Classes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {assignedClasses?.length > 0 ? (
              <div className="divide-y divide-dark-800">
                {assignedClasses.map((cls, index) => {
                  const count = studentCounts?.find(s => s._id === cls.class)?.count || 0;
                  return (
                    <Link
                      key={index}
                      to={`/teacher/students?class=${cls.class}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-dark-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-400">{cls.class}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            Class {cls.class} {cls.section && `- ${cls.section}`}
                          </p>
                          <p className="text-sm text-dark-400">{cls.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{count}</p>
                        <p className="text-sm text-dark-400">students</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-dark-400">
                No classes assigned yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teacher Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl font-bold text-white shadow-glow">
                  {teacher?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">{teacher?.name}</p>
                  <p className="text-sm text-dark-400">{teacher?.teacherId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-dark-800">
                  <span className="text-dark-400">Subjects</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                    {teacher?.subjects?.map((subject, i) => (
                      <Badge key={i} variant="primary">{subject}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-dark-800">
                  <span className="text-dark-400">Salary</span>
                  <span className="font-semibold text-accent-400">
                    {formatCurrency(teacher?.salary)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'View Students', href: '/teacher/students', icon: Users, color: 'primary' },
              { label: 'Mark Attendance', href: '/teacher/attendance', icon: Calendar, color: 'accent' },
              { label: 'Add Grades', href: '/teacher/students', icon: BookOpen, color: 'blue' },
            ].map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-dark-700 hover:border-dark-600 transition-all card-hover group"
              >
                <div className={`p-3 rounded-xl bg-${action.color}-500/10 group-hover:bg-${action.color}-500/20 transition-colors`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                </div>
                <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors text-center">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

