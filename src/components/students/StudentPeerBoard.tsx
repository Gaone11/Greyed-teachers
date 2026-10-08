import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Megaphone, UserPlus, Users } from 'lucide-react';
import { useStudentNetwork } from '../../hooks/useStudentNetwork';
import { connectWithInviteCode, updateOpenToConnect } from '../../lib/student-network';

interface StudentPeerBoardProps {
  compact?: boolean;
}

const getInitials = (name: string) => name
  .split(' ')
  .map(part => part[0])
  .filter(Boolean)
  .slice(0, 2)
  .join('')
  .toUpperCase() || 'ST';

const StudentPeerBoard: React.FC<StudentPeerBoardProps> = ({ compact = false }) => {
  const { me, network, loading } = useStudentNetwork();
  const [headline, setHeadline] = useState('');
  const [busyCode, setBusyCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const savedHeadline = network?.profile.headline;

  useEffect(() => {
    if (savedHeadline !== undefined) setHeadline(savedHeadline);
  }, [savedHeadline]);

  if (loading || !network) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-greyed-navy/5 text-sm text-greyed-navy/60">
        Loading students who want to connect...
      </div>
    );
  }

  const { profile, board } = network;
  const visibleBoard = compact ? board.slice(0, 4) : board;

  const handleAccept = async (code: string, name: string) => {
    setBusyCode(code);
    setMessage(null);
    try {
      await connectWithInviteCode(me, network, code);
      setMessage({ type: 'success', text: `You and ${name} are now friends.` });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not accept that invite.' });
    } finally {
      setBusyCode('');
    }
  };

  const handleToggle = async () => {
    setMessage(null);
    try {
      await updateOpenToConnect(me, network, !profile.openToConnect, headline);
      setMessage({
        type: 'success',
        text: profile.openToConnect ? 'Your invite code is no longer on the board.' : 'Your invite code is now on the board.',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not update the board.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-greyed-navy/5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-greyed-navy flex items-center gap-2">
            <Users className="w-5 h-5 text-greyed-blue" />
            Students who want to connect
          </h2>
          <p className="text-sm text-greyed-navy/60 mt-1">Only students can see this board. Accept an invite to add them as a friend.</p>
        </div>
        {compact && (
          <Link to="/students/connections" className="text-sm font-semibold text-greyed-blue hover:text-[#2a2f6e] transition-colors whitespace-nowrap">
            Friends & groups
          </Link>
        )}
      </div>

      <div className="rounded-xl bg-greyed-navy/5 p-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-greyed-navy mb-2">
          <Megaphone className="w-4 h-4 text-greyed-blue" />
          {profile.openToConnect ? 'Your code is on the board' : 'Share your invite code here'}
          <span className="ml-auto font-mono text-xs bg-white px-2 py-1 rounded-md border border-greyed-navy/10">{profile.inviteCode}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={headline}
            maxLength={140}
            onChange={event => setHeadline(event.target.value)}
            placeholder="e.g. Looking for a Maths revision partner"
            className="flex-1 rounded-lg border border-greyed-navy/10 bg-white px-3 py-2 text-sm text-greyed-navy focus:outline-none focus:ring-2 focus:ring-greyed-blue/40"
          />
          <button
            type="button"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              profile.openToConnect
                ? 'bg-white border border-greyed-navy/15 text-greyed-navy hover:bg-greyed-navy/5'
                : 'bg-greyed-navy text-white hover:bg-greyed-navy/90'
            }`}
          >
            {profile.openToConnect ? 'Remove from board' : 'Post my code'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      {visibleBoard.length === 0 ? (
        <p className="text-sm text-greyed-navy/60 py-4 text-center">No students are looking to connect right now. Post your code to start.</p>
      ) : (
        <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {visibleBoard.map(peer => (
            <div key={peer.email} className="flex items-center gap-3 p-3 rounded-xl border border-greyed-navy/10">
              <div className="w-10 h-10 rounded-full bg-[#bbd7eb]/50 text-greyed-navy font-bold text-sm flex items-center justify-center flex-shrink-0">
                {getInitials(peer.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-greyed-navy truncate">
                  {peer.name}
                  {peer.sample && <span className="ml-2 text-[10px] uppercase tracking-wider text-greyed-navy/40">Sample</span>}
                </p>
                <p className="text-xs text-greyed-navy/60 truncate">{peer.headline || 'Open to new study friends'}</p>
                <p className="text-[11px] font-mono text-greyed-navy/45">{peer.inviteCode}</p>
              </div>
              <button
                type="button"
                disabled={busyCode === peer.inviteCode}
                onClick={() => handleAccept(peer.inviteCode, peer.name)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-greyed-navy text-white text-xs font-bold hover:bg-greyed-navy/90 disabled:opacity-60 transition-colors flex-shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Accept
              </button>
            </div>
          ))}
        </div>
      )}

      {network.mode === 'local' && (
        <p className="text-[11px] text-greyed-navy/45 mt-4">
          Saved on this device until the student network is switched on for your school.
        </p>
      )}
    </div>
  );
};

export default StudentPeerBoard;
