interface Word {
  language: string;
  word: string;
  article: string;
  genus: string;
}

export interface CardWord extends Word {
  tpe?: string;
}

export class WordPair {
  src: Word;
  tgt: Word;
  tpe: string;
  categories: string[];
}

