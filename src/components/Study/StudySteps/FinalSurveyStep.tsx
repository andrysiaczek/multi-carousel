import { useEffect, useState } from 'react';
import { RankingQuestion } from '../../../components';
import { SurveyDetails, SurveyQuestion } from '../../../firebase';
import { useStudyStore } from '../../../store';
import {
  finalQuestions,
  interfaceLabels,
  InterfaceOption,
} from '../../../types';

export type FinalSurveyStepProps = {
  onSubmit: (answers: SurveyDetails) => void;
};

export const FinalSurveyStep = ({ onSubmit }: FinalSurveyStepProps) => {
  const { interfaceOrder } = useStudyStore.getState();
  const [favorite, setFavorite] = useState<InterfaceOption | ''>('');
  const [favoriteWhy, setFavoriteWhy] = useState('');
  const [real, setReal] = useState<InterfaceOption | ''>('');
  const [realWhy, setRealWhy] = useState('');
  const [rankOrder, setRankOrder] = useState<InterfaceOption[]>([]);
  const [feedback, setFeedback] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [travelFrequency, setTravelFrequency] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!favorite) {
      newErrors.favorite = 'Please pick your favorite interface.';
    }
    if (!real) {
      newErrors.real = 'Please pick which interface you would actually use.';
    }
    if (rankOrder.length !== 3) {
      newErrors.rank = 'Please assign all three interfaces a rank.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // scroll to first invalid question
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`question-${firstKey}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const quantitative: SurveyQuestion[] = [];
    const qualitative: SurveyQuestion[] = [
      { questionId: 'favorite', answer: favorite },
      { questionId: 'favoriteWhy', answer: favoriteWhy },
      { questionId: 'real', answer: real },
      { questionId: 'realWhy', answer: realWhy },
      { questionId: 'rank', answer: JSON.stringify(rankOrder) },
      { questionId: 'feedback', answer: feedback },
    ];

    if (age) quantitative.push({ questionId: 'age', answer: age });
    if (sex) qualitative.push({ questionId: 'sex', answer: sex });
    if (travelFrequency)
      qualitative.push({
        questionId: 'travelFrequency',
        answer: travelFrequency,
      });

    onSubmit({ quantitative, qualitative });
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-antiflashWhite min-h-screen">
      <h3 className="text-3xl font-semibold mb-6 text-darkGreen">
        Final Comparative Survey
      </h3>

      {/* Centralized content wrapper */}
      <div className="w-full max-w-xl space-y-8">
        {/* Q1: favorite */}
        <div id="question-favorite">
          <p className="font-medium mb-2">{finalQuestions[0].text}</p>
          <div className="flex gap-6 mb-4">
            {Object.entries(interfaceOrder).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="favorite"
                  value={key}
                  checked={favorite === key}
                  onChange={() => {
                    setFavorite(key as InterfaceOption);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy['favorite'];
                      return copy;
                    });
                  }}
                  className="form-radio text-darkGreen"
                />
                <span>{interfaceLabels[label]}</span>
              </label>
            ))}
          </div>
          {errors.favorite && (
            <p className="my-2 text-sm text-darkOrange text-center">
              {errors.favorite}
            </p>
          )}
          <textarea
            placeholder="Why?"
            value={favoriteWhy}
            onChange={(e) => setFavoriteWhy(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={2}
          />
        </div>

        {/* Q2: real */}
        <div id="question-real">
          <p className="font-medium mb-2">{finalQuestions[1].text}</p>
          <div className="flex gap-6 mb-4">
            {Object.entries(interfaceOrder).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="use_real"
                  value={key}
                  checked={real === key}
                  onChange={() => {
                    setReal(key as InterfaceOption);
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy['real'];
                      return copy;
                    });
                  }}
                  className="form-radio text-darkGreen"
                />
                <span>{interfaceLabels[label]}</span>
              </label>
            ))}
          </div>
          {errors.real && (
            <p className="my-2 text-sm text-darkOrange text-center">
              {errors.real}
            </p>
          )}
          <textarea
            placeholder="Why?"
            value={realWhy}
            onChange={(e) => setRealWhy(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={2}
          />
        </div>

        {/* Q3: rank */}
        <div id="question-rank">
          <p className="mb-2 font-medium">{finalQuestions[2].text}</p>
          <RankingQuestion
            onChange={(order) => {
              setRankOrder(order);
              setErrors((prev) => {
                const copy = { ...prev };
                delete copy['rank'];
                return copy;
              });
            }}
          />
          {errors.rank && (
            <p className="text-sm text-darkOrange text-center mt-1">
              {errors.rank}
            </p>
          )}
        </div>

        {/* Q4: feedback */}
        <div>
          <p className="font-medium mb-2">{finalQuestions[3].text}</p>
          <textarea
            placeholder="Your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
          />
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 my-6" />

        {/* Demographics Section */}
        <div className="space-y-4">
          <p className="text-sm text-center text-gray-600 italic">
            The following demographic questions are optional and used only for
            statistical analysis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Travel Frequency (full width) */}
            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                How often do you travel?
              </label>
              <div className="flex flex-col gap-1">
                {[
                  'Less than once a year',
                  'Once a year',
                  '2 – 3 times a year',
                  'More than 3 times a year',
                ].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      name="travelFrequency"
                      value={opt}
                      checked={travelFrequency === opt}
                      onChange={(e) => setTravelFrequency(e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="md:col-span-1 space-y-3">
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                id="age"
                type="number"
                min={10}
                max={120}
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-darkGreen"
              />
            </div>

            {/* Sex */}
            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Sex
              </label>
              <div className="flex flex-col gap-1">
                {['Female', 'Male', 'Other', 'Prefer not to say'].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 text-sm text-gray-700"
                  >
                    <input
                      type="radio"
                      name="sex"
                      value={opt}
                      checked={sex === opt}
                      onChange={(e) => setSex(e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-darkGreen hover:bg-darkOrange text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  );
};
