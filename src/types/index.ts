
export type ICurrentItem = {
  display: string;
  index: number | null;
};

export type StringListState = {
  strings: string[];
  selectedStrings: string[];
};

export type StringListAction = {
  type: 'ADD_STRING' | 'SELECT_STRING' | 'REMOVE_STRING' | 'CLEAR_SELECT_STRINGS';
  payload: string | number | null;
};

export type IAppTitle = {
  mainTitle: string;
  subTitle: string;
};

export type IRank = "rematch" | "finals" | "unused";

export type IQuest = {
  _id: string;
  selected: boolean;
  name: string;
  rank?: IRank;
  isUsed?: boolean;
};

export type IQuestRequest = {
  name: string;
  rank: IRank;
  selected: boolean;
};

export type StringSpinnerProps = {
  strings: IQuest[];
  interval?: number;
};

export type IConfig = {
  drawCount: number,
  selectedStrings: IQuest[],
};
