import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search,
  Pencil,
  Trash2,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

const initialFormState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  subjects: [],
  qualification: '',
  experience: '',
  salary: '',
  address: ''
};

const subjectOptions = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
  'History', 'Geography', 'Computer Science', 'Physical Education',
  'Art', 'Music', 'Economics', 'Accountancy'
].map(s => ({ value: s, label: s }));

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchTeachers();
  }, [pagination.page]);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getTeachers({ page: pagination.page, limit: 10 });
      setTeachers(response.data.teachers);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTeacher(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.user?.name || '',
      email: teacher.user?.email || '',
      password: '',
      phone: teacher.user?.phone || '',
      subjects: teacher.subjects || [],
      qualification: teacher.qualification || '',
      experience: teacher.experience || '',
      salary: teacher.salary || '',
      address: teacher.address || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = {
        ...formData,
        subjects: Array.isArray(formData.subjects) ? formData.subjects : [formData.subjects]
      };

      if (editingTeacher) {
        await adminAPI.updateTeacher(editingTeacher._id, submitData);
        toast.success('Teacher updated successfully');
      } else {
        await adminAPI.createTeacher(submitData);
        toast.success('Teacher created successfully');
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await adminAPI.deleteTeacher(id);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Teachers</h1>
          <p className="text-dark-400 mt-1">Manage teaching staff</p>
        </div>
        <Button onClick={openCreateModal} icon={Plus}>
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <Input
              icon={Search}
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : teachers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers
                  .filter(t => 
                    t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.teacherId?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 font-semibold">
                          {teacher.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{teacher.user?.name}</p>
                          <p className="text-xs text-dark-400">{teacher.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{teacher.teacherId}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects?.slice(0, 2).map((subject, i) => (
                          <Badge key={i} variant="primary">{subject}</Badge>
                        ))}
                        {teacher.subjects?.length > 2 && (
                          <Badge variant="default">+{teacher.subjects.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-dark-200">{teacher.experience || 0} years</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-accent-400">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(teacher.salary)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {teacher.assignedClasses?.length || 0} classes
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditModal(teacher)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(teacher._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-400">No teachers found</p>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-dark-800">
            <p className="text-sm text-dark-400">
              Showing {teachers.length} of {pagination.total} teachers
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!editingTeacher}
            />
            {!editingTeacher && (
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-200 mb-2">Subjects</label>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => {
                      const subjects = formData.subjects.includes(subject.value)
                        ? formData.subjects.filter(s => s !== subject.value)
                        : [...formData.subjects, subject.value];
                      setFormData({ ...formData, subjects });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      formData.subjects.includes(subject.value)
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                    }`}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Qualification"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g., M.Ed, Ph.D"
            />
            <Input
              label="Experience (years)"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
            <Input
              label="Monthly Salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

