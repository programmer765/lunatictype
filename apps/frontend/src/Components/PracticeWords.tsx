import { useCallback, useEffect, useRef, useState } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'
import Loading from './Loading'


interface CharState {
  char: string
  isAdded: boolean
  isTyped: boolean
  isCorrect: boolean
  typed: string
}


const PracticeWords = () => {

  const data = useGetRandomWordFromServer()

  const [loading, setLoading] = useState<boolean>(true)
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [chars, setChars] = useState<CharState[]>([])
  const [index, setIndex] = useState<number>(0)
  const [currentLine, setCurrentLine] = useState<number>(0)
  const [lineHeight, setLineHeight] = useState<number>(0)
  const [skipFirstLine, setSkipFirstLine] = useState<boolean>(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<(HTMLSpanElement | null)[]>(Array(chars.length).fill(null))

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
    setLoading(false)
    const sentence : string = words.join(' ')

    setChars(sentence.split('').map((char) => ({
      char: char,
      isAdded: false,
      isTyped: false,
      isCorrect: false,
      typed: ''
    })))
    
    setIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isLoading])

  useEffect(() => {
    if(characterRef.current[0]) {
      const rect = characterRef.current[0].getBoundingClientRect()
      setLineHeight(rect.height)
    }
  }, [chars])

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
        const char = characterRef.current[index + 1]
        const prevChar = characterRef.current[index]
        if(char && prevChar) {
          const prevTop = prevChar.getBoundingClientRect().top
          const currentTop = char.getBoundingClientRect().top
          if(currentTop > prevTop) {
            if(skipFirstLine) {
              setSkipFirstLine(false)
              return
            }
            setCurrentLine(currentLine + 1)
          }
        }

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
        const char = characterRef.current[index - 1]
        const nextChar = characterRef.current[index]
        if(char && nextChar) {
          const nextTop = nextChar.getBoundingClientRect().top
          const currentTop = char.getBoundingClientRect().top
          if(currentTop < nextTop) {
            if(currentLine === 0) {
              setSkipFirstLine(true)
            }
            setCurrentLine(Math.max(currentLine - 1, 0))
          }
        }
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
  }, [index, updateCursorPosition])

  useEffect(() => {
    // updateCursorPosition(index)

    const handleResize = () => {
      if(characterRef.current[0]) {
        const rect = characterRef.current[0].getBoundingClientRect()
        setLineHeight(rect.height)
      }

      requestAnimationFrame(() => updateCursorPosition(index))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [index, updateCursorPosition])


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


  return (
    <div>
      { loading && <Loading />}
      <div 
        ref={containerRef} 
        className='relative flex flex-wrap text-justify overflow-hidden h-[26vh]'
        style={{ height: lineHeight * 2.6 || '26vh' }}
      >
        <div 
          ref={textRef} 
          className='mx-2 text-4xl tracking-wider transition-transform duration-300 ease-in-out'
          style={{ transform: `translateY(-${currentLine * lineHeight}px)`}}
        >
        <div 
          className='absolute w-[2px] h-10 bg-[#FFBF00] transition-transform duration-300 ease-in-out animate-blink'
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
  )
}

export default PracticeWords