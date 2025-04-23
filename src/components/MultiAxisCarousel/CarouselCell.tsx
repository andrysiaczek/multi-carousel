import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Search } from 'lucide-react';
import {
  useAxisFilterStore,
  useCarouselStore,
  useFilterHistoryStore,
} from '../../store';
import { Accommodation, Subrange } from '../../types';
import { capitalize, getFeatureIcon } from '../../utils';

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
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();
  const { setHoveredStep, resetHoveredStep } = useFilterHistoryStore();
  const navigate = useNavigate();

  const isEmptyCell = accommodations.length === 0;
  const isActiveCell = !isEmptyCell && !isFillerCell;
  const additionalCount = accommodations.length - 1;
  const isHoveredRow = hoveredRow === row;
  const isHoveredColumn = hoveredColumn === col;
  const isHoveredCell = hoveredCell?.row === row && hoveredCell?.col === col;

  const handleFilterMouseEnter = () => {
    if (isActiveCell) {
      setHoveredCell(row, col);
      setHoveredStep(columnRange, rowRange);
    }
  };

  const handleFilterMouseLeave = () => {
    resetHover();
    resetHoveredStep();
  };

  const handleResultsMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isActiveCell) {
      resetHover();
      resetHoveredStep();
      e.currentTarget.classList.add('bg-lightOrange', 'text-darkOrange');
    }
  };

  const handleResultsMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isActiveCell) {
      setHoveredCell(row, col);
      setHoveredStep(columnRange, rowRange);
      e.currentTarget.classList.remove('bg-lightOrange', 'text-darkOrange');
    }
  };

  const handleRedirectClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActiveCell) return;

    e.stopPropagation();
    handleFilterMouseLeave();
    e.currentTarget.classList.remove('bg-lightOrange', 'text-darkOrange');

    if (additionalCount === 0) {
      navigate(`/multi-carousel/details/${accommodations[0].id}`);
    }

    // Set the filtered accommodations and navigate to results
    localStorage.setItem(
      'filteredAccommodations',
      JSON.stringify(accommodations)
    );
    navigate('/multi-carousel/results');
  };

  const getAccommodationScore = (acc: Accommodation) =>
    acc.rating * 3.5 - acc.price * 2 - acc.distance;

  const bestAccommodation = useMemo(() => {
    if (isEmptyCell) return null;
    return accommodations.reduce((best, current) =>
      getAccommodationScore(current) > getAccommodationScore(best)
        ? current
        : best
    );
  }, [accommodations, isEmptyCell]);

  const getCellStyling = () => {
    if (isFillerCell) return 'bg-gray-50';
    if (isEmptyCell) return 'bg-gray-100 border';
    if (isHoveredRow || isHoveredColumn || isHoveredCell)
      return 'bg-lightOrange cursor-pointer shadow-xl';
    return 'bg-white border border-gray-100 cursor-pointer';
  };

  const cardPadding = cellWidth > 300 ? 'p-4' : 'p-2';
  const cardClass = `flex flex-1 flex-col justify-between ${cardPadding} rounded-lg bg-darkGreen/5 cursor-pointer group transform transition duration-300 ease-in-out hover:bg-lightOrange hover:shadow-xl hover:scale-[1.02]`;
  const featureLimit = cellHeight < 280 ? 5 : 7;

  // Truncate long accommodation names
  const truncateName = (name: string) =>
    cellWidth < 350
      ? name.length > 20
        ? `${name.slice(0, 15)}...`
        : name
      : name.length > 25
      ? `${name.slice(0, 20)}...`
      : name;

  return (
    <div
      style={{ width: `${cellWidth}px`, height: `${cellHeight}px` }}
      className={`px-4 py-3 transition rounded flex flex-col ${getCellStyling()}`}
      onMouseEnter={handleFilterMouseEnter}
      onMouseLeave={handleFilterMouseLeave}
      onClick={() => isActiveCell && drillDownCell(col, row)}
    >
      {!isFillerCell && (
        <>
          {isEmptyCell ? (
            <div className="flex flex-col h-full items-center justify-center gap-1 text-gray-400">
              <div className="flex gap-1 text-sm font-semibold">
                <Search size={20} />
                No Results
              </div>
              <span className="text-xs">Try adjusting your filters</span>
            </div>
          ) : (
            <>
              {/* Top-left: Cell Title */}
              <div className="text-xs font-medium text-gray-400 mb-2">
                {capitalize(xAxisFilter)}: {columnRange.label} /{' '}
                {capitalize(yAxisFilter)}: {rowRange.label}
              </div>

              {/* Best Accommodation & more */}
              <div
                className={cardClass}
                onMouseEnter={handleResultsMouseEnter}
                onMouseLeave={handleResultsMouseLeave}
                onClick={handleRedirectClick}
                title={
                  additionalCount === 0
                    ? 'View details for this accommodation'
                    : 'Explore accommodations for this category'
                }
              >
                {/* Best Accommodation */}
                {bestAccommodation && (
                  <div className="flex flex-grow gap-2 overflow-hidden">
                    {/* Image */}
                    <div
                      className={`${
                        cellWidth > 400 ? 'w-36' : 'w-28'
                      } flex-shrink-0 flex flex-col gap-1 h-full`}
                    >
                      {cellHeight > 250 ? (
                        <>
                          <img
                            src={
                              bestAccommodation.versionMultiAxisCarousel
                                .images[0]
                            }
                            alt={
                              bestAccommodation.versionMultiAxisCarousel.name
                            }
                            className="w-full h-1/2 object-cover rounded"
                          />
                          <img
                            src={
                              bestAccommodation.versionMultiAxisCarousel
                                .images[1] ||
                              bestAccommodation.versionMultiAxisCarousel
                                .images[0]
                            }
                            alt={
                              bestAccommodation.versionMultiAxisCarousel.name
                            }
                            className="w-full h-1/2 object-cover rounded"
                          />
                        </>
                      ) : (
                        <img
                          src={
                            bestAccommodation.versionMultiAxisCarousel.images[0]
                          }
                          alt={bestAccommodation.versionMultiAxisCarousel.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-around flex-1">
                      <div className="flex flex-col gap-2">
                        {/* Name */}
                        <h2
                          className={`${
                            cellHeight > 300 ? 'text-lg' : 'text-md'
                          } text-center font-semibold text-darkGreen w-full group-hover:text-darkOrange`}
                        >
                          {truncateName(
                            bestAccommodation.versionMultiAxisCarousel.name
                          )}
                        </h2>

                        {/* Price, Rating & Distance */}
                        <div className="flex gap-2 items-center text-xs font-normal text-gray-500">
                          {/* Labels Column */}
                          <div className="flex flex-col w-full items-end gap-1">
                            <span>Rating</span>
                            <span>Price</span>
                            <span>Distance</span>
                          </div>

                          {/* Vertical Divider */}
                          <div className="h-full w-[1px] bg-gray-300" />

                          {/* Values Column */}
                          <div className="flex flex-col w-full items-start gap-1 ">
                            <span>{bestAccommodation.rating.toFixed(1)} ★</span>
                            <span>€{bestAccommodation.price}</span>
                            <span>
                              {bestAccommodation.distance < 0.1
                                ? 'Central'
                                : bestAccommodation.distance < 1
                                ? `${bestAccommodation.distance * 1000} m`
                                : `${bestAccommodation.distance} km`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-gray-400 text-xxs">
                        {bestAccommodation.features
                          .filter((f) => f.length < 15)
                          .slice(0, featureLimit)
                          .map((feature) => {
                            const Icon = getFeatureIcon(feature);
                            return (
                              <div
                                key={feature}
                                className="flex items-center gap-1"
                              >
                                <Icon size={12} />
                                {cellHeight > 280 && <span>{feature}</span>}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom: Additional count */}
                {additionalCount > 0 && (
                  <div className="flex items-end self-end gap-1 text-xs text-darkGreen cursor-pointer group-hover:underline group-hover:text-darkOrange relative">
                    <MoreHorizontal
                      size={12}
                      className="absolute bottom-[-2px] left-[-15px]"
                    />
                    and {additionalCount} more
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
