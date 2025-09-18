// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'
import PracticeWords from '../Components/PracticeWords'
import PracticeType from '../Components/PracticeType'
import RefreshWords from '../Components/RefreshWords'

const Practice : React.FC = () => {

  const [componentKey, setComponentKey] = useState<number>(0)

  const handleReload = () => {
    setComponentKey(prevKey => 1 - prevKey)
  }

  return (
    <div className='px-10'>
      <div className='my-10'>
        <PracticeType />
      </div>
      <div className='py-10'>
        <PracticeWords key={componentKey} />
      </div>
      <div className='py-10'>
        <RefreshWords onReloadClick={handleReload}/>
      </div>
    </div>
  )
}

export default Practice