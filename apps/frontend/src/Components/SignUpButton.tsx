import { motion } from  "framer-motion"
import { Link } from "react-router-dom"


const SignUpButton : React.FC = () => {
  return (
    <motion.div className='items-center appearance-none text-base rounded-[24px] border-none [box-shadow:0px_1px_1px_rgb(255_255_255)] box-border text-[#bdc7cf] cursor-pointer inline-flex fill-current font-["Google_Sans",Roboto,Arial,sans-serif] font-medium h-[48px] justify-center tracking-[.25px] leading-[normal] max-w-full overflow-visible px-[24px] py-[2px] relative text-center normal-case [transition:box-shadow_325ms_cubic-bezier(.4,_0,_.2,_1),opacity_15ms_linear_30ms,transform_350ms_cubic-bezier(0,_0,_.2,_1)_0ms] select-none w-auto z-0'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Link to="/v1/auth" state={{ from: 'signup' }}>Signup</Link>
    </motion.div>
  )
}

export default SignUpButton