import { useContext, useEffect, useState } from 'react';
import { Avatar, Badge, Button } from '@mantine/core';
import Timer from '../assets/chronometer.png';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import { QuizzContext } from '../context/QuizzContext';

function QuizzRoom({ socket }) {
  // Sample user data, you can replace it with actual data received from the server
  const navigate = useNavigate()


  // State to keep track of the user's answer
  const [userAnswer, setUserAnswer] = useState(null);
 const [usersAnswered, setUsersAnswered] = useState([])
  // Function to handle user's answer selection
  const handleAnswerSelection = (answer) => {
    setUserAnswer(answer);
    // You can emit the user's answer to the server using the socket here
    socket.emit('userAnswer', { roomId: localStorage.getItem("roomId"), answer: answer, name: localStorage.getItem("name") });
  };

  const [Question,setQuestion] = useState({options : []})
  const [timer,setTimer] = useState(0)
  const Room = JSON.parse(localStorage.getItem("room")) 
  useEffect(()=>{
    
    // Handle the First Question
    socket.on("firstQuestion",(data)=>{
      if(data.roomId === localStorage.getItem("roomId")){
        setQuestion(data.question)
        setTimer(15)

        setInterval(()=>{
          setTimer(timer-1)
        },1000)
      }

    })

    // Handlet NextQustion
    socket.on('nextQuestion', (data) => {
      if (data.roomId === localStorage.getItem('roomId')) {
        setQuestion(data.question);
        setUsersAnswered([]);
        setTimer(15);

        const intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
      }
    });
    // Handler User Answered
    socket.on("userAnswered",(data)=>{
      if(data.roomId === localStorage.getItem("roomId")){
    setUsersAnswered(userAnd => [...userAnd, data.name]);
      
      }

    })
    // Handler Game End
    socket.on("gameEnd",(data)=>{
      if(data.roomId === localStorage.getItem("roomId")){
        navigate("/ranking")
      }
    })
    
  },[])
  console.log(Room)
  return (
    <div className='h-screen bg-white flex '>
      {/* Group a gacuhe */}
      <div className={`w-[25%] grid grid-rows-[${Room.participants.filter((_,index)=> index %2 !== 0).length}]`}>
        {Room.participants.filter((_,index)=> index %2 !== 0).map((user, index) => (
          <div key={index} className='relative bg-white border-b-2 gap-y-4 flex justify-center items-center flex-col'>
            <div className='absolute top-4 right-4'>
              <Badge color={usersAnswered.includes(user.name) ?  'green' : 'yellow'}>{usersAnswered.includes(user.name)? "repondu" : "en cours"}</Badge>
            </div>
            <Avatar size={150} />
            <p className='font-medium text-lg'>{ user.name === localStorage.getItem("name") ? "You" : user.name}</p>
          </div>
        ))}
      </div>
      {/* Block for question */}
      <div className='bg-slate-50 p-2 pt-5 flex flex-1 flex-col'>
        <div className='flex items-center self-center'>
          <Avatar size={60} src={Timer} />
          <h1 className='font-semibold ml-4 tracking-wider italic'>{`00:${timer.toString()}`}</h1>
        </div>
        {/* Card pour la question */}
        <div className='h-[20rem] bg-white w-full mt-[10rem] drop-shadow-lg flex flex-col rounded-lg p-10'>
          <h2 className='font-semibold ml-4 text-center text-2xl tracking-wider italic'>{Question?.question}</h2>
          {/* Possible Answers */}
          <div className='flex flex-row justify-center flex-1 items-end gap-x-4'>
            {Question?.options.map((answer, index) => (
              <p key={index} className='text-gray-500 font-medium text-lg '>{`${String.fromCharCode(65 + index)}) ${answer}`}</p>
            ))}
          </div>
        </div>
        <div className='h-[8rem] bg-white mt-20 drop-shadow-lg flex p-3 flex-col'>
          <p className='text-center'>votre reponse</p>
          <div className='flex flex-1 flex-row justify-center items-center gap-x-4 rounded-xl'>
            {Question?.options.map((_, index) => (
              <Button
                key={index}
                className={`bg-blue-500 w-[8rem] ${
                  userAnswer === index ? 'bg-blue-600' : ''
                }`}
                onClick={() => handleAnswerSelection(index)}
              >
                {String.fromCharCode(65 + index)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* group a droite */}
      <div className={`w-[25%] grid grid-rows-[${Room.participants.filter((_,index)=> index %2 !== 0).length}]`}>
        {Room.participants.filter((user,index)=> index %2 === 0).map((user, index) => (
          <div key={index} className='relative bg-white border-b-2 gap-y-4 flex justify-center items-center flex-col'>
            <div className='absolute top-4 right-4'>
            <Badge color={usersAnswered.includes(user.name) ?  'green' : 'yellow'}>{usersAnswered.includes(user.name)? "repondu" : "en cours"}</Badge>
            </div>
            <Avatar size={150} />
            <p className='font-medium text-lg'>{ user.name === localStorage.getItem("name") ? "You" : user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizzRoom;
