import { useCallback, useEffect, useRef } from 'react';
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
} from 'lucide-react';
import {
  CarouselArrow,
  CarouselCell,
  ResetButtonCarousel as ResetButton,
} from '../../components';
import { EventType } from '../../firebase';
import { useResponsiveCarousel } from '../../hooks';
import {
  useAxisFilterStore,
  useCarouselStore,
  useDecisionChipsStore,
  useFilterHistoryStore,
  useStudyStore,
} from '../../store';
import { Axis, Subrange } from '../../types';
import {
  drillDownColumn,
  drillDownRow,
  resetPosition,
  scrollDown,
  scrollDownLeft,
  scrollDownRight,
  scrollLeft,
  scrollRight,
  scrollUp,
  scrollUpLeft,
  scrollUpRight,
} from '../../utils';

export const CarouselGrid = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    rowOffset,
    columnOffset,
    cellHeight,
    cellWidth,
    visibleRows,
    visibleColumns,
    hoveredRow,
    hoveredColumn,
    columnRanges,
    rowRanges,
    dataPerCell,
    applyDecisionChipsToCarousel,
    setCellSize,
    updateVisibleCarouselSize,
    setHoveredRow,
    setHoveredColumn,
    resetHover,
  } = useCarouselStore();
  const { xAxisFilter, yAxisFilter } = useAxisFilterStore();
  const { selectedChips } = useDecisionChipsStore();
  const { steps, setHoveredStepForAxis, resetHoveredStep, goToStep } =
    useFilterHistoryStore();
  const { logEvent } = useStudyStore();

  useResponsiveCarousel({
    ref: carouselRef,
    maxCols: 3,
    maxRows: 2,
    minCellWidth: 250,
    minCellHeight: 200,
    gap: 8,
    onResize: (cols, rows, width, height) => {
      setCellSize(width, height);
      updateVisibleCarouselSize(rows, cols);
    },
  });

  const visibleColumnRanges = columnRanges.slice(
    columnOffset,
    columnOffset + visibleColumns
  );
  const visibleRowRanges = rowRanges.slice(rowOffset, rowOffset + visibleRows);
  const isEmptyGrid = dataPerCell.every((row) =>
    row.every((cell) => !cell || cell.accommodations.length === 0)
  );

  const handleMouseEnter = (axis: Axis, index: number, range: Subrange) => {
    if (axis === Axis.X) setHoveredColumn(columnOffset + index);
    else setHoveredRow(rowOffset + index);
    setHoveredStepForAxis(axis, range);
  };

  const handleMouseLeave = () => {
    resetHover();
    resetHoveredStep();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        logEvent(EventType.ArrowKeyDown, {
          targetType: 'carousel',
          direction: 'left',
          offset: { row: rowOffset, col: columnOffset },
          xAxis: {
            filterType: xAxisFilter,
            ranges: columnRanges.map((col) => col.label),
          },
          yAxis: {
            filterType: yAxisFilter,
            ranges: rowRanges.map((row) => row.label),
          },
        });
        scrollLeft();
      }
      if (e.key === 'ArrowRight') {
        logEvent(EventType.ArrowKeyDown, {
          targetType: 'carousel',
          direction: 'right',
          offset: { row: rowOffset, col: columnOffset },
          xAxis: {
            filterType: xAxisFilter,
            ranges: columnRanges.map((col) => col.label),
          },
          yAxis: {
            filterType: yAxisFilter,
            ranges: rowRanges.map((row) => row.label),
          },
        });
        scrollRight();
      }
      if (e.key === 'ArrowUp') {
        logEvent(EventType.ArrowKeyDown, {
          targetType: 'carousel',
          direction: 'up',
          offset: { row: rowOffset, col: columnOffset },
          xAxis: {
            filterType: xAxisFilter,
            ranges: columnRanges.map((col) => col.label),
          },
          yAxis: {
            filterType: yAxisFilter,
            ranges: rowRanges.map((row) => row.label),
          },
        });
        scrollUp();
      }
      if (e.key === 'ArrowDown') {
        logEvent(EventType.ArrowKeyDown, {
          targetType: 'carousel',
          direction: 'down',
          offset: { row: rowOffset, col: columnOffset },
          xAxis: {
            filterType: xAxisFilter,
            ranges: columnRanges.map((col) => col.label),
          },
          yAxis: {
            filterType: yAxisFilter,
            ranges: rowRanges.map((row) => row.label),
          },
        });
        scrollDown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollLeft, scrollRight, scrollUp, scrollDown]);

  const accX = useRef(0);
  const accY = useRef(0);
  const lastScrollTime = useRef(0);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      const dt = now - lastScrollTime.current;

      accX.current += e.deltaX;
      accY.current += e.deltaY;

      const threshX = cellWidth * 0.5;
      const threshY = cellHeight * 0.7;
      const canScroll = dt > 200;

      // Diagonal
      if (
        canScroll &&
        Math.abs(accX.current) >= threshX &&
        Math.abs(accY.current) >= threshY
      ) {
        // four possible diagonal directions:
        if (accX.current > 0 && accY.current > 0) {
          logEvent(EventType.Scroll, {
            targetType: 'carousel',
            direction: 'downRight',
            offset: { row: rowOffset, col: columnOffset },
            xAxis: {
              filterType: xAxisFilter,
              ranges: columnRanges.map((col) => col.label),
            },
            yAxis: {
              filterType: yAxisFilter,
              ranges: rowRanges.map((row) => row.label),
            },
          });
          scrollDownRight();
        } else if (accX.current < 0 && accY.current < 0) {
          logEvent(EventType.Scroll, {
            targetType: 'carousel',
            direction: 'upLeft',
            offset: { row: rowOffset, col: columnOffset },
            xAxis: {
              filterType: xAxisFilter,
              ranges: columnRanges.map((col) => col.label),
            },
            yAxis: {
              filterType: yAxisFilter,
              ranges: rowRanges.map((row) => row.label),
            },
          });
          scrollUpLeft();
        } else if (accX.current > 0 && accY.current < 0) {
          logEvent(EventType.Scroll, {
            targetType: 'carousel',
            direction: 'upRight',
            offset: { row: rowOffset, col: columnOffset },
            xAxis: {
              filterType: xAxisFilter,
              ranges: columnRanges.map((col) => col.label),
            },
            yAxis: {
              filterType: yAxisFilter,
              ranges: rowRanges.map((row) => row.label),
            },
          });
          scrollUpRight();
        } else if (accX.current < 0 && accY.current > 0) {
          logEvent(EventType.Scroll, {
            targetType: 'carousel',
            direction: 'downLeft',
            offset: { row: rowOffset, col: columnOffset },
            xAxis: {
              filterType: xAxisFilter,
              ranges: columnRanges.map((col) => col.label),
            },
            yAxis: {
              filterType: yAxisFilter,
              ranges: rowRanges.map((row) => row.label),
            },
          });
          scrollDownLeft();
        }

        lastScrollTime.current = now;
        accX.current = 0;
        accY.current = 0;
        return;
      }

      // 2) Single-axis logic
      if (Math.abs(accX.current) > Math.abs(accY.current)) {
        if (canScroll && Math.abs(accX.current) >= threshX) {
          if (accX.current) {
            logEvent(EventType.Scroll, {
              targetType: 'carousel',
              direction: 'right',
              offset: { row: rowOffset, col: columnOffset },
              xAxis: {
                filterType: xAxisFilter,
                ranges: columnRanges.map((col) => col.label),
              },
              yAxis: {
                filterType: yAxisFilter,
                ranges: rowRanges.map((row) => row.label),
              },
            });
            scrollRight();
          } else {
            logEvent(EventType.Scroll, {
              targetType: 'carousel',
              direction: 'left',
              offset: { row: rowOffset, col: columnOffset },
              xAxis: {
                filterType: xAxisFilter,
                ranges: columnRanges.map((col) => col.label),
              },
              yAxis: {
                filterType: yAxisFilter,
                ranges: rowRanges.map((row) => row.label),
              },
            });
            scrollLeft();
          }
          lastScrollTime.current = now;
          accX.current = 0;
        }
        accY.current = 0;
      } else {
        if (canScroll && Math.abs(accY.current) >= threshY) {
          if (accY.current) {
            logEvent(EventType.Scroll, {
              targetType: 'carousel',
              direction: 'down',
              offset: { row: rowOffset, col: columnOffset },
              xAxis: {
                filterType: xAxisFilter,
                ranges: columnRanges.map((col) => col.label),
              },
              yAxis: {
                filterType: yAxisFilter,
                ranges: rowRanges.map((row) => row.label),
              },
            });
            scrollDown();
          } else {
            logEvent(EventType.Scroll, {
              targetType: 'carousel',
              direction: 'up',
              offset: { row: rowOffset, col: columnOffset },
              xAxis: {
                filterType: xAxisFilter,
                ranges: columnRanges.map((col) => col.label),
              },
              yAxis: {
                filterType: yAxisFilter,
                ranges: rowRanges.map((row) => row.label),
              },
            });
            scrollUp();
          }
          lastScrollTime.current = now;
          accY.current = 0;
        }
        accX.current = 0;
      }
    },
    [cellWidth, cellHeight, scrollLeft, scrollRight, scrollUp, scrollDown]
  );

  // attach wheel listener
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    applyDecisionChipsToCarousel();
  }, [selectedChips, applyDecisionChipsToCarousel]);

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Column Headers (X-Axis Labels) */}
      <div className="flex w-full">
        {/* Space for row headers */}
        <div className="w-rowLabels" />
        <div
          className={`flex flex-1 gap-2 h-columnLabels justify-center items-center font-medium text-sm text-gray-500`}
          style={{
            width: `${visibleColumns * cellWidth + (visibleColumns - 1) * 8}px`,
          }}
        >
          {visibleColumnRanges.map((colRange, colIndex) => (
            <div
              key={colRange.label}
              className={`text-center text-pretty p-2 cursor-pointer ${
                hoveredColumn === columnOffset + colIndex
                  ? 'font-semibold text-darkOrange'
                  : ''
              }`}
              style={{
                width: `${cellWidth}px`,
              }}
              onMouseEnter={() => handleMouseEnter(Axis.X, colIndex, colRange)}
              onMouseLeave={() => handleMouseLeave()}
              onClick={() => {
                logEvent(EventType.Click, {
                  targetType: 'column',
                  xAxis: {
                    filterType: xAxisFilter,
                    filterValue: colRange.label,
                  },
                });
                drillDownColumn(columnOffset + colIndex);
              }}
            >
              {colRange.label}
              <br />
              <span
                className={`text-xs ${
                  hoveredColumn === columnOffset + colIndex
                    ? 'font-semibold text-darkOrange'
                    : 'text-gray-400'
                }`}
              >
                {colRange.sublabel ?? ''}
              </span>
            </div>
          ))}

          {/* Add invisible placeholders to preserve layout */}
          {Array.from({
            length: visibleColumns - visibleColumnRanges.length,
          }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="invisible"
              style={{ width: `${cellWidth}px` }}
            >
              {/* Empty to preserve spacing */}
            </div>
          ))}
        </div>
      </div>

      {/* Reset Position Button at the Intersection */}
      <ResetButton
        onClick={resetPosition}
        disabled={rowOffset === 0 && columnOffset === 0}
      />

      <div className="flex w-full h-full">
        {/* Row Headers (Y-Axis Labels) */}
        <div
          className={`flex flex-shrink-0 w-rowLabels h-[${
            visibleRows * cellHeight + (visibleRows - 1) * 8
          }px] my-[36px]`}
        >
          <div
            className={`flex flex-col w-full h-full items-center justify-content gap-2 font-medium text-sm text-gray-500`}
          >
            {visibleRowRanges.map((rowRange, rowIndex) => (
              <div
                key={`${rowRange.label}`}
                className={`flex flex-col gap-0.5 justify-center text-center -rotate-90 origin-center cursor-pointer ${
                  hoveredRow === rowOffset + rowIndex
                    ? 'font-semibold text-darkOrange'
                    : ''
                }`}
                style={{ height: `${cellHeight}px` }}
                onMouseEnter={() =>
                  handleMouseEnter(Axis.Y, rowIndex, rowRange)
                }
                onMouseLeave={() => handleMouseLeave()}
                onClick={() => {
                  logEvent(EventType.Click, {
                    targetType: 'row',
                    yAxis: {
                      filterType: yAxisFilter,
                      filterValue: rowRange.label,
                    },
                  });
                  drillDownRow(rowOffset + rowIndex);
                }}
              >
                <span style={{ width: `${cellHeight}px` }}>
                  {rowRange.label}
                </span>
                <span
                  className={`text-xs ${
                    hoveredRow === rowOffset + rowIndex
                      ? 'font-semibold text-darkOrange'
                      : 'text-gray-400'
                  }`}
                  style={{ width: `${cellHeight}px` }}
                >
                  {rowRange.sublabel ?? ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel + Arrows */}
        <div className="relative w-full h-full">
          {/* Carousel */}
          <div ref={carouselRef} className="overflow-auto w-full h-full p-2">
            {isEmptyGrid ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 text-sm gap-2">
                <div className="flex items-center gap-1 text-base font-semibold">
                  <Search size={16} />
                  No accommodations found
                </div>
                <span className="text-xs text-center max-w-xs">
                  Try changing or resetting some filters.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logEvent(EventType.FilterReset, {
                      filterType: 'filterHistory',
                      numberOfSteps: steps.length - 1,
                    });
                    goToStep(0);
                  }}
                  className="mt-4 px-4 py-2 text-sm text-white bg-darkOrange rounded-lg hover:bg-darkOrange/90 transition"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div
                className="grid gap-2 transition-transform w-full h-full grid place-content-center"
                style={{
                  gridTemplateColumns: `repeat(${visibleColumns}, ${cellWidth}px)`,
                  gridTemplateRows: `repeat(${visibleRows}, ${cellHeight}px)`,
                }}
              >
                {Array.from({ length: visibleRows }).map((_, rowIndex) =>
                  Array.from({ length: visibleColumns }).map((_, colIndex) => {
                    const row = dataPerCell[rowOffset + rowIndex];
                    const cell = row ? row[columnOffset + colIndex] : null;

                    return (
                      <CarouselCell
                        key={`${rowOffset + rowIndex}-${
                          columnOffset + colIndex
                        }`}
                        col={columnOffset + colIndex}
                        row={rowOffset + rowIndex}
                        columnRange={columnRanges[columnOffset + colIndex]}
                        rowRange={rowRanges[rowOffset + rowIndex]}
                        accommodations={cell ? cell.accommodations : []}
                        isFillerCell={!cell}
                      />
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Main arrows */}
          <CarouselArrow
            position="left-0 top-1/2 -translate-y-1/2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'left',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollLeft();
            }}
            icon={<ChevronLeft size={18} />}
          />
          <CarouselArrow
            position="right-0 top-1/2 -translate-y-1/2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'right',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollRight();
            }}
            icon={<ChevronRight size={18} />}
          />
          <CarouselArrow
            position="top-0 left-1/2 -translate-x-1/2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'up',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollUp();
            }}
            icon={<ChevronUp size={18} />}
          />
          <CarouselArrow
            position="bottom-[4px] left-1/2 -translate-x-1/2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'down',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollDown();
            }}
            icon={<ChevronDown size={18} />}
          />

          {/* Diagonal arrows */}
          <CarouselArrow
            position="absolute top-2 left-2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'upLeft',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollUpLeft();
            }}
            icon={<ArrowUpLeft size={16} />}
          />
          <CarouselArrow
            position="absolute top-2 right-2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'upRight',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollUpRight();
            }}
            icon={<ArrowUpRight size={16} />}
          />
          <CarouselArrow
            position="absolute bottom-2 right-2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'downRight',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollDownRight();
            }}
            icon={<ArrowDownRight size={16} />}
          />
          <CarouselArrow
            position="absolute bottom-2 left-2"
            onClick={() => {
              logEvent(EventType.ArrowClick, {
                targetType: 'carousel',
                direction: 'downLeft',
                offset: { row: rowOffset, col: columnOffset },
                xAxis: {
                  filterType: xAxisFilter,
                  ranges: columnRanges.map((col) => col.label),
                },
                yAxis: {
                  filterType: yAxisFilter,
                  ranges: rowRanges.map((row) => row.label),
                },
              });
              scrollDownLeft();
            }}
            icon={<ArrowDownLeft size={16} />}
          />
        </div>
      </div>
    </div>
  );
};
