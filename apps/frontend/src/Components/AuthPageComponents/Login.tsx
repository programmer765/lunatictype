import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { FaApple } from "react-icons/fa";

const Login : React.FC = () => {
  return (
    <div>
      <div className='text-sm'>Please log in to continue.</div>
      <div className='text-sm pt-2'>Log in with</div>
      <div className='flex pt-4 space-x-3'>
        <div data-tooltip-target="tooltip-light" className='bg-gray-800 text-white px-7 py-4 rounded hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer'>
          <FcGoogle size={21} />
        </div>
        <div className='bg-gray-800 text-white px-7 py-4 rounded hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer'>
          <SiGithub size={21} />
        </div>
        <div className='bg-gray-800 text-white px-7 py-4 rounded hover:bg-gray-700 transition-colors duration-200 hover:cursor-pointer'>
          <FaApple size={21} />
        </div>
      </div>
      <div className='py-4'>
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </div>
      <div className='flex flex-col space-y-4'>
        <input type="email" placeholder='Email' className='bg-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200' />
        <input type="password" placeholder='Password' className='bg-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200' />
        <button className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors duration-200'>Log In</button>
      </div>
    </div>
  )
}

export default Login