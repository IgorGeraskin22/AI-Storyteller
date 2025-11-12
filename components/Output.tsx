import React, { useState } from 'react';
import { StoryResponse } from '../types';
import { Diagram } from './Diagram';
import { CopyIcon, ExportIcon, CheckIcon } from './icons';

interface OutputProps {
  result: StoryResponse;
}

export const Output: React.FC<OutputProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const fullText = [
    result.story,
    result.examples ? `\n\n### Практическое применение\n\n${result.examples}` : ''
  ].join('');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText.replace(/### .+\n\n/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    createDownload(fullText.replace(/### .+\n\n/g, ''), 'story.txt', 'text/plain;charset=utf-8');
  };

  const handleExportMd = () => {
    createDownload(fullText, 'story.md', 'text/markdown;charset=utf-8');
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 animate-fade-in">
      <div className="flex justify-end items-center gap-2 mb-4">
        <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300">
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Скопировано!' : 'Копировать текст'}
        </button>
        <button onClick={handleExportTxt} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300">
          <ExportIcon />
          Экспорт в TXT
        </button>
         <button onClick={handleExportMd} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300">
          <ExportIcon />
          Экспорт в MD
        </button>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
        {result.story.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {result.diagram && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">Визуальная схема</h3>
          <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
            <Diagram data={result.diagram} />
          </div>
        </div>
      )}

      {result.examples && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">Практическое применение</h3>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-lg">
             {result.examples.split('\n').map((line, index) => (
              <p key={index} className="my-2">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
