import React, { useState } from 'react';
import api from '../services/api';

const FEEDBACK_PROMPTS = {
  first_visit: {
    title: "Welcome! How can we improve?",
    placeholder: "Share your first impressions and suggestions...",
  },
  test_completion: {
    title: "How was your test experience?",
    placeholder: "Tell us about your test-taking experience...",
  },
  periodic: {
    title: "Help us serve you better!",
    placeholder: "What features would you like to see? Any suggestions for improvement?",
  },
  feature_usage: {
    title: "How's this feature working for you?",
    placeholder: "Share your thoughts about this feature...",
  },
  exit_intent: {
    title: "Wait! Quick feedback before you go?",
    placeholder: "What made you leave? How can we improve?",
  }
};

const FeedbackPopup = ({ user, onClose, feedbackType = 'first_visit', context = {} }) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!message.trim()) {
      setError('Please enter your feedback.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/feedback', { 
        message,
        rating,
        feedbackType,
        context,
        userId: user?._id
      });
      if (res.data.success) {
        setSuccess('Thank you for your feedback!');
        setMessage('');
        setTimeout(onClose, 1500);
      } else {
        setError(res.data.message || 'Failed to submit feedback.');
      }
    } catch {
      setError('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
        <h3 className="text-lg font-bold mb-4">{FEEDBACK_PROMPTS[feedbackType].title}</h3>
        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate your experience?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`p-2 rounded-full focus:outline-none focus:ring-2 ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="input w-full mb-3 border rounded p-2"
            rows={5}
            placeholder={FEEDBACK_PROMPTS[feedbackType].placeholder}
            value={message}
            onChange={e => setMessage(e.target.value)}
            aria-label="Feedback message"
            required
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit Feedback'}</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
