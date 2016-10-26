export interface Total {
  correct?: number;
  incorrect?: number;
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
  aspect?:string;
  plural?:string;
  total?:Total;
}

export interface Answer {
  _id: string;
  wordId?: string;
  correct?: boolean;
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

export interface ErrorObject {
  article?: boolean;
  genus?: boolean;
}
