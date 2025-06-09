import { motion } from "framer-motion"

const LoginButton : React.FC = () => {
  return (
    <motion.div className='items-center appearance-none bg-[#fff] rounded-[24px] border-none [box-shadow:0px_2px_12px_rgb(255_255_255)] box-border text-[#3c4043] cursor-pointer inline-flex fill-current font-["Google_Sans",Roboto,Arial,sans-serif] text-base font-semibold h-[48px] justify-center tracking-[.25px] leading-[normal] max-w-full overflow-visible px-[24px] py-[2px] relative text-center normal-case [transition:box-shadow_325ms_cubic-bezier(.4,_0,_.2,_1),opacity_15ms_linear_30ms,transform_350ms_cubic-bezier(0,_0,_.2,_1)_0ms] select-none w-auto z-0'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
        Login
    </motion.div>
  )
}

export default LoginButton