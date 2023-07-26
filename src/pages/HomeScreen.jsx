import React, { useEffect, useRef, useState } from 'react'
import CodeImg from '../assets/QuizzImg.png'
import Coding from '../assets/coding.png'
import Math from '../assets/calculator.png'
import sport from '../assets/sport.png'
import story from '../assets/napoleon.png'
import Anime from '../assets/otaku.png'
import Mode from '../assets/dress.png'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, TextInput, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import generateKey from '../utils/generateKey'
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development'
function HomeScreen({socket}) {
  const Types = [
    {
      id : 1,
      name : "Programmation",
      img : Coding
    },
    {
      id : 2,
      name : "Mathematique",
      img : Math
    },
    {
      id : 3,
      name : "Sport",
      img : sport
    },
    {
      id : 4,
      name : "Anime",
      img : Anime
    },
    {
      id : 5,
      name : "Histoire",
      img : story
    },
    {
      id : 6,
      name : "Mode",
      img : Mode
    },
  ]
  const inputRef = useRef(null)
    const [opened, { open, close }] = useDisclosure(false);
    const [NameOpen, { open :NameOpenFunc, close : NameCloseFunc }] = useDisclosure(true);
    const [name,setName] = useState("")
    const [roomId,setRoomId] = useState("")
    const [visible, { toggle }] = useDisclosure(false);
   const navigate = useNavigate()
    const closeNameModal = () => { 
      if(name.length == 0){
        notifications.show({
          title: 'Name input Feedback',
          color : "red",
          message: 'Please enter a name',
        })
      }else{
        NameCloseFunc()
      }
      }
      // Initialize Socket Handler
     const HandlerRoomCreation = (type) => { 
      toggle()
      const RoomId = generateKey()
      socket.emit('createRoom',{
        name : name,
        roomId : RoomId,
        type : type,
      })
      socket.on("feedbackCreatingRoom",(data)=> {
        if(data.status === "success"){
          notifications.show({
            title: 'Feeback About creating room',
            color : "green",
            message: 'Your room has been created',
          })
          localStorage.removeItem("roomId")
          localStorage.removeItem("name")
          localStorage.setItem("roomId",RoomId)
          localStorage.setItem("name",name)
          navigate("/waiting")
        }
      })
      }
      // Handle Join
      const HandlerRoomJoin = () => {
        console.log("click on join button");
        socket.emit("joinRoom", {
          roomId: inputRef.current.value,
          name,
        });
      
        socket.on("feedbackJoiningRoom", (data) => {
          if (data.status === "success") {
            console.log("working");
            // Update the roomId state variable with the user input
            setRoomId(inputRef.current.value);
      
            localStorage.removeItem("roomId");
            localStorage.removeItem("name");
            localStorage.setItem("roomId", inputRef.current.value); // Use inputRef.current.value here
            localStorage.setItem("name", name);
            navigate("/waiting");
          } else {
            notifications.show({
              title: "Feedback About Joining room",
              color: "red",
              message: `${data.message}`,
            });
          }
        });
      };
      
  return (
    <div className='h-screen font-[poppins] p-4 flex flex-col  md:grid md:grid-cols-2' >
     
      {/* Name */}
      <Modal size="lg" title="Enter Your Name" opened={NameOpen}  centered >
            <div className="h-[10rem] flex justify-between p-4 flex-col " >
         <TextInput onChange={(e ) => setName(e.target.value)} placeholder='your name' />
         <Button onClick={closeNameModal} className='bg-blue-400 h-[2.5rem] mt-4' >Save</Button>
            </div>
          </Modal>
        {/* Choose quizz modal */}
        <Modal size="lg" opened={opened} centered onClose={close} title="Choose the Quizz Category">
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <div className='h-[24rem]   flex-col flex p-4  ' >
                  {/* actions card */}
                  <div className='flex gap-4  justify-center flex-wrap '> 
      
      {Types.map((type,index)=> (<div   key={type.name + "dsdsdsds"} onClick={()=> HandlerRoomCreation(type.id)}  className=' cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-[10rem] gap-y-3 items-center flex-col justify-center flex p-2 w-[10rem] bg-white' >
        <img src={type.img} className="h-[5rem] " />
        <p className='text-center font-bold' >{type.name}</p>
      </div>))}
    
    
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
                    <input ref={inputRef}  className='border-b-2 border-green-400 bg-gray-50 outline-none px-2 flex-1 h-[2.5rem]' />
                    <Button className='bg-blue-500 h-[3rem]' onClick={HandlerRoomJoin}>Join a session</Button>
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