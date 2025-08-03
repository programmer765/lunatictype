import { useEffect, useState } from "react"


const PracticeType = () => {

  const time : number[] = [30, 60, 90, 120, 150]
  const words : number[] = [50, 75, 100, 125, 150]
  const [condition, setCondition] = useState<number[]>(time)
  const [active, setActive] = useState<string>('time')
  const [ind, setInd] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(time[ind])
  const [wordsLeft, setWordsLeft] = useState<number>(words[ind])
  const [isStarted, setIsStarted] = useState<boolean>(false)

  const updateLeft = (index : number) => {
    if(active === 'time') {
      setTimeLeft(time[index])
    } else {
      setWordsLeft(words[index])
    }
  }

  const handleCondition = (condn : number[]) => {
    setInd(0)
    setCondition(condn)
    setActive(condn === time ? 'time' : 'words')
    updateLeft(0)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStart = () => {
    setIsStarted(true)
  }

  const updateInd = (index : number) => {
    setInd(index)
    updateLeft(index)
  }
  
  useEffect(() => {
    if (timeLeft > 0 && isStarted) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    }
  }, [timeLeft, isStarted])

  return (
    <div>
      <div className="text-white flex justify-between items-center">
        <div className="absolute pb-1 left-1/2 transform -translate-x-1/2 flex flex-wrap text-justify border-b-2 border-b-[#616161]">
          <div className="border-r-2 border-r-[#616161] pr-2">
            <span className={`px-2 ${active === 'time' ? 'text-blue-800' : ''} font-bold cursor-pointer`} onClick={() => handleCondition(time)}>time</span>
            <span className={`px-2 ${active === 'words' ? 'text-red-700' : ''} font-bold cursor-pointer`} onClick={() => handleCondition(words)}>words</span>
          </div>
          <div className="pl-2">
            {
              condition.map((condn, index) => (
                <span key={index} className={`px-2 cursor-pointer hover:text-yellow-600 ${ind === index ? 'text-yellow-700' : ''}`} onClick={() => updateInd(index)}>{condn}</span>
              ))
            }
          </div>
        </div>
        <div className="ml-auto">
          <span className="text-3xl font-bold pr-2 text-[#e09859]">
            {
              active === 'time' ? timeLeft : wordsLeft
            }
          </span>
          <span>
            {active === 'time' ? ' seconds' : ' words'} left
          </span>
        </div>
      </div>
    </div>
  )
}

export default PracticeType