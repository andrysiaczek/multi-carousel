import { InterfaceOption } from '../types';

export type SurveyQuestion = { id: string; text: string };

export type StudyStep =
  | { type: 'intro' }
  | { type: 'task'; subtype: 'exploratory' | 'goal'; option: InterfaceOption }
  | { type: 'survey'; option: InterfaceOption }
  | { type: 'final' };

export const exploratoryTask =
  "Find an accommodation you'd genuinely book for a week-long vacation.";

export const goalTask =
  'Find a hotel under €100 per night, located within 2 km of the city center, with a swimming pool.';

export const interfaceQuestions: SurveyQuestion[] = [
  { id: 'ease', text: 'I found the interface easy to use.' },
  { id: 'fun', text: 'I found browsing with this interface enjoyable.' },
  {
    id: 'helpful',
    text: 'I found the interface helpful in achieving my goal.',
  },
  {
    id: 'useful',
    text: 'I would use an interface like this when booking travel.',
  },
] as const;

export const finalQuestions: SurveyQuestion[] = [
  { id: 'favorite', text: 'Which interface did you enjoy the most and why?' },
  {
    id: 'real',
    text: 'Which interface would you use in a real booking scenario?',
  },
  {
    id: 'rank',
    text: 'Please rank the three interfaces based on how effectively they helped you achieve your goal.',
  },
  { id: 'feedback', text: 'Do you have any feedback or feature ideas?' },
] as const;

export type DetailedQuestions = Record<
  InterfaceOption,
  {
    image: string;
    quantitative: { id: string; text: string }[];
    qualitative: { id: string; text: string }[];
  }
>;

export const detailedQuestions: DetailedQuestions = {
  [InterfaceOption.MultiAxisCarousel]: {
    image: '/study/multi.png',
    quantitative: [
      // Scrolling
      {
        id: 'multi_scroll_notice',
        text: 'It was easy to notice the option to scroll in multiple directions.',
      },
      // 1a. Horizontal & vertical
      {
        id: 'multi_scroll_axes_helpful',
        text: 'Being able to scroll both horizontally (← →) and vertically (↑ ↓) helped me discover more options.',
      },
      {
        id: 'multi_scroll_axes_confusing',
        text: 'I found it confusing to scroll in both horizontal and vertical directions.',
      },
      // 1b. Diagonal
      {
        id: 'multi_scroll_diagonal_helpful',
        text: 'Being able to scroll diagonally (↖ ↗ ↙ ↘) helped me explore combinations more quickly.',
      },
      {
        id: 'multi_scroll_diagonal_confusing',
        text: 'I found diagonal scrolling (↖ ↗ ↙ ↘) confusing or hard to control.',
      },
      // 2. Basic filtering
      {
        id: 'multi_filter_easy',
        text: 'It was easy to use the filters to narrow down the list of places.',
      },
      {
        id: 'multi_filter_helpful',
        text: 'Using the filters helped me find the right accommodations.',
      },
      // 3. Column-level / row-level clicks
      {
        id: 'multi_header_click_filters',
        text: 'I understood that clicking on a column header or a row header filters the results by the category or range that it represents.',
      },
      // 4. Cell‐level clicks
      {
        id: 'multi_cell_action_combined',
        text: 'I understood that clicking on a cell can simultaneously apply both its row and column filters.',
      },
      // 5. Direct item clicks
      {
        id: 'multi_item_click_shows_list',
        text: 'It was clear that clicking an accommodation item would redirect me to a list of matching accommodations.',
      },
      // 6. “Show results” button
      {
        id: 'multi_show_results_button',
        text: 'It was clear that the orange "Show Filtered Results (...)" button on the top right would take me to a result page with the current filters applied.',
      },
      // 7. History panel
      {
        id: 'multi_history_saved',
        text: 'I understood that each filter action is recorded in the history panel at the top left.',
      },
      {
        id: 'multi_history_step_back',
        text: 'I noticed I could go back to earlier filters by clicking previous steps in the history panel.',
      },
    ],
    qualitative: [
      {
        id: 'multi_what_works',
        text: 'What did you like the most about the Multi-directional Interface?',
      },
      {
        id: 'multi_improve',
        text: 'How could this carousel be improved to make browsing easier?',
      },
    ],
  },
  [InterfaceOption.SingleAxisCarousel]: {
    image: '/study/single.png',
    quantitative: [
      {
        id: 'single_horiz_scroll_ease',
        text: 'I found it easy to horizontally ( ← → ) scroll through the lists.',
      },
      {
        id: 'single_title_filter_intuitive',
        text: 'It felt intuitive to vertically ( ↑ ↓ ) scroll a list title (e.g. “Price: Low → Medium → High) to update the list below.',
      },
      {
        id: 'single_title_filter_clear',
        text: 'It was clear that changing the list title would update its corresponding accommodations.',
      },
      {
        id: 'single_info_density',
        text: 'The amount of information shown in each list was just right.',
      },
      {
        id: 'single_compare_helpful',
        text: 'Having separate lists for different categories (Price, Rating, etc.) helped me compare options quickly.',
      },
      {
        id: 'single_independent_lists',
        text: 'I understood that filtering a list by its title did not affect the other lists.',
      },
    ],
    qualitative: [
      {
        id: 'single_what_works',
        text: 'What did you like the most about the Netflix-style Interface?',
      },
      {
        id: 'single_title_filter_feedback',
        text: 'What did you like the most about the title filtering feature?',
      },
      {
        id: 'single_title_filter_improve',
        text: 'How could the title filtering be improved?',
      },
    ],
  },
  [InterfaceOption.Benchmark]: {
    image: '/study/benchmark.png',
    quantitative: [
      {
        id: 'benchmark_list_scan_ease',
        text: 'I found it easy to scan and locate accommodations in this list view.',
      },
      {
        id: 'benchmark_list_efficient',
        text: 'Finding items in this list view was efficient.',
      },
    ],
    qualitative: [
      {
        id: 'benchmark_feature_ideas',
        text: 'What features would you add or improve in this list-based interface?',
      },
    ],
  },
} as const;

type InterfaceQuestionId = (typeof interfaceQuestions)[number]['id'];
type FinalQuestionId = (typeof finalQuestions)[number]['id'];

type DetailedQuantId =
  (typeof detailedQuestions)[keyof typeof detailedQuestions]['quantitative'][number]['id'];
type DetailedQualId =
  (typeof detailedQuestions)[keyof typeof detailedQuestions]['qualitative'][number]['id'];

export type QuestionId =
  | InterfaceQuestionId
  | FinalQuestionId
  | DetailedQuantId
  | DetailedQualId;
