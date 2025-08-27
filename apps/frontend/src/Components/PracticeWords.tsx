import { useEffect, useState } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'

const PracticeWords = () => {

  const words = useGetRandomWordFromServer()

  const [currentSentence, setCurrentSentence] = useState<string>('')
  const [wordSentence, setWordSentence] = useState<string>('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chars = [...wordSentence]
  
  useEffect(() => {
    const sentence : string = words.join(' ')

    setWordSentence(sentence)
  }, [words])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newSentence = currentSentence
      if(e.key.length === 1) {
        newSentence += e.key
        setCurrentSentence(newSentence)
        // console.log(newSentence)
      }
      else if(e.key === 'Backspace') {
        const index = newSentence.length - 1
        if(index > 0 && chars[index] === '_') {
          // If the last character is a placeholder for a space, remove it
          chars.splice(index, 1)
        }
        newSentence = newSentence.slice(0, -1);
        setCurrentSentence(newSentence)
      }
    }


    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSentence, chars])



  return (
    <div>
      <div className='relative flex flex-wrap text-justify'>
        <div className='mx-2 text-4xl tracking-wider'>
          {
            chars.map((char, index) => {

              let colorClass = 'text-gray-500'
              let displayChar = char

              if(index < currentSentence.length) {
                if(char == ' ') {
                  if(currentSentence[index] !== ' ') {
                    colorClass = 'text-red-500'
                    chars.splice(index, 0, '_') // Add a placeholder for misstyped space
                    displayChar = currentSentence[index]
                  } 
                }
                else colorClass = (char === currentSentence[index]) ? 'text-white' : 'text-red-500' 
              }
              
              const isCursor = index === currentSentence.length

              return (
                <span key={index}>
                  <span key={index} className={`letter ${colorClass}`}>
                    {
                    isCursor && 
                      <span 
                          className='absolute w-[1px] h-10 bg-white animate-[cursor-blink] transition-transform duration-300 ease-in-out' />
                    }
                    {displayChar}
                  </span>
                </span>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default PracticeWords