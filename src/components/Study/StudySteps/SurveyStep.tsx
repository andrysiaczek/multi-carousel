import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Survey } from '../../../components';
import { EventType, SurveyDetails, SurveyQuestion } from '../../../firebase';
import { useStudyStore } from '../../../store';
import {
  detailedQuestions,
  interfaceLabels,
  InterfaceOption,
  interfaceQuestions,
} from '../../../types';

type SurveyStepProps = {
  interfaceOption: InterfaceOption;
  onSubmit: (answers: SurveyDetails) => void;
};

export const SurveyStep = ({ interfaceOption, onSubmit }: SurveyStepProps) => {
  const detail = detailedQuestions[interfaceOption];
  const [showImage, setShowImage] = useState(true);

  const [mainAnswers, setMainAnswers] = useState<Record<string, string>>({});
  const [detailQuant, setDetailQuant] = useState<Record<string, string>>({});
  const [detailQual, setDetailQual] = useState<Record<string, string>>({});

  const [mainErrors, setMainErrors] = useState<Record<string, string>>({});
  const [detailQuantErrors, setDetailQuantErrors] = useState<
    Record<string, string>
  >({});

  // Highlight toggle for the first 2 seconds
  const [highlightToggle, setHighlightToggle] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setHighlightToggle(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleMainAnswerChange = (answers: Record<string, string>) => {
    setMainAnswers(answers);
    const last = Object.keys(answers).slice(-1)[0];
    setMainErrors((prev) => {
      const copy = { ...prev };
      delete copy[last];
      return copy;
    });
  };

  const handleDetailQuantChange = (answers: Record<string, string>) => {
    setDetailQuant(answers);
    const last = Object.keys(answers).slice(-1)[0];
    setDetailQuantErrors((prev) => {
      const copy = { ...prev };
      delete copy[last];
      return copy;
    });
  };

  const handleSubmit = () => {
    const newMainErr: Record<string, string> = {};
    interfaceQuestions.forEach(({ id }) => {
      if (!mainAnswers[id]) newMainErr[id] = 'Please select a rating.';
    });

    const newDetailErr: Record<string, string> = {};
    detail.quantitative.forEach(({ id }) => {
      if (!detailQuant[id]) newDetailErr[id] = 'Please select a rating.';
    });

    // if any errors, show them and scroll to first
    if (Object.keys(newMainErr).length || Object.keys(newDetailErr).length) {
      setMainErrors(newMainErr);
      setDetailQuantErrors(newDetailErr);
      const firstBad =
        Object.keys(newMainErr)[0] ?? Object.keys(newDetailErr)[0];
      document.querySelector(`[name="${firstBad}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    const quantitative: SurveyQuestion[] = Object.entries({
      ...mainAnswers,
      ...detailQuant,
    }).map(([questionId, answer]) => ({
      questionId: questionId as keyof typeof mainAnswers,
      answer: Number(answer),
    }));

    const qualitative: SurveyQuestion[] = Object.entries(detailQual).map(
      ([questionId, answer]) => ({
        questionId: questionId as keyof typeof detailQual,
        answer,
      })
    );

    onSubmit({ quantitative, qualitative });
  };

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
            onClick={() => {
              useStudyStore.getState().logEvent(EventType.Click, {
                targetType: 'previewToggleButton',
              });
              setShowImage((v) => !v);
            }}
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
            answers={mainAnswers}
            errors={mainErrors}
            onAnswerChange={handleMainAnswerChange}
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
              answers={detailQuant}
              errors={detailQuantErrors}
              onAnswerChange={handleDetailQuantChange}
              onSubmit={() => {}}
              showSubmit={false}
            />
          </div>

          <hr className="border-gray-200 my-6" />

          {/* Detailed qualitative */}
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
                  value={detailQual[id] || ''}
                  onChange={(e) =>
                    setDetailQual((prev) => ({ ...prev, [id]: e.target.value }))
                  }
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
              onClick={handleSubmit}
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
