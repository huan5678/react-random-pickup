import { useCallback, useEffect, useRef, useState } from "react";
import { useTransition, animated } from "@react-spring/web";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import Confetti from "./components/Confetti";
import Dialog from "./components/Dialog";
import StringSpinner from "./components/StringSpinner";
import { Label } from "./components/ui/label";
import RootLayout from "./Layout";
import { Checkbox } from "./components/ui/checkbox";
import { RadioGroup } from "./components/ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Switch } from "./components/ui/switch";
import { quest1 } from "./data/quest1";

function App() {
  const [quests, setQuests] = useState<IQuest[]>([]);
  const [input, setInput] = useState<string>("");
  const [drawCount, setDrawCount] = useState<number>(1);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [rank, setRank] = useState<IRank>("unused");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [selectedStrings, setSelectedStrings] = useState<IQuest[]>([]);

  const animationFrameId = useRef<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const handleAddQuestion = () => {
    quest1.forEach((quest) => {
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

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

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
        <h2 className="text-2xl font-bold text-center">
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
          <div className="flex flex-col items-end gap-2">
            <p>目前題目數: {quests.filter((q) => !q.selected).length}</p>
            <Button
              onClick={startAnimation}
              disabled={quests.length <= drawCount || isSpinning}
            >
              隨機抽選
            </Button>
          </div>
          <div className="flex flex-col w-full gap-4 mx-auto">
            <div>{isSpinning && <StringSpinner strings={quests} />}</div>
            <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
              <h2 className="text-4xl">抽選結果</h2>
              <p className="text-2xl">獲選的是:</p>
              <ul>
                {selectedStrings.map((item) => (
                  <li className="text-lg" key={item.name}>
                    {item.name}
                  </li>
                ))}
              </ul>
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
        {showInput && (
          <section className="px-4 py-8 space-y-6 bg-white rounded-2xl">
            <div className="flex flex-col items-center justify-center gap-4">
              <Label htmlFor="gameTitle" className="block text-lg">
                比賽階段
              </Label>
              <RadioGroup
                value={rank}
                onValueChange={(value) => setRank(value as IRank)}
                defaultValue="unused"
                className="flex items-center justify-center gap-4 peer/overview"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="rematch"
                    checked={rank === "rematch"}
                    id="option-one"
                    className="text-primary"
                  />
                  <Label htmlFor="option-one">複賽</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="finals"
                    checked={rank === "finals"}
                    id="option-two"
                  />
                  <Label htmlFor="option-two">決賽</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg">抽選數量</h3>
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
              <Label htmlFor="setQuest1">讀取題庫1</Label>
              <Button id="setQuest1" onClick={handleAddQuestion}>
                加入題庫
              </Button>
            </div>
            <div>
              <Label htmlFor="input" className="text-lg">
                題目名稱
              </Label>
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
          </section>
        )}
      </div>
      <div className="absolute bottom-0 right-0 flex items-center justify-end w-full gap-4 mb-2 text-white -translate-x-4 -translate-y-4 opacity-25">
        <Label htmlFor="showSettings">輸入模式</Label>
        <Checkbox
          id="showSettings"
          checked={showInput}
          onCheckedChange={() => setShowInput(!showInput)}
        />
      </div>
    </RootLayout>
  );
}

export default App;
