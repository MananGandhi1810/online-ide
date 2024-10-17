import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";

const ConfettiContext = createContext({});

const Confetti = forwardRef((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props;
  const instanceRef = useRef(null); // confetti instance

  const canvasRef = useCallback(// https://react.dev/reference/react-dom/components/common#ref-callback
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  (node) => {
    if (node !== null) {
      // <canvas> is mounted => create the confetti instance
      if (instanceRef.current) return; // if not already created
      instanceRef.current = confetti.create(node, {
        ...globalOptions,
        resize: true,
      });
    } else {
      // <canvas> is unmounted => reset and destroy instanceRef
      if (instanceRef.current) {
        instanceRef.current.reset();
        instanceRef.current = null;
      }
    }
  }, [globalOptions]);

  // `fire` is a function that calls the instance() with `opts` merged with `options`
  const fire = useCallback((opts = {}) => instanceRef.current?.({ ...options, ...opts }), [options]);

  const api = useMemo(() => ({
    fire,
  }), [fire]);

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) {
      fire();
    }
  }, [manualstart, fire]);

  return (
    (<ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>)
  );
});

function ConfettiButton({
  options,
  children,
  ...props
}) {
  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    confetti({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  return (
    (<Button onClick={handleClick} {...props}>
      {children}
    </Button>)
  );
}

Confetti.displayName = "Confetti";

export { Confetti, ConfettiButton };

export default Confetti;
