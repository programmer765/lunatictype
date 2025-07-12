import { useGetRandomWordFromServer } from '../server/router/getDataFromServer'

const PracticeWords = () => {

  const words = useGetRandomWordFromServer()

  return (
    <div>
      <div className='text-white flex flex-wrap'>
        {
          words.map((word, index) => (
          <span key={index} className='mx-2 text-3xl'>{word}</span>
          ))
        }
      </div>
    </div>
  )
}

export default PracticeWords