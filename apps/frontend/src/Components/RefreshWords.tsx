import { MdOutlineRefresh } from "react-icons/md";


interface RefreshWordsProps {
  onReloadClick: () => void
}

const RefreshWords : React.FC<RefreshWordsProps> = ({ onReloadClick }) => {
  return (
    <div className="w-fit mx-auto">
      <div 
        onClick={onReloadClick}
        className="px-7 py-5 border border-solid border-gray-900 rounded-md cursor-pointer bg-black shadow-xl">
        <div className="text-white">
          <MdOutlineRefresh />
        </div>
      </div>
    </div>
  )
}

export default RefreshWords