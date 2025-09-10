import { useEffect } from "react";
import {Navbar} from "../Components/Navbar";
import { motion } from "framer-motion";
import PracticeBtn from "../Components/PracticeBtn";
import PlayOnlineBtn from "../Components/PlayOnlineBtn";
import { useState } from "react";
import Practice from "./Practice";
import PlayOnline from "./PlayOnline";
import { useIsLoggedIn } from "../server/router/getDataFromServer";
import Loading from "../Components/Loading";
import User from "../types/User";

const LandingPage : React.FC = () => {

  const [isPractice, setIsPractice] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
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
  

  const updatePlayType = (practice: boolean, online: boolean) => {
    setIsPractice(practice)
    setIsOnline(online)
  }

  const [isLoading, setIsLoading] = useState(false);
  // Hook to check if user is logged in
  const isLoggedIn = useIsLoggedIn();
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setIsLoading(true);
    const checkLoggedIn = () => {
      if(isLoggedIn.data?.user !== null && isLoggedIn.data?.user !== undefined) {
        setUser(isLoggedIn.data?.user)
      }
      if(isLoggedIn.error) {
        console.log(isLoggedIn.error.message)
      }
      setIsLoading(false);
    };
    checkLoggedIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn.isLoading]);

  return (
    <motion.div>
      { isLoading && <Loading />}
      <motion.div className='h-screen bg-[#202020]'>
        <motion.div variants={container} initial="hidden" animate="visible" transition={{ ease: "easeIn", duration: 2 }}>
          <motion.div className='' variants={item}>
              <Navbar 
                isPractice={isPractice} 
                setIsPractice={setIsPractice} 
                isOnline={isOnline} setIsOnline={setIsOnline} 
                {...(user !== null && user !== undefined && {user: user})} 
              />
          </motion.div>
          {
            isPractice ? 
            ( 
              <div>
                <Practice />
              </div>
            )
            :
            isOnline ? 
            (
              <div>
                <PlayOnline />
              </div>
            )
            :
            (
            <motion.div className="flex flex-col items-center gap-y-40" variants={item}>
              <motion.div className="pt-16 text-[#a4b5a3] text-6xl font-serif text-center" variants={item}>
                  KNOW YOUR KEYBOARD BETTER!!
              </motion.div>
              <motion.div className="flex gap-x-16">
                <div onClick={() => updatePlayType(true, false)}>
                  <PracticeBtn />
                </div>
                <div onClick={() => updatePlayType(false, true)}>
                  <PlayOnlineBtn />
                </div>
              </motion.div>
            </motion.div>
            )
          }
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default LandingPage
