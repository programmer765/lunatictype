import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { FaApple } from "react-icons/fa";

const Login : React.FC = () => {
  return (
    <div>
      <div className='text-sm'>Please log in to continue.</div>
      <div className='flex mt-4 space-x-3'>
        <div>
          <div data-tooltip-target="tooltip-light" className='bg-gray-800 text-white px-7 py-4 rounded hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer'>
            <FcGoogle size={21} />
          </div>
          <div id="tooltip-light" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 tooltip">
            Log in with Google
          </div>
        </div>
        <div className='bg-gray-800 text-white px-7 py-4 rounded hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer'>
          <SiGithub size={21} />
        </div>
        <div className='bg-gray-800 text-white px-7 py-4 rounded hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer'>
          <FaApple size={21} />
        </div>
      </div>
    </div>
  )
}

export default Login