import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
import useUserStore from '../../store/userStore'
import { useNavigate } from 'react-router-dom'
import { ErrorAlert } from '@repo/ui'
import { cn } from '../../../../../packages/ui/src/lib/utils'

const host : URL = import.meta.env.VITE_WS_URL || new URL('ws://localhost:3000');

interface ErrorType {
  isError: boolean,
  message: string
}

interface MessageType {
  type: string,
  message: string
}

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
  const [error, setError] = useState<ErrorType>({ isError: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if(userIsLoading) return; // Wait until we know if the user is logged in or not
    if(user === null || user === undefined) {
      navigate('/v1/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIsLoading])
  

  // useEffect(() => {
  //   setTimeout(() => setIsMatching(false), 4000);
  // }, []);


  useEffect(() => {
    if (!isMatching) return;
    
    try {
      const matchmakingURL = new URL('/ws/matchmaking', host);
      const ws = new WebSocket(matchmakingURL);

      // ws.onopen = () => {
      //   console.log('WebSocket connection established');
      // }
      
      ws.onmessage = (message) => {
        try {
          const msgIn : string = message.data
          const msg : MessageType = JSON.parse(msgIn)
          console.log(msg.type)
          if (msg.type === 'error') throw new Error(msg.message)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Server error'
          console.log('Failed to connect to WebSocket:', errorMessage);
          ws.close();
          setError({ isError: true, message: errorMessage });
        } 
      }

      ws.onclose = () => {
        // console.log('WebSocket connection closed');
        setIsMatching(false);
      }

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      console.error('Failed to connect to WebSocket:', errorMessage);
      setError({ isError: true, message: errorMessage });
    }


  }, [isMatching])

  return (
    <motion.div className='h-screen flex bg-[#202020] flex-col text-white'>
      {error.isError &&  <ErrorAlert message={error.message} />}
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
          <motion.div>
            <motion.button className={`${cn(isMatching ? 'bg-[#272727] text-red-700' : 'bg-[#efefef] text-black')} px-4 py-2 rounded-md mt-5 `} onClick={() => setIsMatching(!isMatching)}>
              {isMatching ? "Stop Matching" : "Try Again"}
            </motion.button>
          </motion.div>
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