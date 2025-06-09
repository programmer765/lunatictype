import { motion } from  "framer-motion"


const PlayOnlineBtn : React.FC = () => {
  return (
    <motion.div className='items-center bg-[#2d7820] appearance-none text-lg rounded-[27px] border-s-green-700 box-border text-[#202325] cursor-pointer inline-flex fill-current font-mono font-semibold h-[72px] justify-center tracking-[.25px] leading-[normal] w-[172px] overflow-visible px-[24px] py-[2px] relative text-center normal-case [transition:box-shadow_325ms_cubic-bezier(.4,_0,_.2,_1),opacity_15ms_linear_30ms,transform_350ms_cubic-bezier(0,_0,_.2,_1)_0ms] select-none z-0'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
        Play Online
    </motion.div>
  )
}

export default PlayOnlineBtn