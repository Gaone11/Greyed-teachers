import React, { useState } from 'react';
import StudentLayout from '../../components/students/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Eye,
  Lock,
  Mail,
  Moon,
  Save,
  Settings,
  Shield,
  User
} from 'lucide-react';

const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.first_name || 'Hilda Molefi');
  const [email, setEmail] = useState(user?.email || 'hilda@student.greyed.org');
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    assignmentReminders: true,
    weeklySummary: false,
    darkMode: false,
    dyslexiaSupport: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(current => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
  };

  const preferenceRows = [
    {
      key: 'emailAlerts' as const,
      icon: Mail,
      title: 'Email alerts',
      description: 'Receive messages from teachers and school announcements.',
    },
    {
      key: 'assignmentReminders' as const,
      icon: Bell,
      title: 'Assignment reminders',
      description: 'Get nudges before coursework and homework deadlines.',
    },
    {
      key: 'weeklySummary' as const,
      icon: Shield,
      title: 'Weekly progress summary',
      description: 'Send a weekly snapshot of grades, attendance, and goals.',
    },
    {
      key: 'darkMode' as const,
      icon: Moon,
      title: 'Dark mode',
      description: 'Use a calmer darker interface where supported.',
    },
    {
      key: 'dyslexiaSupport' as const,
      icon: Eye,
      title: 'Reading support',
      description: 'Enable clearer spacing and reading-friendly display options.',
    },
  ];

  return (
    <StudentLayout activePage="settings">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-greyed-navy flex items-center gap-2">
          <Settings className="w-8 h-8 text-greyed-blue" />
          Settings
        </h1>
        <p className="text-greyed-navy/75 mt-1 font-medium">Manage your profile, notifications, and learning preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <form onSubmit={handleSave} className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-greyed-navy/5 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-greyed-blue" />
            <h2 className="text-xl font-bold text-greyed-navy">Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-greyed-navy">Display name</span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-xl border border-greyed-navy/10 px-4 py-3 text-greyed-navy outline-none focus:border-greyed-blue focus:ring-2 focus:ring-greyed-blue/20"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-greyed-navy">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-xl border border-greyed-navy/10 px-4 py-3 text-greyed-navy outline-none focus:border-greyed-blue focus:ring-2 focus:ring-greyed-blue/20"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-greyed-navy px-5 py-3 text-sm font-bold text-white hover:bg-[#2a2f6e] transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>

          {saved && (
            <p className="mt-3 text-sm font-semibold text-green-700">Settings saved for this preview.</p>
          )}
        </form>

        <div className="bg-white rounded-2xl shadow-sm border border-greyed-navy/5 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-greyed-blue" />
            <h2 className="text-xl font-bold text-greyed-navy">Account</h2>
          </div>
          <div className="space-y-3 text-sm text-greyed-navy/75">
            <p className="font-medium">Password and account security are managed through your school sign-in.</p>
            <button
              type="button"
              onClick={() => alert('Password reset options will be available when school authentication is connected.')}
              className="w-full rounded-xl border border-greyed-navy/10 px-4 py-3 font-bold text-greyed-navy hover:bg-greyed-navy/5 transition-colors"
            >
              Password Options
            </button>
          </div>
        </div>

        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-greyed-navy/5 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-greyed-blue" />
            <h2 className="text-xl font-bold text-greyed-navy">Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preferenceRows.map(({ key, icon: Icon, title, description }) => (
              <button
                key={key}
                type="button"
                onClick={() => togglePreference(key)}
                className="flex items-center justify-between gap-4 rounded-xl border border-greyed-navy/10 p-4 text-left hover:border-greyed-blue/40 hover:bg-[#bbd7eb]/10 transition-colors"
              >
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-greyed-blue/10 p-2 text-greyed-navy">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block font-bold text-greyed-navy">{title}</span>
                    <span className="block text-sm text-greyed-navy/70">{description}</span>
                  </span>
                </span>
                <span className={`h-6 w-11 rounded-full p-1 transition-colors ${preferences[key] ? 'bg-greyed-navy' : 'bg-greyed-navy/15'}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${preferences[key] ? 'translate-x-5' : ''}`} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentSettingsPage;
