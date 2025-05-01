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

      {/* Q1: favorite */}
      <div id="question-favorite" className="w-full max-w-xl mb-8">
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
      <div id="question-real" className="w-full max-w-xl mb-8">
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
      <div id="question-rank" className="w-full max-w-xl mb-8">
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
      <div className="w-full max-w-xl mb-8">
        <p className="font-medium mb-2">{finalQuestions[3].text}</p>
        <textarea
          placeholder="Your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-darkGreen hover:bg-darkOrange text-white px-8 py-3 rounded-lg font-medium transition"
      >
        Submit Survey
      </button>
    </div>
  );
};
