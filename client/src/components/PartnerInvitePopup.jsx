import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PartnerInvitePopup = ({ onClose, onDontShowAgain, onMaybeLater }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [step, setStep] = useState('ask'); // 'ask' | 'invite'

  const handleClose = () => {
    if (dontShow) {
      onDontShowAgain?.();
    }
    onClose?.();
  };

  const handleSkipAsStudent = () => {
    // Students who skip should not be shown again
    onDontShowAgain?.();
    handleClose();
  };

  const handleMaybeLater = () => {
    // Parent can implement snooze persistence; call it if provided
    if (typeof onMaybeLater === 'function') {
      onMaybeLater();
    }
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-invite-title"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative transform transition-all duration-300 ease-out scale-100 opacity-100">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          &times;
        </button>

        {/* Ask step: are you an institution? */}
        {step === 'ask' ? (
          <div className="text-center">
            <h3 id="partner-invite-title" className="text-2xl font-bold mb-4 text-blue-600">
              Are you an institution or organization?
            </h3>

            <p className="text-gray-700 mb-6">We'd love to partner with institutions and organizations. Students can skip this.</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep('invite')}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                I'm an institution / organization
              </button>

              <button
                onClick={handleSkipAsStudent}
                className="w-full border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                I'm a student — Skip
              </button>
            </div>
          </div>
        ) : (
          // Invite step (existing content)
          <div className="text-center">
            <h3 id="partner-invite-title" className="text-2xl font-bold mb-4 text-blue-600">
              Become a Partner!
            </h3>

            <div className="mb-6">
              <div className="bg-blue-50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

              <p className="text-gray-700 mb-4 font-medium">
                Join our growing network of educational partners and make a difference!
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
                <div className="text-sm text-gray-600">Presented by</div>
                <div className="text-blue-600 font-bold text-xl">Maxx Solutions</div>
              </div>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Collaborate with prestigious institutions</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access exclusive teaching resources & tools</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Earn revenue through our partner program</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/partner"
                className={`
                  w-full bg-blue-600 text-white px-6 py-3 rounded-lg
                  hover:bg-blue-700 transition-all transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isLoading ? 'opacity-75 cursor-wait' : ''}
                `}
                onClick={() => {
                  setIsLoading(true);
                  handleClose();
                }}
              >
                {isLoading ? 'Loading...' : 'Learn More About Partnership'}
              </Link>
              <button
                onClick={handleMaybeLater}
                className="w-full border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="dontShowAgain"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="dontShowAgain" className="text-sm text-gray-600">
                Don't show this again
              </label>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Partnership information is always available in your dashboard settings
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerInvitePopup;