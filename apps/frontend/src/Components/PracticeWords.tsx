import { useEffect, useState } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'

const PracticeWords = () => {

  const words = useGetRandomWordFromServer()

  const [currentSentence, setCurrentSentence] = useState<string>('')
  const [wordSentence, setWordSentence] = useState<string>('')
  
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
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSentence])

  const chars = [...wordSentence]


  return (
    <div>
      <div className='relative flex flex-wrap text-justify'>
        <div className='absolute w-[1px] h-10 bg-white animate-[cursor-blink] left-2'>
        </div>
        <div className='mx-2 text-3xl'>
          {
            chars.map((char, index) => {

              let colorClass = 'text-gray-500'

              if(index < currentSentence.length) {
                colorClass = (char === currentSentence[index]) ? 'text-white' : 'text-red-500' 
              }
              
              return (
                <span key={index} className={colorClass}>{char}</span>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default PracticeWords