import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CompeteWordsProps {
  words: string[]
}

const countDown = 3; // Countdown duration in seconds

const Cursor : React.FC<{color: string}> = ({color}) => (
  <motion.span 
    className="inline-block w-1 h-[1.2em] relative"
    style={{ backgroundColor: color, verticalAlign: 'text-bottom' }}
    animate={{ opacity: [0, 1] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
  />
)



export const CompeteWords: React.FC<CompeteWordsProps> = ({ words }) => {

  const str = words.join(" ");
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [startTimer, setStartTimer] = useState<number>(countDown);
  const [player1Pos, setPlayer1Pos] = useState<number>(0);
  const [player2Pos, setPlayer2Pos] = useState<number>(0);

  useEffect(() => {

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTimerValue = countDown - elapsed;

      setStartTimer(newTimerValue);
      if (newTimerValue < 0) {
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

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
  console.log(isTimerDone, startTimer)


  const renderWordsWithCursor = () => {
    const charArray = str.split("");
    return charArray.map((char, index) => (
      <span key={index} className="relative text-[#acacac]">
        { index === player1Pos && <Cursor color="blue" /> }
        { index === player2Pos && <Cursor color="red" /> }
        {char}
      </span>
    ));
  }


  
  return (
    <motion.div className="text-white flex mt-10">
      <motion.div className="flex-1 flex justify-center items-center">
        <motion.span 
          className="text-4xl h-full font-mono tracking-wide leading-normal overflow-hidden flex-wrap text-justify" 
          style={{ height: maxHeight ? `${maxHeight}px` : 'auto'}}
          animate={{ opacity: isTimerDone ? 1 : 0 }}
          ref={containerRef}
        >
          {renderWordsWithCursor()}
        </motion.span>


        <AnimatePresence>
          {
            !isTimerDone && (
              <motion.div 
                className="absolute text-5xl font-mono tracking-wide leading-normal"
                animate={{ opacity: [0, 1], scale: [0.8, 1.2] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, repeat: 0 } }}
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