import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Eye, Type, Maximize2, Contrast, Check } from 'lucide-react';

interface AccessibilityPreferences {
  dyslexia_mode_enabled: boolean;
  preferred_font: 'Inter' | 'OpenDyslexic' | 'Comic Sans MS' | 'Arial' | 'Verdana';
  font_size: number;
  line_spacing: number;
  contrast_theme: 'standard' | 'high_contrast' | 'dark_mode' | 'blue_yellow' | 'cream_brown';
  simplified_language: boolean;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Default)', preview: 'The quick brown fox' },
  { value: 'OpenDyslexic', label: 'OpenDyslexic', preview: 'The quick brown fox' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS', preview: 'The quick brown fox' },
  { value: 'Arial', label: 'Arial', preview: 'The quick brown fox' },
  { value: 'Verdana', label: 'Verdana', preview: 'The quick brown fox' }
];

const CONTRAST_THEMES = [
  { value: 'standard', label: 'Standard', bg: '#F5F3EF', text: '#1A3A52' },
  { value: 'high_contrast', label: 'High Contrast', bg: '#FFFFFF', text: '#000000' },
  { value: 'dark_mode', label: 'Dark Mode', bg: '#1A1A1A', text: '#FFFFFF' },
  { value: 'blue_yellow', label: 'Blue on Yellow', bg: '#FFFFE0', text: '#00008B' },
  { value: 'cream_brown', label: 'Cream on Brown', bg: '#FFF8DC', text: '#3E2723' }
];

const AccessibilitySettings: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    dyslexia_mode_enabled: false,
    preferred_font: 'Inter',
    font_size: 16,
    line_spacing: 1.5,
    contrast_theme: 'standard',
    simplified_language: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [user]);

  useEffect(() => {
    applyAccessibilitySettings();
  }, [preferences]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('dyslexia_mode_enabled, preferred_font, font_size, line_spacing, contrast_theme, simplified_language')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreferences({
          dyslexia_mode_enabled: data.dyslexia_mode_enabled || false,
          preferred_font: data.preferred_font || 'Inter',
          font_size: data.font_size || 16,
          line_spacing: data.line_spacing || 1.5,
          contrast_theme: data.contrast_theme || 'standard',
          simplified_language: data.simplified_language || false
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          dyslexia_mode_enabled: preferences.dyslexia_mode_enabled,
          preferred_font: preferences.preferred_font,
          font_size: preferences.font_size,
          line_spacing: preferences.line_spacing,
          contrast_theme: preferences.contrast_theme,
          simplified_language: preferences.simplified_language
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const applyAccessibilitySettings = () => {
    const rootElement = document.documentElement;

    if (preferences.dyslexia_mode_enabled) {
      rootElement.classList.add('dyslexia-mode');
      rootElement.classList.add(`font-${preferences.preferred_font.toLowerCase().replace(' ', '-')}`);
      rootElement.classList.add(`font-size-${preferences.font_size}`);
      rootElement.classList.add(`line-spacing-${preferences.line_spacing.toString().replace('.', '-')}`);
      rootElement.classList.add(`theme-${preferences.contrast_theme}`);
    } else {
      rootElement.classList.remove('dyslexia-mode');
      FONT_OPTIONS.forEach(font => {
        rootElement.classList.remove(`font-${font.value.toLowerCase().replace(' ', '-')}`);
      });
      [14, 16, 18, 20, 22, 24].forEach(size => {
        rootElement.classList.remove(`font-size-${size}`);
      });
      [1.5, 1.8, 2.0, 2.2, 2.5].forEach(spacing => {
        rootElement.classList.remove(`line-spacing-${spacing.toString().replace('.', '-')}`);
      });
      CONTRAST_THEMES.forEach(theme => {
        rootElement.classList.remove(`theme-${theme.value}`);
      });
    }
  };

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Accessibility Settings</h2>
        {preferences.dyslexia_mode_enabled && (
          <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-lg">
            <Eye size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Dyslexia Mode Active</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-primary mb-1">Enable Dyslexia Mode</h3>
            <p className="text-sm text-primary/70">
              Applies accessible formatting throughout the application
            </p>
          </div>
          <button
            onClick={() => updatePreference('dyslexia_mode_enabled', !preferences.dyslexia_mode_enabled)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              preferences.dyslexia_mode_enabled ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                preferences.dyslexia_mode_enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {preferences.dyslexia_mode_enabled && (
          <>
            <div className="border-t border-primary/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Type size={20} className="text-primary" />
                <h3 className="font-bold text-primary">Font Selection</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font.value}
                    onClick={() => updatePreference('preferred_font', font.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      preferences.preferred_font === font.value
                        ? 'border-primary bg-primary/5'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary">{font.label}</span>
                      {preferences.preferred_font === font.value && (
                        <Check size={20} className="text-primary" />
                      )}
                    </div>
                    <p
                      className="text-sm text-primary/70"
                      style={{ fontFamily: font.value }}
                    >
                      {font.preview}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-primary/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Maximize2 size={20} className="text-primary" />
                <h3 className="font-bold text-primary">Font Size</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-primary/70 w-20">14px</span>
                <input
                  type="range"
                  min="14"
                  max="24"
                  step="2"
                  value={preferences.font_size}
                  onChange={(e) => updatePreference('font_size', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-primary/70 w-20 text-right">24px</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-bold text-primary">{preferences.font_size}px</span>
              </div>
              <p
                className="mt-4 text-primary/80 p-4 bg-surface/20 rounded-lg"
                style={{ fontSize: `${preferences.font_size}px` }}
              >
                This is how your text will appear at this size.
              </p>
            </div>

            <div className="border-t border-primary/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Maximize2 size={20} className="text-primary rotate-90" />
                <h3 className="font-bold text-primary">Line Spacing</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-primary/70 w-20">1.5x</span>
                <input
                  type="range"
                  min="1.5"
                  max="2.5"
                  step="0.1"
                  value={preferences.line_spacing}
                  onChange={(e) => updatePreference('line_spacing', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-primary/70 w-20 text-right">2.5x</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-bold text-primary">{preferences.line_spacing}x</span>
              </div>
              <div
                className="mt-4 text-primary/80 p-4 bg-surface/20 rounded-lg"
                style={{ lineHeight: preferences.line_spacing }}
              >
                <p>This is how your line spacing will appear.</p>
                <p>Multiple lines help you see the effect clearly.</p>
                <p>Adjust until it feels comfortable to read.</p>
              </div>
            </div>

            <div className="border-t border-primary/10 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Contrast size={20} className="text-primary" />
                <h3 className="font-bold text-primary">Contrast Theme</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CONTRAST_THEMES.map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => updatePreference('contrast_theme', theme.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.contrast_theme === theme.value
                        ? 'border-primary'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                    style={{
                      backgroundColor: theme.bg,
                      color: theme.text
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{theme.label}</span>
                      {preferences.contrast_theme === theme.value && (
                        <Check size={20} />
                      )}
                    </div>
                    <p className="text-sm mt-2 opacity-80">Sample text preview</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="border-t border-primary/10 pt-6">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={20} />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
