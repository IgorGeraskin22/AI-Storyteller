import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { GENRES, STORY_LENGTHS } from './constants';
import { Genre, StoryLength, StoryRequest, StoryResponse } from './types';
import { Controls } from './components/Controls';
import { Output } from './components/Output';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/icons';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [genre, setGenre] = useState<Genre>(GENRES[0]);
  const [length, setLength] = useState<StoryLength>(STORY_LENGTHS[1]);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeExamples, setIncludeExamples] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StoryResponse | null>(null);

  const generatePrompt = (request: StoryRequest): string => {
    const { topic, genre, length, includeDiagram, includeExamples } = request;

    const technicalDecomposition = `
**Если тема техническая или научная, обязательно проведи её декомпозицию:**
- Что это такое (простое определение).
- Из чего состоит (ключевые части/структура).
- Как работает по шагам.
- Когда применяется и зачем.
- Основные методы/операции/подтипы.
- Сравнение с близкими понятиями.
- Достоинства и ограничения.
- Типичные ошибки и как их избежать.
`;

    return `Ты — ИИ-рассказчик. Твоя задача — превратить любую тему в увлекательную и понятную историю на русском языке. Твоя аудитория — люди без специальной подготовки, включая школьников и пожилых.

**Основные правила:**
1.  **Язык:** Строго русский. Все термины объясняй простыми словами.
2.  **Стиль:** Простое, ясное повествование. Используй короткие предложения и избегай жаргона.
3.  **Фокус:** Не отклоняйся от заданной темы.
4.  **Аналогии:** Обязательно вплетай в рассказ сравнения и ассоциации из повседневной жизни, чтобы помочь читателю запомнить материал.
5.  **Примеры:** Постоянно приводи конкретные, жизненные примеры.
6.  **Формат рассказа:** Вывод должен быть разбит на абзацы (используй '\\n\\n' как разделитель). В итоговом тексте рассказа не должно быть никакого форматирования: ни заголовков, ни списков, ни жирного шрифта, ни курсива.

**Задание:**
- **Тема:** "${topic}"
- **Жанр:** "${genre.label}"
- **Длина рассказа:** "${length.label}"
${length.id === 'full' ? technicalDecomposition : ''}

Создай рассказ, который объясняет тему в соответствии с заданными параметрами.
${includeDiagram ? 'Если это уместно для темы, создай простую блок-схему или диаграмму для визуализации ключевой концепции. Диаграмма должна быть на русском языке и содержать от 3 до 8 блоков.' : ''}
${includeExamples ? 'В конце добавь отдельный раздел "Практическое применение" с 2-3 короткими примерами для работы, учебы и быта.' : ''}

Твой ответ ДОЛЖЕН быть в формате JSON. Не добавляй ничего кроме валидного JSON объекта.
`;
  };

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Пожалуйста, введите тему для рассказа.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API-ключ не найден. Убедитесь, что он настроен в переменных окружения.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const request: StoryRequest = { topic, genre, length, includeDiagram, includeExamples };
      const prompt = generatePrompt(request);

      const responseSchema = {
          type: Type.OBJECT,
          properties: {
            story: {
              type: Type.STRING,
              description: "Текст рассказа, разделенный на абзацы с помощью '\\n\\n'. Без markdown.",
            },
            diagram: {
              type: Type.OBJECT,
              description: "Объект, описывающий диаграмму. Присутствует только если диаграмма была запрошена и релевантна.",
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                    },
                  },
                },
                edges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      from: { type: Type.STRING },
                      to: { type: Type.STRING },
                      label: { type: Type.STRING, nullable: true },
                    },
                  },
                },
              },
              nullable: true,
            },
            practical_examples: {
              type: Type.STRING,
              description: "Текст с практическими примерами. Присутствует только если примеры были запрошены.",
              nullable: true,
            },
          },
      };

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7,
          }
      });

      const jsonString = response.text.trim();
      const parsedResult = JSON.parse(jsonString);

      setResult({
        story: parsedResult.story || "Не удалось сгенерировать рассказ.",
        diagram: parsedResult.diagram || null,
        examples: parsedResult.practical_examples || null,
      });

    } catch (e) {
      console.error(e);
      setError(`Произошла ошибка при генерации: ${e instanceof Error ? e.message : String(e)}. Попробуйте еще раз.`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, genre, length, includeDiagram, includeExamples]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <Controls
            topic={topic}
            setTopic={setTopic}
            genre={genre}
            setGenre={setGenre}
            length={length}
            setLength={setLength}
            includeDiagram={includeDiagram}
            setIncludeDiagram={setIncludeDiagram}
            includeExamples={includeExamples}
            setIncludeExamples={setIncludeExamples}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <p className="font-semibold">Ошибка</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-gray-400">Генерация рассказа... Это может занять некоторое время.</p>
              </div>
            )}
            {result && <Output result={result} />}
            {!isLoading && !result && (
                 <div className="text-center p-8 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-300">Здесь появится ваш рассказ</h3>
                    <p className="mt-2 text-gray-500">Заполните поля выше и нажмите "Сгенерировать", чтобы начать.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;