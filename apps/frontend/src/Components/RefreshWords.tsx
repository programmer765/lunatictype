import { MdOutlineRefresh } from "react-icons/md";


interface RefreshWordsProps {
  onReloadClick: () => void
}

const RefreshWords : React.FC<RefreshWordsProps> = ({ onReloadClick }) => {
  return (
    <div className="w-fit mx-auto">
      <div 
        onClick={onReloadClick}
        className="px-7 py-5 border border-solid border-gray-900 rounded-md cursor-pointer bg-black shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 select-none">
        <div className="flex items-center text-white">
          <span>Try Again</span>
          <div className="relative top-[2px] ml-2">
            <MdOutlineRefresh />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefreshWords