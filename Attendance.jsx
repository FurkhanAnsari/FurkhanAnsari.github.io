import { useState, useEffect } from 'react';
import { teacherAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  Save
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

const attendanceStatuses = [
  { value: 'present', label: 'Present', icon: Check, color: 'accent' },
  { value: 'absent', label: 'Absent', icon: X, color: 'red' },
  { value: 'late', label: 'Late', icon: Clock, color: 'amber' },
  { value: 'excused', label: 'Excused', icon: AlertCircle, color: 'blue' }
];

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (selectedClass) params.class = selectedClass;

      const response = await teacherAPI.getStudents(params);
      setStudents(response.data.students);
      setAssignedClasses(response.data.assignedClasses);
      
      // Initialize attendance with 'present' for all students
      const initialAttendance = {};
      response.data.students.forEach(s => {
        initialAttendance[s._id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);

    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));

      await teacherAPI.markBulkAttendance({
        attendanceRecords,
        date: selectedDate
      });

      toast.success('Attendance saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-accent-500',
      absent: 'bg-red-500',
      late: 'bg-amber-500',
      excused: 'bg-blue-500'
    };
    return colors[status] || 'bg-dark-600';
  };

  const classOptions = assignedClasses.map(c => ({
    value: c.class,
    label: `Class ${c.class} - ${c.subject}`
  }));

  // Count attendance
  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendance).filter(s => s === 'late').length;
  const excusedCount = Object.values(attendance).filter(s => s === 'excused').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Mark Attendance</h1>
          <p className="text-dark-400 mt-1">Record daily attendance for your classes</p>
        </div>
        <Button 
          onClick={handleSaveAttendance}
          loading={saving}
          icon={Save}
          disabled={students.length === 0}
        >
          Save Attendance
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={classOptions}
              placeholder="Select Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="flex-1 sm:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-dark-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-500/10">
                <Check className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{presentCount}</p>
                <p className="text-sm text-dark-400">Present</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{absentCount}</p>
                <p className="text-sm text-dark-400">Absent</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{lateCount}</p>
                <p className="text-sm text-dark-400">Late</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{excusedCount}</p>
                <p className="text-sm text-dark-400">Excused</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students {selectedClass ? `- Class ${selectedClass}` : ''}
            {students.length > 0 && (
              <Badge variant="default" className="ml-2">{students.length} students</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : students.length > 0 ? (
            <div className="divide-y divide-dark-800">
              {students.map((student) => (
                <div 
                  key={student._id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-dark-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${getStatusColor(attendance[student._id])}`} />
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-semibold">
                      {student.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{student.user?.name}</p>
                      <p className="text-sm text-dark-400">
                        {student.studentId} • Roll #{student.rollNumber || '-'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {attendanceStatuses.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(student._id, status.value)}
                        className={`
                          flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${attendance[student._id] === status.value
                            ? `bg-${status.color}-500/20 text-${status.color}-400 ring-2 ring-${status.color}-500/30`
                            : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                          }
                        `}
                      >
                        <status.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{status.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400">
                {selectedClass ? 'No students in this class' : 'Select a class to mark attendance'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

