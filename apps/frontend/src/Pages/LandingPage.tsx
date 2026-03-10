import { useEffect } from "react";
import {Navbar} from "../Components/Navbar";
import { motion } from "framer-motion";
import PracticeBtn from "../Components/PracticeBtn";
import PlayOnlineBtn from "../Components/PlayOnlineBtn";
import { useState } from "react";
import Practice from "./Practice";
import PlayOnline from "./PlayOnline";
import { ErrorAlert } from "@repo/ui";
import useHomeStore from "../store/homeStore";
import useUserStore from "../store/userStore";

const LandingPage : React.FC = () => {

  const [isPractice, setIsPractice] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const setIsHome = useHomeStore((state) => state.setIsHome);
  const isHome = useHomeStore((state) => state.isHome);
  const user = useUserStore((state) => state.user);

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
    if(practice === false && online === true && (user === null || user === undefined)) {
      setIsError(true);
    }
    setIsPractice(practice)
    setIsOnline(online)
    setIsHome(false)
  }

  useEffect(() => {
    setIsHome(true);
  }, [])

  useEffect(() => {
    if(!isHome) return;
    setIsPractice(false);
    setIsOnline(false);
  }, [isHome])

  return (
    <motion.div>
      { isError && <ErrorAlert message="Please log in to play online." /> }
      <motion.div className='h-screen bg-[#202020] flex flex-col'>
        <motion.div variants={container} initial="hidden" animate="visible" transition={{ ease: "easeIn", duration: 2 }} className="flex flex-col h-full">
          <motion.div className='' variants={item}>
              <Navbar />
          </motion.div>
          {
            isPractice ? 
            ( 
              <div className="flex-1">
                <Practice />
              </div>
            )
            :
            isOnline ? 
            (
              <div className="flex-1">
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
