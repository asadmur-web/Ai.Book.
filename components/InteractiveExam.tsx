import React, { useState, useMemo } from 'react';
import { ExamData, Question } from '../types';
import ActionButton from './shared/ActionButton';
import { Check, X } from 'lucide-react';

interface InteractiveExamProps {
  examData: ExamData;
}

const InteractiveExam: React.FC<InteractiveExamProps> = ({ examData }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = useMemo(() => {
    if (!submitted) return 0;
    return examData.questions.reduce((acc, question, index) => {
      const userAnswer = userAnswers[index]?.trim();
      const correctAnswer = question.correctAnswer.trim();
      return userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? acc + 1 : acc;
    }, 0);
  }, [submitted, userAnswers, examData.questions]);

  const renderQuestion = (question: Question, index: number) => {
    const isCorrect = submitted && userAnswers[index]?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    
    const getBorderColor = () => {
        if (!submitted) return 'border-gray-700';
        return isCorrect ? 'border-green-500/50' : 'border-red-500/50';
    };

    return (
      <div key={index} className={`bg-gray-900/50 p-4 rounded-lg border-2 ${getBorderColor()} transition-colors`}>
        <p className="font-semibold mb-3">{index + 1}. {question.questionText}</p>
        
        {question.type === 'MultipleChoice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, optIndex) => (
              <label key={optIndex} className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${userAnswers[index] === option ? 'bg-purple-900/50' : 'hover:bg-gray-800'}`}>
                <input
                  type="radio"
                  name={`q${index}`}
                  value={option}
                  checked={userAnswers[index] === option}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={submitted}
                  className="form-radio text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'TrueFalse' && (
           <div className="flex space-x-4">
             {['صح', 'خطأ'].map(option => (
                <label key={option} className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${userAnswers[index] === option ? 'bg-purple-900/50' : 'hover:bg-gray-800'}`}>
                    <input
                        type="radio"
                        name={`q${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        disabled={submitted}
                        className="form-radio text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-600"
                    />
                    <span>{option}</span>
                </label>
             ))}
           </div>
        )}

        {question.type === 'FillInTheBlank' && (
            <input
                type="text"
                value={userAnswers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={submitted}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="اكتب إجابتك هنا"
            />
        )}
        
        {submitted && (
            <div className={`mt-3 p-2 rounded-md text-sm flex items-center ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {isCorrect ? <Check className="w-4 h-4 ml-2" /> : <X className="w-4 h-4 ml-2" />}
                {isCorrect ? 'إجابة صحيحة!' : `الإجابة الصحيحة: ${question.correctAnswer}`}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-orbitron text-center">{examData.title}</h2>
      
      {submitted && (
        <div className="bg-gradient-to-r from-purple-600/30 to-blue-500/30 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">نتيجتك النهائية</p>
            <p className="text-3xl font-orbitron my-2">{score} / {examData.questions.length}</p>
        </div>
      )}

      <div className="space-y-4">
        {examData.questions.map(renderQuestion)}
      </div>

      {!submitted && (
        <div className="flex justify-center mt-6">
            <ActionButton
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length !== examData.questions.length}
            >
                إرسال الإجابات
            </ActionButton>
        </div>
      )}
    </div>
  );
};

export default InteractiveExam;
