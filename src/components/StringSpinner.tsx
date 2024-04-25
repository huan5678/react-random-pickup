import {useEffect, useState} from 'react';

const StringSpinner = ({strings, interval = 100}: StringSpinnerProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % strings.length);
    }, interval);

    return () => clearInterval(timer);
  }, [strings, interval]);

  // 計算上一個和下一個索引
  const prevIndex = index === 0 ? strings.length - 1 : index - 1;
  const nextIndex = (index + 1) % strings.length;

  // 需要顯示的三個字符串
  const itemsToShow = [strings[prevIndex], strings[index], strings[nextIndex]];

  return (
    <div className="flex flex-col items-stretch justify-center h-64 gap-2 overflow-hidden divide-y">
      {itemsToShow.map((item, i) => (
        <div key={i} className="flex-1 inline-block text-6xl text-center h-1/3">
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default StringSpinner;
