import React from 'react';
import { GENRES, STORY_LENGTHS } from '../constants';
import { Genre, StoryLength } from '../types';
import { GenerateIcon, DiagramIcon, ExamplesIcon } from './icons';

interface ControlsProps {
  topic: string;
  setTopic: (topic: string) => void;
  genre: Genre;
  setGenre: (genre: Genre) => void;
  length: StoryLength;
  setLength: (length: StoryLength) => void;
  includeDiagram: boolean;
  setIncludeDiagram: (include: boolean) => void;
  includeExamples: boolean;
  setIncludeExamples: (include: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const OptionButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500
        ${isActive ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
    >
      {icon}
      {label}
    </button>
);


export const Controls: React.FC<ControlsProps> = ({
  topic, setTopic, genre, setGenre, length, setLength,
  includeDiagram, setIncludeDiagram, includeExamples, setIncludeExamples,
  onGenerate, isLoading
}) => {
  return (
    <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700">
      <div className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-lg font-semibold text-gray-300 mb-2">
            1. Введите вашу тему
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Например: Что такое квантовая физика? или Принцип работы двигателя внутреннего сгорания"
            className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 text-gray-200 min-h-[60px] resize-y"
            rows={2}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">2. Выберите жанр</h3>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => setGenre(g)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500
                  ${genre.id === g.id ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >{g.label}</button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">3. Укажите длину рассказа</h3>
          <div className="flex flex-wrap gap-2">
            {STORY_LENGTHS.map(l => (
              <button
                key={l.id}
                onClick={() => setLength(l)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500
                  ${length.id === l.id ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >{l.label}</button>
            ))}
          </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">4. Дополнительные опции</h3>
            <div className="flex flex-wrap gap-3">
                <OptionButton 
                    label="Показать схемы" 
                    icon={<DiagramIcon />}
                    isActive={includeDiagram} 
                    onClick={() => setIncludeDiagram(!includeDiagram)} 
                />
                <OptionButton 
                    label="Примеры применения" 
                    icon={<ExamplesIcon />}
                    isActive={includeExamples} 
                    onClick={() => setIncludeExamples(!includeExamples)} 
                />
            </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 text-lg font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          <GenerateIcon />
          {isLoading ? 'Генерация...' : 'Сгенерировать рассказ'}
        </button>
      </div>
    </div>
  );
};
