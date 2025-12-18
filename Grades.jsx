import { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  BookOpen,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';

export default function StudentGrades() {
  const [gradesData, setGradesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    fetchGrades();
  }, [filterSemester]);

  const fetchGrades = async () => {
    try {
      const params = {};
      if (filterSemester) params.semester = filterSemester;

      const response = await studentAPI.getGrades(params);
      setGradesData(response.data);
    } catch (error) {
      toast.error('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadge = (grade) => {
    const variants = {
      'A+': 'success', 'A': 'success',
      'B+': 'info', 'B': 'info',
      'C': 'warning',
      'D': 'danger', 'F': 'danger'
    };
    return <Badge variant={variants[grade] || 'default'}>{grade}</Badge>;
  };

  const getGradeColor = (average) => {
    if (average >= 80) return 'from-accent-500 to-accent-400';
    if (average >= 60) return 'from-blue-500 to-blue-400';
    if (average >= 40) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { gradesBySubject, overallAverage } = gradesData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Grades</h1>
          <p className="text-dark-400 mt-1">View your academic performance</p>
        </div>
        <Select
          options={[
            { value: '1', label: 'Semester 1' },
            { value: '2', label: 'Semester 2' },
            { value: 'annual', label: 'Annual' }
          ]}
          placeholder="All Semesters"
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Average"
          value={overallAverage ? `${overallAverage}%` : '-'}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Subjects"
          value={gradesBySubject?.length || 0}
          icon={BookOpen}
        />
        <StatCard
          title="Best Subject"
          value={gradesBySubject?.length > 0 
            ? gradesBySubject.reduce((a, b) => a.average > b.average ? a : b).subject 
            : '-'
          }
          icon={Award}
        />
      </div>

      {/* Grades by Subject */}
      {gradesBySubject?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gradesBySubject.map((subjectData, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${getGradeColor(subjectData.average)}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{subjectData.subject}</CardTitle>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{subjectData.average}%</p>
                    <p className="text-xs text-dark-400">Average</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-dark-800">
                  {subjectData.grades.map((grade, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-dark-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(grade.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        {grade.semester && (
                          <Badge variant="default">Sem {grade.semester}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">
                          {grade.marks}/{grade.maxMarks}
                        </span>
                        {getGradeBadge(grade.grade)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No grades recorded yet</p>
          </CardContent>
        </Card>
      )}

      {/* Grade Scale Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {[
              { grade: 'A+', range: '90-100%', color: 'success' },
              { grade: 'A', range: '80-89%', color: 'success' },
              { grade: 'B+', range: '70-79%', color: 'info' },
              { grade: 'B', range: '60-69%', color: 'info' },
              { grade: 'C', range: '50-59%', color: 'warning' },
              { grade: 'D', range: '40-49%', color: 'danger' },
              { grade: 'F', range: 'Below 40%', color: 'danger' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800">
                <Badge variant={item.color}>{item.grade}</Badge>
                <span className="text-sm text-dark-300">{item.range}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

