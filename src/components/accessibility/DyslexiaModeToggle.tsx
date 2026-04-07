import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const STORAGE_KEY = 'dyslexia_mode_enabled';

const DyslexiaModeToggle: React.FC = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSetting();
  }, [user]);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dyslexia-mode');
    } else {
      document.documentElement.classList.remove('dyslexia-mode');
    }
  }, [enabled]);

  const loadSetting = async () => {
    // Try localStorage first for instant load
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached !== null) {
      setEnabled(cached === 'true');
      setLoading(false);
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('profiles')
        .select('dyslexia_mode_enabled')
        .eq('id', user.id)
        .single();

      if (data) {
        const val = data.dyslexia_mode_enabled || false;
        setEnabled(val);
        localStorage.setItem(STORAGE_KEY, String(val));
      }
    } catch {
      // keep localStorage value
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));

    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ dyslexia_mode_enabled: newValue })
          .eq('id', user.id);
      } catch {
        // visual state stays — localStorage keeps it persistent
      }
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
