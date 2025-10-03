import React from 'react'
import { motion } from 'framer-motion'


interface TypingResultsProps {
  charactersTyped: React.MutableRefObject<number>
  timeTaken: React.MutableRefObject<number>
  errorsMade: React.MutableRefObject<number>
}


const TypingResults : React.FC<TypingResultsProps> = ({ charactersTyped, timeTaken, errorsMade }) => {

  const timetakenInMinutes = timeTaken.current / 60
  const rawwpm = Math.round((charactersTyped.current / 5) / timetakenInMinutes) || 0
  const wpm = Math.round(rawwpm - (errorsMade.current / timetakenInMinutes)) || 0
  const accuracy = Math.round(((charactersTyped.current - errorsMade.current) / charactersTyped.current) * 100) || 0


  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 1 }}
      className='relative'
    >
      <div className='flex justify-center items-center text-2xl font-bold text-white mb-10'>
        <div className='flex flex-col items-center mx-5'>
          WPM
          <div className='text-3xl'>
            { wpm }
          </div>
        </div>
        <div className='flex flex-col items-center mx-5'>
          Raw WPM
          <div className='text-3xl'>
            { rawwpm }
          </div>
        </div>
        <div className='flex flex-col items-center mx-5'>
          Accuracy
          <div className='text-3xl'>
            { accuracy }%
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TypingResults