import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const DyslexiaModeBadge: React.FC = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSetting();
  }, [user]);

  const loadSetting = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('dyslexia_mode_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setEnabled(data.dyslexia_mode_enabled || false);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (loading || !enabled) {
    return null;
  }

  return (
    <div className="dyslexia-mode-badge">
      <Eye size={16} className="dyslexia-mode-badge-icon" />
      <span>Accessible Mode</span>
    </div>
  );
};

export default DyslexiaModeBadge;
