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
  level: number;
  categories: string[];
}

export interface FormWordPair {
  _id: string;
  tpe: string;
  level: string;
  categories: string;
  'cz.word': string;
  'cz.genus': string;
  'cz.case'?: string;
  'cz.hint'?: string;
  'cz.otherwords'?: string[];
  'czP.word': string;
  'czP.case'?: string;
  'czP.hint'?: string;
  'czP.otherwords'?: string[];
  'nl.word': string;
  'nl.article': string;
  'nl.otherwords'?: string[];
  'nl.hint'?: string;
}


export interface ErrorObject {
  article?: boolean;
  genus?: boolean;
}
