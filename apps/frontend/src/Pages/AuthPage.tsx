import React from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const AuthPage : React.FC = () => {

    const location = useLocation()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const from : string = location.state?.from || 'login'

  return (
    <motion.div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#141220] to-[#000000]">
      <div className='w-full px-32 py-12 h-screen flex items-center justify-center'>
        <div className='w-1/2 flex flex-col bg-black h-full text-white rounded-l-lg shadow-lg'>
          <div className='flex items-center justify-center py-10'>
            <h1 className='text-4xl font-semibold'>LunaticType</h1>
          </div>
          <div className='flex px-16'>
            <div>Welcome!</div>
          </div>
        </div>
        <div className='w-1/2 h-full bg-gradient-to-br from-[#100E1C] via-[#181626] to-[#000000] rounded-r-lg shadow-lg p-8'>

        </div>
      </div>
    </motion.div>
  )
}

export default AuthPage