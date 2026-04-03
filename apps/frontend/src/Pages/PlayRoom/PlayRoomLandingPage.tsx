import React, { useEffect } from 'react'
import { Navbar } from '../../Components/Navbar'
import { motion } from 'framer-motion'
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

const PlayRoomLandingPage = () => {
  const user = useUserStore((state) => state.user);
  const userIsLoading = useUserStore((state) => state.userIsLoading);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if(user === null) {
  //     navigate('/v1/auth');
  //   }
  // }, [user, navigate]);


  useEffect(() => {
    if(userIsLoading) return; // Wait until we know if the user is logged in or not
    if(user === null || user === undefined) {
      navigate('/v1/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIsLoading])


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
            Play Room
          </motion.h1>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default PlayRoomLandingPage