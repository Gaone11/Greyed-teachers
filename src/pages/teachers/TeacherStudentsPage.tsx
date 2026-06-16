import React, { useState } from 'react';
import TeacherLayout from '../../layouts/TeacherLayout';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Mail,
  Eye
} from 'lucide-react';

const TeacherStudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const students = [
    { id: 1, name: 'Emma Thompson', grade: '10th Grade', class: 'Biology 101', attendance: '98%', status: 'Excellent', lastActive: '2 hours ago' },
    { id: 2, name: 'Liam Johnson', grade: '10th Grade', class: 'Biology 101', attendance: '85%', status: 'Good', lastActive: '1 day ago' },
    { id: 3, name: 'Noah Williams', grade: '11th Grade', class: 'Chemistry Adv', attendance: '72%', status: 'At Risk', lastActive: '3 days ago' },
    { id: 4, name: 'Olivia Brown', grade: '10th Grade', class: 'Biology 101', attendance: '95%', status: 'Excellent', lastActive: '5 hours ago' },
    { id: 5, name: 'William Jones', grade: '11th Grade', class: 'Chemistry Adv', attendance: '88%', status: 'Good', lastActive: 'Yesterday' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <TeacherLayout activePage="students">
      <div className="mb-6 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
            <Users className="w-8 h-8 text-greyed-blue" />
            Students & Attendance
          </h1>
          <p className="text-greyed-navy/70 mt-1">Manage your classroom, track attendance, and view student profiles.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-greyed-blue/10 hover:bg-greyed-blue/20 text-greyed-navy px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Take Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/10 overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
        <div className="p-4 md:p-6 border-b border-greyed-navy/10">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-greyed-navy/40" />
              <input 
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-greyed-navy/20 focus:outline-none focus:ring-2 focus:ring-greyed-blue/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-greyed-navy/40" />
                <select 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-greyed-navy/20 focus:outline-none focus:ring-2 focus:ring-greyed-blue/50 appearance-none bg-white"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="all">All Classes</option>
                  <option value="Biology 101">Biology 101</option>
                  <option value="Chemistry Adv">Chemistry Adv</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-greyed-navy/5 text-greyed-navy/70 text-sm">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Class / Grade</th>
                <th className="p-4 font-semibold">Attendance</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-greyed-navy/10 text-sm">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-greyed-navy/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-greyed-navy">{student.name}</p>
                        <p className="text-xs text-greyed-navy/60">Last active: {student.lastActive}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-greyed-navy">
                    <p className="font-medium">{student.class}</p>
                    <p className="text-xs text-greyed-navy/60">{student.grade}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-greyed-navy/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            parseInt(student.attendance) > 90 ? 'bg-green-500' :
                            parseInt(student.attendance) > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: student.attendance }}
                        ></div>
                      </div>
                      <span className="font-medium text-greyed-navy">{student.attendance}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max ${
                      student.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                      student.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.status === 'At Risk' ? <AlertCircle className="w-3 h-3" /> : null}
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-greyed-navy/60 hover:text-greyed-blue hover:bg-greyed-blue/10 rounded-lg transition-colors" title="View Profile">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-greyed-navy/60 hover:text-greyed-blue hover:bg-greyed-blue/10 rounded-lg transition-colors" title="Message">
                        <Mail className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/10 rounded-lg transition-colors" title="More">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-greyed-navy/60">
              No students found matching your search.
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherStudentsPage;
