import { CarouselRow, DecisionChipsPanel } from '../components';
import { FilterOption } from '../types';

export const SingleAxisCarouselPage = () => (
  <div className="flex flex-col items-center gap-4 py-4 bg-white min-h-screen">
    {/* Decision Chips Panel */}
    <div className="flex-shrink-0">
      <DecisionChipsPanel />
    </div>

    {/* Single Axis Carousels */}
    <div className="w-full flex flex-col flex-1 items-center gap-5 overflow-hidden bg-white">
      <CarouselRow filterOption={FilterOption.Rating} />
      <CarouselRow filterOption={FilterOption.Price} />
      <CarouselRow filterOption={FilterOption.Distance} />
      <CarouselRow filterOption={FilterOption.Type} />
    </div>
  </div>
);
