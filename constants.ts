import { Genre, StoryLength } from './types';

export const GENRES: Genre[] = [
  { id: 'sci-fi', label: 'Фантастика' },
  { id: 'drama', label: 'Драма' },
  { id: 'thriller', label: 'Триллер' },
  { id: 'fairy-tale', label: 'Сказка' },
  { id: 'spy-novel', label: 'Шпионский роман' },
  { id: 'detective', label: 'Детектив-приключение' },
  { id: 'adventure', label: 'Приключенческий роман' },
  { id: 'mystery', label: 'Мистерия' },
  { id: 'comedy', label: 'Комедия' },
];

export const STORY_LENGTHS: StoryLength[] = [
  { id: 'short', label: 'Короткий' },
  { id: 'medium', label: 'Средний' },
  { id: 'long', label: 'Длинный' },
  { id: 'full', label: 'Полный разбор' },
];
