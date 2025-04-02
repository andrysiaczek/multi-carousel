import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Accommodation } from '../types';
import { ResultItem } from '../components';

export const ResultsPage = () => {
  const navigate = useNavigate();
  const filteredAccommodations: Accommodation[] = JSON.parse(
    localStorage.getItem('filteredAccommodations') || '[]'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 flex flex-col items-center">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center text-darkOrange text-m font-normal hover:font-medium self-start mb-4 ml-4 transition-transform duration-300 hover:-translate-x-1"
      >
        <ChevronLeft
          size={16}
          className="inline-block mr-1 hover:font-semibold transition-transform duration-300 group-hover:-translate-x-1"
        />
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          Back To Filtering
        </span>
      </button>

      {/* Results List */}
      <div className="w-full max-w-2xl space-y-6">
        {filteredAccommodations.length === 0 ? (
          <p>No results found.</p>
        ) : (
          filteredAccommodations.map((accommodation) => (
            <ResultItem key={accommodation.id} accommodation={accommodation} />
          ))
        )}
      </div>
    </div>
  );
};
