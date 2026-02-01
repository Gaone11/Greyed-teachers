import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const DyslexiaModeToggle: React.FC = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSetting();
  }, [user]);

  useEffect(() => {
    applyMode();
  }, [enabled]);

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

  const toggleMode = async () => {
    const newValue = !enabled;
    setEnabled(newValue);

    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ dyslexia_mode_enabled: newValue })
          .eq('id', user.id);

        if (error) throw error;
      } catch {
        setEnabled(!newValue);
      }
    }
  };

  const applyMode = () => {
    const rootElement = document.documentElement;

    if (enabled) {
      rootElement.classList.add('dyslexia-mode');
    } else {
      rootElement.classList.remove('dyslexia-mode');
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <button
      onClick={toggleMode}
      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
        enabled
          ? 'bg-greyed-blue text-greyed-navy'
          : 'bg-greyed-navy/10 text-greyed-navy hover:bg-greyed-navy/20'
      }`}
      title={enabled ? 'Accessible Mode (Click to disable)' : 'Standard Mode (Click to enable accessible mode)'}
      aria-label={enabled ? 'Disable Dyslexia Mode' : 'Enable Dyslexia Mode'}
    >
      {enabled ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  );
};

export default DyslexiaModeToggle;
