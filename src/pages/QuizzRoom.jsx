import { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Button } from '@mantine/core';
import Timer from '../assets/chronometer.png';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import { QuizzContext } from '../context/QuizzContext';

function QuizzRoom({ socket }) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [usersAnswered, setUsersAnswered] = useState([]);
  const navigate = useNavigate();

  // Function to handle user's answer selection
  const handleAnswerSelection = (answer) => {
    setUserAnswer(answer);
    // You can emit the user's answer to the server using the socket here
    socket.emit('userAnswer', {
      roomId: localStorage.getItem('roomId'),
      answer: answer,
      name: localStorage.getItem('name'),
    });
  };

  const [Question, setQuestion] = useState({ options: [] });
  const [timer, setTimer] = useState(20);
  const Room = JSON.parse(localStorage.getItem('room'));

  // Ref to hold the interval ID for the timer
  const timerIntervalRef = useRef(null);

  useEffect(() => {

    socket.on('nextQuestion', (data) => {
      if (data.roomId === localStorage.getItem('roomId')) {
        clearInterval(timerIntervalRef.current); // Clear the previous timer interval
        setQuestion(data.question);
        setUsersAnswered([]);
        setUserAnswer("")
        setTimer(20); // Reset timer to 20 seconds
        startTimer();
      }
    });

    socket.on('userAnswered', (data) => {
      if (data.roomId === localStorage.getItem('roomId')) {
        setUsersAnswered((userAnd) => [...userAnd, data.name]);
      }
    });

    socket.on('gameEnd', (data) => {
      if (data.roomId === localStorage.getItem('roomId')) {
        navigate('/ranking');
      }
    });

    // Clean up the timer interval when the component unmounts
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
  };

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(timerIntervalRef.current);
      socket.emit('nextQuestion', {
        roomId: localStorage.getItem('roomId'),
      });
      setTimer(20); // Reset timer to 20 seconds
    }
  }, [timer]);
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
          <h1 className='font-semibold ml-4 tracking-wider italic'>{`00:${timer.toString().length>0 ? timer.toString() : "0"+timer.toString()}`}</h1>
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
                className={`w-[8rem] ${
                  userAnswer === index ? 'bg-blue-600' : 'bg-gray-300'
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
