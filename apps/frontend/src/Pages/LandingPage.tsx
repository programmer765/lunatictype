/* eslint-disable @typescript-eslint/no-unused-vars */
import {Navbar} from "../Components/Navbar.tsx";
import { motion } from "framer-motion";
import PracticeBtn from "../Components/PracticeBtn.tsx";
import PlayOnlineBtn from "../Components/PlayOnlineBtn.tsx";
import { useState } from "react";
import Practice from "./Practice.tsx";
import PlayOnline from "./PlayOnline.tsx";

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

  return (
    <motion.div className='h-screen bg-[#202020]'>
      <motion.div variants={container} initial="hidden" animate="visible" transition={{ ease: "easeIn", duration: 2 }}>
        <motion.div className='' variants={item}>
            <Navbar isPractice={isPractice} setIsPractice={setIsPractice} isOnline={isOnline} setIsOnline={setIsOnline} />
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
  )
}

export default LandingPage