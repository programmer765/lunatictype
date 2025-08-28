import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import Login from '../Components/AuthPageComponents/Login'
import Signup from '../Components/AuthPageComponents/Signup'

const AuthPage : React.FC = () => {

    const location = useLocation()
    const [authState, setAuthState] = useState(location.state?.from === 'login' ? 'login' : 'signup')

  return (
    <motion.div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#141220] to-[#000000]">
      <div className='w-full px-32 py-12 h-screen flex items-center justify-center'>
        <div className='w-[40%] flex flex-col bg-black h-full text-white rounded-l-lg shadow-lg'>
          <div className='flex items-center justify-center py-10'>
            <h1 className='text-3xl font-semibold'>
              <Link to="/">LunaticType</Link>
            </h1>
          </div>
          <div className='flex flex-col px-20 pt-5'>
            <div className='text-xl pb-2'>Welcome!</div>
            {
              (authState === 'login') ? 
                <Login setAuthState={setAuthState} />
              :
                <Signup setAuthState={setAuthState} />
            }
          </div>
        </div>
        <div className='w-[50%] h-full bg-gradient-to-br from-[#100E1C] via-[#181626] to-[#000000] rounded-r-lg shadow-lg p-8'>

        </div>
      </div>
    </motion.div>
  )
}

export default AuthPage