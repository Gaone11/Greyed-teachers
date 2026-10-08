import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  loadStudentNetwork,
  StudentIdentity,
  StudentNetwork,
  STUDENT_NETWORK_UPDATED_EVENT,
} from '../lib/student-network';

export const useStudentNetwork = () => {
  const { user } = useAuth();
  const [network, setNetwork] = useState<StudentNetwork | null>(null);
  const [loading, setLoading] = useState(true);

  const me: StudentIdentity = useMemo(() => {
    const metadata = user?.user_metadata || {};
    const name = [metadata.first_name, metadata.last_name].filter(Boolean).join(' ')
      || metadata.name
      || user?.email?.split('@')[0]
      || 'Student';
    return { email: user?.email || 'student@this-device.local', name };
  }, [user]);

  const refresh = useCallback(async () => {
    const next = await loadStudentNetwork(me);
    setNetwork(next);
    setLoading(false);
  }, [me]);

  useEffect(() => {
    refresh();
    const handleUpdate = () => { refresh(); };
    window.addEventListener(STUDENT_NETWORK_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(STUDENT_NETWORK_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  return { me, network, loading, refresh };
};
