import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import useUserStore from '../../store/userStore'
import { useNavigate } from 'react-router-dom'

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.4,
        duration: 0.6,
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7
      }
    }
  };

const PlayRandomLandingPage = () => {

  const [isMatching, setIsMatching] = useState<boolean>(true);
  const user = useUserStore((state) => state.user);
  const userIsLoading = useUserStore((state) => state.userIsLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if(userIsLoading) return; // Wait until we know if the user is logged in or not
    if(user === null || user === undefined) {
      navigate('/v1/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIsLoading])
  

  useEffect(() => {
    setTimeout(() => setIsMatching(false), 4000);
  }, []);

  return (
    <motion.div className='h-screen flex bg-[#202020] flex-col text-white'>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        transition={{ ease: "easeIn", duration: 2 }}
        className='flex flex-col h-full overflow-hidden'
        >
        <motion.div variants={item}>
          <Navbar />
        </motion.div>
        <motion.div variants={item} className='flex flex-col items-center justify-center h-full'>
          <motion.h1 className='text-4xl font-bold'>
            {isMatching ? "Finding you an opponent..." : "No opponents found. Please try again later."}
          </motion.h1>
        </motion.div>
        <motion.div variants={item} className='flex justify-center mb-5'>
          <div className='bg-black px-4 py-2 rounded-md text-sm font-semibold text-yellow-600'>
            Please don't leave or refresh the page while we are finding you an opponent!
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default PlayRandomLandingPage