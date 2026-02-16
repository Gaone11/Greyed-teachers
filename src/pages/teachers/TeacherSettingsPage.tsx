import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader, User, Mail as MailIcon, School, Save, Bell, AlertOctagon, HelpCircle, Award, BookLock, AlertCircle, CheckCircle, ExternalLink, Menu, X, Upload, Camera, Trash2, Eye } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import TeacherSidebar from '../../components/teachers/TeacherSidebar';
import AccessibilitySettings from '../../components/accessibility/AccessibilitySettings';
import { getTeacherProfile, updateTeacherProfile, updateNotificationSettings, hasActiveSubscription } from '../../lib/api/teacher-api';
import { getUserSubscription, redirectToCheckout } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { supabase } from '../../lib/supabase';

const TeacherSettingsPage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    title: '',
    subjects: [] as string[],
    bio: '',
    avatar_url: ''
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailDaily: true,
    emailWeekly: true,
    pushNotifications: true,
    familyUpdateReminders: true,
    assessmentSubmissions: true,
    questionAlerts: false
  });

  useEffect(() => {
    document.title = "Settings | GreyEd Teachers";
    
    // Get active tab from URL hash if present
    const hash = location.hash.replace('#', '');
    if (hash && ['profile', 'notifications', 'subscription', 'security', 'accessibility'].includes(hash)) {
      setActiveTab(hash);
    }
    
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }
    
    const fetchTeacherData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch teacher profile from API
        const profileData = await getTeacherProfile(user.id);
        setProfileData({
          firstName: profileData?.first_name || '',
          lastName: profileData?.last_name || '',
          email: user.email || '',
          school: profileData?.school || '',
          title: profileData?.title || '',
          subjects: profileData?.subjects || [],
          bio: profileData?.bio || '',
          avatar_url: profileData?.avatar_url || ''
        });
        
        // Fetch subscription data
        const subscriptionData = await getUserSubscription();
        setSubscription(subscriptionData);
      } catch {
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTeacherData();
    }

    // Load sidebar collapsed state from localStorage
    const savedCollapsed = localStorage.getItem('teacherSidebarCollapsed');
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true);
    }
  }, [user, authLoading, navigate, location]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('teacherSidebarCollapsed', String(newState));
  };
  
  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  // Handle photo upload trigger
  const handlePhotoUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setUploadingPhoto(true);
    setError(null);
    
    try {
      // Create a unique file path using user ID for easy identification
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Delete old avatar if it exists in storage (ignore errors)
      if (profileData.avatar_url) {
        try {
          const oldPath = profileData.avatar_url.split('/uploads/')[1];
          if (oldPath) {
            await supabase.storage.from('uploads').remove([decodeURIComponent(oldPath)]);
          }
        } catch {
          // Ignore cleanup errors
        }
      }
      
      // Upload to Supabase Storage with upsert to handle re-uploads
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);
        
      if (!urlData.publicUrl) throw new Error('Failed to get public URL for the uploaded image');
      
      // Update profile data state with the new avatar URL
      setProfileData({
        ...profileData,
        avatar_url: urlData.publicUrl
      });
      
      // Update only the avatar_url in the database
      await updateTeacherProfile(user.id, {
        avatar_url: urlData.publicUrl
      });
      
      // Show success message
      setSuccess('Profile photo updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Handle remove photo
  const handleRemovePhoto = async () => {
    if (!user || !profileData.avatar_url) return;
    
    if (!confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }
    
    setUploadingPhoto(true);
    setError(null);
    
    try {
      // Delete old avatar from storage if possible
      if (profileData.avatar_url) {
        try {
          const oldPath = profileData.avatar_url.split('/uploads/')[1];
          if (oldPath) {
            await supabase.storage.from('uploads').remove([decodeURIComponent(oldPath)]);
          }
        } catch {
          // Ignore cleanup errors
        }
      }

      // Update only the avatar_url in the database
      await updateTeacherProfile(user.id, {
        avatar_url: ''
      });
      
      // Update local state
      setProfileData({
        ...profileData,
        avatar_url: ''
      });
      
      // Show success message
      setSuccess('Profile photo removed successfully');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to remove photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update profile via API
      await updateTeacherProfile(user.id, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        school: profileData.school,
        title: profileData.title,
        subjects: profileData.subjects,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url
      });
      
      // Show success message
      setSuccess('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle notification settings submission
  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update notification settings via API
      await updateNotificationSettings(user.id, notificationSettings);
      
      // Show success message
      setSuccess('Notification settings updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update notification settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle subscription checkout
  const handleSubscribe = async () => {
    if (!user) return;
    
    try {
      setIsCheckingOut(true);
      setError(null);
      
      // Get the GreyEd Teachers product
      const teacherProduct = stripeProducts[0];
      
      // Redirect to Stripe Checkout with optional trial period and back button destination
      await redirectToCheckout(teacherProduct.priceId, 14);
    } catch (err: any) {
      setError('Failed to start checkout process. Please try again.');
      setIsCheckingOut(false);
    }
  };
  
  // Handle subscription management (redirect to customer portal)
  const handleManageSubscription = () => {
    // In a real app, this would redirect to the Stripe Customer Portal
    window.open('https://billing.stripe.com/p/login/test_28o6rn3vF8HG5KE144', '_blank');
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Check if subscription is active
  const hasActiveSubscriptionStatus = subscription && 
                                subscription.subscription_status === 'active' && 
                                subscription.price_id === stripeProducts[0].priceId;

  if (authLoading || (loading && user)) {
    return (
      <LandingLayout disableSnapScroll={true}>
        <NavBar sidebarCollapsed={sidebarCollapsed} />
        <div className="min-h-screen pt-20 pb-10 flex items-center justify-center bg-[#f8f8f6]">
          <div className="text-center">
            <Loader className="w-8 h-8 text-greyed-blue mx-auto animate-spin" />
          </div>
        </div>
        <Footer />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar sidebarCollapsed={sidebarCollapsed} />
      
      <div className="min-h-screen pt-16 bg-[#f8f8f6] flex">
        {/* Mobile menu overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMobileMenu(false)}></div>
        )}
        
        {/* Left sidebar navigation */}
        <div className={`${
          isMobile
            ? `fixed inset-y-0 pt-16 z-50 transition-transform transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed top-0 left-0 bottom-0 z-40'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <TeacherSidebar
            activePage="settings"
            onLogout={handleLogout}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            isMobile={isMobile}
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
          />

          {/* Close button for mobile menu */}
          {showMobileMenu && isMobile && (
            <button 
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 p-2 text-white bg-greyed-navy/50 rounded-full"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Main content area */}
        <div className={`flex-1 pt-3 pb-16 md:pb-0 transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
        }`}>
          <main className="px-4 sm:px-6 lg:px-8">
            {/* Mobile menu toggle */}
            <div className="md:hidden mb-2">
              <button
                className="p-2 rounded-lg hover:bg-greyed-navy/10"
                onClick={toggleMobileMenu}
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Success message */}
            {success && (
              <div className="bg-greyed-beige/20 border border-greyed-blue/20 text-greyed-navy px-4 py-3 rounded-lg mb-4 flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-greyed-beige/30 border border-greyed-navy/20 text-greyed-black px-4 py-3 rounded-lg mb-4 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            
            {/* Settings tabs and content */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-greyed-navy/10">
                <nav className="flex overflow-x-auto">
                  <button 
                    className={`px-5 py-3 text-sm font-medium relative whitespace-nowrap ${activeTab === 'profile' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </div>
                    {activeTab === 'profile' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>
                  
                  <button 
                    className={`px-5 py-3 text-sm font-medium relative whitespace-nowrap ${activeTab === 'notifications' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <div className="flex items-center">
                      <Bell size={16} className="mr-2" />
                      Notifications
                    </div>
                    {activeTab === 'notifications' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>
                  
                  <button 
                    className={`px-5 py-3 text-sm font-medium relative whitespace-nowrap ${activeTab === 'subscription' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('subscription')}
                  >
                    <div className="flex items-center">
                      <Award size={16} className="mr-2" />
                      Subscription
                    </div>
                    {activeTab === 'subscription' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>
                  
                  <button
                    className={`px-5 py-3 text-sm font-medium relative whitespace-nowrap ${activeTab === 'security' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <div className="flex items-center">
                      <BookLock size={16} className="mr-2" />
                      Security
                    </div>
                    {activeTab === 'security' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>

                  <button
                    className={`px-5 py-3 text-sm font-medium relative whitespace-nowrap ${activeTab === 'accessibility' ? 'text-greyed-blue' : 'text-black hover:text-greyed-navy/70'}`}
                    onClick={() => setActiveTab('accessibility')}
                  >
                    <div className="flex items-center">
                      <Eye size={16} className="mr-2" />
                      Accessibility
                    </div>
                    {activeTab === 'accessibility' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-greyed-blue"></div>
                    )}
                  </button>
                </nav>
              </div>
              
              {/* Tab content */}
              <div className="p-5">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSubmit} className="max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile image upload section */}
                      <div className="md:w-1/3">
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-greyed-navy/10 border-2 border-greyed-blue/20">
                              {uploadingPhoto ? (
                                <div className="w-full h-full flex items-center justify-center bg-greyed-navy/5">
                                  <Loader className="w-8 h-8 text-greyed-blue animate-spin" />
                                </div>
                              ) : profileData.avatar_url ? (
                                <img 
                                  src={profileData.avatar_url} 
                                  alt={`${profileData.firstName} ${profileData.lastName}`} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-16 h-16 text-greyed-navy/30" />
                                </div>
                              )}
                            </div>
                            
                            {/* Hidden file input */}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                              disabled={uploadingPhoto}
                            />
                            
                            {/* Camera icon overlay for photo upload */}
                            <button 
                              type="button"
                              onClick={handlePhotoUploadClick}
                              disabled={uploadingPhoto}
                              className="absolute bottom-0 right-0 w-10 h-10 bg-greyed-blue text-greyed-navy rounded-full flex items-center justify-center hover:bg-greyed-white transition-colors border-2 border-white"
                            >
                              <Camera size={18} />
                            </button>
                          </div>
                          
                          <div className="flex mt-3 space-x-2">
                            <button 
                              type="button"
                              onClick={handlePhotoUploadClick}
                              disabled={uploadingPhoto}
                              className="text-sm text-greyed-blue hover:text-greyed-navy"
                            >
                              {profileData.avatar_url ? 'Change photo' : 'Upload photo'}
                            </button>
                            
                            {profileData.avatar_url && (
                              <button 
                                type="button"
                                onClick={handleRemovePhoto}
                                disabled={uploadingPhoto}
                                className="text-sm text-greyed-black hover:text-greyed-navy/80"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            JPG, PNG or GIF<br />Max 5MB
                          </p>
                        </div>
                      </div>
                      
                      {/* Profile form */}
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              First Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="firstName"
                                value={profileData.firstName}
                                onChange={handleProfileChange}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Email
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MailIcon className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={profileData.email || user?.email || ''}
                                onChange={handleProfileChange}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md"
                                disabled
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              School/Institution
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <School className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="school"
                                value={profileData.school}
                                onChange={handleProfileChange}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Job Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={profileData.title}
                              onChange={handleProfileChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                              placeholder="e.g. Physics Teacher, Head of Science"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-black mb-1">
                              Bio
                            </label>
                            <textarea
                              name="bio"
                              value={profileData.bio}
                              onChange={handleProfileChange}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greyed-blue"
                              placeholder="A brief description about yourself and your teaching experience"
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-4 border-t border-greyed-navy/10">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 focus:outline-none focus:ring-2 focus:ring-greyed-blue flex items-center ${
                              isSaving ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            {isSaving ? (
                              <>
                                <Loader size={16} className="animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" />
                                Save Profile
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
                
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <form onSubmit={handleNotificationsSubmit} className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-black mb-5">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-greyed-navy/10 rounded-lg">
                        <h3 className="font-medium text-black mb-3">Email Notifications</h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="emailDaily"
                              checked={notificationSettings.emailDaily}
                              onChange={handleNotificationChange}
                              className="mt-0.5 mr-2"
                            />
                            <div>
                              <span className="text-black">Daily summary</span>
                              <p className="text-black/60 text-sm">Get a daily email with summaries of student activity</p>
                            </div>
                          </label>
                          
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="emailWeekly"
                              checked={notificationSettings.emailWeekly}
                              onChange={handleNotificationChange}
                              className="mt-0.5 mr-2"
                            />
                            <div>
                              <span className="text-black">Weekly summary</span>
                              <p className="text-black/60 text-sm">Get a weekly email with student progress and analytics</p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-greyed-navy/10 rounded-lg">
                        <h3 className="font-medium text-black mb-3">Push Notifications</h3>
                        
                        <div>
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="pushNotifications"
                              checked={notificationSettings.pushNotifications}
                              onChange={handleNotificationChange}
                              className="mt-0.5 mr-2"
                            />
                            <div>
                              <span className="text-black">Enable push notifications</span>
                              <p className="text-black/60 text-sm">Receive notifications in your browser or mobile app</p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-greyed-navy/10 rounded-lg">
                        <h3 className="font-medium text-black mb-3">Activity Alerts</h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="familyUpdateReminders"
                              checked={notificationSettings.familyUpdateReminders}
                              onChange={handleNotificationChange}
                              className="mt-0.5 mr-2"
                            />
                            <div>
                              <span className="text-black">Family update reminders</span>
                              <p className="text-black/60 text-sm">Receive reminders to send weekly family updates</p>
                            </div>
                          </label>
                          
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="assessmentSubmissions"
                              checked={notificationSettings.assessmentSubmissions}
                              onChange={handleNotificationChange}
                              className="mt-0.5 mr-2"
                            />
                            <div>
                              <span className="text-black">Assessment submissions</span>
                              <p className="text-black/60 text-sm">Be notified when students complete assessments</p>
                            </div>
                          </label>
                          
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="questionAlerts"
                              checked={notificationSettings.questionAlerts}
                              onChange={handleNotificationChange}
                              className="mt-0.5 mr-2"
                            />
                            <div>
                              <span className="text-black">Student question alerts</span>
                              <p className="text-black/60 text-sm">Be notified when students ask questions in the platform</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 mt-4 border-t border-greyed-navy/10">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 focus:outline-none focus:ring-2 focus:ring-greyed-blue flex items-center ${
                          isSaving ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <Loader size={16} className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="mr-2" />
                            Save Preferences
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-black mb-5">Your Subscription</h2>
                    
                    <div className="bg-greyed-blue/10 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-greyed-navy">GreyEd Teachers</h3>
                          <p className="text-sm text-greyed-navy/70">Monthly Plan</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-greyed-beige/40 text-greyed-navy">
                          <CheckCircle size={12} className="mr-1" />
                          {hasActiveSubscriptionStatus ? 'Active' : 'Free Trial'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-greyed-navy">£8<span className="text-sm font-normal">/month</span></div>
                        {subscription && subscription.current_period_end && (
                          <p className="text-sm text-greyed-navy/70">
                            Next billing date: {formatDate(subscription.current_period_end)}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-greyed-navy/70">AI lesson plans</span>
                          <span className="text-greyed-navy">{hasActiveSubscriptionStatus ? 'Unlimited' : '3/5 used this month'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-greyed-navy/70">Smart assessments</span>
                          <span className="text-greyed-navy">{hasActiveSubscriptionStatus ? 'Unlimited' : '2/5 used this month'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-greyed-navy/70">Family updates</span>
                          <span className="text-greyed-navy">Unlimited</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-greyed-navy/10">
                        {hasActiveSubscriptionStatus ? (
                          <>
                            <button 
                              className="px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90"
                              onClick={handleManageSubscription}
                            >
                              Manage Subscription
                            </button>
                            <button className="px-4 py-2 bg-white border border-greyed-navy/20 text-greyed-navy rounded-md hover:bg-greyed-navy/5">
                              View Billing History
                            </button>
                          </>
                        ) : (
                          <button 
                            className="px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 flex items-center"
                            onClick={handleSubscribe}
                            disabled={isCheckingOut}
                          >
                            {isCheckingOut ? (
                              <>
                                <Loader size={16} className="animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>Subscribe Now</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Benefits information */}
                    <div className="bg-greyed-beige/20 rounded-lg p-6 border-l-4 border-greyed-blue">
                      <h3 className="font-medium text-black text-lg mb-3">GreyEd Teachers Subscription Benefits</h3>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-greyed-navy mr-2 mt-0.5 flex-shrink-0" />
                          <span>Unlimited AI lesson plan generation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-greyed-navy mr-2 mt-0.5 flex-shrink-0" />
                          <span>Unlimited assessment creation with auto-grading</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-greyed-navy mr-2 mt-0.5 flex-shrink-0" />
                          <span>Unlimited weekly family updates</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-greyed-navy mr-2 mt-0.5 flex-shrink-0" />
                          <span>Advanced analytics dashboard</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-greyed-navy mr-2 mt-0.5 flex-shrink-0" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                      
                      <div className="text-xs text-greyed-navy/60">
                        <p>Your subscription helps us continue to develop innovative tools for educators.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-black mb-5">Security Settings</h2>

                    {/* Two-Factor Authentication */}
                    <div className="p-4 border border-greyed-navy/10 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-black">Two-Factor Authentication</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-greyed-beige/30 text-greyed-black">
                          Coming Soon
                        </span>
                      </div>

                      <p className="text-black/70 text-sm mb-3">
                        Two-factor authentication will be available soon for additional account security.
                      </p>

                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>

                    {/* Privacy & Data */}
                    <div className="p-4 border border-greyed-navy/10 rounded-lg">
                      <h3 className="font-medium text-black mb-3">Privacy & Data</h3>

                      <p className="text-black/70 text-sm mb-3">
                        Manage how your data is used within GreyEd Teachers.
                      </p>

                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={true}
                            className="mt-0.5 mr-2"
                          />
                          <div>
                            <span className="text-black">Improve AI with my data</span>
                            <p className="text-black/60 text-xs">Help us improve GreyEd Teachers by allowing anonymous usage of your content and interactions</p>
                          </div>
                        </label>

                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={true}
                            className="mt-0.5 mr-2"
                          />
                          <div>
                            <span className="text-black">Store class data</span>
                            <p className="text-black/60 text-xs">Store your class data to enhance personalization and continuity</p>
                          </div>
                        </label>
                      </div>

                      <div className="mt-4 pt-4 border-t border-greyed-navy/10">
                        <button
                          type="button"
                          className="text-greyed-black hover:text-greyed-navy/80 text-sm font-medium"
                        >
                          Delete my account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accessibility Tab */}
                {activeTab === 'accessibility' && (
                  <div className="max-w-2xl mx-auto">
                    <AccessibilitySettings />
                  </div>
                )}
              </div>
            </div>
            
            {/* Help and Support */}
            <div className="mt-5 bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-start">
                <HelpCircle className="w-6 h-6 text-greyed-blue mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-black mb-2">Need Help?</h2>
                  <p className="text-black/70 mb-3">
                    Our support team is available to assist with any questions or issues you encounter.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      to="/contact" 
                      className="px-4 py-2 bg-greyed-navy text-white rounded-md hover:bg-greyed-navy/90 transition-colors"
                    >
                      Contact Support
                    </Link>
                    <a 
                      href="#" 
                      className="px-4 py-2 bg-white border border-greyed-navy/20 text-greyed-navy rounded-md hover:bg-greyed-navy/5 transition-colors"
                    >
                      View Documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </LandingLayout>
  );
};

export default TeacherSettingsPage;