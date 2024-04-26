declare module '*.jpg';
declare module '*.png';

type ICurrentItem = {
  display: string;
  index: number | null;
};

type StringListState = {
  strings: string[];
  selectedStrings: string[];
};

type StringListAction = {
  type: 'ADD_STRING' | 'SELECT_STRING' | 'REMOVE_STRING' | 'CLEAR_SELECT_STRINGS';
  payload: string | number | null;
};

type IRank = "rematch" | "finals" | "unused";

type IQuest = {
  _id?: string;
  selected: boolean;
  name: string;
  rank?: IRank;
  isUsed?: boolean;
};

type IQuestRequest = {
  name: string;
  rank: IRank;
  selected: boolean;
};

type StringSpinnerProps = {
  strings: IQuest[];
  interval?: number;
};