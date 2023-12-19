import {FC, useCallback, useEffect, useRef} from 'react';

import ReactCanvasConfetti from 'react-canvas-confetti';
import {CreateTypes} from 'canvas-confetti';

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

interface IFireworks {
  children: (e: {start?: () => void; stop: () => void; pause: () => void}) => JSX.Element;
}
interface ConfettiOptions {
  spread: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

const Confetti: FC<IFireworks> = () => {
  const refAnimationInstance = useRef<CreateTypes | null>(null);

  const makeShot = useCallback((particleRatio: number, opts: ConfettiOptions) => {
    refAnimationInstance.current?.({
      ...opts,
      origin: {y: 0.7},
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const setRefConfetti = useCallback((instance: CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  useEffect(() => {
    fire();
  }, [fire]);

  // @ts-expect-error Description of why the @ts-expect-error is necessary
  return <ReactCanvasConfetti refConfetti={setRefConfetti} style={canvasStyles} />;
};

export default Confetti;