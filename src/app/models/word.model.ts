import {AllSettings} from './settings.model';

export enum Direction {Left = -1, Right = 1};

export interface Total {
  correct?: number;
  incorrect?: number;
  new?: number;
  review?: number;
}

export interface Word {
  word: string;
  genus?: string;
  case?: string;
  article?: string;
  hint?: string;
  otherwords?: string[];
  firstpersonsingular?: string;
  info?: string;
  aspect?: string;
  plural?: string;
  diminutive?: string;
  total?: Total;
}

export interface Answer {
  _id: string;
  wordId?: string;
  correct?: boolean;
  review?: boolean;
  streak?: number;
  total?: Total;
}

export interface WordPair {
  _id: string;
  cz: Word;
  czP?: Word;
  nl: Word;
  nlP: Word;
  answer?: Answer;
  tpe: string;
  level: any;
  categories: string[];
  perfective?: boolean;
}

export interface CardQA {
  card: WordPair;
  settings: AllSettings;
  isQuestion: boolean;
  perfective: boolean;
}

export interface ErrorObject {
  article?: boolean;
  genus?: boolean;
}
