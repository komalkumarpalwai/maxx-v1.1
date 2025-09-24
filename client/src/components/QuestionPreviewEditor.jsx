import React, { useState } from 'react';

const QuestionPreviewEditor = ({ questions, onSave, onCancel }) => {
  const [editedQuestions, setEditedQuestions] = useState(questions);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleQuestionChange = (index, field, value) => {
    setEditedQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      return newQuestions;
    });
  };

  const handleSave = () => {
    onSave(editedQuestions);
  };

  const getPageQuestions = () => {
    const start = (currentPage - 1) * questionsPerPage;
    return editedQuestions.slice(start, start + questionsPerPage);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="mb-4 text-sm text-gray-600">
        Showing {Math.min(questions.length, (currentPage - 1) * questionsPerPage + 1)} 
        - {Math.min(questions.length, currentPage * questionsPerPage)} of {questions.length} questions
      </div>

      {getPageQuestions().map((question, idx) => {
        const actualIndex = (currentPage - 1) * questionsPerPage + idx;
        return (
          <div key={actualIndex} className="mb-6 p-4 border rounded bg-gray-50">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Question {actualIndex + 1}</label>
              <textarea
                className="w-full p-2 border rounded"
                value={question.question}
                onChange={(e) => handleQuestionChange(actualIndex, 'question', e.target.value)}
                rows={2}
              />
            </div>
            
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="mb-2">
                <label className="block text-sm mb-1">Option {num}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={question[`option${num}`]}
                  onChange={(e) => handleQuestionChange(actualIndex, `option${num}`, e.target.value)}
                />
              </div>
            ))}
            
            <div className="flex gap-4">
              <div>
                <label className="block text-sm mb-1">Correct Answer</label>
                <select
                  className="p-2 border rounded"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(actualIndex, 'correctAnswer', e.target.value)}
                >
                  <option value="">Select Answer</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                  <option value="4">Option 4</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Points</label>
                <input
                  type="number"
                  min="1"
                  className="w-20 p-2 border rounded"
                  value={question.points}
                  onChange={(e) => handleQuestionChange(actualIndex, 'points', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 my-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSave}
        >
          Save All Questions
        </button>
      </div>
    </div>
  );
};

export default QuestionPreviewEditor;