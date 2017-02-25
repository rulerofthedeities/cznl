export interface ProgressStats {
  dt: string;
  totalCorrect: number;
  totalInCorrect: number;
  totalLastCorrect: number;
  totalLastInCorrect: number;
  wordsTestedToday: number;
  wordsCorrectToday: number;
  wordsInCorrectToday: number;
  wordsNewToday: number;
  wordsReviewedToday: number;
}

export interface CalendarDay {
  day: string;
  currentMonth: boolean;
  stats: ProgressStats;
}
