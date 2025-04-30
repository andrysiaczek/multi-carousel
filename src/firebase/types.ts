import { FieldValue } from 'firebase/firestore';
import { InterfaceOption, QuestionId } from '../types';

/**
 * All the events which might be logged during a step.
 */
export enum EventType {
  TaskStart = 'task_start',
  TaskEnd = 'task_end',

  Hover = 'hover',
  Click = 'click',

  Scroll = 'scroll',
  ArrowClick = 'arrow_click',
  Navigation = 'navigation',

  FilterApply = 'filter_apply',
  FilterReset = 'filter_reset',
  FilterResetAll = 'filter_reset_all',

  FilterStep = 'filter_step',

  Survey = 'survey',
}

export type NoDetails = Record<string, never>;

/**
 * Payload when the user hovers over something.
 */
export interface HoverDetails {
  targetType:
    | 'infoButton'
    | 'resultItem'
    | 'resultItemShowMore'
    | 'bookNowButton'
    | 'carouselItem'
    | 'carouselItemShowMoreButton'
    | 'carouselShowThisList'
    | 'showAllResults'
    | 'showFilteredResults'
    | 'row'
    | 'column'
    | 'cell'
    | 'cellShowResults';
  accommodationId?: string; // also best accommodation
  accommodationIds?: string[];
  filter?: FilterDetails;
  xAxis?: FilterDetails;
  yAxis?: FilterDetails;
  featuresApplied?: string[];
  filterHistorySteps?: string[];
  carouselPosition?: { column: number; row: number };
}

/**
 * Payload when the user clicks on something.
 */
export interface ClickDetails {
  targetType:
    | 'resultsPage' // general e.g. images etc.
    | 'resultItem'
    | 'detailViewBackButton'
    | 'detailView'
    | 'bookNowButton'
    | 'hideInterfacePreview'
    | 'showInterfacePreview'
    | 'carouselShowThisList'
    | 'showAllResults'
    | 'showFilteredResults'
    | 'row'
    | 'column'
    | 'cell'
    | 'cellShowResults';
  accommodationId?: string;
  accommodationIds?: string[];
  filter?: FilterDetails;
  xAxis?: FilterDetails;
  yAxis?: FilterDetails;
  featuresApplied?: string[];
  filterHistorySteps?: string[];
  carouselPosition?: { column: number; row: number };
}

/**
 * Payload when the user scrolls.
 */
export interface ScrollDetails {
  targetType: 'carousel' | 'carouselTitle';
  direction?:
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'upLeft'
    | 'upRight'
    | 'downLeft'
    | 'downRight';
  filter?: FilterDetails;
  xAxis?: FilterDetails;
  yAxis?: FilterDetails;
  previousPosition?: { row: number; col: number };
  filterHistorySteps?: string[];
  accommodationIds?: string[];
  resetPosition?: boolean;
}

/**
 * Payload when a filter is applied or reset.
 */
export interface FilterDetails {
  filterType:
    | 'price'
    | 'rating'
    | 'distance'
    | 'type'
    | 'features'
    | 'filterHistory';
  filterValue?: string; // or range
  ranges?: string[];
  axis?: 'x' | 'y';
  sortDirection?: 'ascending' | 'descending';
  resetFilter?: boolean;
}

/**
 * Payload when a filter step is applied.
 */
export interface FilterStepDetails {
  stepNumber: number;
  label: string;
  xFilter: FilterDetails;
  yFilter: FilterDetails;
  accommodationIds: string[];
  goTo?: boolean;
}

export interface SurveyQuestion {
  questionId: QuestionId;
  answer: string | number;
}

/**
 * Payload when submitting the survey.
 */
export interface SurveyDetails {
  quantitative: SurveyQuestion[];
  qualitative: SurveyQuestion[];
}

/**
 * Payload when navigating to another page.
 */
export interface NavigationDetails {
  to: 'resultsPage' | 'detailView';
  accommodationId?: string;
  accommodationIds?: string[];
}

/**
 * Payload when a task starts or ends.
 */
export interface TaskDetails {
  taskType: 'exploratory' | 'goal' | 'survey';
  durationMs?: number;
}

/**
 * Map each EventType to the shape of its `details` object.
 */
export interface DetailsMap {
  [EventType.TaskStart]: TaskDetails;
  [EventType.TaskEnd]: TaskDetails;

  [EventType.Hover]: HoverDetails;
  [EventType.Click]: ClickDetails;

  [EventType.Scroll]: ScrollDetails;
  [EventType.ArrowClick]: ScrollDetails;
  [EventType.Navigation]: NavigationDetails;

  [EventType.FilterApply]: FilterDetails;
  [EventType.FilterReset]: FilterDetails;
  [EventType.FilterResetAll]: { scope: 'allFilters' | 'features' };

  [EventType.FilterStep]: FilterStepDetails;

  [EventType.Survey]: SurveyDetails;
}

export type DetailsFor<T extends EventType> = DetailsMap[T];

/**
 * A single logged event.
 */
export type FirebaseEvent<T extends EventType = EventType> = {
  timestamp: number;
  type: T;
  details: DetailsFor<T>;
};

/**
 * Structure for storing one step's worth of events.
 */
export type StudyStepLog = {
  sessionId: string;
  interfaceOption: InterfaceOption | null;
  taskType: 'exploratory' | 'goal' | 'survey';
  events: FirebaseEvent[];
  createdAt: FieldValue; // serverTimestamp()
  interfaceOrder: InterfaceOption[];
};
