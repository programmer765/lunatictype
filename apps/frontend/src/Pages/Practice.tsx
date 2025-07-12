// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'
import PracticeWords from '../Components/PracticeWords'
import PracticeType from '../Components/PracticeType'

const Practice : React.FC = () => {

  // const [words, setWords] = useState<Array<string>>([])

  // console.log(getWords)

  // useEffect(() => {
  //   setWords(getWords)
  // }, [getWords])

  return (
    <div className='px-10'>
      <div className='my-10'>
        <PracticeType />
      </div>
      <div>
        < PracticeWords />
      </div>
    </div>
  )
}

export default Practice