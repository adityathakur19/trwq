import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';

const QualificationModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    yearsInBusiness: '',
    annualRevenue: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    biggestChallenge: '',
    openToContact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const totalSteps = 6;

  const openModal = () => {
    setIsOpen(true);
    setCurrentStep(1);
    setFormData({
      businessType: '',
      yearsInBusiness: '',
      annualRevenue: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      biggestChallenge: '',
      openToContact: ''
    });
    setShowThankYou(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowThankYou(false);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessType !== '';
      case 2:
        return formData.yearsInBusiness !== '';
      case 3:
        return formData.annualRevenue !== '';
      case 4:
        return formData.fullName.trim() !== '' && 
               formData.phoneNumber.trim() !== '' && 
               formData.email.trim() !== '';
      case 5:
        return formData.biggestChallenge !== '';
      case 6:
        return formData.openToContact !== '';
      default:
        return false;
    }
  };

  const isQualified = () => {
    // Check for the exact disqualifying combination
    const isDisqualified = (
      formData.businessType === 'student' &&
      formData.yearsInBusiness === 'less-than-1' &&
      formData.annualRevenue === '5-10' &&
      formData.openToContact === 'no'
    );

    return !isDisqualified;
  };

  const handleSubmit = async () => {
    if (!isCurrentStepValid()) return;

    setIsSubmitting(true);

    try {
      const qualified = isQualified();

      // Only submit data to backend if user is qualified
      if (qualified) {
        console.log('Submitting qualified user data:', formData);
        
        const submissionData = {
          businessType: formData.businessType,
          yearsInBusiness: formData.yearsInBusiness,
          annualRevenue: formData.annualRevenue,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          biggestChallenge: formData.biggestChallenge,
          openToContact: formData.openToContact,
          submittedAt: new Date().toISOString(),
          qualified: true
        };
        
        console.log('Sending submission data:', submissionData);
        
        // Updated to use Netlify Functions endpoint
        const response = await fetch('/.netlify/functions/submit-qualification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        const result = await response.json();
        console.log('Form submitted successfully:', result);
      } else {
        console.log('User not qualified - data not saved:', {
          businessType: formData.businessType,
          yearsInBusiness: formData.yearsInBusiness,
          annualRevenue: formData.annualRevenue,
          openToContact: formData.openToContact
        });
      }

      // Show thank you page regardless of qualification status
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (showThankYou) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in our clarity call. We'll review your submission and get back to you soon.
          </p>
          <button
            onClick={closeModal}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Close
          </button>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">What best describes you?</h3>
            <p className="text-gray-600 text-center mb-6">Please select the option that best fits your situation</p>
            <div className="space-y-3">
              {[
                { value: 'coach-consultant', label: "I'm a coach/consultant running my own business" },
                { value: 'service-based', label: "I run a service-based business" },
                { value: 'professional', label: "I'm a working professional exploring sales coaching" },
                { value: 'student', label: "I'm a student/fresher" }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="businessType"
                    value={option.value}
                    checked={formData.businessType === option.value}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="mr-3 text-pink-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">How many years have you been running your business?</h3>
            <div className="space-y-3">
              {[
                { value: 'less-than-1', label: 'Less than 1 year' },
                { value: '1-2', label: '1-2 years' },
                { value: '2-5', label: '2-5 years' },
                { value: '5-plus', label: '5+ years' }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="yearsInBusiness"
                    value={option.value}
                    checked={formData.yearsInBusiness === option.value}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                    className="mr-3 text-pink-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">What is your current annual revenue?</h3>
            <div className="space-y-3">
              {[
                { value: '5-10', label: '₹5-10 lakhs' },
                { value: '10-25', label: '₹10-25 lakhs' },
                { value: '25-plus', label: '₹25 lakhs+' }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="annualRevenue"
                    value={option.value}
                    checked={formData.annualRevenue === option.value}
                    onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                    className="mr-3 text-pink-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">What's your biggest challenge in growing your business right now?</h3>
            <div className="space-y-3">
              {[
                { value: 'lead-qualification', label: 'Lead Qualification' },
                { value: 'lead-nurturing', label: 'Lead Nurturing' },
                { value: 'objection-handling', label: 'Objection Handling' },
                { value: 'sales-closing', label: '1:1 Sales Closing' },
                { value: 'other', label: 'Other' }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="biggestChallenge"
                    value={option.value}
                    checked={formData.biggestChallenge === option.value}
                    onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
                    className="mr-3 text-pink-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">Final Step</h3>
            <p className="text-gray-600 text-center mb-6">
              If you're a good fit, are you open to being contacted for a free Sales Growth clarity call?
            </p>
            <div className="space-y-3">
              {[
                { value: 'yes', label: "Yes, I'm open to being contacted" },
                { value: 'no', label: "No, not at this time" }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="openToContact"
                    value={option.value}
                    checked={formData.openToContact === option.value}
                    onChange={(e) => handleInputChange('openToContact', e.target.value)}
                    className="mr-3 text-pink-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              This gives us explicit permission for follow-up regarding your clarity call.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderProgressDots = () => {
    return (
      <div className="flex justify-center space-x-2 mb-6">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index + 1 <= currentStep ? 'bg-pink-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div onClick={openModal}>
        {children}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Your Clarity Call</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {!showThankYou && renderProgressDots()}

          {renderStep()}

          {!showThankYou && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-pink-500 hover:bg-pink-50'
                }`}
              >
                <ChevronLeft size={20} className="mr-1" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isCurrentStepValid()
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isCurrentStepValid() || isSubmitting}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isCurrentStepValid() && !isSubmitting
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualificationModal;