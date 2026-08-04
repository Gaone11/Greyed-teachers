import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Link2,
  Mail,
  RefreshCw,
  UserCheck,
  Users,
} from 'lucide-react';
import StudentLayout from '../../components/students/StudentLayout';
import TeacherLayout from '../../layouts/TeacherLayout';
import ParentLayout from '../../layouts/ParentLayout';
import { useAuth } from '../../context/AuthContext';
import {
  ConnectionInput,
  ConnectionRole,
  CONNECTION_UPDATED_EVENT,
  createConnectedCircle,
  loadConnectionCircle,
  saveConnectionCircle,
} from '../../lib/connection-circle';

interface ConnectionsPageProps {
  role: ConnectionRole;
}

const inviteCode = 'GREYED-CIRCLE-2026';

const roleCopy: Record<ConnectionRole, { title: string; subtitle: string; action: string }> = {
  student: {
    title: 'Connect Your Learning Circle',
    subtitle: 'Link your account with your teacher and parent so everyone sees the same learning updates.',
    action: 'Connect my teacher and parent',
  },
  teacher: {
    title: 'Connect Students And Families',
    subtitle: 'Link a student account with their parent so lessons, messages, assignments, and updates stay aligned.',
    action: 'Connect student and parent',
  },
  parent: {
    title: 'Connect Your Child And Teachers',
    subtitle: 'Link your parent account to your child and their teacher so progress and communication stay in one place.',
    action: 'Connect child and teacher',
  },
};

const roleLabels: Record<ConnectionRole, string> = {
  student: 'Student',
  teacher: 'Teacher',
  parent: 'Parent',
};

const roleDescriptions: Record<ConnectionRole, string> = {
  student: 'Learner account',
  teacher: 'Classroom account',
  parent: 'Guardian account',
};

const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return initials || 'GE';
};

