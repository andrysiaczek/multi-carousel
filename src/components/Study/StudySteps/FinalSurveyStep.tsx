import { useEffect, useState } from 'react';
import { RankingQuestion } from '../../../components';
import { SurveyDetails, SurveyQuestion } from '../../../firebase';
import {
  finalQuestions,
  interfaceLabels,
  InterfaceOption,
} from '../../../types';

export type FinalSurveyStepProps = {
  onSubmit: (answers: SurveyDetails) => void;
};

export const FinalSurveyStep = ({ onSubmit }: FinalSurveyStepProps) => {
  const [favorite, setFavorite] = useState<InterfaceOption | ''>('');
  const [favoriteWhy, setFavoriteWhy] = useState('');
  const [real, setReal] = useState<InterfaceOption | ''>('');
  const [realWhy, setRealWhy] = useState('');
  const [rankOrder, setRankOrder] = useState<InterfaceOption[]>([]);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!favorite) {
      alert('Please pick your favorite interface.');
      return;
    }
    if (!real) {
      alert('Please pick which you would use in real life.');
      return;
    }
    if (rankOrder.length !== 3) {
      alert(
        'Please assign all three interfaces to a position before submitting.'
      );
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
      <div className="w-full max-w-xl mb-8">
        <p className="font-medium mb-2">{finalQuestions[0].text}</p>
        <div className="flex gap-6 mb-4">
          {Object.entries(interfaceLabels).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="radio"
                name="favorite"
                value={key}
                checked={favorite === key}
                onChange={() => setFavorite(key as InterfaceOption)}
                className="form-radio text-darkGreen"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <textarea
          placeholder="Why?"
          value={favoriteWhy}
          onChange={(e) => setFavoriteWhy(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={2}
        />
      </div>

      {/* Q2: use_real */}
      <div className="w-full max-w-xl mb-8">
        <p className="font-medium mb-2">{finalQuestions[1].text}</p>
        <div className="flex gap-6 mb-4">
          {Object.entries(interfaceLabels).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="radio"
                name="use_real"
                value={key}
                checked={real === key}
                onChange={() => setReal(key as InterfaceOption)}
                className="form-radio text-darkGreen"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <textarea
          placeholder="Why?"
          value={realWhy}
          onChange={(e) => setRealWhy(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={2}
        />
      </div>

      {/* Q3: rank */}
      <div className="w-full max-w-xl mb-8">
        <p className="mb-2 font-medium">{finalQuestions[2].text}</p>
        <RankingQuestion onChange={setRankOrder} />
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
