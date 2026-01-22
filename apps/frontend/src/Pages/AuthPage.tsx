import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Login from '../Components/AuthPageComponents/Login'
import Signup from '../Components/AuthPageComponents/Signup'
import { useIsLoggedIn } from '../server/router/getDataFromServer'
import Loading from '../Components/Loading'

interface decodedState {
  from: string;
  method: string;
}

const AuthPage : React.FC = () => {

  const navigate = useNavigate()

  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = searchParams.get('state');
  const fromLocation = location.state?.from === undefined ? null : location.state.from as string;
  const fromSession = sessionStorage.getItem('from') !== null ? sessionStorage.getItem('from') as string : null
  let fromState = null;
  if(state) {
    const decodedState : decodedState = JSON.parse(decodeURIComponent(state));
    fromState = decodedState.from;
  }
  const from = fromLocation !== null ? fromLocation : fromSession !== null ? fromSession : fromState !== null ? fromState : 'login';
  sessionStorage.setItem('from', from)
  const [authFrom, setAuthFrom] = useState(from)

  const handleSetAuthFrom = (value: string) => {
    setAuthFrom(value);
    sessionStorage.setItem('from', value);
  }

  const [isLoading, setIsLoading] = useState(false);
  // Hook to check if user is logged in
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    setIsLoading(true);
    // isLoggedIn.refetch()
    const checkLoggedIn = () => {
      setIsLoading(false);
      if (isLoggedIn.data?.success === true) {
        navigate('/');
      }
      if(isLoggedIn.error) {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn.isLoading]);

  return (
    <motion.div>
      {isLoading && <Loading />}
      <motion.div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#141220] to-[#000000]">
        <div className='w-full px-[1%] py-12 h-screen flex items-center justify-center'>
          <div className='w-[35%] lg:w-[30%] flex flex-col bg-black h-full text-white rounded-l-lg shadow-lg'>
            <div className={`flex items-center justify-center ${authFrom === 'login' ? 'py-10' : 'py-5'}`}>
              <h1 className='text-3xl font-semibold'>
                <Link to="/">LunaticType</Link>
              </h1>
            </div>
            <div className='flex flex-col px-[12%] pt-[2%]'>
              <div className='text-xl pb-2'>Welcome!</div>
              {
                (authFrom === 'login') ? 
                  <Login handleSetAuthFrom={handleSetAuthFrom} />
                :
                  <Signup handleSetAuthFrom={handleSetAuthFrom} />
              }
            </div>
          </div>
          <div className='w-[50%] h-full bg-gradient-to-br from-[#100E1C] via-[#181626] to-[#000000] rounded-r-lg shadow-lg p-8'>

          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AuthPage