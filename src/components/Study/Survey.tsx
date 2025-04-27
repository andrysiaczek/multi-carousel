import { ChangeEvent, FormEvent, useState } from 'react';
import { SurveyQuestion } from '../../types';

export type SurveyProps = {
  questions: SurveyQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  showSubmit?: boolean;
  submitLabel?: string;
};

export const Survey = ({
  questions,
  onSubmit,
  showSubmit = true,
  submitLabel = 'Submit',
}: SurveyProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map(({ id, text }, idx) => (
        <div key={id} className="bg-antiflashWhite p-6 rounded-2xl shadow-md">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            {idx + 1}. {text}
          </p>

          <div className="flex justify-between max-w-lg mx-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <label
                key={n}
                className="flex flex-col items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name={id}
                  value={String(n)}
                  checked={answers[id] === String(n)}
                  onChange={handleChange}
                  required
                  className="sr-only"
                />
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                    transition transform hover:scale-110
                    ${
                      answers[id] === String(n)
                        ? 'bg-darkGreen text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {n}
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      {showSubmit && (
        <button
          type="submit"
          className="block mx-auto mt-4 bg-darkGreen hover:bg-darkOrange text-white px-8 py-3 rounded-lg font-medium transition"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
};

export default Survey;
