import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Search,
  Plus,
  User,
  BookOpen,
  Percent
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export default function TeacherStudents() {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState(searchParams.get('class') || '');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    subject: '',
    marks: '',
    maxMarks: '100',
    semester: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [filterClass]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filterClass) params.class = filterClass;

      const response = await teacherAPI.getStudents(params);
      setStudents(response.data.students);
      setAssignedClasses(response.data.assignedClasses);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const openGradeModal = (student) => {
    setSelectedStudent(student);
    setGradeForm({
      subject: '',
      marks: '',
      maxMarks: '100',
      semester: ''
    });
    setIsGradeModalOpen(true);
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await teacherAPI.addGrade(selectedStudent._id, gradeForm);
      toast.success('Grade added successfully');
      setIsGradeModalOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add grade');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const classOptions = assignedClasses.map(c => ({
    value: c.class,
    label: `Class ${c.class} - ${c.subject}`
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">My Students</h1>
        <p className="text-dark-400 mt-1">View and manage students in your assigned classes</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={classOptions}
              placeholder="All Classes"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Recent Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const attendancePercentage = student.getAttendancePercentage?.() || 
                    (student.attendance?.length > 0 
                      ? Math.round((student.attendance.filter(a => a.status === 'present' || a.status === 'late').length / student.attendance.length) * 100)
                      : 100
                    );
                  
                  const recentGrade = student.grades?.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                  return (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-semibold">
                            {student.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{student.user?.name}</p>
                            <p className="text-xs text-dark-400">{student.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{student.studentId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-white">Class {student.class}</span>
                        <span className="text-dark-400 ml-1">({student.section})</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-dark-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                attendancePercentage >= 75 ? 'bg-accent-500' :
                                attendancePercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${attendancePercentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-dark-300">{attendancePercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {recentGrade ? (
                          <div>
                            <Badge variant={
                              recentGrade.grade === 'A+' || recentGrade.grade === 'A' ? 'success' :
                              recentGrade.grade === 'B+' || recentGrade.grade === 'B' ? 'info' :
                              recentGrade.grade === 'C' ? 'warning' : 'danger'
                            }>
                              {recentGrade.grade}
                            </Badge>
                            <p className="text-xs text-dark-400 mt-1">{recentGrade.subject}</p>
                          </div>
                        ) : (
                          <span className="text-dark-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          icon={Plus}
                          onClick={() => openGradeModal(student)}
                        >
                          Add Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-400">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Grade Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={`Add Grade for ${selectedStudent?.user?.name}`}
      >
        <form onSubmit={handleAddGrade} className="space-y-6">
          <Input
            label="Subject"
            value={gradeForm.subject}
            onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
            required
            placeholder="e.g., Mathematics"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Marks Obtained"
              type="number"
              value={gradeForm.marks}
              onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })}
              required
              min="0"
            />
            <Input
              label="Maximum Marks"
              type="number"
              value={gradeForm.maxMarks}
              onChange={(e) => setGradeForm({ ...gradeForm, maxMarks: e.target.value })}
              required
              min="1"
            />
          </div>

          <Select
            label="Semester"
            options={[
              { value: '1', label: 'Semester 1' },
              { value: '2', label: 'Semester 2' },
              { value: 'annual', label: 'Annual' }
            ]}
            value={gradeForm.semester}
            onChange={(e) => setGradeForm({ ...gradeForm, semester: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button type="button" variant="secondary" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Add Grade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

