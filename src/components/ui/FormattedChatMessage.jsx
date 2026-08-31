import React from 'react';

/**
 * Formats inline Markdown patterns: **bold**, *italic*, and [link](url)
 */
const renderInlineFormatted = (text) => {
  if (!text) return null;

  // Match markdown links [text](url) or bold **text** or italic *text*
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Link: [Title](https://...)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, linkText, linkUrl] = match;
        return (
          <a
            key={index}
            href={linkUrl}
            target={linkUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noreferrer"
            className="text-gold-400 hover:text-gold-300 underline underline-offset-2 font-medium transition-colors"
          >
            {linkText}
          </a>
        );
      }
    }

    // 2. Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-amber-300 tracking-normal">
          {content}
        </strong>
      );
    }

    // 3. Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-200">
          {content}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

/**
 * FormattedChatMessage
 * Renders structured markdown (headings, bullets, numbered lists, bold text, links)
 * with luxury concierge typography and no raw asterisk clutter.
 */
const FormattedChatMessage = ({ text, isStreaming = false }) => {
  if (!text && !isStreaming) return null;

  // Split by double newline to handle paragraphs and blocks
  const rawBlocks = (text || '').split(/\n\n+/);

  return (
    <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-100 font-sans">
      {rawBlocks.map((block, bIdx) => {
        const lines = block.split('\n');

        // Check if block is a bulleted list
        const isBulletList = lines.length > 0 && lines.every((line) => /^\s*[-*•]\s+/.test(line.trim()));
        if (isBulletList) {
          return (
            <ul key={bIdx} className="space-y-1.5 my-1.5 pl-1 pr-1">
              {lines.map((line, lIdx) => {
                const clean = line.replace(/^\s*[-*•]\s+/, '').trim();
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="text-gold-400 text-[10px] select-none mt-1 shrink-0">✦</span>
                    <span className="flex-1">{renderInlineFormatted(clean)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Check if block is a numbered list
        const isNumberedList = lines.length > 0 && lines.every((line) => /^\s*\d+[\.\)]\s+/.test(line.trim()));
        if (isNumberedList) {
          return (
            <ol key={bIdx} className="space-y-1.5 my-1.5 pl-1 pr-1">
              {lines.map((line, lIdx) => {
                const match = line.match(/^\s*(\d+)[\.\)]\s+(.*)/);
                const num = match ? match[1] : lIdx + 1;
                const clean = match ? match[2] : line;
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 select-none">
                      {num}
                    </span>
                    <span className="flex-1">{renderInlineFormatted(clean)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Mixed block: render line by line if there are headings
        return (
          <div key={bIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                const cleanHeading = trimmed.replace(/^#+\s+/, '');
                return (
                  <h4
                    key={lIdx}
                    className="text-xs sm:text-sm font-bold text-gold-300 border-b border-gold-500/20 pb-1 mt-2 mb-1"
                  >
                    {renderInlineFormatted(cleanHeading)}
                  </h4>
                );
              }
              if (!trimmed) return null;
              return (
                <p key={lIdx} className="break-words">
                  {renderInlineFormatted(line)}
                </p>
              );
            })}
          </div>
        );
      })}

      {/* Streaming cursor pulse */}
      {isStreaming && (
        <span className="inline-block w-1.5 h-3.5 bg-amber-400 animate-pulse ml-1 align-middle" />
      )}
    </div>
  );
};

export default FormattedChatMessage;
