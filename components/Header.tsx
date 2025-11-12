import React from 'react';

export const Header: React.FC = () => (
  <header className="text-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
      ИИ-Рассказчик
    </h1>
    <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
      Превратите любую тему в увлекательную историю. Введите запрос, выберите жанр, и мы поможем вам понять и запомнить сложные вещи простым языком.
    </p>
  </header>
);