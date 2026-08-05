import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Link2, Megaphone, Send, Users } from 'lucide-react';
import {
  ConnectedAnnouncement,
  CONNECTED_ANNOUNCEMENTS_UPDATED_EVENT,
  loadConnectedAnnouncements,
  publishConnectedAnnouncement,
} from '../../lib/connected-announcements';
import {
  ConnectionRole,
  CONNECTION_UPDATED_EVENT,
  isConnectionCircleReady,
  loadConnectionCircle,
  loadRemoteConnectionCircle,
} from '../../lib/connection-circle';
import { useAuth } from '../../context/AuthContext';

interface ConnectedAnnouncementsPanelProps {
  currentRole: ConnectionRole;
  canCompose?: boolean;
}

const formatAnnouncementDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const ConnectedAnnouncementsPanel: React.FC<ConnectedAnnouncementsPanelProps> = ({
  currentRole,
  canCompose = false,
}) => {
  const { user } = useAuth();
  const [circle, setCircle] = useState(() => loadConnectionCircle());
  const [announcements, setAnnouncements] = useState<ConnectedAnnouncement[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState('');

  const connected = isConnectionCircleReady(circle);

  const refreshAnnouncements = useCallback(async (showLoading = false) => {
    if (!isConnectionCircleReady(circle)) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    const list = await loadConnectedAnnouncements(circle);
    setAnnouncements(list);
    if (showLoading) setLoading(false);
  }, [circle]);

  useEffect(() => {
    refreshAnnouncements(true);
  }, [refreshAnnouncements]);

  useEffect(() => {
    let active = true;

    const syncRemoteCircle = async () => {
      if (!user?.email || isConnectionCircleReady(loadConnectionCircle())) return;
      const remoteCircle = await loadRemoteConnectionCircle(user.email);
      if (active && remoteCircle) setCircle(remoteCircle);
    };

    syncRemoteCircle();

    return () => {
      active = false;
    };
  }, [user?.email]);

  useEffect(() => {
    const refreshCircle = () => setCircle(loadConnectionCircle());
    const refreshList = () => refreshAnnouncements(false);
    const interval = window.setInterval(refreshList, 5000);

    window.addEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
    window.addEventListener(CONNECTED_ANNOUNCEMENTS_UPDATED_EVENT, refreshList);
    window.addEventListener('storage', refreshList);

    return () => {
      window.removeEventListener(CONNECTION_UPDATED_EVENT, refreshCircle);
      window.removeEventListener(CONNECTED_ANNOUNCEMENTS_UPDATED_EVENT, refreshList);
      window.removeEventListener('storage', refreshList);
      window.clearInterval(interval);
    };
  }, [refreshAnnouncements]);

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !body.trim() || publishing || !connected) return;

    setPublishing(true);
    setNotice('');
    const saved = await publishConnectedAnnouncement(circle, currentRole, {
      title,
      body,
      audience: 'all',
    });
    setAnnouncements(current => [saved, ...current.filter(item => item.id !== saved.id)]);
    setTitle('');
    setBody('');
    setNotice('Announcement sent to the student and parent hubs.');
    setPublishing(false);
  };

  if (!connected) {
    return (
      <div className="flex-1 flex items-center justify-center bg-greyed-navy/5 p-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-greyed-navy/10 text-greyed-navy flex items-center justify-center mx-auto mb-3">
            <Link2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-greyed-navy">Connect your learning circle first</h3>
          <p className="text-sm text-greyed-navy/60 mt-2">
            Once the student, teacher, and parent are connected, announcements will appear across their hubs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-greyed-navy/5 overflow-y-auto p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-5">
        {canCompose && (
          <form onSubmit={handlePublish} className="bg-white rounded-xl border border-greyed-navy/10 p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-greyed-navy font-bold">
              <Megaphone className="w-4 h-4 text-greyed-blue" />
              New Announcement
            </div>
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Announcement title"
              className="w-full rounded-lg border border-greyed-navy/10 bg-greyed-navy/5 px-3 py-2 text-sm text-greyed-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue/40"
            />
            <textarea
              value={body}
              onChange={event => setBody(event.target.value)}
              placeholder="Write the announcement students and parents should see..."
              className="w-full min-h-[110px] rounded-lg border border-greyed-navy/10 bg-greyed-navy/5 px-3 py-2 text-sm text-greyed-navy resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-greyed-blue/40"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-greyed-navy/55 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Sends to {circle.members.student.name} and {circle.members.parent.name}
              </div>
              <button
                type="submit"
                disabled={!title.trim() || !body.trim() || publishing}
                className="inline-flex items-center justify-center gap-2 bg-greyed-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-greyed-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {publishing ? 'Sending...' : 'Send announcement'}
              </button>
            </div>
            {notice && (
              <div className="rounded-lg bg-green-50 border border-green-100 text-green-700 px-3 py-2 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                {notice}
              </div>
            )}
          </form>
        )}

        {loading ? (
          <div className="text-center text-sm text-greyed-navy/50 py-10">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-xl border border-greyed-navy/10 p-6 text-center text-greyed-navy/60">
            <AlertCircle className="w-5 h-5 mx-auto mb-2 text-greyed-navy/35" />
            <p className="text-sm font-semibold">No announcements yet.</p>
          </div>
        ) : (
          announcements.map(announcement => (
            <article key={announcement.id} className="bg-white rounded-xl shadow-sm border border-greyed-navy/10 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-greyed-blue"></div>
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-greyed-navy text-lg">{announcement.title}</h3>
                  <p className="text-xs text-greyed-navy/50 mt-1">
                    From: {announcement.sender_name} • {formatAnnouncementDate(announcement.created_at)}
                  </p>
                </div>
                <span className="bg-greyed-blue/10 text-greyed-blue px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Sent
                </span>
              </div>
              <p className="text-sm text-greyed-navy/70 whitespace-pre-wrap">{announcement.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectedAnnouncementsPanel;
