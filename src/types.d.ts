type StringSpinnerProps = {
  strings: string[];
  interval?: number;
};

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
