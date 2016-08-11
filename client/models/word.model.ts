export interface Word {
  word: string;
  genus?: string;
  case?: string;
  article?: string;
  hint?: string;
  otherwords?: string[];
  firstpersonsingular?: string;
  info?: string;
}

export interface Answer {
  _id: string;
  wordId?: string;
  correct?: boolean;
  listIds?: string[];
}

export interface WordPair {
  _id: string;
  cz: Word;
  czP?: Word;
  nl: Word;
  answer?: Answer;
  tpe: string;
  level: any;
  categories: string[];
}

export interface ErrorObject {
  article?: boolean;
  genus?: boolean;
}