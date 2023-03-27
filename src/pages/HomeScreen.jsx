import React from 'react'
import CodeImg from '../assets/QuizzImg.png'
import Coding from '../assets/coding.png'
import Math from '../assets/calculator.png'
import sport from '../assets/sport.png'
import story from '../assets/napoleon.png'
import Anime from '../assets/otaku.png'
import Mode from '../assets/dress.png'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group } from '@mantine/core';
function HomeScreen() {
    const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className='h-screen font-[poppins] p-4 flex flex-col  md:grid md:grid-cols-2' >
        {/* Choose quizz modal */}
        <Modal size="lg" opened={opened} centered onClose={close} title="Choose the Quizz Category">
        <div className='h-[24rem]   flex-col flex p-4  ' >
                  {/* actions card */}
                  <div className='flex gap-4  justify-center flex-wrap '> 
      <div onClick={()=> setSeeCommentModal(true)}  className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-5 w-[10rem] bg-white' >
        <img src={Coding} className="h-[5rem] " />
        <p className='text-center font-bold' >Programmation</p>
      </div>
      <div  onClick={()=> setSendingNotification(true)}  className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-2 w-[10rem] bg-white' >
        <img src={Math} className="h-[5rem] " />
        <p className='text-center font-bold' >Mathematique</p>
      </div>
      <div onClick={()=> setModifyUserModalStatus(true)}  className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-2 w-[10rem] bg-white' >
        <img src={sport} className="h-[5rem] " />
        <p className='text-center font-bold' >Sport</p>
      </div>
      <div onClick={()=> setReservationModal(true)} className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-5 w-[10rem] bg-white' >
        <img src={Anime} className="h-[5rem] " />
        <p className='text-center font-bold text-sm' >Anime</p>
      </div>
      <div onClick={()=> setSeePaymentModal(true)} className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-5 w-[10rem] bg-white' >
        <img src={story} className="h-[5rem] " />
        <p className='text-center font-bold text-sm' >Histoire</p>
      </div>
      <div onClick={()=> setSeePaymentModal(true)} className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-5 w-[10rem] bg-white' >
        <img src={Mode} className="h-[5rem] " />
        <p className='text-center font-bold text-sm' >Mode</p>
      </div>
    
      </div>
          </div>
      </Modal>
    {/* Information relative to the platform and the connection */}
        <div className='h-full  items-start flex-col gap-y-6 pt-10 capitalize  justify-center p-4 flex'>
            <h1 className='text-2xl font-semibold'>Welcome to your <span className='text-blue-500'>online Quizz multiplayer game</span>  </h1>
            <p className='text-gray-500 tracking-tighter '>
            Online Quizz Multiplayer Game is an exciting and interactive game that allows players to compete with each other in real-time. The game consists of a series of questions that test the players' knowledge in various categories such as history, science, pop culture, and more. Each player has a limited amount of time to answer each question, adding a sense of urgency to the game. The game is designed to be played with multiple players, allowing friends and strangers from all around the world to compete against each other. The leaderboard keeps track of each player's score, creating a competitive and engaging environment. The game is accessible through any device with an internet connection, making it easy for anyone to participate. The questions are randomly generated, ensuring that the game is always fresh and exciting. The game can be played for fun or with real prizes, adding another level of excitement for players. Overall, Online Quizz Multiplayer Game is an entertaining and educational experience that combines competition and knowledge in a fun and engaging way.
            </p>
            <div className='flex  flex-col md:flex-row h-20  gap-x-6 w-full items-center' >
                {/* Create a create boutton sesssion */}
            
                <Button className='bg-blue-500 h-[3rem]' onClick={open}>Create a session</Button>
                <h1>Or</h1>
                {/* Join an  current   sesssion */}
                <div className='flex flex-col md:flex-row items-center w-[27rem] gap-x-4    '>
                    <input  className='border-b-2 border-green-400 bg-gray-50 outline-none px-2 flex-1 h-[2.5rem]' />
                    <Button className='bg-blue-500 h-[3rem]' onClick={open}>Join a session</Button>
                </div>
           
            </div>
        </div>
    {/* Image */}
    <div className='h-full items-center justify-center flex '>
        <img src={CodeImg} />
    </div>

</div>
  )
}

export default HomeScreen