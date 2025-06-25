// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'
import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'

const Practice : React.FC = () => {

  // const [words, setWords] = useState<Array<string>>([])

  useGetRandomWordFromServer()
  // console.log(getWords)

  // useEffect(() => {
  //   setWords(getWords)
  // }, [getWords])

  return (
    <div className='text-white'>Practice</div>
  )
}

export default Practice