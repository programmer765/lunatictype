import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Navbar } from '../Navbar'
import { CompeteWords } from '../CompeteWords';


interface CompetePageProps {
  words: string[]
}

const timerColorYellow = 'text-yellow-500 animate-pulse duration-500 ease-in-out';
const timerColorRed = 'text-red-500 animate-pulse duration-50 ease-in-out';


const CompetePage : React.FC<CompetePageProps> = ({ words }) => {
  const [timer, setTimer] = useState<number>(30);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  
  useEffect(() => {
    const delay = setTimeout(() => {
      setTimerStarted(true);
    }, 3000); // Start timer after 3 seconds
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!timerStarted || timer <= 0) return; // Timer has ended, do nothing
    const timerId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timer, timerStarted]);

  return (
    <motion.div className='h-screen bg-[#202020] flex flex-col'>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <Navbar />
      </motion.div>

      <motion.div className='flex flex-col justify-center align-middle relative gap-20 mt-16' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}>
        <motion.div className='flex justify-center align-middle text-white'>
          <motion.h1 className={`text-4xl font-semibold ${timer > 10 ? timerColorYellow : timerColorRed}`}>
            {timer}
          </motion.h1>
        </motion.div>
        <motion.div className='px-24 flex justify-center align-middle'>
          <CompeteWords words={words} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default CompetePage