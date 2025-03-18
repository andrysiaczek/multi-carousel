import { FilterAxisSelector } from './FilterAxisSelector';

export const FilterPane = () => (
  <div className="p-4 space-y-6 border rounded-lg bg-gray-50">
    <div>
      <h3 className="font-semibold mb-2">Select X-Axis:</h3>
      <FilterAxisSelector axis="X" />
    </div>
    <div>
      <h3 className="font-semibold mb-2">Select Y-Axis:</h3>
      <FilterAxisSelector axis="Y" />
    </div>
  </div>
);
