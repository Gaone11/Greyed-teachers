import React from 'react';
import { CircleUser as UserCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  profile_picture?: string;
  grade?: string;
  parent_name?: string;
  lastUpdate?: string;
  updates?: any[];
}

interface StudentListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  searchTerm?: string;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onViewStudent,
  searchTerm = ''
}) => {
  // Filter students based on search term if provided
  const filteredStudents = searchTerm
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.parent_name && student.parent_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : students;

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (filteredStudents.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-primary/10 rounded-lg">
        {searchTerm ? (
          <p className="text-black/60">No students matching your search</p>
        ) : (
          <p className="text-black/60">No students in this class</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredStudents.map((student) => (
        <div 
          key={student.id} 
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
          onClick={() => onViewStudent(student)}
        >
          <div className="flex p-4">
            <div className="mr-4">
              {student.profile_picture ? (
                <img
                  src={student.profile_picture}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-primary/50" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-black mb-1">{student.name}</h3>
              <div className="text-sm text-black/70 mb-2">Grade: {student.grade || 'N/A'}</div>
              
              {student.lastUpdate ? (
                <div className="text-xs text-black/60">
                  Last update: {formatDate(student.lastUpdate)}
                </div>
              ) : (
                <div className="text-xs text-amber-600">
                  No updates sent yet
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-primary/5 px-4 py-2 flex justify-between items-center">
            <div className="text-sm text-primary">
              {student.parent_name ? `Parent: ${student.parent_name}` : 'No parent info'}
            </div>
            <div className="text-xs text-primary/70">
              {student.updates?.length || 0} updates
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;