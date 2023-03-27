import { Avatar, Button } from '@mantine/core'
import React from 'react'
import Clap from '../assets/clap.png'
import Cup from '../assets/winner.png'
import Gold from '../assets/medal.png'
import Silver from '../assets/silver-medal.png'
import Bronze from '../assets/bronze-medal.png'
function RankingScreen() {
  return (
    <div className='h-screen bg-slate-50 items-center gap-y-2 flex-col justify-center flex'>
      <div className='flex items-center self-center' >
      <h1 className='font-semibold mr-4 tracking-wider' >Ranking</h1>
      <Avatar size={60}  src={Cup} />

      </div>
      {/* Participants */}
      <div className='h-[40rem] w-[30rem] bg-white drop-shadow-lg shadow-md rounded-lg  flex  p-4 flex-col ' >
        {/* Participants */}
       <ul className='flex-1 flex-col flex gap-y-8 list-none pt-10' >
        <li className='h-[4rem] p-2 flex-row border-b-2 flex items-center w-full  ' >
          <Avatar size={30}  />
          <div className='flex-1 flex-col ml-4 flex' >
            <p className='font-semibold'>Yves Lionel Diomande</p>
            <p className=' text-gray-500'>I am the GOAT</p>
          </div>
          <Avatar size={30}  src={Gold} />

        </li>
        <li className='h-[4rem] p-2 flex-row border-b-2 flex items-center w-full  ' >
          <Avatar size={30}  />
          <div className='flex-1 flex-col ml-4 flex' >
            <p className='font-semibold'>Yves Lionel Diomande</p>
            <p className=' text-gray-500'>I am the GOAT</p>
          </div>
          <Avatar size={30}  src={Silver} />
        </li>
        <li className='h-[4rem] p-2 flex-row border-b-2 flex items-center w-full  ' >
          <Avatar size={30}  />
          <div className='flex-1 flex-col ml-4 flex' >
            <p className='font-semibold'>Yves Lionel Diomande</p>
            <p className=' text-gray-500'>I am the GOAT</p>
          </div>
          <Avatar size={30}  src={Bronze} />
        </li>
        <li className='h-[4rem] p-2 flex-row border-b-2 flex items-center w-full  ' >
          <Avatar size={30}  />
          <div className='flex-1 flex-col ml-4 flex' >
            <p className='font-semibold'>Yves Lionel Diomande</p>
            <p className=' text-gray-500'>I am the GOAT</p>
          </div>
          <Avatar size={30}  src={Clap} />
        </li>
       </ul>
        {/* Button to go */}
        <Button className='bg-blue-500 h-[3rem]' onClick={open}>Launch the game</Button>

      </div>
    </div>
  )
}

export default RankingScreen