import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWaitlistData } from '../../hooks/useWaitlistData';
import {
  Loader,
  Users,
  Mail,
  Calendar,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';

const AdminDashboardPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { waitlistData, loading, error, totalCount, pageCount, isAuthenticated } = useWaitlistData({
    limit: 10,
    page,
    filter: searchFilter
  });

  // Redirect if not logged in or not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
    
    // Additional check to prevent unauthorized access (even for logged in users)
    if (!authLoading && !loading && !isAuthenticated) {
      signOut();
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate, loading, isAuthenticated, signOut]);
  
  // Set document title
  useEffect(() => {
    document.title = "Admin Dashboard | GreyEd";
  }, []);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };
  
  // Handle export CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    
    try {
      // Convert waitlist data to CSV
      const headers = ['Name', 'Email', 'Role', 'Signup Date'];
      const csvRows = [
        headers.join(','),
        ...waitlistData.map(entry => [
          `"${entry.name.replace(/"/g, '""')}"`,
          `"${entry.email.replace(/"/g, '""')}"`,
          `"${entry.role.replace(/"/g, '""')}"`,
          `"${new Date(entry.created_at).toLocaleDateString()}"`,
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `greyed_waitlist_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
    } finally {
      setIsExporting(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <LandingLayout disableSnapScroll={true}>
        <NavBar />
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-white">
          <div className="text-center">
            <Loader className="w-12 h-12 text-greyed-blue mx-auto animate-spin" />
            <p className="mt-4 text-greyed-navy font-semibold">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 bg-greyed-white">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-greyed-navy/10">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-headline font-bold text-greyed-navy">Admin Dashboard</h1>
                  <p className="text-greyed-navy/70">Manage waitlist registrations</p>
                </div>
                
                <div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-greyed-beige/10 border-b border-greyed-navy/10">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-greyed-blue mr-2" />
                  <h3 className="font-medium text-greyed-navy">Total Signups</h3>
                </div>
                <p className="text-2xl font-bold text-greyed-navy">{totalCount}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Mail className="w-5 h-5 text-greyed-blue mr-2" />
                  <h3 className="font-medium text-greyed-navy">Email Confirmations</h3>
                </div>
                <p className="text-2xl font-bold text-greyed-navy">{totalCount}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-greyed-blue mr-2" />
                  <h3 className="font-medium text-greyed-navy">This Week</h3>
                </div>
                <p className="text-2xl font-bold text-greyed-navy">
                  {waitlistData.filter(
                    entry => new Date(entry.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
            </div>
            
            {/* Search and filters */}
            <div className="p-6 border-b border-greyed-navy/10">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative sm:max-w-xs flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                    value={searchFilter}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button 
                    className="px-4 py-2 bg-greyed-navy/10 hover:bg-greyed-navy/20 rounded-lg transition-colors flex items-center"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Filter</span>
                  </button>
                  
                  <button 
                    onClick={handleExportCSV}
                    disabled={isExporting || waitlistData.length === 0}
                    className={`px-4 py-2 bg-greyed-navy text-white rounded-lg transition-colors flex items-center ${
                      isExporting || waitlistData.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
                    }`}
                  >
                    <Download size={16} className="mr-2" />
                    <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Waitlist data table */}
            {error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-greyed-navy mb-2">Error Loading Data</h2>
                <p className="text-greyed-navy/70 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-greyed-navy text-white rounded-lg hover:bg-greyed-navy/90"
                >
                  Refresh Page
                </button>
              </div>
            ) : waitlistData.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-greyed-navy/50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-greyed-navy mb-2">
                  {searchFilter ? 'No matching entries found' : 'No waitlist entries yet'}
                </h2>
                <p className="text-greyed-navy/70">
                  {searchFilter 
                    ? 'Try adjusting your search term to find what you\'re looking for.'
                    : 'Waitlist signups will appear here once users register.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-greyed-navy/5">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-greyed-navy uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-greyed-navy uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-greyed-navy uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-greyed-navy uppercase tracking-wider">
                        Signup Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitlistData.map((entry) => (
                      <tr key={entry.id} className="hover:bg-greyed-navy/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-greyed-navy">{entry.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-greyed-navy">{entry.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entry.role === 'student' ? 'bg-blue-100 text-blue-800' :
                            entry.role === 'parent' ? 'bg-green-100 text-green-800' :
                            entry.role === 'teacher' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.role.charAt(0).toUpperCase() + entry.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-greyed-navy">
                          {formatDate(entry.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {pageCount > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-greyed-navy/10">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-greyed-navy hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page < pageCount ? page + 1 : pageCount)}
                    disabled={page === pageCount}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page === pageCount 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-greyed-navy hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{waitlistData.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to <span className="font-medium">{Math.min(page * 10, totalCount)}</span> of{' '}
                      <span className="font-medium">{totalCount}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(page > 1 ? page - 1 : 1)}
                        disabled={page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
                          page === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {[...Array(pageCount)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === i + 1
                              ? 'z-10 bg-greyed-blue/20 border-greyed-blue text-greyed-navy'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setPage(page < pageCount ? page + 1 : pageCount)}
                        disabled={page === pageCount}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
                          page === pageCount 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </LandingLayout>
  );
};

export default AdminDashboardPage;