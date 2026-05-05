import React, { useState, useEffect } from 'react';
import { getQuizQuestions, submitAnswer, submitQuiz } from '../services/api';

export default function QuizPage({ user, onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const sessionId = localStorage.getItem('sessionId');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuizQuestions(sessionId);
      if (response.questions) {
        setQuestions(response.questions);
        setError('');
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, answerId, isMultiple) => {
    setSelectedAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        if (currentAnswers.includes(answerId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== answerId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId],
          };
        }
      } else {
        return {
          ...prev,
          [questionId]: [answerId],
        };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (
      !window.confirm(
        'Are you sure you want to submit the quiz? You cannot change your answers after submission.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Submit all answers
      for (const questionId in selectedAnswers) {
        const answerIds = selectedAnswers[questionId] || [];
        if (answerIds.length > 0) {
          await submitAnswer(sessionId, parseInt(questionId), answerIds);
        }
      }

      // Submit quiz
      const response = await submitQuiz(sessionId);
      if (response.sessionId) {
        setQuizResult(response);
        setSubmitted(true);
      } else {
        setError('Failed to submit quiz');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (submitted && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-lg w-full card text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">[OK] Quiz Completed!</h1>
          <div className="mb-6">
            <p className="text-gray-600 text-lg mb-2">Your Score:</p>
            <div className="text-5xl font-bold text-blue-600">{quizResult.percentage}%</div>
            <p className="text-gray-600 mt-2">
              {quizResult.score} out of {quizResult.totalQuestions} correct
            </p>
          </div>

          <div className={`p-4 rounded-lg mb-6 ${
            quizResult.percentage >= 80
              ? 'bg-green-100 text-green-800'
              : quizResult.percentage >= 60
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {quizResult.percentage >= 80 && '[A+] Excellent! You passed the quiz!'}
            {quizResult.percentage >= 60 && quizResult.percentage < 80 && '[A] Good job! You passed the quiz.'}
            {quizResult.percentage < 60 && '[B] Keep practicing!'}
          </div>

          <button
            onClick={onLogout}
            className="btn-primary w-full"
          >
            [L] Logout
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-lg text-gray-600">No questions available.</p>
          <button onClick={onLogout} className="btn-primary mt-4">
            [L] Logout
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMultiple = currentQuestion.type === 'MCQ';
  const currentAnswers = selectedAnswers[currentQuestion.id] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">[?] Quiz</h1>
            <p className="text-gray-600">Welcome, {user.username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="btn-outline"
          >
            [L] Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            [!] {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.title}
          </h2>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer) => (
              <label
                key={answer.id}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-all"
              >
                <input
                  type={isMultiple ? 'checkbox' : 'radio'}
                  name={`question-${currentQuestion.id}`}
                  checked={currentAnswers.includes(answer.id)}
                  onChange={() => handleSelectAnswer(currentQuestion.id, answer.id, isMultiple)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 text-gray-700">{answer.text}</span>
              </label>
            ))}
          </div>

          {isMultiple && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                [*] <span className="font-semibold">Multiple Choice:</span> Select all correct answers.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg font-semibold ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            [{"<"}] Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Next [{">"}]
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Submitting...' : '[OK] Submit Quiz'}
            </button>
          )}
        </div>

        {/* Answered Questions Indicator */}
        <div className="mt-8 card">
          <p className="text-gray-700 font-semibold mb-3">[*] Questions Status:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : selectedAnswers[q.id]?.length > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