const ConnectionsPage: React.FC<ConnectionsPageProps> = ({ role }) => {
  const { user } = useAuth();
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [formData, setFormData] = useState<ConnectionInput>({});
  const [inviteInput, setInviteInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setCircle(loadConnectionCircle());

    window.addEventListener(CONNECTION_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(CONNECTION_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const missingRoles = useMemo(
    () => (Object.keys(roleLabels) as ConnectionRole[]).filter(item => item !== role),
    [role]
  );

  const hasAnyConnectionInput = Object.values(formData).some(value => value?.trim()) || inviteInput.trim();

  const handleFieldChange = (field: keyof ConnectionInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleConnect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasAnyConnectionInput) {
      setError('Add an email address or invite code to connect the learning circle.');
      return;
    }

    const nextCircle = createConnectedCircle(role, circle, formData, user);
    saveConnectionCircle(nextCircle);
    setCircle(nextCircle);
    setSuccess('Connected. Student, teacher, and parent access are now joined for this learning circle.');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not copy the invite code. You can still type it manually.');
    }
  };

  const handleRefreshFromStorage = () => {
    setCircle(loadConnectionCircle());
    setSuccess('Connection status refreshed.');
  };

  const content = (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-greyed-blue/10 text-greyed-navy text-xs font-bold uppercase tracking-wider mb-3">
            <Link2 className="w-3.5 h-3.5" />
            Learning Circle
          </div>
          <h1 className="text-2xl sm:text-4xl font-headline font-bold text-greyed-navy">
            {roleCopy[role].title}
          </h1>
          <p className="text-greyed-navy/70 mt-2 max-w-2xl font-medium">
            {roleCopy[role].subtitle}
          </p>
        </div>

        <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${
          circle.status === 'connected'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          {circle.status === 'connected' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <div>
            <p className="text-sm font-bold">
              {circle.status === 'connected' ? 'Circle connected' : 'Connection needed'}
            </p>
            <p className="text-xs opacity-80">
              {circle.status === 'connected' ? 'All three hubs can work from the same circle.' : 'One person can connect everyone.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(Object.keys(circle.members) as ConnectionRole[]).map(memberRole => {
          const member = circle.members[memberRole];
          const isCurrentRole = memberRole === role;

          return (
            <div key={memberRole} className="bg-white border border-greyed-navy/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                    member.connected ? 'bg-greyed-navy text-white' : 'bg-greyed-navy/5 text-greyed-navy/50'
                  }`}>
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-greyed-navy">{roleLabels[memberRole]}</p>
                    <p className="text-xs text-greyed-navy/55">{roleDescriptions[memberRole]}</p>
                  </div>
                </div>
                {isCurrentRole && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-greyed-blue/10 text-greyed-navy px-2 py-1 rounded-full">
                    You
                  </span>
                )}
              </div>

              <div className="mt-5">
                <p className="font-bold text-greyed-navy truncate">{member.name}</p>
                <p className="text-sm text-greyed-navy/60 truncate">{member.email || 'Email will appear after connection'}</p>
              </div>

              <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                member.connected ? 'bg-green-50 text-green-700' : 'bg-greyed-navy/5 text-greyed-navy/55'
              }`}>
                <UserCheck className="w-3.5 h-3.5" />
                {member.connected ? 'Linked' : 'Waiting'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <form onSubmit={handleConnect} className="bg-white border border-greyed-navy/10 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-greyed-blue/15 text-greyed-navy flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-greyed-navy">Connect The Right People</h2>
              <p className="text-sm text-greyed-navy/60">Use emails or a shared invite code. Once one person connects, the whole circle is ready.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missingRoles.map(missingRole => (
              <div key={missingRole} className="space-y-3">
                <label className="block">
                  <span className="block text-sm font-bold text-greyed-navy mb-1">{roleLabels[missingRole]} name</span>
                  <input
                    type="text"
                    value={formData[`${missingRole}Name` as keyof ConnectionInput] || ''}
                    onChange={event => handleFieldChange(`${missingRole}Name` as keyof ConnectionInput, event.target.value)}
                    placeholder={`${roleLabels[missingRole]} name`}
                    className="w-full rounded-xl border border-greyed-navy/10 bg-greyed-navy/5 px-4 py-3 text-sm text-greyed-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue/40"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-bold text-greyed-navy mb-1">{roleLabels[missingRole]} email</span>
                  <input
                    type="email"
                    value={formData[`${missingRole}Email` as keyof ConnectionInput] || ''}
                    onChange={event => handleFieldChange(`${missingRole}Email` as keyof ConnectionInput, event.target.value)}
                    placeholder={`${missingRole}@school.com`}
                    className="w-full rounded-xl border border-greyed-navy/10 bg-greyed-navy/5 px-4 py-3 text-sm text-greyed-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue/40"
                  />
                </label>
              </div>
            ))}
          </div>

          <label className="block mt-4">
            <span className="block text-sm font-bold text-greyed-navy mb-1">Invite code</span>
            <input
              type="text"
              value={inviteInput}
              onChange={event => {
                setInviteInput(event.target.value);
                setError('');
                setSuccess('');
              }}
              placeholder={inviteCode}
              className="w-full rounded-xl border border-greyed-navy/10 bg-greyed-navy/5 px-4 py-3 text-sm text-greyed-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue/40"
            />
          </label>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-xl bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-greyed-navy hover:bg-greyed-navy/90 text-white font-bold px-5 py-3 rounded-xl transition-colors"
            >
              <Link2 className="w-4 h-4" />
              {circle.status === 'connected' ? 'Update connection' : roleCopy[role].action}
            </button>
            <button
              type="button"
              onClick={handleRefreshFromStorage}
              className="inline-flex items-center justify-center gap-2 bg-greyed-navy/5 hover:bg-greyed-navy/10 text-greyed-navy font-bold px-5 py-3 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh status
            </button>
          </div>
        </form>

        <div className="bg-greyed-navy text-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
            <Mail className="w-5 h-5 text-greyed-blue" />
          </div>
          <h2 className="text-xl font-bold font-headline">Share Your Invite Code</h2>
          <p className="text-white/70 text-sm mt-2">
            Send this to the student, teacher, or parent who should join the circle. Any one of them can complete the connection.
          </p>

          <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Invite code</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-mono text-lg font-bold tracking-wide">{inviteCode}</p>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                title="Copy invite code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs font-semibold text-green-200 mt-2">Copied</p>}
          </div>

          <div className="mt-6 space-y-3 text-sm text-white/70">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
              <p>Students get teacher and parent communication in their hub.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
              <p>Teachers can see the student and parent as one support group.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
              <p>Parents can follow the child and contact the teacher from the parent hub.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (role === 'student') {
    return <StudentLayout activePage="connections">{content}</StudentLayout>;
  }

  if (role === 'teacher') {
    return <TeacherLayout activePage="connections">{content}</TeacherLayout>;
  }

  return <ParentLayout activePage="connections">{content}</ParentLayout>;
};

export default ConnectionsPage;
