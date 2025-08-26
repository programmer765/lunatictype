import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import * as z from 'zod';

interface LoginProps {
  setAuthState: React.Dispatch<React.SetStateAction<string>>;
}


const Login : React.FC<LoginProps> = ({ setAuthState }) => {
  const emailSchema = z.string().email();
  const passwordSchema = z.string().min(6).max(100);

  const emailFound : boolean = true; // Dummy state for demonstration
  const [email, setEmail] = useState<z.infer<typeof emailSchema>>("")
  const [password, setPassword] = useState<z.infer<typeof passwordSchema>>("")

  const isEmailValid = emailSchema.safeParse(email).success;
  const isPasswordValid = passwordSchema.safeParse(password).success;

  const handleGoogleLogin = () => {
    window.location.href = 'https://accounts.google.com/o/oauth2/auth';
  }

  return (
    <div>
      <div className='text-sm'>Please log in to continue.</div>
      <div className='pt-4'>
        <div onClick={handleGoogleLogin} className='flex items-center justify-center space-x-2 bg-[#151515] px-4 py-2 rounded cursor-pointer hover:bg-[#252525] transition-colors duration-200 mb-2'>
          <FcGoogle scale={15} /> 
          <span className='text-sm'>Log in with Google</span>
        </div>
        <div className='flex items-center justify-center space-x-2 bg-[#151515] px-4 py-2 rounded cursor-pointer hover:bg-[#252525] transition-colors duration-200 mb-2'>
          <SiGithub scale={15} /> 
          <span className='text-sm'>Log in with GitHub</span>
        </div>
      </div>
      <div className='py-3'>
        <div className="flex items-center">
          <div className="flex-grow border-t border-[#353535]"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-[#353535]"></div>
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <div className='flex flex-col space-y-1'>
          <span className='text-sm'>Email</span>
          <input 
            type="email" 
            placeholder='Your email here' 
            onChange={(e) => setEmail(e.target.value)}
            className='peer bg-black text-white px-4 py-3 border border-[#2a2a2a] rounded focus:outline-none transition-colors duration-200 text-sm' />
        </div>
        <div className='flex flex-col space-y-1'>
          <span className='text-sm'>Password</span>
          <input 
            type="password" 
            placeholder='Your password here' 
            onChange={(e) => setPassword(e.target.value)}
            className='peer bg-black text-white px-4 py-3 border border-[#2a2a2a] rounded focus:outline-none transition-colors duration-200 text-sm' />
          <p className="invisible peer-invalid:visible text-sm text-red-500">
            {
              emailFound ? <span>Please provide a valid password.</span> : <span>Please provide a valid email.</span>
            }
          </p>
        </div>
        <button 
          disabled={!isEmailValid || !isPasswordValid} 
          className='disabled:bg-[#121212] disabled:text-[gray] bg-[#754dbb] text-black font-semibold px-6 py-3 rounded transition-colors duration-200'>
            Log In
        </button>
      </div>
      <div className='flex justify-center pt-4'>
        <p className="text-sm text-gray-500">
          Don't have an account? <span className="text-[#754dbb] underline cursor-pointer" onClick={() => setAuthState('signup')}>Sign up</span>
        </p>
      </div>
    </div>
  )
}

export default Login