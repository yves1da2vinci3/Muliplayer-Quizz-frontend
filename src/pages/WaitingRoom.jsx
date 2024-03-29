import { Avatar, Button } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development'
import { QuizzContext } from '../context/QuizzContext'

function WaitingRoom({socket}) {
  const navigate = useNavigate()
   const {SetRoom} =useContext(QuizzContext)
  useEffect(()=>{
    // Joinging waiting
    socket.emit("joinWaitingRoom",{
      roomId : localStorage.getItem("roomId")
    })
    // Feedback room
    socket.on("feedbackWaiting",(data)=> {
      if(data.roomId === localStorage.getItem("roomId")){
        setRoom(data.room)
      localStorage.setItem("room",JSON.stringify(data.room))
        }
    })

    // Listing to  room update
    socket.on("updateWaitingRoom",(data)=> {
      console.log("fhummm ",data)
      if(data.roomId === localStorage.getItem("roomId")){
      setRoom(data.room)
      localStorage.setItem("room",JSON.stringify(data.room))
      }
    })
    // Game Start
    socket.on("gameStart",(data)=> {
      if(data.roomId === localStorage.getItem("roomId")){
       
        navigate("/quizz")
      }
    })


  },[])
  const [room,setRoom] =useState({participants : []})

  // Launch The Game
  const LaunchGame = () => { 
    socket.emit("gameStart",{
      roomId: localStorage.getItem("roomId"),
    })

   }
 
  return (
    <div className='h-screen bg-slate-50 items-center gap-y-2 flex-col justify-center flex'>
      <h1 className='font-semibold tracking-wider' >Waiting Room : <span className='text-blue-400' >{localStorage.getItem("roomId")} </span></h1>
      {/* Participants */}
      <div className='h-[40rem] w-[30rem] bg-white drop-shadow-lg shadow-md rounded-lg  flex  p-4 flex-col ' >
        {/* Participants */}
       <ul className='flex-1 overflow-y-scroll flex-col flex gap-y-8 list-none pt-10' >
        {room?.participants.map((participan,index)=> (<li key={index.toString()} className='h-[4rem] p-2 flex-row border-b-2 flex items-center w-full  ' >
          <Avatar size={30}  />
          <div className='flex-1 flex-col ml-4 flex' >
            <p className='font-semibold'>{participan.name}</p>
          </div>
        </li>))}
        
        
      
        
       </ul>
        {/* Button to go */}
        { room ? room.adminName === localStorage.getItem("name") &&  <Button className='bg-blue-500 h-[3rem]' onClick={LaunchGame}>Launch the game</Button> : "" }
       

      </div>
    </div>
  )
}

export default WaitingRoom