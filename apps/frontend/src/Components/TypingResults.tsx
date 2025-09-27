import React from 'react'
import { motion } from 'framer-motion'


const TypingResults : React.FC = () => {
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
            75
          </div>
        </div>
        <div className='flex flex-col items-center mx-5'>
          Raw WPM
          <div className='text-3xl'>
            80
          </div>
        </div>
        <div className='flex flex-col items-center mx-5'>
          Accuracy
          <div className='text-3xl'>
            95%
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TypingResults