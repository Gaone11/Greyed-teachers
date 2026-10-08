import React, { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Heart, LogOut, Plus, UserPlus, UsersRound } from 'lucide-react';
import { useStudentNetwork } from '../../hooks/useStudentNetwork';
import { connectWithInviteCode, createStudyGroup, leaveStudyGroup } from '../../lib/student-network';

const getInitials = (name: string) => name
  .split(' ')
  .map(part => part[0])
  .filter(Boolean)
  .slice(0, 2)
  .join('')
  .toUpperCase() || 'ST';

const inputClass = 'w-full rounded-xl border border-greyed-navy/10 bg-greyed-navy/5 px-4 py-3 text-sm text-greyed-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue/40';

const StudentFriendsPanel: React.FC = () => {
  const { me, network, loading } = useStudentNetwork();
  const [codeInput, setCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSubject, setGroupSubject] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (loading || !network) {
    return (
      <div className="bg-white border border-greyed-navy/10 rounded-2xl p-6 shadow-sm text-sm text-greyed-navy/60">
        Loading your study friends...
      </div>
    );
  }

  const fail = (error: unknown, fallback: string) => {
    setMessage({ type: 'error', text: error instanceof Error ? error.message : fallback });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(network.profile.inviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setMessage({ type: 'error', text: 'Could not copy your code. You can still share it by typing it out.' });
    }
  };

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    try {
      const friend = await connectWithInviteCode(me, network, codeInput);
      setCodeInput('');
      setMessage({ type: 'success', text: `You and ${friend.name} are now friends.` });
    } catch (error) {
      fail(error, 'Could not connect with that code.');
    }
  };

  const toggleFriend = (email: string) => {
    setSelectedFriends(prev => (prev.includes(email) ? prev.filter(item => item !== email) : [...prev, email]));
  };

  const handleCreateGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    try {
      await createStudyGroup(me, network, { name: groupName, subject: groupSubject, memberEmails: selectedFriends });
      setMessage({ type: 'success', text: `Study group "${groupName.trim()}" created.` });
      setGroupName('');
      setGroupSubject('');
      setSelectedFriends([]);
      setShowGroupForm(false);
    } catch (error) {
      fail(error, 'Could not create the study group.');
    }
  };

  const handleLeave = async (groupId: string) => {
    setMessage(null);
    try {
      await leaveStudyGroup(me, network, groupId);
    } catch (error) {
      fail(error, 'Could not update the study group.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr] gap-6">
        {/* My code + connect */}
        <div className="bg-greyed-navy text-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
            <UserPlus className="w-5 h-5 text-greyed-blue" />
          </div>
          <h2 className="text-xl font-bold font-headline">Connect With Other Students</h2>
          <p className="text-white/70 text-sm mt-2">
            Share your code with a classmate. When they enter it, you become friends straight away.
          </p>

          <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Your student code</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-mono text-lg font-bold tracking-wide">{network.profile.inviteCode}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                title="Copy your student code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs font-semibold text-green-200 mt-2">Copied</p>}
          </div>

          <form onSubmit={handleConnect} className="mt-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Have a friend's code?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={event => setCodeInput(event.target.value)}
                placeholder="GE-XXXXXX"
                className="flex-1 min-w-0 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-mono uppercase text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-greyed-blue/60"
              />
              <button type="submit" className="px-4 py-3 rounded-xl bg-white text-greyed-navy text-sm font-bold hover:bg-white/90 transition-colors">
                Connect
              </button>
            </div>
          </form>
        </div>

        {/* Friends */}
        <div className="bg-white border border-greyed-navy/10 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-greyed-blue/15 text-greyed-navy flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-greyed-navy">My Friends</h2>
              <p className="text-sm text-greyed-navy/60">
                {network.friends.length === 0 ? 'No friends yet.' : `${network.friends.length} connected student${network.friends.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>

          {network.friends.length === 0 ? (
            <p className="text-sm text-greyed-navy/60 rounded-xl bg-greyed-navy/5 p-4">
              Enter a classmate's code, or accept someone from the board below, to add your first friend.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {network.friends.map(friend => (
                <div key={friend.email} className="flex items-center gap-3 p-3 rounded-xl border border-greyed-navy/10">
                  <div className="w-10 h-10 rounded-full bg-greyed-navy text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {getInitials(friend.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-greyed-navy truncate">{friend.name}</p>
                    <p className="text-xs text-greyed-navy/55">Friends since {new Date(friend.connectedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Study groups */}
      <div className="bg-white border border-greyed-navy/10 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-greyed-blue/15 text-greyed-navy flex items-center justify-center">
              <UsersRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-greyed-navy">Study Groups</h2>
              <p className="text-sm text-greyed-navy/60">Group your friends by subject and revise together.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGroupForm(prev => !prev)}
            disabled={network.friends.length === 0}
            title={network.friends.length === 0 ? 'Connect with a friend first' : undefined}
            className="inline-flex items-center justify-center gap-2 bg-greyed-navy hover:bg-greyed-navy/90 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            New study group
          </button>
        </div>

        {showGroupForm && (
          <form onSubmit={handleCreateGroup} className="rounded-xl border border-greyed-navy/10 bg-greyed-navy/[0.02] p-4 mb-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-bold text-greyed-navy mb-1">Group name</span>
                <input type="text" value={groupName} onChange={event => setGroupName(event.target.value)} placeholder="Maths exam squad" className={inputClass} />
              </label>
              <label className="block">
                <span className="block text-sm font-bold text-greyed-navy mb-1">Subject</span>
                <input type="text" value={groupSubject} onChange={event => setGroupSubject(event.target.value)} placeholder="Mathematics" className={inputClass} />
              </label>
            </div>
            <div>
              <span className="block text-sm font-bold text-greyed-navy mb-2">Invite friends</span>
              <div className="flex flex-wrap gap-2">
                {network.friends.map(friend => {
                  const selected = selectedFriends.includes(friend.email);
                  return (
                    <button
                      key={friend.email}
                      type="button"
                      onClick={() => toggleFriend(friend.email)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                        selected ? 'bg-greyed-navy text-white border-greyed-navy' : 'bg-white text-greyed-navy border-greyed-navy/15 hover:bg-greyed-navy/5'
                      }`}
                    >
                      {friend.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="submit" className="bg-greyed-navy hover:bg-greyed-navy/90 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Create group
            </button>
          </form>
        )}

        {network.groups.length === 0 ? (
          <p className="text-sm text-greyed-navy/60">You are not in any study groups yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {network.groups.map(group => {
              const isOwner = group.ownerEmail === me.email.toLowerCase();
              return (
                <div key={group.id} className="rounded-xl border border-greyed-navy/10 p-4 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-greyed-navy truncate">{group.name}</p>
                      {group.subject && <p className="text-xs text-greyed-navy/55">{group.subject}</p>}
                    </div>
                    {isOwner && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-greyed-blue/10 text-greyed-navy px-2 py-1 rounded-full">Owner</span>
                    )}
                  </div>
                  <div className="flex -space-x-2 mt-4">
                    {group.members.slice(0, 6).map(member => (
                      <div
                        key={member.email}
                        title={member.name}
                        className="w-8 h-8 rounded-full bg-[#bbd7eb] border-2 border-white text-[11px] font-bold text-greyed-navy flex items-center justify-center"
                      >
                        {getInitials(member.name)}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-greyed-navy/55 mt-2">{group.members.length} member{group.members.length === 1 ? '' : 's'}</p>
                  <button
                    type="button"
                    onClick={() => handleLeave(group.id)}
                    className="mt-4 self-start inline-flex items-center gap-1.5 text-xs font-bold text-greyed-navy/60 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {isOwner ? 'Delete group' : 'Leave group'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFriendsPanel;
