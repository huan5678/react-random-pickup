import {useCallback, useEffect, useRef, useState} from 'react';
import {useTransition, animated} from '@react-spring/web';
import Confetti from './components/Confetti';

import {Input} from './components/ui/input';
import {Button} from './components/ui/button';
import Dialog from './components/Dialog';

function App() {
  const [input, setInput] = useState<string>('');
  const [strings, setStrings] = useState<string[]>([]);
  const [selectedStrings, setSelectedStrings] = useState<string[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string>('');
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [ showConfetti, setShowConfetti ] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);

  const animationFrameId = useRef<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const addString = (newString: string) => {
    setStrings((prevStrings) => [...prevStrings, newString]);
  };

  const selectString = useCallback(
    (index: number) => {
      setSelectedStrings((prevSelected) => [...prevSelected, strings[index]]);
      setStrings((prevStrings) => prevStrings.filter((_, i) => i !== index));
    },
    [strings]
  );

  const transitions = useTransition(strings, {
    from: {opacity: 0, transform: 'translateY(-20px)'},
    enter: {opacity: 1, transform: 'translateY(0)'},
    leave: {opacity: 0, transform: 'translateY(20px)'},
  });

  const selectedTransitions = useTransition(selectedStrings, {
    from: {opacity: 0, transform: 'translateY(-20px)'},
    enter: {opacity: 1, transform: 'translateY(0)'},
    leave: {opacity: 0, transform: 'translateY(20px)'},
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleOnKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddString();
  };

  const handleAddString = () => {
    if (input.trim() !== '') {
      addString(input.trim());
      setInput('');
    } else {
      setInputError(true);
      setTimeout(() => setInputError(false), 500);
    }
  };

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute('open')
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const animate = () => {
    const randomIndex = Math.floor(Math.random() * strings.length);
    setCurrentDisplay(strings[randomIndex]);
    setCurrentDisplayIndex(randomIndex);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (strings.length === 0) return;

    setIsSpinning(true);
    setShowConfetti(false);
    animate();

    // 預先選擇一個隨機索引，並在5秒後停止動畫
    const selectedIndex = Math.floor(Math.random() * strings.length);
    setTimeout(() => stopAnimation(selectedIndex), 5000);
  };

  const stopAnimation = useCallback(
    (selectedIndex: number) => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      setCurrentDisplayIndex(null);
      setIsSpinning(false);
      toggleDialog();
      setShowConfetti(true);
      selectString(selectedIndex);
    },
    [selectString]
  );

  useEffect(() => {
    // 當組件卸載時，清除動畫
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-2xl uppercase">Welcome Welcome</h1>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="輸入字串"
          value={input}
          onChange={handleInputChange}
          onKeyUp={handleOnKeyEnter}
          className={`${inputError ? 'shake-rotate shake-settings' : ''} transition`}
        />
        <div className="flex gap-4">
          <Button onClick={handleAddString}>新增候選人</Button>
          <Button onClick={startAnimation} disabled={strings.length <= 1 || isSpinning}>
            自信一抽
          </Button>
        </div>
        <div>{isSpinning && <div>{currentDisplay}</div>}</div>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          <h2 className="text-4xl">恭喜</h2>
          <p className="text-2xl">獲選的是: {currentDisplay}</p>
        </Dialog>
        {strings.length > 0 && (
          <ul className="flex flex-col gap-2 px-6 py-4 border rounded shadow">
            {transitions((style, string, _, index) => (
              <li key={string} className="relative">
                <animated.span style={style}>
                  {currentDisplayIndex === index && isSpinning && (
                    <span className="absolute top-0 left-0 -translate-x-6">👉</span>
                  )}
                  {string}
                </animated.span>
              </li>
            ))}
          </ul>
        )}
        {selectedStrings.length > 0 && (
          <div>
            <h3>恭喜入選人:</h3>
            <ul className="flex flex-col gap-4">
              {selectedTransitions((style, string) => (
                <animated.li
                  key={string}
                  style={style}
                  className={'px-6 py-4 border rounded shadow'}
                >
                  {string}
                </animated.li>
              ))}
            </ul>
          </div>
        )}
        {showConfetti && <Confetti />}
      </div>
    </section>
  );
}

export default App;
