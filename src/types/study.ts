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
];

export const finalQuestions: SurveyQuestion[] = [
  { id: 'favorite', text: 'Which interface did you enjoy the most and why?' },
  {
    id: 'use_real',
    text: 'Which interface would you use in a real booking scenario?',
  },
  {
    id: 'rank',
    text: 'Please rank the three interfaces based on how effectively they helped you achieve your goal.',
  },
  { id: 'feedback', text: 'Do you have any feedback or feature ideas?' },
];

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
    image: '/src/assets/study/multi.png',
    quantitative: [
      // 1. Scrolling
      {
        id: 'multiScrollHelpful',
        text: 'Being able to scroll / navigate both horizontally ( ← → ) and vertically ( ↑ ↓ ) helped me discover more options.',
      },
      {
        id: 'multiScrollConfusing',
        text: 'I found it confusing to scroll / navigate in more than one direction.',
      },
      {
        id: 'multiScrollNotice',
        text: 'It was easy to notice the option to scroll / navigate in multiple directions.',
      },
      // 2. Basic filtering
      {
        id: 'filterEasy',
        text: 'It was easy to use the filters to narrow down the list of places.',
      },
      {
        id: 'filterHelpful',
        text: 'Using the filters helped me find the right accommodations.',
      },
      // 3. Column-level / row-level clicks
      {
        id: 'headerClickFilters',
        text: 'I understood that clicking on a column header or a row header filters the results by the category or range that it represents.',
      },
      // 4. Cell‐level clicks
      {
        id: 'cellActionCombined',
        text: 'I understood that clicking on a cell can simultaneously apply both its row and column filters.',
      },
      // 5. Direct item clicks
      {
        id: 'itemClickShowsList',
        text: 'It was clear that clicking an accommodation item would redirect me to a list of matching accommodations.',
      },
      // 6. “Show results” button
      {
        id: 'showResultsButton',
        text: 'It was clear that the orange "Show Filtered Results (...)" button on the top right would take me to a result page with the current filters applied.',
      },
      // 7. History panel
      {
        id: 'historySaved',
        text: 'I understood that each filter action is recorded in the history panel at the top left.',
      },
      {
        id: 'historyStepBack',
        text: 'I noticed I could go back to earlier filters by clicking previous steps in the history panel.',
      },
    ],
    qualitative: [
      {
        id: 'whatWorks',
        text: 'What did you like the most about the Multi-directional Interface?',
      },
      {
        id: 'improve',
        text: 'How could this carousel be improved to make browsing easier?',
      },
    ],
  },
  [InterfaceOption.SingleAxisCarousel]: {
    image: '/src/assets/study/single.png',
    quantitative: [
      {
        id: 'horizScrollEase',
        text: 'I found it easy to horizontally ( ← → ) scroll through the lists.',
      },
      {
        id: 'titleFilterIntuitive',
        text: 'It felt intuitive to vertically ( ↑ ↓ ) scroll a list title (e.g. “Price: Low → Medium → High) to update the list below.',
      },
      {
        id: 'titleFilterClear',
        text: 'It was clear that changing the list title would update its corresponding accommodations.',
      },
      {
        id: 'infoDensity',
        text: 'The amount of information shown in each list was just right.',
      },
      {
        id: 'compareHelpful',
        text: 'Having separate lists for different categories (Price, Rating, etc.) helped me compare options quickly.',
      },
      {
        id: 'independentLists',
        text: 'I understood that filtering a list by its title did not affect the other lists.',
      },
    ],
    qualitative: [
      {
        id: 'whatWorks',
        text: 'What did you like the most about the Netflix-style Interface?',
      },
      {
        id: 'titleFilterFeedback',
        text: 'What did you like the most about the title filtering feature?',
      },
      {
        id: 'titleFilterImprove',
        text: 'How could the title filtering be improved?',
      },
    ],
  },
  [InterfaceOption.Benchmark]: {
    image: '/src/assets/study/benchmark.png',
    quantitative: [
      {
        id: 'listScanEase',
        text: 'I found it easy to scan and locate accommodations in this list view.',
      },
      {
        id: 'listEfficient',
        text: 'Finding items in this list view was efficient.',
      },
    ],
    qualitative: [
      {
        id: 'featureIdeas',
        text: 'What features would you add or improve in this list-based interface?',
      },
    ],
  },
};
