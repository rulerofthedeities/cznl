export interface Word {
  word: string;
  genus: string;
  article?: string;
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
