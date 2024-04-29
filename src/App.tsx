import { useCallback, useEffect, useRef, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { useShallow } from "zustand/react/shallow";

import useStore from "@/store";

import RootLayout from "@/Layout";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Config from "@/components/Config";
import StringSpinner from "@/components/StringSpinner";
import { Separator } from "@/components/ui/separator";

function App() {
  const { mainTitle, subTitle, drawCount } = useStore(
    useShallow((state) => state.config)
  );
  const dataList = useStore((state) => state.dataList);
  const updateData = useStore((state) => state.updateData);
  const selectedStrings = useStore((state) => state.selectedStrings);
  const setSelectedStrings = useStore((state) => state.setSelectedStrings);
  const clearSelectedStrings = useStore((state) => state.clearSelectedStrings);
  const setShowConfetti = useStore((state) => state.setShowConfetti);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const animationFrameId = useRef<number | null>(null);

  const selectedTransitions = useTransition(selectedStrings, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
  });

  const handleClearSelectStrings = () => {
    clearSelectedStrings();
  };

  const animate = () => {
    const update = () => {
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);
  };

  const stopPickup = useCallback(
    (selectedIndexes: number[]) => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      setIsSpinning(false);
      setShowConfetti(true);
      selectedIndexes.forEach((index) => {
        const selectedData = dataList[index];
        setSelectedStrings(selectedData);
      });
      setOpenDialog(true);
    },
    [dataList, setSelectedStrings, setShowConfetti]
  );

  const startPickup = () => {
    if (dataList.length === 0) return;
    setShowConfetti(false);
    setIsSpinning(true);
    animate();

    // 過濾出未選中的項目
    const unselectedData = dataList.filter((data) => !data.selected);

    // 預先選擇指定數量的隨機索引
    const selectedIndexes: number[] = [];
    while (
      selectedIndexes.length < drawCount &&
      selectedIndexes.length < unselectedData.length
    ) {
      const randomIndex = Math.floor(Math.random() * unselectedData.length);
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex);
      }
    }

    // 更新選中的項目狀態
    selectedIndexes.forEach((index) => {
      const selectedData = unselectedData[index];
      updateData({ ...selectedData, selected: true });
    });

    // 在3秒後停止動畫,並一次性顯示所有選擇的結果
    setTimeout(() => {
      stopPickup(selectedIndexes);
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
      <div className="container py-12 space-y-4 text-primary-foreground">
        <h1 className="text-4xl font-bold tracking-wide text-center">
          {mainTitle}
        </h1>
        <h2 className="text-3xl font-bold text-center">{subTitle}</h2>
      </div>
      <section className="container flex flex-col justify-between gap-4 px-4 py-8 bg-background rounded-2xl">
        {selectedStrings.length === 0 && (
          <div className="flex flex-col items-end gap-2">
            <p>目前題目數: {dataList.filter((q) => !q.selected).length}</p>
            <Button
              type="button"
              onClick={startPickup}
              disabled={dataList.length <= drawCount || isSpinning}
            >
              隨機抽選
            </Button>
          </div>
        )}
        {isSpinning && (
          <StringSpinner strings={dataList} drawCount={drawCount} />
        )}
        <div className="flex flex-col w-full gap-4 mx-auto">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-4xl">抽選結果</DialogTitle>
              </DialogHeader>
              <DialogDescription>獲選的是:</DialogDescription>
              <ul>
                {selectedStrings.map((item) => (
                  <li className="text-2xl" key={item.name}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
          {selectedStrings.length > 0 && (
            <div>
              <h3 className="mb-2 text-2xl text-center">本次獲選的是</h3>
              <Separator />
              <ul className="flex flex-col max-w-screen-lg gap-4 mx-auto mb-2">
                {selectedTransitions((style, string) => (
                  <animated.li
                    key={string.name}
                    style={style}
                    className={`px-6 py-4 text-lg md:text-6xl text-center bg-primary rounded-xl text-primary-foreground`}
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
        </div>
        {dataList.filter((q) => q.selected).length > 0 && (
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
                  察看歷史項目
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-4xl">已選擇的項目</DialogTitle>
                </DialogHeader>
                <DialogDescription>目前已抽選過的項目:</DialogDescription>
                <ul className="space-y-2">
                  {dataList
                    .filter((q) => q.selected)
                    .map((item) => (
                      <li className="text-2xl" key={item.name}>
                        {item.name}
                      </li>
                    ))}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </section>
      <div className="container absolute bottom-0 right-0 flex items-center justify-end w-full max-w-lg gap-4 mb-2 text-white -translate-x-4 -translate-y-4 opacity-25">
        <Config />
      </div>
    </RootLayout>
  );
}

export default App;
