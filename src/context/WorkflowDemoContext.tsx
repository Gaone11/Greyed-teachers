import React, { createContext, useState, useContext, ReactNode } from 'react';

type AssignmentStatus = 'unassigned' | 'assigned' | 'submitted' | 'graded';

interface WorkflowState {
  assignmentStatus: AssignmentStatus;
  assignmentGrade: number | null;
  teacherNotifications: number;
  studentNotifications: number;
  parentNotifications: number;
  
  // Actions
  assignHomework: () => void;
  submitHomework: () => void;
  gradeHomework: (grade: number) => void;
  clearNotifications: (role: 'teacher' | 'student' | 'parent') => void;
  resetWorkflow: () => void;
}

const WorkflowDemoContext = createContext<WorkflowState | null>(null);

export const useWorkflowDemo = () => {
  const context = useContext(WorkflowDemoContext);
  if (!context) {
    throw new Error('useWorkflowDemo must be used within a WorkflowDemoProvider');
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const WorkflowDemoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>('unassigned');
  const [assignmentGrade, setAssignmentGrade] = useState<number | null>(null);
  
  const [teacherNotifications, setTeacherNotifications] = useState(0);
  const [studentNotifications, setStudentNotifications] = useState(0);
  const [parentNotifications, setParentNotifications] = useState(0);

  const assignHomework = () => {
    setAssignmentStatus('assigned');
    setStudentNotifications(prev => prev + 1);
    setParentNotifications(prev => prev + 1);
  };

  const submitHomework = () => {
    setAssignmentStatus('submitted');
    setTeacherNotifications(prev => prev + 1);
  };

  const gradeHomework = (grade: number) => {
    setAssignmentGrade(grade);
    setAssignmentStatus('graded');
    setStudentNotifications(prev => prev + 1);
    setParentNotifications(prev => prev + 1);
  };

  const clearNotifications = (role: 'teacher' | 'student' | 'parent') => {
    if (role === 'teacher') setTeacherNotifications(0);
    if (role === 'student') setStudentNotifications(0);
    if (role === 'parent') setParentNotifications(0);
  };

  const resetWorkflow = () => {
    setAssignmentStatus('unassigned');
    setAssignmentGrade(null);
    setTeacherNotifications(0);
    setStudentNotifications(0);
    setParentNotifications(0);
  };

  return (
    <WorkflowDemoContext.Provider value={{
      assignmentStatus,
      assignmentGrade,
      teacherNotifications,
      studentNotifications,
      parentNotifications,
      assignHomework,
      submitHomework,
      gradeHomework,
      clearNotifications,
      resetWorkflow
    }}>
      {children}
    </WorkflowDemoContext.Provider>
  );
};
