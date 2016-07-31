export interface Word {
  word: string;
  genus: string;
  article?: string;
}

export interface WordPair {
  _id: string;
  cz: Word;
  nl: Word;
  tpe: string;
  level: number;
  categories: string[];
  correct?: boolean;
  listed?: boolean;
}
