import React from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const AuthPage : React.FC = () => {

    const location = useLocation()
    const from : string = location.state?.from || 'login'

  return (
    <motion.div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Auth Page</h1>
      <p className="text-lg">Please login or signup to continue.</p>
      <p> Redirected from {from}</p>
    </motion.div>
  )
}

export default AuthPage