export interface FilterOption {
  val: any;
  label: string;
}

export interface FilterWord {
  word: string;
  start: boolean;
}

export interface Filter {
  level: number;
  cats: string;
  tpe: string;
  test?: string;
  word?: string;
  start?: boolean;
}
