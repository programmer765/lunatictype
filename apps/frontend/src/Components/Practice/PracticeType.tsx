import { motion } from "framer-motion"
import { useEffect, useState } from "react"


interface PracticeTypeProps {
  setIsCompleted: (completed: boolean) => void
  timeTaken: React.MutableRefObject<number>
  isStarted: boolean
  setIsStarted: (started: boolean) => void
}



const PracticeType: React.FC<PracticeTypeProps> = ({ setIsCompleted, timeTaken, isStarted, setIsStarted }) => {

  const time : number[] = [30, 60, 90]
  const words : number[] = [50, 75, 100, 125, 150]
  const [activeConditionSubList, setActiveConditionSubList] = useState<number[]>(time)
  const [activeCondition, setActiveCondition] = useState<string>('time')
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(time[0])
  const [wordsLeft, setWordsLeft] = useState<number>(words[0])
  // const [isStarted, setIsStarted] = useState<boolean>(false)

  const updateLeft = (index : number) => {
    console.log(activeCondition)
    if(activeCondition === 'time') {
      setTimeLeft(time[index])
    } else {
      setWordsLeft(words[index])
    }
  }

  const handleCondition = (condn : string) => {
    setActiveIndex(0)
    timeTaken.current = condn === 'time' ? time[0] : 0
    setActiveConditionSubList(condn === 'time' ? time : words)
    setActiveCondition(condn)
    updateLeft(0)
  }

  const updateActiveIndex = (index : number) => {
    setActiveIndex(index)
    updateLeft(index)
  }
  
  useEffect(() => {
    if(!isStarted) return

    if (timeLeft <= 0 || wordsLeft <= 0) {
      setIsStarted(false)
      setIsCompleted(true)

      if(activeCondition === 'time') {
        timeTaken.current = time[activeIndex]
      } else {
        timeTaken.current = timeLeft // in seconds
      }

      return
    }

    if (activeCondition === 'time') {
      setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    else {
      setTimeout(() => {
        setTimeLeft((prev) => prev + 1)
      }, 1000)
      setWordsLeft((prev) => prev - 1)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isStarted, setIsCompleted])

  return (
    <div>
      <div className="relative flex justify-between items-center">
        <div className={`flex flex-1 items-center ${isStarted ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-all duration-500`}>
          <div className="flex flex-1 justify-end border-r-2 border-gray-600">
            <div className="relative flex py-2 border-2 bg-[#161616] border-[#161616] rounded-l-md">
              <motion.div
                layout
                animate={{ x: activeCondition === 'time' ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute left-0 top-0 w-1/2 h-full bg-white ${activeCondition === 'time' ? 'rounded-md' : 'rounded-l-md'}`}
                />
              <div 
                className={`pl-4 pr-3 z-10 ${activeCondition === 'time' ? 'text-black' : 'text-gray-400 hover:text-white'} hover:cursor-pointer transition-all duration-500`}
                onClick={() => handleCondition('time')}
                >
                Time
              </div>
              <div 
                className={`pl-8 pr-4 z-10 ${activeCondition === 'words' ? 'text-black' : 'text-gray-400 hover:text-white'} hover:cursor-pointer transition-all duration-500`}
                onClick={() => handleCondition('words')}
                >
                Words
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-start">
            <div className="flex py-2 pr-4 border-2 bg-[#161616] border-[#161616] rounded-r-md">
              {
                activeConditionSubList.map((condn, index) => (
                  <span 
                    key={index} 
                    className={`px-2 text-base text-gray-400 cursor-pointer ${activeIndex === index ? 'text-yellow-600 scale-110' : 'hover:text-yellow-800'} transition-all duration-500`} 
                    onClick={() => updateActiveIndex(index)}>
                      {condn}
                  </span>
                ))
              }
            </div>
          </div>
        </div>
        <div className="relative pl-4">
          <div className="absolute left-[-3rem] top-[-1rem]">
            <span className="relative text-3xl font-bold pr-2 text-[#e09859]">
              {
                activeCondition === 'time' ? timeLeft : wordsLeft
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeType