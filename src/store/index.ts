import { IConfig, IData } from '@/types/';
import { create } from 'zustand';
import backgroundImg from "@/assets/images/bg.png";

type State = {
  dataList: IData[];
  config: IConfig;
  selectedStrings: IData[];
};

type Action = {
  addData: (data: IData) => void;
  updateData: (data: IData) => void;
  updateDataList: (dataList: IData[]) => void;
  removeData: (data: IData) => void;
  clearDataList: () => void;
  setConfig: (config: IConfig) => void;
  setSelectedStrings: (selectedStrings: IData) => void;
  clearSelectedStrings: () => void;
  setShowConfetti: (showConfetti: boolean) => void;
};

const useStore = create<State & Action>((set) => ({
  dataList: [],
  config: {
    mainTitle: "抽選系統",
    subTitle: "預備階段",
    background: backgroundImg,
    drawCount: 3,
    showConfetti: false,
  },
  selectedStrings: [],
  addData: (data) => set((state) => ({ dataList: [ ...state.dataList, data ] })),
  updateData: (data) => set((state) => ({ dataList: state.dataList.map((q) => (q._id === data._id ? data : q)) })),
  removeData: (data) => set((state) => ({ dataList: state.dataList.filter((q) => q._id !== data._id) })),
  updateDataList: (dataList) => set({ dataList }),
  clearDataList: () => set({ dataList: [] }),
  setConfig: (config) => set({ config }),
  setSelectedStrings: (selectedStrings) => set((state) => ({ selectedStrings: [ ...state.selectedStrings, selectedStrings ] })),
  clearSelectedStrings: () => set({ selectedStrings: [] }),
  setShowConfetti: (showConfetti) => set((state) => ({ config: { ...state.config, showConfetti } })),
}));

export default useStore;