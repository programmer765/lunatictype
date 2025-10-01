// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'
import PracticeWords from '../Components/PracticeWords'
import PracticeType from '../Components/PracticeType'
import RefreshWords from '../Components/RefreshWords'
import TypingResults from '../Components/TypingResults'

const Practice : React.FC = () => {

  const [componentKey, setComponentKey] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(true) // for testing purpose, change to false later
  const [charactersTyped, setCharactersTyped] = useState<number>(0)
  const [timeTaken, setTimeTaken] = useState<number>(0) // in seconds
  const [errorsMade, setErrorsMade] = useState<number>(0)
  
  const onComplete = (charsTyped: number, time: number, errors: number) => {
    setCharactersTyped(charsTyped)
    setTimeTaken(time)
    setErrorsMade(errors)
    setIsCompleted(true)
  }

  const handleReload = () => {
    setComponentKey(prevKey => 1 - prevKey)
    setIsCompleted(false)
  }

  return (
    <div className='px-10'>
      <div className='my-10'>
        <PracticeType setIsCompleted={setIsCompleted} />
      </div>
      <div className='py-10'>
        { 
          isCompleted ? 
          <TypingResults charactersTyped={charactersTyped} timeTaken={timeTaken} errorsMade={errorsMade} />
          :
          <PracticeWords key={componentKey} onComplete={onComplete} />
        }
      </div>
      <div className='py-10'>
        <RefreshWords onReloadClick={handleReload}/>
      </div>
    </div>
  )
}

export default Practice