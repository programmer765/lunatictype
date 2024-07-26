// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from 'react'
import {Navbar} from "../Components/Navbar.tsx";

const LandingPage = () => {
  return (
    <div className='h-screen bg-[#202020]'>
        <div className=''>
            <Navbar />
        </div>
        <div className="pt-16 text-[#a4b5a3] text-center text-6xl font-serif">
            KNOW YOUR KEYBOARD BETTER!!
        </div>
    </div>
  )
}

export default LandingPage