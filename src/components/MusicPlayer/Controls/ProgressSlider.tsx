import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
  } from "framer-motion";
  import { useRef } from "react";
  
  const MAX_OVERFLOW = 50;
  
  export default function ProgressSlider({
    value,
    onChange,
    className = "",
  }: {
    value: number;
    onChange: (value: number) => void;
    className?: string;
  }) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);
  
    const handleChange = (newValue: number) => {
      onChange(Math.min(100, Math.max(0, newValue)));
    };
  
    useMotionValueEvent(clientX, "change", (latest) => {
      if (sliderRef.current) {
        const { left, right } = sliderRef.current.getBoundingClientRect();
        let newValue;
  
        if (latest < left) {
          newValue = left - latest;
        } else if (latest > right) {
          newValue = latest - right;
        } else {
          newValue = 0;
        }
  
        overflow.jump(decay(newValue, MAX_OVERFLOW));
      }
    });
  
    const handlePointerMove = (e: React.PointerEvent) => {
      if (e.buttons > 0 && sliderRef.current) {
        const { left, width } = sliderRef.current.getBoundingClientRect();
        const newValue = (e.clientX - left) / width * 100;
        handleChange(newValue);
        clientX.jump(e.clientX);
      }
    };
  
    const handlePointerDown = (e: React.PointerEvent) => {
      handlePointerMove(e);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
  
    const handlePointerUp = () => {
      animate(overflow, 0, { type: "spring", bounce: 0.5 });
    };
  
    return (
      <div className={`w-full ${className}`}>
        <motion.div
          onHoverStart={() => animate(scale, 1.1)}
          onHoverEnd={() => animate(scale, 1)}
          style={{ scale }}
          className="group relative w-full touch-none select-none"
        >
          <div
            ref={sliderRef}
            className="relative h-3 w-full cursor-pointer rounded-full bg-gray-700"
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <motion.div
              className="absolute h-full rounded-full bg-green-400"
              style={{
                width: useTransform(() => `${value}%`),
                scaleX: useTransform(() => {
                  if (sliderRef.current) {
                    const { width } = sliderRef.current.getBoundingClientRect();
                    return 1 + overflow.get() / width;
                  }
                  return 1;
                }),
                scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              }}
            >
              <div className="absolute -right-2 -top-1 h-4 w-4 rounded-full bg-green-400 shadow-lg transition-transform group-hover:scale-100 group-active:scale-100 scale-0" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  function decay(value: number, max: number) {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
  }