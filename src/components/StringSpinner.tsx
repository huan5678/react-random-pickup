import { StringSpinnerProps } from "@/types/";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

const StringSpinner = ({
  strings,
  interval = 100,
  drawCount = 3,
}: StringSpinnerProps) => {
  const [index, setIndex] = useState(0);

  useInterval(() => {
    setIndex((prevIndex) => (prevIndex + 1) % strings.length);
  }, interval);

  // 計算需要顯示的字符串索引
  const itemIndexesToShow = Array.from({ length: drawCount }, (_, i) => {
    return (index + i) % strings.length;
  });

  // 需要顯示的字符串
  const itemsToShow = itemIndexesToShow.map((idx) => strings[idx]);
  const itemHeight = `${100 / drawCount}%`;

  return (
    <div
      className="flex flex-col items-stretch justify-center gap-2 overflow-hidden divide-y"
      style={{ height: `${drawCount * 100}px` }}
    >
      {itemsToShow.map((item, i) => (
        <div
          key={i}
          className="flex-1 inline-block text-lg text-center md:text-6xl"
          style={{ height: itemHeight }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default StringSpinner;
