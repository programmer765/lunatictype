import { motion } from 'framer-motion'
import React from 'react'

const PlayOnline : React.FC = () => {
  return (
    <motion.div className="h-full flex items-center justify-center" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <div className='text-3xl font-mono text-white flex gap-10'>
        <motion.button className='px-10 py-5 bg-rose-800 hover:bg-rose-900 rounded-[27px]'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        >
          Create Room
        </motion.button>
        <motion.button className='px-10 py-5 bg-green-700 hover:bg-green-800 rounded-[27px]'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
        >
          Play 1v1
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PlayOnline