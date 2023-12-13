import {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {useTransition, animated} from '@react-spring/web';

import {Button} from './components/ui/button';
import {Input} from './components/ui/input';
import Confetti from './components/Confetti';
import Dialog from './components/Dialog';

type StringSpinnerProps = {
  strings: string[];
  interval?: number;
};

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
    <div className="flex flex-col items-stretch justify-center h-20 gap-2 overflow-hidden divide-y">
      {itemsToShow.map((item, i) => (
        <div key={i} className="flex-1 inline-block text-center h-1/3">
          {item}
        </div>
      ))}
    </div>
  );
};

interface ICurrentItem {
  display: string;
  index: number | null;
}

interface StringListState {
  strings: string[];
  selectedStrings: string[];
}

interface StringListAction {
  type: 'ADD_STRING' | 'SELECT_STRING' | 'REMOVE_STRING' | 'CLEAR_SELECT_STRINGS';
  payload: string | number;
}

function App() {
  const [input, setInput] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ICurrentItem>({display: '', index: null});

  const initialState: StringListState = {
    strings: [],
    selectedStrings: [],
  };

  const stringListReducer = (state: StringListState, action: StringListAction): StringListState => {
    switch (action.type) {
      case 'ADD_STRING':
        return {...state, strings: [...state.strings, action.payload as string]};
      case 'SELECT_STRING':
        return {
          ...state,
          strings: state.strings.filter((_, index) => index !== action.payload),
          selectedStrings: [
            ...state.selectedStrings,
            String(state.strings[action.payload as number]),
          ],
        };
      case 'REMOVE_STRING':
        return {
          ...state,
          strings: state.strings.filter((_, index) => index !== action.payload),
        };
      case 'CLEAR_SELECT_STRINGS':
        return {...state, selectedStrings: []};
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(stringListReducer, initialState);
  const {strings, selectedStrings} = state;

  const animationFrameId = useRef<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const addString = (newString: string) => {
    dispatch({type: 'ADD_STRING', payload: newString});
  };

  const selectString = useCallback((index: number) => {
    dispatch({type: 'SELECT_STRING', payload: index});
  }, []);

  const removeString = useCallback((index: number) => {
    dispatch({type: 'REMOVE_STRING', payload: index});
  }, []);

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

  const handleClearSelectStrings = () => {
    dispatch({type: 'CLEAR_SELECT_STRINGS', payload: null});
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
    const update = () => {
      const randomIndex = Math.floor(Math.random() * strings.length);
      setCurrentItem({display: strings[randomIndex], index: randomIndex});
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);
  };

  const stopAnimation = useCallback(
    (selectedIndex: number) => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      setCurrentItem({display: strings[selectedIndex], index: null});
      setIsSpinning(false);
      setShowConfetti(true);
      toggleDialog();
      selectString(selectedIndex);
    },
    [strings, selectString]
  );

  const startAnimation = () => {
    if (strings.length === 0) return;

    setIsSpinning(true);
    setShowConfetti(false);
    animate();

    // 預先選擇一個隨機索引，並在5秒後停止動畫
    const selectedIndex = Math.floor(Math.random() * strings.length);
    setTimeout(() => stopAnimation(selectedIndex), 5000);
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
    <section className="flex flex-col items-center justify-center h-screen px-4 md:px-0">
      <h1 className="mb-4 text-2xl uppercase">Welcome Welcome</h1>
      <div className="flex flex-col w-full gap-4 mx-auto sm:w-3/4 md:w-4/6 lg:w-1/2 xl:w-1/3">
        <Input
          type="text"
          placeholder="輸入字串"
          value={input}
          onChange={handleInputChange}
          onKeyUp={handleOnKeyEnter}
          className={`${inputError ? 'shake-rotate shake-settings' : ''} transition`}
        />
        <div className="flex justify-center gap-4">
          <Button onClick={handleAddString}>新增候選人</Button>
          <Button onClick={startAnimation} disabled={strings.length <= 1 || isSpinning}>
            自信一抽
          </Button>
        </div>
        <div>{isSpinning && <StringSpinner strings={strings} />}</div>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          <h2 className="text-4xl">恭喜</h2>
          <p className="text-2xl">獲選的是: {currentItem.display}</p>
        </Dialog>
        {strings.length > 0 && (
          <ul className="flex flex-col gap-2 px-6 py-4 border divide-y rounded shadow">
            {transitions((style, string, _, index) => (
              <animated.li
                key={string}
                className="relative flex items-center justify-between pt-2"
                style={style}
              >
                {currentItem.index === index && isSpinning && (
                  <span className="absolute top-0 left-0 -translate-x-6">👉</span>
                )}
                {string}
                <Button variant="outline" size="icon" onClick={() => removeString(index)}>
                  ❌
                </Button>
              </animated.li>
            ))}
          </ul>
        )}
        {selectedStrings.length > 0 && (
          <div>
            <h3>恭喜入選人:</h3>
            <ul className="flex flex-col gap-4 mb-2">
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
            <div className="flex justify-end w-full">
              <Button variant="outline" onClick={() => handleClearSelectStrings()}>
                清空
              </Button>
            </div>
          </div>
        )}
        {showConfetti && <Confetti />}
      </div>
    </section>
  );
}

export default App;
