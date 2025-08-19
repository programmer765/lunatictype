import React from 'react'

const Login : React.FC = () => {
  return (
    <div>
      <div className='text-sm'>Please log in to continue.</div>
      <div className='flex mt-4 space-x-4'>
        <div>
          Google
        </div>
        <div>
          Github
        </div>
        <div>
          Apple
        </div>
      </div>
    </div>
  )
}

export default Login