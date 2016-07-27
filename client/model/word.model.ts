export interface Word {
  word: string;
  genus: string;
  article?: string;
}

export interface WordPair {
  cz: Word;
  nl: Word;
  tpe: string;
  level: number;
  categories: string[];
}
