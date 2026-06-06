import { useState, useRef, useLayoutEffect, useEffect, memo, useCallback } from "react"
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


const CharSpan = memo(({
  char,
  index,
  isPlayer1Cursor,
  isPlayer2Cursor,
  setRefs
} : {
  char: CharState,
  index: number,
  isPlayer1Cursor: boolean,
  isPlayer2Cursor: boolean,
  setRefs: (el: HTMLSpanElement | null) => void
}) => (
  <span key={index} className="relative" style={{ color: charColors[char.state], transition: "color 0.3s" }}
      ref={setRefs}
    >
      { isPlayer1Cursor && <Cursor color="blue" layoutId="player1" /> }
      { isPlayer2Cursor && <Cursor color="red" layoutId="player2" /> }
      {char.char}
    </span>
))



export const CompeteWords: React.FC<CompeteWordsProps> = ({ words }) => {

  const str = words.join(" ");
  const initialCharArray = useRef<CharState[]>(str.split("").map((char) => ({
    char,
    state: "untyped" as const
  })));

  const charArrayRef = useRef<CharState[]>([...initialCharArray.current]);
  const player1PosRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const startTimerRef = useRef<number>(0);
  const lineHeightRef = useRef<number>(0);
  // const player2PosRef = useRef<number>(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  const [charArray, setCharArray] = useState<CharState[]>([...initialCharArray.current]);
  const [lineHeight, setLineHeight] = useState<number>(0);
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [startTimer, setStartTimer] = useState<number>(countDown);
  const [player1Pos, setPlayer1Pos] = useState<number>(0);
  const [player2Pos, setPlayer2Pos] = useState<number>(0);



  useEffect(() => {

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTimerValue = countDown - elapsed;
      startTimerRef.current = newTimerValue;
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

    lineHeightRef.current = lineHeight;
    setLineHeight(lineHeight);

  }, [str]);


  const getCharTop = (ind: number) : number => {
    const charEl = charRefs.current[ind];
    const containerEl = containerRef.current;
    if (!charEl || !containerEl) return 0;
    return charEl.offsetTop;
  }


  const getLineNumber = (offsetTop: number): number => {
    const lh = lineHeightRef.current;
    if(lh === 0) return 0;
    return Math.round(offsetTop / lh);
  }


  const updateScroll = (cursorIndex: number) => {
    const now = Date.now();
    if (now - lastTimeRef.current < 50) return; // Throttle updates to every 100ms
    lastTimeRef.current = now;
    const lh = lineHeightRef.current;
    
    if(lh === 0) return;
    const totalChars = charRefs.current.length;
    const safeIndex = Math.min(cursorIndex, totalChars - 1);
    const cursorTop = getCharTop(safeIndex);
    const cursorLine = getLineNumber(cursorTop);
    const lastCharTop = getCharTop(totalChars - 1);
    const totalLines = getLineNumber(lastCharTop);

    if (cursorLine <= 1) {
      // containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      setScrollOffset(0);
      return;
    }

    if (cursorLine >= totalLines) return;
    const newScroll = (cursorLine - 1) * lh;
    setScrollOffset(newScroll); 
  }

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) return; // Already scheduled

    rafRef.current = requestAnimationFrame(() => {
      setCharArray([...charArrayRef.current]);
      setPlayer1Pos(player1PosRef.current);
      updateScroll(player1PosRef.current);
      rafRef.current = null; // Clear the ref after update
    });
  }, []);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (startTimerRef.current >= 0) return; // Ignore input during countdown

      const { ctrlKey, metaKey, shiftKey } = event
      if (ctrlKey || metaKey || shiftKey) return
      const currentPos = player1PosRef.current;
      if (event.key.length === 1) {

        const isCorrect = event.key === charArrayRef.current[currentPos].char
        charArrayRef.current[currentPos] = {
          char: charArrayRef.current[currentPos].char,
          state: isCorrect ? "correct" : "incorrect"
        }
        const newPos = currentPos + 1;
        // setPlayer1Pos(newPos);
        // updateScroll(newPos);

        player1PosRef.current = newPos;
        scheduleUpdate();

      } else if (event.key === "Backspace") {

        if (player1PosRef.current === 0) return; // Can't backspace at the start

        charArrayRef.current[currentPos - 1] = {
          char: charArrayRef.current[currentPos - 1].char,
          state: "untyped"
        }
        const newPos = currentPos - 1;
        // setPlayer1Pos(newPos);
        // updateScroll(newPos);

        player1PosRef.current = newPos;
        scheduleUpdate();
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [scheduleUpdate]);



  const isTimerDone = startTimer < 0;


  const renderWordsWithCursor = () => {
    
    return charArray.map((char, index) => (
      <CharSpan
        key={index}
        char={char}
        index={index}
        isPlayer1Cursor={index === player1Pos}
        isPlayer2Cursor={index === player2Pos}
        setRefs={el => charRefs.current[index] = el}
      />
    ));
  }


  
  return (
    <motion.div className="text-white flex mt-10">
      <motion.div className="flex-1 flex justify-center items-center">
        <div
          className="relative overflow-hidden w-full flex justify-center items-center"
          style={{ height: lineHeight ? `${lineHeight * 3}px` : 'auto' }}
        >
          <motion.span 
            className="text-4xl h-full font-mono tracking-wide leading-normal flex-wrap text-justify" 
            ref={containerRef}
            animate={{ 
              opacity: isTimerDone ? 1 : 0,
              y: -scrollOffset
            }}
            transition={{ 
              opacity: { duration: 0.5 },
              y: { duration: 0.5, ease: "easeInOut" }
            }}
            >
            {renderWordsWithCursor()}
          </motion.span>
        </div>


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