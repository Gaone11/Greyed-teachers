import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, PlusCircle, AlertCircle, Users, Trash2, MoreVertical, X, ChevronRight } from 'lucide-react';
import TeacherPageLayout from '../../components/teachers/TeacherPageLayout';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ClassForm from '../../components/teachers/ClassForm';
import { fetchTeacherClasses, createClass, deleteClass, hasActiveSubscription, getTeacherLimits } from '../../lib/api/teacher-api';
import { Class } from '../../types/teacher';

const TeacherClassesPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [limits, setLimits] = useState({
    classes: 1,
    usedClasses: 0
  });

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setSidebarCollapsed(savedState === 'true');
      }
    } catch {
      // localStorage unavailable (private browsing)
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    try {
      localStorage.setItem('sidebarCollapsed', String(newState));
    } catch {
      // localStorage unavailable (private browsing)
    }
  };

  useEffect(() => {
    document.title = "Manage Classes | GreyEd Teachers";

    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    const fetchClasses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Check subscription status first
        const subscriptionActive = await hasActiveSubscription();
        setIsSubscribed(subscriptionActive);

        // Fetch classes from API
        const classData = await fetchTeacherClasses(user.id);
        setClasses(classData);

        // Get teacher limits
        const userLimits = await getTeacherLimits(user.id);
        setLimits({
          classes: isSubscribed ? Infinity : 1,
          usedClasses: classData.length
        });
      } catch {
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClasses();
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user, authLoading, navigate, isSubscribed]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Handle creating a new class
  const handleCreateClass = async (classData: {
    name: string;
    subject: string;
    grade: string;
    description: string;
    syllabus: string;
    classSize?: number;
    duration?: number;
  }) => {
    if (!user) return;

    try {
      setError(null);

      // Check if user is on free tier and already has a class
      if (!isSubscribed && classes.length >= 1) {
        throw new Error("Free tier is limited to 1 class. Please upgrade to create more classes.");
      }

      // Create the class via API
      const newClass = await createClass({
        teacher_id: user.id,
        name: classData.name,
        subject: classData.subject,
        grade: classData.grade,
        description: classData.description,
        syllabus: classData.syllabus,
        student_count: classData.classSize
      });

      // Add the new class to state
      setClasses([...classes, newClass]);

      // Close the modal
      setShowCreateModal(false);
    } catch (err: any) {
      throw err; // Re-throw to be handled by the form component
    }
  };

  // Handle deleting a class
  const handleDeleteClass = async (id: string) => {
    if (!user) return;

    try {
      setIsDeleting(true);
      setError(null);

      // Delete the class via API
      await deleteClass(id);

      // Remove the class from state
      setClasses(classes.filter(c => c.id !== id));
      setClassToDelete(null);
    } catch {
      setError('Failed to delete class. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter classes by search term and subject
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cls.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === '' || cls.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filter
  const subjects = [...new Set(classes.map(cls => cls.subject))];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Create class card component for mobile view
  const ClassCard = ({ cls }: { cls: Class }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4">
        <Link to={`/teachers/classes/${cls.id}`} className="block">
          <h3 className="font-medium text-lg text-primary hover:text-primary">{cls.name}</h3>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-accent/10 text-primary px-2 py-1 rounded-full text-xs">
              {cls.subject}
            </span>
            <span className="bg-primary/5 text-primary/80 px-2 py-1 rounded-full text-xs">
              {cls.grade}
            </span>
            {cls.syllabus && (
              <span className="bg-accent/20 text-primary px-2 py-1 rounded-full text-xs">
                {cls.syllabus}
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-primary/60 text-sm">
            <Users size={14} className="mr-1" />
            <span>{cls.student_count || 0} students</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(dropdownOpen === cls.id ? null : cls.id)}
              className="p-2 text-primary/60 hover:text-primary rounded-full hover:bg-primary/5"
            >
              <MoreVertical size={16} />
            </button>

            {dropdownOpen === cls.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                <Link
                  to={`/teachers/classes/${cls.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <ChevronRight size={14} className="mr-2" />
                  View Class
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  onClick={() => setClassToDelete(cls.id)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete Class
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TeacherPageLayout
      activePage="classes"
      onLogout={handleLogout}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      loading={authLoading || (loading && !!user)}
      loadingMessage="Loading your classes..."
    >
      <PageHeader
        title="Classes"
        subtitle="Manage your classes and students."
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className={`inline-flex items-center justify-center ${
              !isSubscribed && classes.length >= 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            } text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap`}
            disabled={!isSubscribed && classes.length >= 1}
            title={!isSubscribed && classes.length >= 1 ? "Free tier limited to 1 class" : ""}
          >
            <PlusCircle size={16} className="mr-2" />
            Create New Class
          </button>
        }
      />

      {error && (
        <div className="bg-accent/20 border-2 border-primary/20 text-text px-4 py-3 rounded-lg mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Subscription warning for free tier */}
      {!isSubscribed && classes.length >= 1 && (
        <div className="bg-accent/10 border-2 border-accent/30 text-primary px-3 py-2.5 md:px-4 md:py-3 rounded-lg mb-4 md:mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm md:text-base">You've reached your free tier limit</p>
              <p className="mt-1 text-xs md:text-sm">Free tier is limited to 1 class. Upgrade to create unlimited classes.</p>
              <Link
                to="/teachers/settings#subscription"
                className="mt-2 inline-block bg-primary text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-primary/90 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      )}


      {/* Search and filters - Simplified layout with less padding */}
      <div className="bg-white rounded-xl shadow-sm p-2.5 md:p-3 mb-3 md:mb-4">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 lg:space-x-3">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-2.5 md:pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-8 md:pl-9 pr-8 py-2 w-full border border-premium-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-2.5 md:pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="relative w-full md:w-44 lg:w-48 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-2.5 md:pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="pl-8 md:pl-9 pr-8 py-2 w-full border border-premium-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white text-sm"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 md:pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Classes list - More compact layout */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No classes found"
          description={searchTerm || filterSubject ? "Try adjusting your search or filters." : "You haven't created any classes yet."}
          action={!searchTerm && !filterSubject ? (
            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-5 py-3 hover:shadow-md transition-all font-medium">
              <PlusCircle size={18} />
              Create Your First Class
            </button>
          ) : undefined}
        />
      ) : (
        <>
          {/* Mobile view - cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {filteredClasses.map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>

          {/* Desktop view - compact table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary/5">
                <tr>
                  <th scope="col" className="px-2 lg:px-4 py-2.5 lg:py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-2 lg:px-3 py-2.5 lg:py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Subject</th>
                  <th scope="col" className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Syllabus</th>
                  <th scope="col" className="px-2 lg:px-3 py-2.5 lg:py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Grade</th>
                  <th scope="col" className="px-2 lg:px-3 py-2.5 lg:py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Students</th>
                  <th scope="col" className="hidden xl:table-cell px-3 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-2 lg:px-3 py-2.5 lg:py-3 text-right text-xs font-medium text-text uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-primary/5">
                    <td className="px-2 lg:px-4 py-2.5 lg:py-3">
                      <Link to={`/teachers/classes/${cls.id}`} className="font-medium text-primary hover:text-primary text-sm lg:text-base truncate block max-w-[150px] lg:max-w-none">
                        {cls.name}
                      </Link>
                    </td>
                    <td className="px-2 lg:px-3 py-2.5 lg:py-3 text-text text-sm lg:text-base">
                      <span className="truncate block max-w-[100px] lg:max-w-none">{cls.subject}</span>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-3 text-text text-sm">
                      <span className="truncate block max-w-[120px]">{cls.syllabus || '-'}</span>
                    </td>
                    <td className="px-2 lg:px-3 py-2.5 lg:py-3 text-text text-sm lg:text-base">
                      {cls.grade}
                    </td>
                    <td className="px-2 lg:px-3 py-2.5 lg:py-3 text-text text-sm lg:text-base">
                      {cls.student_count || 0}
                    </td>
                    <td className="hidden xl:table-cell px-3 py-3 text-text text-sm whitespace-nowrap">
                      {formatDate(cls.created_at)}
                    </td>
                    <td className="px-2 lg:px-3 py-2.5 lg:py-3 text-right text-sm font-medium">
                      <div className="flex justify-end gap-0.5 lg:gap-1">
                        <Link
                          to={`/teachers/classes/${cls.id}`}
                          className="text-primary hover:text-primary p-1 rounded hover:bg-primary/5"
                          title="View Class"
                        >
                          <ChevronRight size={16} className="lg:w-[18px] lg:h-[18px]" />
                        </Link>
                        <button
                          onClick={() => setClassToDelete(cls.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Delete Class"
                        >
                          <Trash2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Free tier limit info */}
      {!isSubscribed && (
        <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-text-muted px-2">
          <p>Free tier is limited to 1 class. You've created {classes.length} of 1 allowed classes.</p>
          <p className="mt-1">Need more classes? <Link to="/teachers/settings#subscription" className="text-primary hover:underline font-medium">Upgrade to unlimited for £8/month</Link></p>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!classToDelete}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone and will remove all associated lesson plans, assessments, and resources."
        confirmLabel={isDeleting ? "Deleting..." : "Delete Class"}
        variant="danger"
        onConfirm={() => { if (classToDelete) handleDeleteClass(classToDelete); }}
        onCancel={() => setClassToDelete(null)}
      />

      {/* Instructions Card - More compact */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 mt-4 md:mt-6 border-l-4 border-primary">
        <h3 className="text-base md:text-lg font-headline font-semibold text-text mb-2">Getting Started with Classes</h3>
        <p className="text-xs md:text-sm text-text-muted mb-3">
          Classes are the core of your teaching experience in GreyEd. Here's how to make the most of them:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 text-xs md:text-sm text-text-muted">
          <li className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-primary text-xs mr-2 flex-shrink-0 mt-0.5">1</div>
            <span>Create a class for each of your teaching groups</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-primary text-xs mr-2 flex-shrink-0 mt-0.5">2</div>
            <span>Upload teaching resources for each class</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-primary text-xs mr-2 flex-shrink-0 mt-0.5">3</div>
            <span>Generate AI lesson plans based on your curriculum</span>
          </li>
          <li className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-primary text-xs mr-2 flex-shrink-0 mt-0.5">4</div>
            <span>Create and auto-grade assessments</span>
          </li>
        </ul>
      </div>

      {/* Create Class Modal */}
      <ClassForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateClass}
      />
    </TeacherPageLayout>
  );
};

export default TeacherClassesPage;
