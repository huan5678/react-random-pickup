import { useCallback, useEffect, useRef, useState } from "react";
import { useTransition, animated } from "@react-spring/web";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Confetti from "@/components/Confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import StringSpinner from "@/components/StringSpinner";
import { Label } from "@/components/ui/label";
import RootLayout from "@/Layout";
import { Switch } from "@/components/ui/switch";
import { quest1 } from "@/data/quest1";
import { quest2 } from "@/data/quest2";

function App() {
  const [quests, setQuests] = useState<IQuest[]>([]);
  const [input, setInput] = useState<string>("");
  const [drawCount, setDrawCount] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [rank, setRank] = useState<IRank>("unused");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [selectedStrings, setSelectedStrings] = useState<IQuest[]>([]);

  const animationFrameId = useRef<number | null>(null);

  const selectedTransitions = useTransition(selectedStrings, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleOnKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddString();
  };

  const addQuest = async (questName: string) => {
    try {
      const questNameArr = questName.split(",");

      const newQuests = questNameArr.map((name) => ({
        name,
        selected: false,
        rank,
      }));

      setQuests((prevQuests) => [...prevQuests, ...newQuests]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddQuestion = (quests: string[]) => {
    quests.forEach((quest) => {
      addQuest(quest);
    });
  };

  const handleClearSelectStrings = () => {
    setSelectedStrings([]);
  };

  const handleAddString = () => {
    if (input.trim() !== "") {
      addQuest(input.trim());
      setInput("");
    } else {
      setInputError(true);
      setTimeout(() => setInputError(false), 500);
    }
  };

  const animate = () => {
    const update = () => {
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);
  };

  const stopAnimation = useCallback(
    (selectedIndexes: number[]) => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      setIsSpinning(false);
      setShowConfetti(true);
      selectedIndexes.forEach((index) => {
        setSelectedStrings((prev) => [...prev, quests[index]]);
      });
    },
    [quests]
  );

  const startAnimation = () => {
    if (quests.length === 0) return;
    setShowConfetti(false);
    setIsSpinning(true);
    animate();

    // 預先選擇指定數量的隨機索引
    const selectedIndexes: number[] = [];
    while (selectedIndexes.length < drawCount) {
      const randomIndex = Math.floor(Math.random() * quests.length);
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex);
      }
      setQuests((prevQuests) => {
        const newQuests = [...prevQuests];
        newQuests[randomIndex].selected = true;
        return newQuests;
      });
    }

    // 在3秒後停止動畫,並一次性顯示所有選擇的結果
    setTimeout(() => {
      stopAnimation(selectedIndexes);
    }, 2000);
  };
  useEffect(() => {
    // 當組件卸載時，清除動畫
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <RootLayout>
      <div className="py-12 space-y-4 text-white">
        <h1 className="text-4xl font-bold tracking-wide text-center">
          2024台灣AI生成大賽(鳥巢盃)
        </h1>
        <h2 className="text-3xl font-bold text-center">
          {rank === "rematch"
            ? "複賽"
            : rank === "finals"
            ? "決賽"
            : "預備階段"}{" "}
          出題系統
        </h2>
      </div>
      <div className="flex gap-4">
        <section className="container flex flex-col justify-between px-4 py-8 bg-white rounded-2xl">
          {selectedStrings.length === 0 && (
            <div className="flex flex-col items-end gap-2">
              <p>目前題目數: {quests.filter((q) => !q.selected).length}</p>
              <Button
                type="button"
                onClick={startAnimation}
                disabled={quests.length <= drawCount || isSpinning}
              >
                隨機抽選
              </Button>
            </div>
          )}
          {isSpinning && <StringSpinner strings={quests} />}
          <div className="flex flex-col w-full gap-4 mx-auto">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-4xl">抽選結果</DialogTitle>
                </DialogHeader>
                <DialogDescription>獲選的是:</DialogDescription>
                <ul>
                  {selectedStrings.map((item) => (
                    <li className="text-lg" key={item.name}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
            {selectedStrings.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg">本輪題目是:</h3>
                <ul className="flex flex-col gap-4 mb-2">
                  {selectedTransitions((style, string) => (
                    <animated.li
                      key={string.name}
                      style={style}
                      className={"px-6 py-4 border rounded shadow text-6xl"}
                    >
                      {string.name}
                    </animated.li>
                  ))}
                </ul>
                <div className="flex justify-end w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleClearSelectStrings()}
                  >
                    清空
                  </Button>
                </div>
              </div>
            )}
            {showConfetti && <Confetti />}
          </div>
        </section>
      </div>
      <div className="absolute bottom-0 right-0 flex items-center justify-end w-full gap-4 mb-2 text-white -translate-x-4 -translate-y-4 opacity-25">
        <Drawer>
          <DrawerTrigger>設定</DrawerTrigger>
          <DrawerContent className="container max-w-screen">
            <DrawerHeader>
              <DrawerTitle>輸入模式</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              參數相關設定，包含比賽階段、抽選數量、題目名稱、題庫選擇等。
            </DrawerDescription>
            <div className="flex items-center gap-8 py-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <Label htmlFor="gameTitle" className="block text-lg">
                  比賽階段
                </Label>
                <Button
                  type="button"
                  id="gameTitle"
                  onClick={() => setRank("rematch")}
                  variant={rank === "rematch" ? "secondary" : "outline"}
                >
                  複賽
                </Button>
                <Button
                  type="button"
                  id="gameTitle"
                  onClick={() => setRank("finals")}
                  variant={rank === "finals" ? "default" : "outline"}
                >
                  決賽
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg text-center">抽選數量</h3>
                <div className="flex items-center gap-4">
                  <Label htmlFor="drawCount">單抽</Label>
                  <Switch
                    id="drawCount"
                    value={drawCount}
                    onCheckedChange={(value: boolean) =>
                      setDrawCount(value === true ? 3 : 1)
                    }
                  />
                  <Label htmlFor="drawCount">三連抽</Label>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-4">
                  <Label htmlFor="setQuest1">讀取題庫1</Label>
                  <Button
                    type="button"
                    id="setQuest1"
                    onClick={() => handleAddQuestion(quest1)}
                  >
                    加入題庫
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <Label htmlFor="setQuest2">讀取題庫2</Label>
                  <Button
                    type="button"
                    id="setQuest2"
                    onClick={() => handleAddQuestion(quest2)}
                  >
                    加入題庫
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="input" className="text-lg">
                手動輸入題目名稱
              </Label>
              <div className="flex gap-4">
                <Input
                  id="input"
                  type="text"
                  placeholder="輸入字串"
                  value={input}
                  onChange={handleInputChange}
                  onKeyUp={handleOnKeyEnter}
                  className={`${
                    inputError ? "shake-rotate shake-settings" : ""
                  } transition`}
                />
                <Button onClick={handleAddString}>新增題目</Button>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose>關閉</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </RootLayout>
  );
}

export default App;
