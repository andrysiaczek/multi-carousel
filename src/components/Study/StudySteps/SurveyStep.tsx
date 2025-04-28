import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Survey } from '../../../components';
import {
  detailedQuestions,
  interfaceLabels,
  InterfaceOption,
  interfaceQuestions,
} from '../../../types';

type SurveyStepProps = {
  interfaceOption: InterfaceOption;
  onSubmit: () => void;
};

export const SurveyStep = ({ interfaceOption, onSubmit }: SurveyStepProps) => {
  const detail = detailedQuestions[interfaceOption];
  const [showImage, setShowImage] = useState(true);

  // Highlight toggle for the first 2 seconds
  const [highlightToggle, setHighlightToggle] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setHighlightToggle(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen bg-antiflashWhite">
      {/* Interface preview toggle */}
      <div className="fixed top-14 left-8 z-50">
        <div className="relative inline-block">
          {/* Pulsing highlight */}
          {highlightToggle && (
            <span className="absolute inset-0 rounded-full bg-darkGreen/20 animate-ping"></span>
          )}
          {/* The button itself */}
          <button
            type="button"
            onClick={() => setShowImage((v) => !v)}
            className="
              relative flex items-center space-x-2
              bg-darkGreen/90 hover:bg-darkGreen px-4 py-2 rounded-full
              shadow-md hover:shadow-lg transition-all duration-200
              text-antiflashWhite
            "
          >
            <span className="text-sm font-medium tracking-wide">
              {showImage ? 'Hide Preview' : 'Preview Interface'}
            </span>
            <ChevronDown
              size={16}
              className={`
                transform transition-transform duration-200
                ${showImage ? '-rotate-90' : 'rotate-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Interface preview */}
      {showImage && (
        <aside className="w-[35%] p-4">
          <div className="sticky top-20 rounded-lg overflow-hidden shadow-md">
            <img
              src={detail.image}
              alt={`${interfaceLabels[interfaceOption]} screenshot`}
              className="w-full block"
            />
          </div>
        </aside>
      )}

      {/* Main survey content */}
      <main
        className={`flex-1 ${
          showImage ? 'pl-4' : 'pl-8'
        } pr-8 py-8 overflow-y-auto`}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="text-3xl font-bold text-darkGreen text-center mb-6">
            How was your experience with{' '}
            <span className="italic">{interfaceLabels[interfaceOption]}</span>?
          </h3>

          {/* Main questions */}
          <Survey
            questions={interfaceQuestions}
            onSubmit={() => {}}
            showSubmit={false}
          />

          <hr className="border-gray-200 my-6" />

          {/* Detailed quantitative */}
          <div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Tell us about these specific features
            </h4>
            <Survey
              questions={detail.quantitative}
              onSubmit={() => {}}
              showSubmit={false}
            />
          </div>

          <hr className="border-gray-200 my-6" />

          {/* Free-text feedback */}
          <div className="space-y-6 mb-8">
            {detail.qualitative.map(({ id, text }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-gray-800 font-medium mb-2"
                >
                  {text}
                </label>
                <textarea
                  id={id}
                  name={id}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-darkGreen/50"
                  placeholder="Your thoughts…"
                />
              </div>
            ))}
          </div>

          {/* Final submit */}
          <div className="text-center">
            <button
              type="button"
              onClick={onSubmit}
              className="bg-darkGreen hover:bg-darkOrange text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
