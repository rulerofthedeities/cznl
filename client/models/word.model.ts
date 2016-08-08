export interface Word {
  word: string;
  genus?: string;
  article?: string;
  hint?: string;
  otherwords?: string[];
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
  'cz.hint'?: string;
  'cz.otherwords'?: string[];
  'nl.word': string;
  'nl.article': string;
  'nl.otherwords'?: string[];
  'nl.hint'?: string;
}


export interface ErrorObject {
  article?: boolean;
  genus?: boolean;
}
