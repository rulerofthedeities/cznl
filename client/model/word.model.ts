export interface Word {
  language: string;
  word: string;
  article: string;
  genus: string;
  tpe?: string;
}

export interface WordPair {
  cz: Word;
  nl: Word;
  tpe: string;
  categories: string[];
}
