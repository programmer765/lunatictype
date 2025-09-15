import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'
import Loading from './Loading'

const PracticeWords = () => {

  const data = useGetRandomWordFromServer()

  
  const [inputSentence, setInputSentence] = useState<string>('')
  const [defaultSentence, setDefaultSentence] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [cursorPosition, setCursorPosition] = useState<{x: number, y: number}>({x: 0, y: 0})

  const textRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<(HTMLSpanElement | null)[]>([])

  const chars = useMemo(() => [...defaultSentence], [defaultSentence])

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

    setDefaultSentence(sentence)
    setInputSentence('')
    updateCursorPosition(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isLoading])

  useEffect(() => {
    updateCursorPosition(inputSentence.length)
  }, [inputSentence.length, updateCursorPosition, chars])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newSentence = inputSentence
      if(e.key.length === 1) {
        newSentence += e.key
        setInputSentence(newSentence)
        // console.log(newSentence)
      }
      else if(e.key === 'Backspace') {
        const index = newSentence.length - 1
        if(index > 0 && chars[index] === '_') {
          // If the last character is a placeholder for a space, remove it
          chars.splice(index, 1)
        }
        newSentence = newSentence.slice(0, -1);
        setInputSentence(newSentence)
      }
    }


    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [inputSentence, chars])



  return (
    <div>
      { loading && <Loading />}
      <div className='relative flex flex-wrap text-justify'>
        <div ref={textRef} className='mx-2 text-4xl tracking-wider'>
        <div 
          className='absolute w-[1px] h-10 bg-white transition-transform duration-300 ease-in-out'
          style={{ transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`}}
        />
          {
            chars.map((char, index) => {

              let colorClass = 'text-gray-500'
              let displayChar = char

              if(index < inputSentence.length) {
                if(char == ' ') {
                  if(inputSentence[index] !== ' ') {
                    colorClass = 'text-red-500'
                    chars.splice(index, 0, '_') // Add a placeholder for misstyped space
                    displayChar = inputSentence[index]
                  } 
                }
                else colorClass = (char === inputSentence[index]) ? 'text-white' : 'text-red-500' 
              }
              
              // const isCursor = index === inputSentence.length

              return (
                // <span key={index}>
                  <span 
                    key={index} 
                    ref={(el) => {
                      // if(index === 0) characterRef.current[index] = null
                      characterRef.current[index] = el
                      // console.log(characterRef.current[index])
                    }}
                    className={`letter ${colorClass} transform duration-600 ease-in-out`}
                  >
                    {displayChar}
                  </span>
                // </span>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default PracticeWords