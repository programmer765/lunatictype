import React, { useEffect, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import * as z from 'zod';
import { useGetGithubTokenLink, useGetGoogleAuthLink, useGetGoogleTokenLink, useGetGithubAuthLink, useLogin } from '../../server/router/getDataFromServer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../Loading';

interface LoginProps {
  handleSetAuthFrom: (value: string) => void;
}

interface decodedState {
  from: string;
  method: string;
}


const Login : React.FC<LoginProps> = ({ handleSetAuthFrom }) => {
  
  const navigate = useNavigate()

  const emailSchema = z.string().email();
  const passwordSchema = z.string().min(6).max(100);
  const [searchParams] = useSearchParams()

  const emailFound : boolean = true; // Dummy state for demonstration
  const [email, setEmail] = useState<z.infer<typeof emailSchema>>("")
  const [password, setPassword] = useState<z.infer<typeof passwordSchema>>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEmailValid = emailSchema.safeParse(email).success;
  const isPasswordValid = passwordSchema.safeParse(password).success;

  // Hooks for Google authentication links
  const googleAuthLink = useGetGoogleAuthLink();
  const googleTokenLink = useGetGoogleTokenLink();

  // Hooks for GitHub authentication links
  const githubAuthLink = useGetGithubAuthLink();
  const githubTokenLink = useGetGithubTokenLink();

  // Hooks for login mutation
  const loginUser = useLogin();

  const handleGoogleLogin = async () => {
    const state = JSON.stringify({ from: 'login', method: 'google' });
    setIsLoading(true);
    const result = await googleAuthLink.mutateAsync({ redirect_url: window.location.href, state: encodeURIComponent(state) });
    window.location.href = result.url;
  }

  const handleGithubLogin = async () => {
    const state = JSON.stringify({ from: 'login', method: 'github' });
    setIsLoading(true);
    const result = await githubAuthLink.mutateAsync({ redirect_url: window.location.href, state: encodeURIComponent(state) });
    window.location.href = result.url;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    const result = await loginUser.mutateAsync({ email: email, password: password });
    if (result.success) {
      navigate('/');
    } else {
      setIsLoading(false);
    }
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if(code === null || state === null) return;
    // console.log("login mounted")
    const decodedState : decodedState = JSON.parse(decodeURIComponent(state));
    const from = decodedState.from;
    const method = decodedState.method;
    const isOauthTokenFetched = sessionStorage.getItem('isOauthTokenFetched');
    if(isOauthTokenFetched === 'true') return;
    handleSetAuthFrom(from);
    if(from !== 'login') return;
    const fetchToken = async() => {
      sessionStorage.setItem('isOauthTokenFetched', 'true');
      setIsLoading(true);
      let isSuccess = false;
      if(method === 'google') {
        const { success } = await googleTokenLink.mutateAsync({ code: code, state: state })
        isSuccess = success;
        // console.log(message)
      }
      else if(method === 'github') {
        // console.log("executing github login")
        const { success } = await githubTokenLink.mutateAsync({ code: code, state: state })
        isSuccess = success;
        // console.log(message)
      }
      // console.log(isSuccess);
      if (isSuccess === true) {
        // Token fetched successfully
        sessionStorage.removeItem('isOauthTokenFetched');
        window.location.href = '/'
      } else {
        // Handle error
        sessionStorage.setItem('isOauthTokenFetched', 'false')
        setIsLoading(false);
        navigate('/v1/auth', { replace: true })
      }
    }
    fetchToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div className='text-sm'>Please log in to continue.</div>
      <div className='pt-4'>
        <div onClick={handleGoogleLogin} className='flex items-center justify-center space-x-2 bg-[#151515] px-4 py-2 rounded cursor-pointer hover:bg-[#252525] transition-colors duration-200 mb-2'>
          <FcGoogle scale={15} /> 
          <span className='text-sm'>Log in with Google</span>
        </div>
        <div onClick={handleGithubLogin} className='flex items-center justify-center space-x-2 bg-[#151515] px-4 py-2 rounded cursor-pointer hover:bg-[#252525] transition-colors duration-200 mb-2'>
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
            placeholder='abc@example.com' 
            onChange={(e) => setEmail(e.target.value)}
            className='peer bg-black text-white px-4 py-3 border border-[#2a2a2a] rounded focus:outline-none transition-colors duration-200 text-sm' />
        </div>
        <div className='flex flex-col space-y-1'>
          <span className='text-sm'>Password</span>
          <input 
            type="password" 
            placeholder='******' 
            onChange={(e) => setPassword(e.target.value)}
            className='peer bg-black text-white px-4 py-3 border border-[#2a2a2a] rounded focus:outline-none transition-colors duration-200 text-sm' />
          <p className="invisible peer-invalid:visible text-sm text-red-500">
            {
              emailFound ? <span>Please provide a valid password.</span> : <span>Please provide a valid email.</span>
            }
          </p>
        </div>
        <button 
          onClick={handleLogin}
          disabled={!isEmailValid || !isPasswordValid} 
          className='disabled:bg-[#121212] disabled:text-[gray] bg-[#754dbb] text-black font-semibold px-6 py-3 rounded transition-colors duration-200'>
            Log In
        </button>
      </div>
      <div className='flex justify-center pt-4'>
        <p className="text-sm text-gray-500">
          Don't have an account? <span className="text-[#754dbb] underline cursor-pointer" onClick={() => handleSetAuthFrom('signup')}>Sign up</span>
        </p>
      </div>
    </div>
  )
}

export default Login