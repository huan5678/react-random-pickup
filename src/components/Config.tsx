import { useState } from "react";
import { X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useWindowSize } from "usehooks-ts";

import useStore from "@/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { quest1 } from "@/data/quest1";
import { quest2 } from "@/data/quest2";
import { IData } from "@/types/";

export default function Config() {
  const width = useWindowSize().width;
  const screen = { width };
  const { toast } = useToast();
  const config = useStore(useShallow((state) => state.config));
  const { background, mainTitle, subTitle, drawCount } = config;
  const dataList = useStore((state) => state.dataList);
  const addData = useStore((state) => state.addData);
  const updateDataList = useStore((state) => state.updateDataList);
  const clearDataList = useStore((state) => state.clearDataList);
  const setConfig = useStore((state) => state.setConfig);
  const [input, setInput] = useState<string>("");

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleAddData = async (questName: string) => {
    try {
      const questNameArr = questName.split(",");

      questNameArr.map((name) =>
        addData({
          _id: crypto.randomUUID(),
          name,
          selected: false,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDataList = async (questName: string[]) => {
    const newDataList: IData[] = questName.map((name) => ({
      _id: crypto.randomUUID(),
      name,
      selected: false,
    }));
    updateDataList([...dataList, ...newDataList]);
  };

  const handleAddString = () => {
    if (input.trim() !== "") {
      handleAddData(input.trim());
      setInput("");
      toast({
        title: "新增成功",
        description: `已新增 "${input.trim()}" 到資料集`,
      });
    } else {
      toast({
        title: "新增失敗",
        description: "請輸入字串",
        variant: "destructive",
      });
    }
  };
  console.log(screen.width);
  return (
    <Drawer>
      <DrawerTrigger>設定</DrawerTrigger>
      <DrawerContent className="container max-w-screen">
        <DrawerHeader>
          <DrawerTitle>輸入模式</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription>App參數相關設定。</DrawerDescription>
        <div className="flex flex-col items-end justify-between gap-8 py-8 md:flex-row">
          <div className="flex flex-col w-full gap-4 md:flex-row md:w-auto">
            <div className="flex flex-col items-center justify-center gap-4">
              <Label htmlFor="mainTitle" className="block text-lg">
                標題名稱
              </Label>
              <Input
                id="mainTitle"
                type="text"
                value={mainTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newConfig = { ...config, mainTitle: e.target.value };
                  setConfig(newConfig);
                }}
              />
            </div>
            <Separator
              className="md:h-24"
              orientation={screen.width < 768 ? "horizontal" : "vertical"}
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <Label htmlFor="subTitle" className="block text-lg">
                副標題名稱
              </Label>
              <Input
                id="subTitle"
                type="text"
                value={subTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newConfig = { ...config, subTitle: e.target.value };
                  setConfig(newConfig);
                }}
              />
            </div>
            <Separator
              className="md:h-24"
              orientation={screen.width < 768 ? "horizontal" : "vertical"}
            />
            <div className="space-y-4">
              <h3 className="text-lg text-center">一次抽選數量</h3>
              <Input
                type="number"
                value={drawCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newConfig = {
                    ...config,
                    drawCount: parseInt(e.target.value),
                  };
                  setConfig(newConfig);
                }}
              />
            </div>
            <Separator
              className="md:h-24"
              orientation={screen.width < 768 ? "horizontal" : "vertical"}
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <Label htmlFor="background" className="block text-lg">
                背景圖片
              </Label>
              <Input
                id="background"
                type="text"
                value={background}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newConfig = { ...config, background: e.target.value };
                  setConfig(newConfig);
                }}
              />
            </div>
          </div>
          <Separator
            className="md:h-24"
            orientation={screen.width < 768 ? "horizontal" : "vertical"}
          />
          <div className="grid w-full grid-cols-2 gap-4 md:flex md:justify-center md:w-auto">
            <Dialog>
              <DialogTrigger className="flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
                顯示資料集
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-4xl">資料集</DialogTitle>
                </DialogHeader>
                <DialogDescription>目前資料集的項目:</DialogDescription>
                <ul className="flex flex-col gap-3 max-h-[75vh] overflow-auto">
                  {dataList
                    .filter((item) => !item.selected)
                    .map((item, index) => (
                      <li
                        className={`flex items-center justify-between p-2 transition duration-300 ${
                          index === dataList.length - 1
                            ? ""
                            : "border-b-2 border-primary-foreground"
                        }`}
                        key={item.name}
                      >
                        #{index + 1} - {item.name}
                        <div
                          className="p-1 transition duration-300 rounded-full group hover:cursor-pointer hover:bg-red-500"
                          onClick={() => {
                            const newDataList = dataList.filter(
                              (q) => q._id !== item._id
                            );
                            updateDataList(newDataList);
                          }}
                        >
                          <X className="w-6 h-6 text-red-500 transition duration-300 group-hover:text-white" />
                        </div>
                      </li>
                    ))}
                </ul>
              </DialogContent>
            </Dialog>
            <div className="flex flex-col items-center gap-4">
              <Button
                type="button"
                id="clearData"
                className="w-full md:w-auto"
                variant={"destructive"}
                onClick={() => clearDataList()}
              >
                清空資料集
              </Button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button
                type="button"
                id="setData1"
                className="w-full md:w-auto"
                onClick={() => handleAddDataList(quest1)}
              >
                加入題庫1
              </Button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button
                type="button"
                id="setData2"
                className="w-full md:w-auto"
                onClick={() => handleAddDataList(quest2)}
              >
                加入題庫2
              </Button>
            </div>
          </div>
        </div>
        <Separator className="my-2 md:my-4" />
        <div>
          <Label htmlFor="input" className="text-lg text-center">
            手動輸入項目
          </Label>
          <div className="flex flex-wrap gap-4 md:flex-nowrap">
            <Textarea
              id="input"
              placeholder="輸入字串，支援使用英文小寫逗號','進行多項目的新增。"
              value={input}
              onChange={handleTextAreaChange}
            />
            <Button className="w-full md:w-auto" onClick={handleAddString}>
              新增選項
            </Button>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose>關閉</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
