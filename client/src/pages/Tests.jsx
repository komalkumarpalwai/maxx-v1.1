import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, Users, BarChart3, Play } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import api from '../services/api';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attemptedTestIds, setAttemptedTestIds] = useState([]);
  // const { user } = useAuth(); // Not used
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
    fetchAttemptedTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/tests');
      if (res.data.success) {
        setTests(res.data.tests);
      } else {
        toast.error('Failed to fetch tests');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all test results for this user to know which tests have been attempted
  const fetchAttemptedTests = async () => {
    try {
      const res = await api.get('/api/tests/results/student');
      if (res.data.success) {
        const ids = res.data.results.map(r => r.test && (r.test._id || r.test));
        setAttemptedTestIds(ids);
      }
    } catch (error) {
      // ignore
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active Now';
      case 'upcoming':
        return 'Coming Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartTest = (testId) => {
    navigate(`/starttest/${testId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 w-full">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Tests</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Take tests to improve your skills and track your progress
          </p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            Promise.all([fetchTests(), fetchAttemptedTests()]).finally(() => setLoading(false));
          }}
          className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <h3 className="mt-2 text-base sm:text-sm font-medium text-gray-900">No tests available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Check back later for new tests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full border border-gray-100"
            >
              <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    {test.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    {test.description || 'No description available'}
                  </p>
                </div>
                <span className={`self-start xs:self-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}> 
                  {getStatusText(test.status)}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>{test.category}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{test.duration} minutes</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>{test.totalQuestions} questions</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Passing: {test.passingScore != null && test.passingScore !== '' ? test.passingScore + '%' : 'N/A'}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-auto">
                <div className="text-xs text-gray-500 mb-2 sm:mb-3">
                  <div>Starts: {formatDate(test.startDate)}</div>
                  <div>Ends: {formatDate(test.endDate)}</div>
                </div>

                {test.status === 'active' && !attemptedTestIds.includes(test._id) && (
                  <Button
                    onClick={() => handleStartTest(test._id)}
                    className="w-full text-xs sm:text-sm"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Test
                  </Button>
                )}
                {test.status === 'active' && attemptedTestIds.includes(test._id) && (
                  <div className="text-center text-green-600 font-semibold py-2 text-xs sm:text-base">
                    Attempted
                  </div>
                )}

                {test.status === 'upcoming' && (
                  <div className="text-center text-xs sm:text-sm text-gray-500 py-2">
                    Test will be available soon
                  </div>
                )}

                {test.status === 'expired' && (
                  <div className="text-center text-xs sm:text-sm text-gray-500 py-2">
                    Test has expired
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;








