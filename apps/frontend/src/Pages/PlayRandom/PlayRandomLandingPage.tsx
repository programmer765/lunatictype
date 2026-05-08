import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
// import useUserStore from '../../store/userStore'
// import { useNavigate } from 'react-router-dom'
import { ErrorAlert } from '@repo/ui'
// import { cn } from '../../../../../packages/ui/src/lib/utils'
import { ErrorCodes, ErrorState } from '@repo/types';
import { WebSocketMessage } from '@repo/types'
import setWebSocketError from '../../utils/setWebSocketError';
import generateWebSocketError from '../../utils/generateWebSocketError'
import Loading from '../../Components/Loading'
import { parseWebSocketErrorFromMsg } from '../../utils/parseWebSocketErrorFromMsg'
import { useIsLoggedIn } from '../../server/router/getDataFromServer'

const host : URL = import.meta.env.VITE_WS_URL || new URL('ws://localhost:3000');

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
  // console.log(first)
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  // const user = useUserStore((state) => state.user);
  // const userIsLoading = useUserStore((state) => state.userIsLoading);
  const [error, setError] = useState<ErrorState>({ showAlert: false, message: "", code: ErrorCodes.UNKOWN_ERROR, home: false, refresh: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoggedIn = useIsLoggedIn();


  useEffect(() => {

    if(isLoggedIn.isLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (isLoggedIn.error || isLoggedIn.data === null || isLoggedIn.data === undefined) {
      setError({ showAlert: true, code: ErrorCodes.SERVER_ERROR, message: "Failed to check login status", home: false, refresh: true });
      return;
    }

    if (isLoggedIn.data.success === false || isLoggedIn.data.user === null || isLoggedIn.data.user === undefined) {
      setError({ showAlert: true, code: ErrorCodes.UNAUTHORIZED, message: "You are not logged in", home: true, refresh: false });
      return;
    }
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn.isLoading])




  useEffect(() => {
    if (!isMatching) return;
    if (firstLoad) setFirstLoad(false);
    
    try {
      const matchmakingURL = new URL('/ws/matchmaking', host);
      const ws = new WebSocket(matchmakingURL);

      
      ws.onmessage = (message) => {
        try {
          const msgIn : string = message.data
          const msg : WebSocketMessage = JSON.parse(msgIn)

          if (msg.isError) {
            throw new Error(generateWebSocketError(msg.code, msg.message));
          }


          console.log('Received message from WebSocket:', msg);
          

          
        } catch (error) {
          ws.close();
          const genError: ErrorState = parseWebSocketErrorFromMsg(error);
          console.log('WebSocket error:', genError);
          setWebSocketError({ setError, error: genError });
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
      const genError: ErrorState = parseWebSocketErrorFromMsg(error);
      setWebSocketError({ setError, error: genError });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMatching])


  if (error.showAlert) {
    return (
      <ErrorAlert message={error.message} home={error.home} refresh={error.refresh} setError={setError} />
    )
  }


  if (isLoading) {
    return <Loading />
  }


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
            {
              firstLoad ? "Click the button below to find a random opponent!" :
              isMatching ? "Finding you an opponent..." : "No opponents found. Please try again later."
            }
          </motion.h1>
          <motion.div>
            <motion.button className={`${isMatching ? 'bg-[#272727] text-red-700' : 'bg-[#efefef] text-black'} px-4 py-2 rounded-md mt-5 `} onClick={() => setIsMatching(!isMatching)}>
              {isMatching ? "Stop Matching" : "Find Match"}
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