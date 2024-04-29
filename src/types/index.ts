export type ICurrentItem = {
  display: string;
  index: number | null;
};

export type StringListState = {
  strings: string[];
  selectedStrings: string[];
};

export type IData = {
  _id: string;
  selected: boolean;
  name: string;
  isUsed?: boolean;
};

export type StringSpinnerProps = {
  strings: IData[];
  interval?: number;
  drawCount?: number;
};

export type IConfig = {
  mainTitle: string;
  subTitle: string;
  background: string | '*.jpg' | '*.png';
  drawCount: number;
  showConfetti: boolean;
};
