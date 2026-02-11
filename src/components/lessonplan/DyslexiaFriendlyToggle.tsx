import React from 'react';
import { Eye, FileText, Sparkles } from 'lucide-react';

interface DyslexiaFriendlyToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

const DyslexiaFriendlyToggle: React.FC<DyslexiaFriendlyToggleProps> = ({
  enabled,
  onChange,
  onGenerate,
  isGenerating = false
}) => {
  return (
    <div className="bg-white rounded-lg border-2 border-primary/10 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
            <Eye size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-primary">Dyslexia-Friendly Format</h3>
            <p className="text-sm text-primary/70">
              Generate an accessible version of this lesson plan
            </p>
          </div>
        </div>
        <button
          onClick={() => onChange(!enabled)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="bg-surface/20 rounded-lg p-4 space-y-3">
          <p className="text-sm text-primary font-semibold mb-2">
            Accessibility Features:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">OpenDyslexic Font</p>
                <p className="text-xs text-primary/70">Easy-to-read typeface</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Increased Spacing</p>
                <p className="text-xs text-primary/70">1.8x line height</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Simplified Language</p>
                <p className="text-xs text-primary/70">Clear, concise text</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">High Contrast</p>
                <p className="text-xs text-primary/70">Enhanced readability</p>
              </div>
            </div>
          </div>

          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Accessible Version...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Dyslexia-Friendly Version
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DyslexiaFriendlyToggle;
