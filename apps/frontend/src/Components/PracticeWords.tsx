import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'
import Loading from './Loading'
import { motion } from 'framer-motion'


interface CharState {
  char: string
  isAdded: boolean
  isTyped: boolean
  isCorrect: boolean
  typed: string
}

interface PracticeWordsProps {
  onComplete: (charactersTyped: number, timeTaken: number, errorsMade: number) => void
}


const PracticeWords : React.FC<PracticeWordsProps> = ({ onComplete }) => {

  const data = useGetRandomWordFromServer()

  const [loading, setLoading] = useState<boolean>(true)
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [chars, setChars] = useState<CharState[]>([])
  const [index, setIndex] = useState<number>(0)
  const [currentLine, setCurrentLine] = useState<number>(0)
  const [lineHeight, setLineHeight] = useState<number>(0)
  const [skipFirstLine, setSkipFirstLine] = useState<boolean>(true)
  const [lineStarts, setLineStarts] = useState<{index: number, top: number}[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<(HTMLSpanElement | null)[]>(Array(chars.length).fill(null))

  const updateLineStarts = useCallback(() => {
    requestAnimationFrame(() => {
      const textEl = textRef.current
      if(!textEl) return
      const rect = textEl.getBoundingClientRect()
      const newLineStarts: {index: number, top: number}[] = []
      let lastTop : number | null = null

      for(let i = 0; i < characterRef.current.length; i++) {
        const char = characterRef.current[i]
        if(!char) continue
        const top = Math.round(char.getBoundingClientRect().top - rect.top)
        if(lastTop === null || Math.abs(top - lastTop) > 5) {
          newLineStarts.push({index: i, top: top})
          lastTop = top
        }
      }
      setLineStarts(newLineStarts)
    })
  }, [])

  const updateCursorPosition = useCallback((index : number) => {
    if(characterRef.current[index] === null || textRef.current === null) return
    const char = characterRef.current[index]
    const textContainer = textRef.current
    if(char) {
      const charRect = char.getBoundingClientRect()
      const containerRect = textContainer.getBoundingClientRect()

      const left = charRect.left - containerRect.left
      const top = charRect.top - containerRect.top + charRect.height / 6

      setCursorPosition({ x: left, y: top })

    } else if(index === 0) {
      setCursorPosition({x: 0, y: 0})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterRef])

  const increaseCurrentLine = useCallback((index: number) => {
    requestAnimationFrame(() => {
      const char = characterRef.current[index + 1]
      const prevChar = characterRef.current[index]
      if(char && prevChar) {
        const prevTop = Math.round(prevChar.getBoundingClientRect().top)
        const currentTop = Math.round(char.getBoundingClientRect().top)
        if(currentTop > prevTop) {
          console.log(currentLine)
          if(skipFirstLine) {
            setSkipFirstLine(false)
            return
          }
          setCurrentLine((currentLine) => Math.min(currentLine + 1, Math.max(0, lineStarts.length - 1)))
          updateLineStarts()
        }
      }
    })
  }, [characterRef, currentLine, lineStarts, skipFirstLine, updateLineStarts])
  
  const decreaseCurrentLine = useCallback((index: number) => {
    requestAnimationFrame(() => {
        const char = characterRef.current[index - 1]
        const nextChar = characterRef.current[index]
        if(char && nextChar) {
          const nextTop = nextChar.getBoundingClientRect().top
          const currentTop = char.getBoundingClientRect().top
          if(currentTop < nextTop) {
            console.log(currentLine)
            if(currentLine === 0) {
              setSkipFirstLine(true)
            }
            setCurrentLine((currentLine) => Math.max(currentLine - 1, 0))
            updateLineStarts()
          }
        }
    })
  }, [characterRef, currentLine, updateLineStarts])

  useEffect(() => {
    if(data.isLoading === true) {
      setLoading(true)
      return
    }
    if(data.isError === true) {
      setLoading(false)
      return
    }
    const words: string[] = data.data ? data.data : [""]
    
    const sentence : string = words.join(' ')

    setChars(sentence.split('').map((char) => ({
      char: char,
      isAdded: false,
      isTyped: false,
      isCorrect: false,
      typed: ''
    })))
    
    setIndex(0)
    
    // Don't set loading to false here - let useLayoutEffect handle it after layout is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isLoading])

  useLayoutEffect(() => {
    if (chars.length === 0) return
    
    const first = characterRef.current[0]
    if(first) {
      const rect = first.getBoundingClientRect()
      setLineHeight(rect.height)
    }
    updateLineStarts()
    
    // Only remove loading after layout is calculated
    requestAnimationFrame(() => {
      setLoading(false)
    })
  }, [chars, updateLineStarts])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      const { ctrlKey, metaKey, shiftKey } = e
      if(ctrlKey || metaKey || shiftKey) return
      if(e.key.length === 1) {
        
        chars[index].isTyped = true
        chars[index].typed = e.key
        
        if(chars[index].char === e.key) {
          chars[index].isCorrect = true
        }
        else if (chars[index].char === ' ') {
          const char : CharState = {
            char: e.key,
            isAdded: true,
            isTyped: true,
            isCorrect: false,
            typed: e.key
          }
          chars.splice(index, 0, char)
        }
        setIndex(index + 1)

        // Check if we need to scroll to the next line
        increaseCurrentLine(index)

      }
      else if(e.key === 'Backspace') {
        if(index === 0) return
        if(chars[index - 1].isAdded) {
          chars.splice(index - 1, 1)
        }
        else {
          chars[index - 1].isTyped = false
          chars[index - 1].typed = ''
          chars[index - 1].isCorrect = false
        }
        setIndex(index - 1)

        // Check if we need to scroll to the previous line
        decreaseCurrentLine(index)
      }
    }


    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars, index])

  useEffect(() => {
    requestAnimationFrame(() => updateCursorPosition(index))
    updateLineStarts()
  }, [index, updateCursorPosition, updateLineStarts])

  useEffect(() => {
    // updateCursorPosition(index)

    const handleResize = () => {
      if(characterRef.current[0]) {
        const rect = characterRef.current[0].getBoundingClientRect()
        setLineHeight(rect.height)
      }
      updateLineStarts()
      requestAnimationFrame(() => updateCursorPosition(index))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [index, updateCursorPosition, updateLineStarts])


  const getCharColor = (char: CharState) => {
    if(char.isTyped) {
      if(char.isCorrect) {
        return 'text-white'
      }
      else {
        return 'text-red-500'
      }
    }
    return 'text-gray-500'
  }

  const computeTranslateY = () => {
    if(!lineStarts || lineStarts.length === 0) return 0
    const top = lineStarts[0].top
    const target = lineStarts[Math.min(currentLine, lineStarts.length - 1)]?.top || top
    return target - top
  }

  const translateY = computeTranslateY()


  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 1 }}
      className='relative'
    >
      { loading && <Loading />}
      <div className='h-[30vh] flex items-center'>
        <div 
          ref={containerRef} 
          className={`relative flex flex-wrap text-justify overflow-hidden transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}
          style={{ height: lineHeight * 3.5 || '32vh' }}
        >
          <div 
            ref={textRef} 
            className='mx-2 text-[2.75rem] tracking-widest transition-transform duration-300 ease-in-out'
            style={{ transform: `translateY(-${translateY}px)`}}
          >
          <div 
            className='absolute w-[2px] h-12 bg-[#FFBF00] transition-transform duration-300 ease-in-out animate-blink'
            style={{ transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`}}
          />
          {
            chars.map((char, index) => (
              <span 
                ref={(el) => characterRef.current[index] = el} 
                key={index} 
                className={`${getCharColor(char)} transition-all duration-500 ease-in-out`}
              >
                {char.char}
              </span>
            ))
          }
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PracticeWords