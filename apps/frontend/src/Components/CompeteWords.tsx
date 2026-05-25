import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CompeteWordsProps {
  words: string[]
}



export const CompeteWords: React.FC<CompeteWordsProps> = ({ words }) => {

  const str = words.join(" ");
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [startTimer, setStartTimer] = useState<number>(3);

  useEffect(() => {
    if (startTimer < 0) return; // Timer has ended, do nothing

    if (startTimer === 0) {
      setStartTimer(-1); // Stop the timer
      return;
    }

    const timer = setInterval(() => {
      setStartTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTimer]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const style = window.getComputedStyle(containerRef.current);
    let lineHeight = parseFloat(style.lineHeight);

    if (isNaN(lineHeight)) {
      lineHeight = parseFloat(style.fontSize) * 1.2; // Fallback to font size if line height is not set
    }

    setMaxHeight(lineHeight * 3); // Set max height to 3 lines

  }, [str]);


  const isTimerDone = startTimer < 0;


  
  return (
    <motion.div className="text-white flex mt-10">
      <motion.div className="flex-1 flex justify-center items-center"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.span 
          className="text-4xl h-full font-mono tracking-wide leading-normal overflow-hidden flex-wrap text-justify" 
          style={{ height: maxHeight ? `${maxHeight}px` : 'auto'}}
          animate={{ opacity: isTimerDone ? 1 : 0 }}
          ref={containerRef}
        >
          {str}
        </motion.span>


        <AnimatePresence>
          {
            !isTimerDone && (
              <motion.div 
                className="absolute text-5xl font-mono tracking-wide leading-normal"
                animate={{ opacity: [0, 1], scale: [0.8, 1.2] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {startTimer || "Go!"}
              </motion.div>
            )
          }
        </AnimatePresence>

      </motion.div>
    </motion.div>
  )
}