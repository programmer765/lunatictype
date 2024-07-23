// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react'
import {Navbar} from "../Components/Navbar.tsx";

const LandingPage = () => {
  return (
    <div className='h-screen bg-[#fff]'>
        <div className=''>
            <Navbar />
        </div>
    </div>
  )
}

export default LandingPage