import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from '../../Components/Navbar'
// import useUserStore from '../../store/userStore'
// import { useNavigate } from 'react-router-dom'
import { ErrorAlert } from '@repo/ui'
// import { cn } from '../../../../../packages/ui/src/lib/utils'
import { Codes, ErrorCodes, ErrorState, MatchFoundPayload, SocketMsgCodes } from '@repo/types';
import { WebSocketMessage } from '@repo/types'
import setWebSocketError from '../../utils/setWebSocketError';
import Loading from '../../Components/Loading'
import { parseWebSocketErrorFromMsg } from '../../utils/parseWebSocketErrorFromMsg'
import { useIsLoggedIn } from '../../server/router/getDataFromServer'
import { Avatar } from '@mui/material';
import { matchSocket } from '../../server/match/matchSocket';
import CompetePage from '../../Components/Compete/CompetePage';

const host : string = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

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
  const [matchInfo, setMatchInfo] = useState<MatchFoundPayload | null>(null);
  // const user = useUserStore((state) => state.user);
  // const userIsLoading = useUserStore((state) => state.userIsLoading);
  const [error, setError] = useState<ErrorState>({ showAlert: false, message: "", code: ErrorCodes.UNKNOWN_ERROR, home: false, refresh: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoggedIn = useIsLoggedIn();
  const [words, setWords] = useState<string[]>([]);
  const [holdVsInfo, setHoldVsInfo] = useState<number>(0);
  const [ackReceived, setAckReceived] = useState<boolean>(false);
  const ackSentRef = useRef<boolean>(false);


  const matchFunctionCalledRef = useRef<boolean>(false);

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


  const matchFunction = (matchId: string) => {
    try {

      if (matchFunctionCalledRef.current) return
      matchFunctionCalledRef.current = true;

      matchSocket.connect(matchId)
      matchSocket.on(SocketMsgCodes.WORD_LIST, (data) => {
        try {

          if (data.isError) {
            throw new Error(JSON.stringify(data));
          }
  
          if (data.code !== SocketMsgCodes.WORD_LIST) {
            throw new Error(`Unexpected message code: ${data.code}`);
          }
  
          setWords(data.payload.words);
        } catch (error) {
          matchSocket.disconnect();
          matchFunctionCalledRef.current = false;

          const genError: ErrorState = parseWebSocketErrorFromMsg(error);
          setWebSocketError({ setError, error: genError });
        }
      })

      matchSocket.on(SocketMsgCodes.MATCH_START, (data) => {
        try {
          
          if (data.isError) {
            throw new Error(JSON.stringify(data));
          }

          if (data.code !== SocketMsgCodes.MATCH_START) {
            throw new Error(`Unexpected message code: ${data.code}`);
          }

          setAckReceived(true);


        } catch (error) {
          matchSocket.disconnect();
          matchFunctionCalledRef.current = false;

          const genError: ErrorState = parseWebSocketErrorFromMsg(error);
          setWebSocketError({ setError, error: genError });
        }
      })

      
    } catch (error) {
      const genError: ErrorState = parseWebSocketErrorFromMsg(error);
      setWebSocketError({ setError, error: genError });
    }
  }
  


  useEffect(() => {
    if (!isMatching) return;
    if (firstLoad) setFirstLoad(false);
    
    try {
      console.log(host)
      const matchmakingURL = host + '/matchmaking';
      const ws = new WebSocket(matchmakingURL);

      
      ws.onmessage = (message) => {
        try {
          const msgIn : string = message.data
          const msg : WebSocketMessage = JSON.parse(msgIn)

          if (msg.isError) {
            throw new Error(msgIn);
          }

          if (msg.code === Codes.MATCH_FOUND) {
            setMatchInfo(msg.payload);
            matchFunction(msg.payload.matchId);
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

  useEffect(() => {
    if (!matchInfo || words.length === 0) return;
    if (holdVsInfo >= 3) {
      if (!ackSentRef.current) {
        matchSocket.sendAck();
        ackSentRef.current = true;
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      setHoldVsInfo(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [matchInfo, words, holdVsInfo]);


  if (error.showAlert) {
    return (
      <ErrorAlert message={error.message} home={error.home} refresh={error.refresh} setError={setError} />
    )
  }


  if (isLoading) {
    return <Loading />
  }

  if (ackReceived) {
    return <CompetePage words={words} />
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
          {
            matchInfo ? (
              <motion.div className='flex flex-col items-center justify-center h-full'>
                <motion.h1 className='text-4xl font-bold mb-5'>Match Found!</motion.h1>
                <motion.div className='flex space-x-10'>
                  {matchInfo.players.map((player, ind) => (
                    <React.Fragment key={player.playerId}>
                    <motion.div className='flex flex-col items-center' animate={{ opacity: [0, 1] }} transition={{ duration: 0.5, delay: ind * 0.5, ease: "easeInOut" }}>
                      <Avatar src={player.pictureUrl || undefined} alt={player.username} sx={{ width: 100, height: 100, mb: 2 }} />
                      <motion.span className='text-lg font-semibold'>{player.username}</motion.span>
                    </motion.div>
                    {
                      ind < matchInfo.players.length - 1 && (
                      <motion.div className='flex flex-col items-center justify-center' >
                        <motion.span className='text-2xl font-bold'>VS</motion.span>
                      </motion.div>
                      )
                    }
                    </React.Fragment>
                  ))}
                </motion.div>
                <motion.div 
                  className='mt-10 text-yellow-600 text-lg font-medium'
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Please wait while we redirect you to the game room
                  <motion.span animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>.</motion.span>
                </motion.div>
              </motion.div>
            )
            :
            (
              <motion.div className='flex flex-col items-center justify-center h-full'>
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
            )
          }
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