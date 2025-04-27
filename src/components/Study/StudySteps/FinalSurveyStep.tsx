import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { finalQuestions, InterfaceOption } from '../../../types';

const interfaceLabels: Record<InterfaceOption, string> = {
  [InterfaceOption.MultiAxisCarousel]: 'Multi-Axis Carousel',
  [InterfaceOption.SingleAxisCarousel]: 'Single-Axis Carousel',
  [InterfaceOption.Benchmark]: 'Benchmark Interface',
};

export type FinalAnswers = {
  favorite: InterfaceOption;
  favoriteWhy: string;
  use_real: InterfaceOption;
  use_realWhy: string;
  rank: InterfaceOption[];
  feedback: string;
};

export type FinalSurveyStepProps = {
  onSubmit: (answers: FinalAnswers) => void;
};

export const FinalSurveyStep = ({ onSubmit }: FinalSurveyStepProps) => {
  const [favorite, setFavorite] = useState<InterfaceOption | ''>('');
  const [favoriteWhy, setFavoriteWhy] = useState('');
  const [useReal, setUseReal] = useState<InterfaceOption | ''>('');
  const [useRealWhy, setUseRealWhy] = useState('');
  const [rankOrder, setRankOrder] = useState<InterfaceOption[]>([
    InterfaceOption.MultiAxisCarousel,
    InterfaceOption.SingleAxisCarousel,
    InterfaceOption.Benchmark,
  ]);
  const [feedback, setFeedback] = useState('');

  // Handlers for moving items up/down in the rank list
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...rankOrder];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setRankOrder(next);
  };
  const moveDown = (idx: number) => {
    if (idx === rankOrder.length - 1) return;
    const next = [...rankOrder];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setRankOrder(next);
  };

  const handleSubmit = () => {
    if (!favorite || !useReal) {
      alert('Please answer all required questions.');
      return;
    }
    onSubmit({
      favorite,
      favoriteWhy,
      use_real: useReal,
      use_realWhy: useRealWhy,
      rank: rankOrder,
      feedback,
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-antiflashWhite min-h-screen">
      <h3 className="text-2xl font-semibold mb-6 text-darkGreen">
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
                checked={useReal === key}
                onChange={() => setUseReal(key as InterfaceOption)}
                className="form-radio text-darkGreen"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <textarea
          placeholder="Why?"
          value={useRealWhy}
          onChange={(e) => setUseRealWhy(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          rows={2}
        />
      </div>

      {/* Q3: rank */}
      <div className="w-full max-w-xl mb-8">
        <p className="font-medium mb-2">{finalQuestions[2].text}</p>
        <ul className="space-y-2">
          {rankOrder.map((opt, idx) => (
            <li
              key={opt}
              className="flex items-center justify-between bg-white p-2 rounded shadow-sm"
            >
              <span>{interfaceLabels[opt]}</span>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 disabled:opacity-50"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === rankOrder.length - 1}
                  className="p-1 disabled:opacity-50"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
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
