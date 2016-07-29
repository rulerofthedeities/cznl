export interface FilterOption {
  val: any;
  label: string;
}

export interface Filter {
  level: number;
  cats: string;
  tpe: string;
  test?: string;
}
