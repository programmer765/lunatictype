import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CompeteWordsProps {
  words: string[]
}

interface CharState {
  char: string;
  state: "untyped" | "correct" | "incorrect";
}

const charColors = {
  untyped: "#888888", // Gray for untyped characters
  correct: "#ffffff", // White for correct characters
  incorrect: "#f44336" // Red for incorrect characters
}

const countDown = 3; // Countdown duration in seconds

const Cursor : React.FC<{color: string, layoutId: string}> = ({color, layoutId}) => (
  <motion.span
    layoutId={layoutId}
    layout
    className="absolute inline-block w-[2px] h-[1.2em] align-middle animate-blink"
    style={{ backgroundColor: color, verticalAlign: 'text-bottom' }}
    transition={{ 
      layout: { duration: 0.2, ease: "easeInOut" },
      // opacity: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
    }}
  />
)



export const CompeteWords: React.FC<CompeteWordsProps> = ({ words }) => {

  const str = words.join(" ");

  const [charArray, setCharArray] = useState<CharState[]>(() => {
    return str.split("").map((char) => {
      return {
        char,
        state: "untyped"
      }
    });
  });
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


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (startTimer >= 0) return; // Ignore input during countdown

      const { ctrlKey, metaKey, shiftKey } = event
      if (ctrlKey || metaKey || shiftKey) return
      if (event.key.length === 1) {

        const isCorrect = event.key === charArray[player1Pos].char
        setCharArray(prev => {
          const newArray = [...prev];
          newArray[player1Pos] = {
            char: prev[player1Pos].char,
            state: isCorrect ? "correct" : "incorrect"
          }
          return newArray;
        });

        setPlayer1Pos(prev => prev + 1);

      } else if (event.key === "Backspace") {

        if (player1Pos === 0) return; // Can't backspace at the start

        setCharArray(prev => {
          const newArray = [...prev];
          newArray[player1Pos - 1] = {
            char: prev[player1Pos - 1].char,
            state: "untyped"
          }
          return newArray;
        });

        setPlayer1Pos(prev => Math.max(prev - 1, 0));
      }


      

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [startTimer, player1Pos, charArray]);



  const isTimerDone = startTimer < 0;


  const renderWordsWithCursor = () => {
    
    return charArray.map((char, index) => (
      <span key={index} className="relative" style={{ color: charColors[char.state], transition: "color 0.3s" }}>
        { index === player1Pos && <Cursor color="blue" layoutId="player1" /> }
        { index === player2Pos && <Cursor color="red" layoutId="player2" /> }
        {char.char}
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