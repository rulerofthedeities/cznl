class Word {
  language: string;
  word: string;
  article: string;
  genus: string;
}

export class WordPair {
	src: Word;
	tgt: Word;
	categories: string[];
}
