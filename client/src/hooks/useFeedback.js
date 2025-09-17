import { useState, useEffect } from 'react';

const FEEDBACK_TRIGGERS = {
  FIRST_VISIT: 'first_visit',
  TEST_COMPLETION: 'test_completion',
  PERIODIC: 'periodic',
  FEATURE_USAGE: 'feature_usage',
  EXIT_INTENT: 'exit_intent'
};

const FEEDBACK_INTERVALS = {
  PERIODIC_DAYS: 90, // Show periodic feedback every 90 days
  MIN_TESTS_FOR_FEEDBACK: 3, // Ask for feedback after completing 3 tests
};

export const useFeedback = (user) => {
  const [shouldShowFeedback, setShouldShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  
  const checkFeedbackEligibility = () => {
    if (!user) return false;

    const now = new Date().getTime();
    const lastFeedbackDate = localStorage.getItem(`last_feedback_${user._id}`);
    const firstVisitShown = localStorage.getItem(`feedback_shown_${user._id}`);
    const testCompletionCount = parseInt(localStorage.getItem(`tests_completed_${user._id}`) || '0');
    
    // First visit feedback
    if (!firstVisitShown) {
      setFeedbackType(FEEDBACK_TRIGGERS.FIRST_VISIT);
      return true;
    }

    // Periodic feedback (every 90 days)
    if (lastFeedbackDate) {
      const daysSinceLastFeedback = (now - parseInt(lastFeedbackDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastFeedback >= FEEDBACK_INTERVALS.PERIODIC_DAYS) {
        setFeedbackType(FEEDBACK_TRIGGERS.PERIODIC);
        return true;
      }
    }

    // Test completion based feedback
    if (testCompletionCount >= FEEDBACK_INTERVALS.MIN_TESTS_FOR_FEEDBACK) {
      const testFeedbackShown = localStorage.getItem(`test_feedback_${user._id}`);
      if (!testFeedbackShown) {
        setFeedbackType(FEEDBACK_TRIGGERS.TEST_COMPLETION);
        return true;
      }
    }

    return false;
  };

  const recordFeedbackShown = (type) => {
    const now = new Date().getTime();
    localStorage.setItem(`last_feedback_${user._id}`, now.toString());
    
    if (type === FEEDBACK_TRIGGERS.FIRST_VISIT) {
      localStorage.setItem(`feedback_shown_${user._id}`, '1');
    } else if (type === FEEDBACK_TRIGGERS.TEST_COMPLETION) {
      localStorage.setItem(`test_feedback_${user._id}`, '1');
    }
  };

  const incrementTestCompletion = () => {
    if (!user) return;
    const currentCount = parseInt(localStorage.getItem(`tests_completed_${user._id}`) || '0');
    localStorage.setItem(`tests_completed_${user._id}`, (currentCount + 1).toString());
  };

  useEffect(() => {
    const shouldShow = checkFeedbackEligibility();
    if (shouldShow) {
      // Add a small delay for better UX
      setTimeout(() => setShouldShowFeedback(true), 2000);
    }
  }, [user]);

  // Exit intent detection
  useEffect(() => {
    const handleExitIntent = (e) => {
      if (e.clientY <= 0) {
        // Check if we haven't shown exit feedback recently
        const lastExitFeedback = localStorage.getItem(`exit_feedback_${user?._id}`);
        const now = new Date().getTime();
        if (!lastExitFeedback || (now - parseInt(lastExitFeedback)) > (24 * 60 * 60 * 1000)) {
          setFeedbackType(FEEDBACK_TRIGGERS.EXIT_INTENT);
          setShouldShowFeedback(true);
          localStorage.setItem(`exit_feedback_${user?._id}`, now.toString());
        }
      }
    };

    if (user) {
      document.addEventListener('mouseleave', handleExitIntent);
    }

    return () => {
      document.removeEventListener('mouseleave', handleExitIntent);
    };
  }, [user]);

  return {
    shouldShowFeedback,
    feedbackType,
    recordFeedbackShown,
    incrementTestCompletion,
    closeFeedback: () => setShouldShowFeedback(false)
  };
};