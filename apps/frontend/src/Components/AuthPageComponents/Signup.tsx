import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { SiGithub } from 'react-icons/si';
import { useSearchParams } from 'react-router-dom';
import * as z from 'zod';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';
import { useGetGithubTokenLink, useGetGoogleAuthLink, useGetGoogleTokenLink, useGetGithubAuthLink, useSignup } from '../../server/router/getDataFromServer';



interface SignupProps {
  handleSetAuthFrom: (value: string) => void;
}

interface decodedState {
  from: string;
  method: string;
}


const Signup : React.FC<SignupProps> = ({ handleSetAuthFrom }) => {

  const navigate = useNavigate()

  const emailSchema = z.string().email();
  const passwordSchema = z.string().min(6).max(100);
  const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/);
  const [searchParams] = useSearchParams()

  const emailFound : boolean = true; // Dummy state for demonstration
  const [email, setEmail] = useState<z.infer<typeof emailSchema>>("")
  const [password, setPassword] = useState<z.infer<typeof passwordSchema>>("")
  const [username, setUsername] = useState<z.infer<typeof usernameSchema>>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEmailValid = emailSchema.safeParse(email).success;
  const isPasswordValid = passwordSchema.safeParse(password).success;
  const isUsernameValid = usernameSchema.safeParse(username).success;

  // Hooks for Google authentication links
  const googleAuthLink = useGetGoogleAuthLink();
  const googleTokenLink = useGetGoogleTokenLink();

  // Hooks for GitHub authentication links
  const githubAuthLink = useGetGithubAuthLink();
  const githubTokenLink = useGetGithubTokenLink();

  // Hooks for signup mutation
  const signupUser = useSignup();

  const handleGoogleSignup = async () => {
    const state = JSON.stringify({ from: 'signup', method: 'google' });
    setIsLoading(true);
    const result = await googleAuthLink.mutateAsync({ redirect_url: window.location.href, state: encodeURIComponent(state) });
    window.location.href = result.url;
  }

  const handleGithubSignup = async () => {
    const state = JSON.stringify({ from: 'signup', method: 'github' });
    setIsLoading(true);
    const result = await githubAuthLink.mutateAsync({ redirect_url: window.location.href, state: encodeURIComponent(state) });
    window.location.href = result.url;
  }

  const handleSignup = async () => {
    setIsLoading(true);
    const result = await signupUser.mutateAsync({ email: email, password: password, username: username });
    if (result.success) {
      navigate('/');
    } else {
      setIsLoading(false);
    }
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  useEffect(() => {
    if (code === null || state === null) return;
    // console.log('signup mounted');
    const decodedState : decodedState = JSON.parse(decodeURIComponent(state));
    const from = decodedState.from;
    const method = decodedState.method;
    const isFetchedOauthToken = sessionStorage.getItem('isOauthTokenFetched');
    if(isFetchedOauthToken === 'true') return;
    handleSetAuthFrom(from);
    if(from !== 'signup') return;
    // sessionStorage.setItem('fetched_oauth_token', 'false');
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
        console.log("executing github signup")
        const { success } = await githubTokenLink.mutateAsync({ code: code, state: state })
        isSuccess = success;
      }
      // console.log(isSuccess);
      if (isSuccess === true) {
        // Token fetched successfully
        sessionStorage.removeItem('isOauthTokenFetched');
        navigate('/')
      } else {
        // Handle error
        setIsLoading(false);
        navigate('/v1/auth', { replace: true })
      }
    }
    fetchToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div>
      { isLoading && <Loading /> }
      <div className='text-sm'>Please sign up to continue.</div>
        <div className='pt-4'>
          <div onClick={handleGoogleSignup} className='flex items-center justify-center space-x-2 bg-[#151515] px-4 py-2 rounded cursor-pointer hover:bg-[#252525] transition-colors duration-200 mb-2'>
            <FcGoogle scale={15} /> 
            <span className='text-sm'>Sign up with Google</span>
          </div>
          <div onClick={handleGithubSignup} className='flex items-center justify-center space-x-2 bg-[#151515] px-4 py-2 rounded cursor-pointer hover:bg-[#252525] transition-colors duration-200 mb-2'>
            <SiGithub scale={15} /> 
            <span className='text-sm'>Sign up with GitHub</span>
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
            <span className='text-sm'>Username</span>
            <input 
              type="text" 
              placeholder='Enter username' 
              onChange={(e) => setUsername(e.target.value)}
              className='peer bg-black text-white px-4 py-3 border border-[#2a2a2a] rounded focus:outline-none transition-colors duration-200 text-sm' />
          </div>
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
            onClick={handleSignup}
            disabled={!isEmailValid || !isPasswordValid || !isUsernameValid} 
            className='disabled:bg-[#121212] disabled:text-[gray] bg-[#754dbb] text-black font-semibold px-6 py-3 rounded transition-colors duration-200'>
              Sign up
          </button>
        </div>
        <div className='flex justify-center pt-4'>
          <p className="text-sm text-gray-500">
            Already have an account? <span className="text-[#754dbb] underline cursor-pointer" onClick={() => handleSetAuthFrom('login')}>Log in</span>
          </p>
        </div>
    </div>
  )
}

export default Signup