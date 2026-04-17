import React from 'react';
import Diagram from './DiagramLibrary';

// ── Types ─────────────────────────────────────────────────────────────────────
type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'formula'; text: string }
  | { type: 'diagram'; name: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'paragraph'; text: string }
  | { type: 'spacer' };

// ── Inline parser ─────────────────────────────────────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-greyed-navy">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ── Block parser ──────────────────────────────────────────────────────────────
function parseNotes(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length > 0) {
      blocks.push({ type: 'bullets', items: [...bullets] });
      bullets = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushBullets();
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (line.startsWith('### ')) {
      flushBullets();
      blocks.push({ type: 'h3', text: line.slice(4) });
    } else if (line.startsWith('> ')) {
      flushBullets();
      blocks.push({ type: 'formula', text: line.slice(2) });
    } else if (/^\[diagram:[^\]]+\]$/.test(line.trim())) {
      flushBullets();
      const name = line.trim().slice(9, -1);
      blocks.push({ type: 'diagram', name });
    } else if (line.startsWith('- ')) {
      bullets.push(line.slice(2));
    } else if (line.trim() === '') {
      flushBullets();
      blocks.push({ type: 'spacer' });
    } else {
      flushBullets();
      blocks.push({ type: 'paragraph', text: line });
    }
  }
  flushBullets();
  return blocks.filter((b, i, arr) => !(b.type === 'spacer' && (i === 0 || arr[i - 1]?.type === 'spacer')));
}

// ── Component ─────────────────────────────────────────────────────────────────
const NotesRenderer: React.FC<{ content: string }> = ({ content }) => {
  const blocks = parseNotes(content);

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} className="text-[13px] font-bold text-greyed-navy uppercase tracking-wide mt-5 mb-1 pb-1 border-b border-premium-neutral-200 first:mt-0">
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="text-sm font-semibold text-premium-navy mt-3 mb-0.5">
                {block.text}
              </h3>
            );
          case 'formula':
            return (
              <div key={i} className="bg-slate-800 border-l-2 border-amber-400 rounded-r-lg px-4 py-2 font-mono text-slate-100 text-[13px] my-2 select-all">
                {block.text}
              </div>
            );
          case 'diagram':
            return <Diagram key={i} name={block.name} />;
          case 'bullets':
            return (
              <ul key={i} className="space-y-1 pl-1 my-1">
                {block.items.map((item, j) => {
                  const isCorrect = item.includes('✓');
                  return (
                    <li key={j} className={`flex items-start gap-2 rounded-lg px-2 py-0.5 ${isCorrect ? 'bg-slate-800 text-slate-200' : 'text-premium-neutral-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[6px] ${isCorrect ? 'bg-slate-8000' : 'bg-greyed-blue'}`} />
                      <span>{parseInline(item)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          case 'paragraph':
            return (
              <p key={i} className="text-premium-neutral-800 leading-relaxed">
                {parseInline(block.text)}
              </p>
            );
          case 'spacer':
            return <div key={i} className="h-1.5" />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default NotesRenderer;
