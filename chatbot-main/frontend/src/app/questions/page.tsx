'use client';

import React, { useState } from 'react';

const QuestionsPage: React.FC = () => {
  const [language, setLanguage] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!language.trim()) {
      setError('Please enter a programming language');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          language: language.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions');
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setError('No questions available for this language');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-900">
      <div className="container max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-purple-800">Fetch Coding Questions</h1>

        {/* Input field */}
        <input
          type="text"
          placeholder="Enter programming language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border-2 border-purple-400 rounded-md mb-4 focus:outline-none focus:ring focus:ring-purple-300"
        />

        {/* Fetch Button */}
        <button
          onClick={fetchQuestions}
          disabled={loading}
          className={`w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-md transition ${
            loading ? 'bg-purple-300 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
        >
          {loading ? 'Fetching...' : 'Fetch Questions'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading mt-4 mx-auto w-6 h-6 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
        )}

        {/* Questions List */}
        <ul className="questions mt-6">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <li
                key={index}
                className="bg-purple-100 text-purple-800 p-3 rounded-md mb-2 shadow"
              >
                {question}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No questions to display</li>
          )}
        </ul>
      </div>
      <button
  onClick={() => window.location.href = 'http://localhost:5000/download_pdf'}
  className="w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700"
>
  Download Questions as PDF
</button>

    </div>
  );
  
};

export default QuestionsPage;
