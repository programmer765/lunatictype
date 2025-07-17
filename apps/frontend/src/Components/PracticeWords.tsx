import { useEffect } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'

const PracticeWords = () => {

  const words = useGetRandomWordFromServer()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key.length === 1) {
        console.log(e.key)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])


  return (
    <div>
      <div className='relative text-gray-500 flex flex-wrap text-justify'>
        <div className='absolute w-[1px] h-10 bg-white animate-[cursor-blink] left-2'>
        </div>
        {
          words.map((word, index) => (
          <span key={index} className='mx-2 text-3xl'>{word}</span>
          ))
        }
      </div>
    </div>
  )
}

export default PracticeWords