import { CSSProperties, useCallback, useEffect, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
interface ConfettiOptions {
  spread: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
  particleCount?: number;
  origin?: { y: number };
}

type CustomCreateTypes = (options?: ConfettiOptions) => void;

const Confetti = () => {
  const refAnimationInstance = useRef<CustomCreateTypes>();

  const getInstance = (confetti: CustomCreateTypes | null) =>
    (refAnimationInstance.current = confetti as CustomCreateTypes);

  const makeShot = useCallback(
    (particleRatio: number, opts: ConfettiOptions) => {
      if (refAnimationInstance.current) {
        refAnimationInstance.current({
          ...opts,
          origin: { y: 0.7 },
          particleCount: Math.floor(200 * particleRatio),
        });
      }
    },
    []
  );

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

  const canvasStyles: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  };

  useEffect(() => {
    fire();
  }, [fire]);

  return <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />;
};

export default Confetti;
