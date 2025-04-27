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
  'Find a mid-range hotel under €100/night, <2 km from center, with a swimming pool.';

export const interfaceQuestions: SurveyQuestion[] = [
  { id: 'ease', text: 'The interface was easy to use.' },
  { id: 'fun', text: 'It was fun to browse using this interface.' },
  { id: 'helpful', text: 'I found the interface helpful to achieve my goal.' },
  {
    id: 'useful',
    text: 'I would use an interface like this when booking travel.',
  },
];

export const finalQuestions: SurveyQuestion[] = [
  { id: 'favorite', text: 'Which interface did you enjoy most and why?' },
  {
    id: 'use_real',
    text: 'Which one would you use in a real booking scenario?',
  },
  { id: 'rank', text: 'Rank the 3 interfaces by ease of use.' },
  { id: 'feedback', text: 'Any feedback or feature ideas?' },
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
      {
        id: 'diagEase',
        text: 'It was easy to scroll diagonally to discover new items.',
      },
      {
        id: 'depthInfo',
        text: 'The 3-D layering helped me understand item relationships.',
      },
      { id: 'funFeature', text: 'I enjoyed using the multi-axis controls.' },
    ],
    qualitative: [
      {
        id: 'whatWorks',
        text: 'What did you like most about the multi-axis carousel?',
      },
      { id: 'improve', text: 'How could this carousel be improved?' },
    ],
  },
  [InterfaceOption.SingleAxisCarousel]: {
    image: '/src/assets/study/single.png',
    quantitative: [
      { id: 'horizEase', text: 'It was easy to scroll horizontally.' },
      {
        id: 'infoDensity',
        text: 'I found the layout sufficiently informative.',
      },
    ],
    qualitative: [
      {
        id: 'compareDiag',
        text: 'How did this compare to the multi-axis version?',
      },
    ],
  },
  [InterfaceOption.Benchmark]: {
    image: '/src/assets/study/benchmark.png',
    quantitative: [
      {
        id: 'listEase',
        text: 'Finding items in this list view was efficient.',
      },
    ],
    qualitative: [
      {
        id: 'featureIdeas',
        text: 'What features from the carousels would you add here?',
      },
    ],
  },
};
