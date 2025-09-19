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
  // const [visibleLines, setVisibleLines] = useState<string[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<(HTMLSpanElement | null)[]>([])

  const updateCursorPosition = useCallback((index : number) => {
    if(characterRef.current[index] === null || textRef.current === null) return
    const char = characterRef.current[index]
    const textContainer = textRef.current
    
    if(char) {
      const charRect = char.getBoundingClientRect()
      const containerRect = textContainer.getBoundingClientRect()

      setCursorPosition({
        x: charRect.left - containerRect.left,
        y: charRect.top - containerRect.top + charRect.height / 8,
      })
    } else if(index === 0) {
      setCursorPosition({x: 0, y: 0})
    }
  }, [])
  
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
    
    updateCursorPosition(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isLoading])

  useEffect(() => {
    updateCursorPosition(chars.length)
  }, [updateCursorPosition, chars])

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
        setIndex(index + 1)
      }
      else if(e.key === 'Backspace') {
        console.log(e.key)
        console.log(chars[index])
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
      }
    }


    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [chars, index])

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
      <div ref={containerRef} className='relative flex flex-wrap text-justify overflow-hidden h-[26vh]'>
        <div ref={textRef} className='mx-2 text-4xl tracking-wider'>
        <div 
          className='absolute w-[1px] h-10 bg-white transition-transform duration-300 ease-in-out'
          style={{ transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`}}
        />
        {
          chars.map((char, index) => (
            <span key={index} className={`${getCharColor(char)}`}>{char.char}</span>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default PracticeWords