import React, { MouseEvent } from 'react';
import {
  BedDouble,
  BedSingle,
  Building,
  Crown,
  Home,
  Hotel,
  House,
  Landmark,
  MoreHorizontal,
} from 'lucide-react';
import { useCarouselStore, useFilterHistoryStore } from '../store';
import { Accommodation, Subrange } from '../types';

const iconMapping: Record<string, React.ElementType> = {
  'Hostel (Dormitory Bed)': BedSingle,
  'Hostel (Private Room)': BedDouble,
  'Budget Hotel': Hotel,
  'Guesthouse / Bed & Breakfast (B&B)': Home,
  'Mid-Range Hotel': Building,
  'Upper Mid-Range Hotel': Landmark,
  'Luxury Hotel': Crown,
  'Entire Apartment / House': House,
};

interface CarouselCellProps {
  col: number;
  row: number;
  columnRange: Subrange;
  rowRange: Subrange;
  accommodations: Accommodation[];
  isFillerCell: boolean;
}

export const CarouselCell = ({
  col,
  row,
  columnRange,
  rowRange,
  accommodations,
  isFillerCell = false,
}: CarouselCellProps) => {
  const {
    cellWidth,
    cellHeight,
    hoveredColumn,
    hoveredRow,
    hoveredCell,
    setHoveredCell,
    resetHover,
    drillDownCell,
  } = useCarouselStore();
  const { setHoveredStep, resetHoveredStep } = useFilterHistoryStore();

  // Determine if this cell, row, or column is being hovered
  const isHoveredRow = hoveredRow === row;
  const isHoveredColumn = hoveredColumn === col;
  const isHoveredCell = hoveredCell?.row === row && hoveredCell?.col === col;

  const getCellBackground = () => {
    if (isFillerCell) return 'bg-gray-100';
    if (isHoveredRow || isHoveredColumn || isHoveredCell)
      return 'bg-lightOrange';
    return 'bg-white';
  };

  const handleFilterMouseEnter = () => {
    setHoveredCell(row, col);
    setHoveredStep(columnRange, rowRange);
  };

  const handleFilterMouseLeave = () => {
    resetHover();
    resetHoveredStep();
  };

  const handleResultsMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    resetHover();
    e.currentTarget.classList.add('bg-gray-200', 'text-darkGreen');
  };

  const handleResultsMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredCell(row, col);
    e.currentTarget.classList.remove('bg-gray-200', 'text-darkGreen');
  };

  const handleRedirectClick = (e: MouseEvent) => {
    e.stopPropagation();
    drillDownCell(col, row);
    console.log('Redirect to the Results Page'); // TODO
  };

  // Highlighted accommodation for display
  const displayedAccommodation = accommodations[0];
  const { type, nameI } = displayedAccommodation || {};
  const additionalCount = accommodations.length - 1;

  // Icon for the displayed accommodation type
  const Icon = type && iconMapping[type];

  // Truncate long accommodation names
  const truncateName = (name: string) =>
    name.length > 25 ? `${name.slice(0, 22)}...` : name;

  return (
    <div
      className={`w-[${cellWidth}px] h-[${cellHeight}px] flex flex-col justify-center p-3 border transition cursor-pointer ${getCellBackground()}`}
      onMouseEnter={handleFilterMouseEnter}
      onMouseLeave={handleFilterMouseLeave}
      onClick={() => drillDownCell(col, row)}
    >
      {!isFillerCell && (
        <div className="flex flex-col h-full justify-around p-2">
          {/* Top-left: Title */}
          <div className="text-xs font-medium text-gray-500 mb-1">
            {columnRange.label} / {rowRange.label}
          </div>

          <div
            className="group cursor-pointer p-2 rounded"
            onMouseEnter={handleResultsMouseEnter}
            onMouseLeave={handleResultsMouseLeave}
            onClick={handleRedirectClick}
          >
            {/* Displayed Accommodation at the center */}
            {displayedAccommodation && (
              <div className="flex-grow flex items-center justify-center font-semibold text-lg text-gray-700 text-center relative">
                {Icon && <Icon size={20} className="mr-1 text-gray-600" />}
                <span
                  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full group-hover:underline"
                  title={nameI}
                >
                  {truncateName(nameI)}
                </span>
                <span className="absolute top-[-36px] left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-gray-200 rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition">
                  {accommodations.length === 1
                    ? 'Show this accommodation'
                    : 'See all results'}
                </span>
              </div>
            )}

            {/* Bottom: Additional count */}
            {additionalCount > 0 && (
              <div className="flex items-end justify-end self-start gap-1 text-s text-gray-500 cursor-pointer group-hover:underline">
                <MoreHorizontal size={12} />
                and {additionalCount} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
