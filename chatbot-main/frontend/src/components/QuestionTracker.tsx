import React from 'react';

interface QuestionTrackerProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionTracker: React.FC<QuestionTrackerProps> = ({ currentQuestion, totalQuestions }) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-[#dca7ff] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuestionTracker;

