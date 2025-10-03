// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, useState } from 'react'
import PracticeWords from '../Components/PracticeWords'
import PracticeType from '../Components/PracticeType'
import RefreshWords from '../Components/RefreshWords'
import TypingResults from '../Components/TypingResults'

const Practice : React.FC = () => {

  const [componentKey, setComponentKey] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(false) // for testing purpose, change to false later
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const charactersTyped = useRef<number>(0)
  const timeTaken = useRef<number>(0) // in seconds
  const errorsMade = useRef<number>(0)


  const handleReload = () => {
    charactersTyped.current = 0
    timeTaken.current = 0
    errorsMade.current = 0
    setComponentKey(prevKey => 1 - prevKey)
    setIsCompleted(false)
  }

  return (
    <div className='px-10'>
      <div className='my-10'>
        <PracticeType setIsCompleted={setIsCompleted} timeTaken={timeTaken} isStarted={isStarted} setIsStarted={setIsStarted} />
      </div>
      <div className='py-10'>
        { 
          isCompleted ? 
          <TypingResults charactersTyped={charactersTyped} timeTaken={timeTaken} errorsMade={errorsMade} />
          :
          <PracticeWords key={componentKey} charactersTyped={charactersTyped} errorsMade={errorsMade} setIsStarted={setIsStarted} isStarted={isStarted} />
        }
      </div>
      <div className='py-10'>
        <RefreshWords onReloadClick={handleReload}/>
      </div>
    </div>
  )
}

export default Practice